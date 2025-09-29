// src/components/Result.js
import React from "react";

const IMAGE_BASE_GRID = "https://image.tmdb.org/t/p/w342"; // medium-quality for grid

function Result({ result, openPopup }) {
  const poster = result.poster_path
    ? `${IMAGE_BASE_GRID}${result.poster_path}`
    : "https://via.placeholder.com/342x513?text=No+Image"; // placeholder

  return (
    <div className="result" onClick={() => openPopup(result.id)}>
      <img loading="lazy" src={poster} alt={result.title} />
      <div className="info">
        <h3>{result.title}</h3>
        <p>{result.release_date ? result.release_date.split("-")[0] : "N/A"}</p>
      </div>
    </div>
  );
}

export default Result;
