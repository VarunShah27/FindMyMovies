// src/components/Results.js
import React from "react";
import Result from "./Result";

// Keep this for hero view, assuming w500 is desired here
const IMAGE_BASE_HERO = "https://image.tmdb.org/t/p/w500";

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
    // Reconstruct hero URL from base path for better quality
    const posterUrl = movie.poster_path.includes("via.placeholder.com")
      ? movie.poster_path
      : `${IMAGE_BASE_HERO}${movie.poster_path.substring(movie.poster_path.lastIndexOf('/'))}`;

    return (
      <section className="single-result-hero" style={{ backgroundImage: `url(${posterUrl})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <img loading="lazy" src={posterUrl} alt={movie.title || "Movie Poster"} className="hero-poster" />
          <div className="hero-details">
            <h1>{movie.title || "N/A"}</h1>
            <p className="hero-meta">
              {movie.release_date ? movie.release_date.split("-")[0] : "N/A"} • ⭐ {movie.vote_average?.toFixed(1) || "N/A"}/10
            </p>
            <p className="hero-plot">{movie.overview || "No description available."}</p>
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
        <Result key={result.id || Math.random()} result={result} openPopup={openPopup} />
      ))}
    </section>
  );
}

export default Results;
