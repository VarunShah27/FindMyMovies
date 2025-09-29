// src/components/Popup.js
import React from "react";

const IMAGE_BASE_POPUP = "https://image.tmdb.org/t/p/w500"; // popup poster size

function Popup({ selected, closePopup }) {
  const poster = selected.poster_path
    ? `${IMAGE_BASE_POPUP}${selected.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <section className="popup">
      <div className="content">
        <div className="plot">
          <img src={poster} alt={selected.title} />
          <div className="info">
            <h2>{selected.title} <span>({selected.release_date?.slice(0, 4)})</span></h2>
            <p className="rating">Rating: ⭐ {selected.vote_average}/10</p>
            <p><strong>Genre:</strong> {selected.genres?.map(g => g.name).join(", ")}</p>
            <p><strong>Director:</strong> {selected.director}</p>
            <p><strong>Actors:</strong> {selected.cast}</p><br/>
            <p>{selected.overview}</p>
          </div>
        </div>
        <button className="close" onClick={closePopup}>×</button>
      </div>
    </section>
  );
}

export default Popup;
