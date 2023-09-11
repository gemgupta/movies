import React from "react";
import { useState, useEffect, useCallback } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";


function App() {
  const [movie, setmovie] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isError, setisError] = useState(null);
  const [retryTimeoutId, setRetryTimeoutId] = useState(null);

  const fetchMovieHandler = useCallback(async () => {
    setisError(null);
    setisLoading(true);
    try {
      const response = await fetch(
        "https://first-http-3de91-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong. Retrying...");
      }
      const data = await response.json();
      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          episode_id: key,
          title: data[key].title,
          release_date: data[key].releaseDate,
          opening_crawl: data[key].openingText,
        });
      }

      setmovie(loadedMovies);
    } catch (error) {
      setisError(error.message);
      const myTimeout = setTimeout(fetchMovieHandler, 5000);
      setRetryTimeoutId(myTimeout);
    }
    setisLoading(false);
  }, []);

  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler]);

  const cancelError = () => {
    if (retryTimeoutId) {
      clearTimeout(retryTimeoutId);
    }
    setisError(null);
  };

  async function addMovieHandler(newmovie) {
    try {
      const response = await fetch(
        "https://first-http-3de91-default-rtdb.firebaseio.com/movies.json",
        {
          method: "POST",
          body: JSON.stringify(newmovie),
          headers: {
            "Content-Type": "Application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong. POST DATA NOT SUCCESSFUL");
      }
      // const data = await response.json();
    } catch (error) {
      setisError(error.message);
    }
  }
  async function removeMovieHandler(id) {
    try {
      const response = await fetch(
        `https://first-http-3de91-default-rtdb.firebaseio.com/movies/${id}.json`,
        {
          method: "DELETE",

          headers: {
            "Content-Type": "Application/json",
          },
        }
      );
if(response.ok){
  fetchMovieHandler();
}
      if (!response.ok) {
        throw new Error("Something went wrong. Delete Request failed");
      }
    } catch (error) {
      setisError(error.message);
    }
  }
  return (
    <>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && (
          <MoviesList onRemoveMovie={removeMovieHandler} movies={movie} />
        )}
        {isLoading && (
          <p>
            Loading... <span className="placeholder col-12"></span>
          </p>
        )}
        {!isLoading && !isError && movie.length===0 && (
          <p className="fw-bold">
           No Movies to show
          </p>
        )}
        {!isLoading && isError && (
          <p>
            {isError} <button onClick={cancelError}>Cancel</button>
          </p>
        )}
      </section>
    </>
  );
}

export default App;
