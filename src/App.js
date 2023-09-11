import React from "react";
import { useState, useEffect, useCallback } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movie, setmovie] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isError, setisError] = useState(null);
  const [retryTimeoutId, setRetryTimeoutId] = useState(null);

  const fetchMovieHandler = useCallback(async () => {
    setisError(null);
    setisLoading(true);
    try {
      const response = await fetch("https://swapi.dev/api/films/");
      if (!response.ok) {
        throw new Error("Something went wrong. Retrying...");
      }
      const data = await response.json();
      setmovie(data.results);
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
  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && <MoviesList movies={movie} />}
        {isLoading && (
          <p>
            Loading... <span className="placeholder col-12"></span>
          </p>
        )}
        {!isLoading && isError && (
          <p>
            {isError} <button onClick={cancelError}>Cancel</button>
          </p>
        )}
      </section>
    </React.Fragment>
  );
}

export default App;
