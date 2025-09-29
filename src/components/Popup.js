import React from "react";

function Popup({ selected, closePopup }) {
  const year = selected.release_date ? selected.release_date.slice(0, 4) : "N/A";
  const genres = selected.genres ? selected.genres.map(g => g.name).join(", ") : "N/A";
  const director = selected.director || "N/A";
  const cast = selected.cast || "N/A";
  const poster = selected.poster_path || "https://via.placeholder.com/342x513?text=No+Image";

  return (
    <section className="popup">
      <div className="content">
        <div className="plot">
          <img src={poster} alt={selected.title} />
          <div className="info">
            <h2>{selected.title} <span>({year})</span></h2>
            <p className="rating">Rating: ⭐ {selected.vote_average || "N/A"}</p>
            <p><strong>Genre:</strong> {genres}</p>
            <p><strong>Director:</strong> {director}</p>
            <p><strong>Actors:</strong> {cast}</p><br/>
            <p>{selected.overview || "No description available."}</p>
          </div>
        </div>
        <button className="close" onClick={closePopup}>×</button>
      </div>
    </section>
  );
}

export default Popup;
