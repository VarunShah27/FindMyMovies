import React from "react";

function Popup({ selected, closePopup }) {
  const year = selected.release_date ? selected.release_date.slice(0, 4) : "N/A";
  const genres = selected.genres ? selected.genres.map(g => g.name).join(", ") : "N/A";
  
  // These now come processed from the openPopup function
  const director = selected.director;
  const cast = selected.cast;

  // The poster path is already a full URL
  const poster = selected.poster_path;

  return (
    <section className="popup">
      <div className="content">
        <div className="plot">
          <img src={poster} alt={selected.title} />
          <div className="info">
            <h2>{selected.title} <span>({year})</span></h2>
            <p className="rating">Rating: ⭐ {selected.vote_average?.toFixed(1) || "N/A"}</p>
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
