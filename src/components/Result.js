// src/components/Result.js
import React from "react";

function Result({ result, openPopup }) {
  // The poster path is now a full URL from App.js
  const poster = result.poster_path;

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
