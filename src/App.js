import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

import Search from "./components/Search";
import Results from "./components/Results";
import Popup from "./components/Popup";
import Suggestion from "./components/Suggestion";
import ThemeToggle from "./components/ThemeToggle";

const API_KEY = "5d048d70e2ec77e86219f7e5f1256f22";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w342";
const HOME_LIMIT = 16;

// Curated popular movies (Hollywood, Bollywood, Pollywood)
const popularMovies = [
  "Inception", "The Godfather", "Nikka Zaildar", "The Shawshank Redemption",
  "Pulp Fiction","Carry on Jatta", "Forrest Gump", "The Matrix", "Ardaas", "Goodfellas",
  "Interstellar", "Dhamaal", "PK", "Goreyan nu Daffa Karo", "The Green Mile",
  "Manje Bistre", "Housefull 2", "Sikander 2", "Yaar Anmulle", "F1",
  "Gladiator", "Joker", "Whiplash", "The Prestige", "Taarzan: The Wonder Car",
  "Sholay", "Ashke", "Spider-Man: Into the Spider-Verse", "Transformers",
  "Whiplash", "Rabb da Radio 2", "The Avengers", "Angrej"
];

// Levenshtein distance for fuzzy suggestions
const levenshteinDistance = (s1, s2) => {
  s1 = s1.toLowerCase(); s2 = s2.toLowerCase();
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
};

function App() {
  const [state, setState] = useState({ s: "", results: [], selected: {} });
  const [suggestion, setSuggestion] = useState("");

  // Fetch 12–16 home page movies
  useEffect(() => {
    const shuffled = popularMovies.sort(() => 0.5 - Math.random());
    const selectedMovies = shuffled.slice(0, HOME_LIMIT);

    const moviePromises = selectedMovies.map((title) =>
      axios
        .get(`${BASE_URL}/search/movie`, {
          params: { api_key: API_KEY, query: title, language: "en-US" },
        })
        .then((res) => {
          // Try exact title match first
          const movie =
            res.data.results.find(
              (m) =>
                m.title.toLowerCase() === title.toLowerCase() ||
                m.original_title.toLowerCase() === title.toLowerCase()
            ) || res.data.results[0];
          if (!movie) return null;
          return {
            ...movie,
            poster_path: movie.poster_path
              ? IMAGE_BASE + movie.poster_path
              : "https://via.placeholder.com/342x513?text=No+Image",
          };
        })
    );

    Promise.all(moviePromises)
      .then((movies) => setState((prev) => ({ ...prev, results: movies.filter(Boolean) })))
      .catch((err) => console.error("Home movies fetch error:", err));
  }, []);

  // Search
  const search = (term) => {
    if (!term) return;
    axios
      .get(`${BASE_URL}/search/movie`, {
        params: { api_key: API_KEY, language: "en-US", query: term },
      })
      .then(({ data }) => {
        if (!data.results || data.results.length === 0) {
          // Fuzzy suggestion
          let bestMatch = null;
          let minDistance = Infinity;
          popularMovies.forEach((movie) => {
            const distance = levenshteinDistance(term, movie);
            if (distance < minDistance && distance <= 3) {
              minDistance = distance;
              bestMatch = movie;
            }
          });
          setSuggestion(bestMatch);
          setState((prev) => ({ ...prev, results: [] }));
        } else {
          const resultsWithPosters = data.results.map((movie) => ({
            ...movie,
            poster_path: movie.poster_path
              ? IMAGE_BASE + movie.poster_path
              : "https://via.placeholder.com/342x513?text=No+Image",
          }));
          setSuggestion("");
          setState((prev) => ({ ...prev, results: resultsWithPosters }));
        }
      })
      .catch((err) => console.error("Search error:", err));
  };

  const handleInput = (e) => setState((prev) => ({ ...prev, s: e.target.value }));
  const handleSearchEvent = (e) => { if (e.key === "Enter") search(state.s); };
  const handleSuggestionClick = (suggestedTerm) => { setState((prev) => ({ ...prev, s: suggestedTerm })); search(suggestedTerm); };

  // Popup with director and cast
  const openPopup = async (id) => {
    try {
      const { data: details } = await axios.get(`${BASE_URL}/movie/${id}`, {
        params: { api_key: API_KEY, language: "en-US" },
      });

      const { data: credits } = await axios.get(`${BASE_URL}/movie/${id}/credits`, {
        params: { api_key: API_KEY },
      });

      const director = credits.crew.find((c) => c.job === "Director")?.name || "N/A";
      const cast = credits.cast.slice(0, 5).map((c) => c.name).join(", ") || "N/A";

      setState((prev) => ({
        ...prev,
        selected: {
          ...details,
          director,
          cast,
          poster_path: details.poster_path
            ? IMAGE_BASE + details.poster_path
            : "https://via.placeholder.com/342x513?text=No+Image",
        },
      }));
    } catch (err) {
      console.error("Popup fetch error:", err);
    }
  };
  const closePopup = () => setState((prev) => ({ ...prev, selected: {} }));

  return (
    <div className="App">
      <ThemeToggle />
      <header>
        <h1>Find My Moviez</h1>
      </header>
      <main>
        <Search handleInput={handleInput} search={handleSearchEvent} />
        {suggestion && (
          <Suggestion suggestion={suggestion} onSuggestionClick={handleSuggestionClick} />
        )}
        <Results results={state.results} openPopup={openPopup} />
        {state.selected.title && <Popup selected={state.selected} closePopup={closePopup} />}
      </main>
    </div>
  );
}

export default App;
