import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

import Search from "./components/Search";
import Results from "./components/Results";
import Popup from "./components/Popup";
import Suggestion from "./components/Suggestion";
import ThemeToggle from "./components/ThemeToggle";

// Get API Key from environment variables
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
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
  // Use multiple useState hooks for cleaner state management
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null); // Use null for clarity
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(true); // State to handle loading UI
  const [error, setError] = useState(null); // State to handle API errors

  // Helper function to process movie data and create full poster URLs
  const processMovieData = (movie) => {
    if (!movie) return null;
    return {
      ...movie,
      poster_path: movie.poster_path
        ? `${IMAGE_BASE}${movie.poster_path}`
        : "https://via.placeholder.com/342x513?text=No+Image",
    };
  };

  useEffect(() => {
    const fetchInitialMovies = async () => {
      if (!API_KEY) {
        setError("API Key is missing. Please add it to your .env file.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const shuffled = popularMovies.sort(() => 0.5 - Math.random());
      const selectedTitles = shuffled.slice(0, HOME_LIMIT);

      const moviePromises = selectedTitles.map((title) =>
        axios.get(`${BASE_URL}/search/movie`, {
          params: { api_key: API_KEY, query: title, language: "en-US" },
        }).then(res => processMovieData(res.data.results?.[0]))
          .catch(() => null) // Ignore individual movie fetch errors
      );

      try {
        const movies = await Promise.all(moviePromises);
        setResults(movies.filter(Boolean));
      } catch (err) {
        setError("Failed to fetch popular movies. Please check your connection or API key.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialMovies();
  }, []);

  const search = async (term) => {
    if (!term) return;

    setLoading(true);
    setError(null);
    setSuggestion("");

    try {
      const { data } = await axios.get(`${BASE_URL}/search/movie`, {
        params: { api_key: API_KEY, query: term, language: "en-US" },
      });
      const resultsWithPosters = (data.results || []).map(processMovieData);
      setResults(resultsWithPosters);
    } catch (err) {
      setError("Search failed. The API key might be invalid or the service is down.");
    } finally {
      setLoading(false);
    }
  };

  const openPopup = async (id) => {
    try {
      const detailsPromise = axios.get(`${BASE_URL}/movie/${id}`, {
        params: { api_key: API_KEY, language: "en-US" },
      });
      const creditsPromise = axios.get(`${BASE_URL}/movie/${id}/credits`, {
        params: { api_key: API_KEY },
      });

      const [{ data: details }, { data: credits }] = await Promise.all([detailsPromise, creditsPromise]);
      
      const director = credits.crew?.find(c => c.job === "Director");
      const cast = credits.cast?.slice(0, 5).map(c => c.name).join(", ");

      setSelected({
        ...details,
        director: director ? director.name : "N/A",
        cast: cast || "N/A",
        poster_path: processMovieData(details).poster_path,
      });
    } catch (err) {
      console.error("Could not open popup:", err);
      setError("Could not fetch movie details.");
    }
  };
  
  const handleInput = (e) => setSearchTerm(e.target.value);
  const handleSearchEvent = (e) => { if (e.key === "Enter") search(searchTerm); };
  const handleSuggestionClick = (term) => { setSearchTerm(term); search(term); };
  const closePopup = () => setSelected(null);

  const renderContent = () => {
    if (loading) return <h3 className="status-message">Loading movies...</h3>;
    if (error) return <h3 className="status-message error">{error}</h3>;
    return <Results results={results} openPopup={openPopup} />;
  };

  return (
    <div className="App">
      <ThemeToggle />
      <header>
        <h1><a href="/" style={{ textDecoration: "none", color: "inherit" }}>Find My Moviez</a></h1>
      </header>
      <main>
        <Search value={searchTerm} handleInput={handleInput} search={handleSearchEvent} />
        {suggestion && <Suggestion suggestion={suggestion} onSuggestionClick={handleSuggestionClick} />}
        {renderContent()}
        {selected && <Popup selected={selected} closePopup={closePopup} />}
      </main>
    </div>
  );
}

export default App;
