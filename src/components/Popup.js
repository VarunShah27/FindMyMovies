// src/components/Popup.js

import React from 'react';

function Popup({ selected, closePopup }) {
  return (
    <section className="popup">
      <div className="content">
        <div className="plot">
          <img src={selected.Poster} alt={selected.Title} />
          <div className="info">
            <h2>{selected.Title} <span>({selected.Year})</span></h2>
            <p className="rating">Rating: ⭐ {selected.imdbRating}</p>
            <p><strong>Genre:</strong> {selected.Genre}</p>
            <p><strong>Director:</strong> {selected.Director}</p>
            <p><strong>Actors:</strong> {selected.Actors}</p>
            <p>{selected.Plot}</p>
          </div>
        </div>
        <button className="close" onClick={closePopup}>×</button>
      </div>
    </section>
  );
}

export default Popup;