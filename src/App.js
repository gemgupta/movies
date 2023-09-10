import React from "react";
import { useState } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movie, setmovie] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  async function fetchMovieHandler() {
    setisLoading(true)
    const response = await fetch("https://swapi.dev/api/films/");
    const data = await response.json();
    setmovie(data.results);
    setisLoading(false)
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
      {!isLoading && <MoviesList movies={movie} />}
      {isLoading && <p >Loading... <span className="placeholder col-12"></span></p>}
      </section>
    </React.Fragment>
  );
}

export default App;
