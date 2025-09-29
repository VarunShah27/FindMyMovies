import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

import Search from "./components/Search";
import Results from "./components/Results";
import Popup from "./components/Popup";
import Suggestion from "./components/Suggestion";
import ThemeToggle from "./components/ThemeToggle";

const API_KEY = "05de3799f13701e05ffa7144adef9ef7";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w342";
const HOME_LIMIT = 16;

const popularMovies = [
  "Inception", "The Godfather", "Nikka Zaildar", "The Shawshank Redemption",
  "Pulp Fiction","Carry on Jatta", "Forrest Gump", "The Matrix", "Ardaas", "Goodfellas",
  "Interstellar", "Dhamaal", "PK", "Goreyan nu Daffa Karo", "The Green Mile",
  "Manje Bistre", "Housefull 2", "Sikander 2", "Yaar Anmulle", "F1",
  "Gladiator", "Joker", "Whiplash", "The Prestige", "Taarzan: The Wonder Car",
  "Sholay", "Ashke", "Spider-Man: Into the Spider-Verse", "Transformers",
  "Rabb da Radio 2", "The Avengers", "Angrej"
];

function App() {
  const [state, setState] = useState({ s: "", results: [], selected: {} });
  const [suggestion, setSuggestion] = useState("");

  useEffect(() => {
    const shuffled = popularMovies.sort(() => 0.5 - Math.random());
    const selectedMovies = shuffled.slice(0, HOME_LIMIT);

    const moviePromises = selectedMovies.map((title) =>
      axios.get(`${BASE_URL}/search/movie`, {
        params: { api_key: API_KEY, query: title, language: "en-US" },
      }).then(res => {
        const movie = (res.data.results && res.data.results[0]) || null;
        if (!movie) return null;
        return {
          ...movie,
          poster_path: movie.poster_path
            ? IMAGE_BASE + movie.poster_path
            : "https://via.placeholder.com/342x513?text=No+Image",
        };
      }).catch(() => null)
    );

    Promise.all(moviePromises)
      .then(movies => setState(prev => ({
        ...prev,
        results: movies.filter(Boolean)
      })))
      .catch(err => console.error(err));
  }, []);

  const search = (term) => {
    if (!term) return;
    axios.get(`${BASE_URL}/search/movie`, {
      params: { api_key: API_KEY, query: term, language: "en-US" }
    })
    .then(({ data }) => {
      const resultsWithPosters = (data.results || []).map(movie => ({
        ...movie,
        poster_path: movie.poster_path
          ? IMAGE_BASE + movie.poster_path
          : "https://via.placeholder.com/342x513?text=No+Image"
      }));
      setSuggestion("");
      setState(prev => ({ ...prev, results: resultsWithPosters }));
    })
    .catch(err => console.error(err));
  };

  const handleInput = (e) => setState(prev => ({ ...prev, s: e.target.value }));
  const handleSearchEvent = (e) => { if (e.key === "Enter") search(state.s); };
  const handleSuggestionClick = (term) => { setState(prev => ({ ...prev, s: term })); search(term); };

  const openPopup = async (id) => {
    try {
      const { data: details } = await axios.get(`${BASE_URL}/movie/${id}`, {
        params: { api_key: API_KEY, language: "en-US" },
      });
      const { data: credits } = await axios.get(`${BASE_URL}/movie/${id}/credits`, {
        params: { api_key: API_KEY },
      });

      const director = (credits.crew || []).find(c => c.job === "Director");
      const cast = (credits.cast || []).slice(0, 5).map(c => c.name).join(", ");

      setState(prev => ({
        ...prev,
        selected: {
          ...details,
          director: director ? director.name : "N/A",
          cast: cast || "N/A",
          poster_path: details.poster_path
            ? IMAGE_BASE + details.poster_path
            : "https://via.placeholder.com/342x513?text=No+Image",
        }
      }));
    } catch (err) { console.error(err); }
  };

  const closePopup = () => setState(prev => ({ ...prev, selected: {} }));

  return (
    <div className="App">
      <ThemeToggle />
      <header>
        <h1><a href="/" style={{ textDecoration: "none", color: "inherit" }}>Find My Moviez</a></h1>
      </header>
      <main>
        <Search handleInput={handleInput} search={handleSearchEvent} />
        {suggestion && <Suggestion suggestion={suggestion} onSuggestionClick={handleSuggestionClick} />}
        <Results results={state.results} openPopup={openPopup} />
        {state.selected.title && <Popup selected={state.selected} closePopup={closePopup} />}
      </main>
    </div>
  );
}

export default App;
