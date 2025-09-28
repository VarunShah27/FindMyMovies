// src/components/Results.js -> Replace the whole file

import React from 'react';
import Result from './Result';

function Results({ results, openPopup }) {
  // Case 1: No search results
  if (!results || results.length === 0) {
    return (
      <section className="results-empty">
        <h3>No movies found. Try another search!</h3>
      </section>
    );
  }

  // Case 2: One detailed result found (check for 'Plot' to confirm)
  if (results.length === 1 && results[0].Plot) {
    const movie = results[0];
    const posterUrl = movie.Poster === 'N/A' ? '' : movie.Poster;

    return (
      <section className="single-result-hero" style={{ backgroundImage: `url(${posterUrl})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <img src={posterUrl} alt={movie.Title} className="hero-poster" />
          <div className="hero-details">
            <h1>{movie.Title}</h1>
            <p className="hero-meta">
              {movie.Year} &bull; {movie.Genre} &bull; ⭐ {movie.imdbRating}
            </p>
            <p className="hero-plot">{movie.Plot}</p>
            <button onClick={() => openPopup(movie.imdbID)}>
              Show More Info
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Case 3: Multiple results, show the grid
  return (
    <section className="results">
      {results.map(result => (
        <Result key={result.imdbID} result={result} openPopup={openPopup} />
      ))}
    </section>
  );
}

export default Results;