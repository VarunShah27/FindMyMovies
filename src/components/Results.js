// src/components/Results.js
import React from "react";
import Result from "./Result";

const IMAGE_BASE_HERO = "https://image.tmdb.org/t/p/w500"; // bigger poster for hero/popup

function Results({ results, openPopup }) {
  if (!results || results.length === 0) {
    return (
      <section className="results-empty">
        <h3>No movies found. Try another search!</h3>
      </section>
    );
  }

  // Single movie hero view
  if (results.length === 1 && results[0].overview) {
    const movie = results[0];
    const posterUrl = movie.poster_path
      ? `${IMAGE_BASE_HERO}${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image";

    return (
      <section
        className="single-result-hero"
        style={{ backgroundImage: `url(${posterUrl})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <img loading="lazy" src={posterUrl} alt={movie.title} className="hero-poster" />
          <div className="hero-details">
            <h1>{movie.title}</h1>
            <p className="hero-meta">
              {movie.release_date?.split("-")[0] || "N/A"} • ⭐ {movie.vote_average}/10
            </p>
            <p className="hero-plot">{movie.overview}</p>
            <button onClick={() => openPopup(movie.id)}>Show More Info</button>
          </div>
        </div>
      </section>
    );
  }

  // Grid view for multiple results
  return (
    <section className="results">
      {results.map((result) => (
        <Result key={result.id} result={result} openPopup={openPopup} />
      ))}
    </section>
  );
}

export default Results;
