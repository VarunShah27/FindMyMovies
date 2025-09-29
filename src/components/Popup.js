import React from "react";

function Popup({ selected, closePopup }) {
  return (
    <section className="popup">
      <div className="content">
        <div className="plot">
          <img src={selected.poster_path} alt={selected.title} />
          <div className="info">
            <h2>{selected.title} <span>({selected.release_date?.slice(0, 4)})</span></h2>
            <p className="rating">Rating: ⭐ {selected.vote_average}</p>
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
