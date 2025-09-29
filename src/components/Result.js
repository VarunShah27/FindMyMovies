// src/components/Result.js
import React from "react";

const IMAGE_BASE_GRID = "https://image.tmdb.org/t/p/w342"; // medium-quality for grid

function Result({ result, openPopup }) {
  const poster = result.poster_path
    ? result.poster_path.startsWith("http") 
      ? result.poster_path 
      : `${IMAGE_BASE_GRID}${result.poster_path}`
    : "https://via.placeholder.com/342x513?text=No+Image";

  return (
    <div className="result" onClick={() => openPopup(result.id)}>
      <img loading="lazy" src={poster} alt={result.title || "Movie Poster"} />
      <div className="info">
        <h3>{result.title || "N/A"}</h3>
        <p>{result.release_date ? result.release_date.split("-")[0] : "N/A"}</p>
      </div>
    </div>
  );
}

export default Result;
