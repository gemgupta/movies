import React from "react";

import classes from "./Movie.module.css";

const Movie = (props) => {
  const removeMovie = (id) => {
    props.onRemove(id);
  };
  return (
    <li className={classes.movie}>
      <h2>{props.title}</h2>
      <h3>{props.releaseDate}</h3>
      <p>{props.openingText}</p>
      <button
        onClick={removeMovie.bind(null, props.id)}
        className="btn btn-danger"
      >
        Remove Movie
      </button>
    </li>
  );
};

export default Movie;
