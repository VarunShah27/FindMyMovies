// src/components/Result.js

import React from 'react';

function Result({ result, openPopup }) {
  // Use a placeholder if the poster is not available
  const poster = result.Poster === 'N/A' ? 'https://via.placeholder.com/300x450' : result.Poster;

  return (
    <div className="result" onClick={() => openPopup(result.imdbID)}>
      <img src={poster} alt={result.Title} />
      <div className="info">
        <h3>{result.Title}</h3>
      </div>
    </div>
  );
}

export default Result;