import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

import Search from "./components/Search";
import Results from "./components/Results";
import Popup from "./components/Popup";
import Suggestion from "./components/Suggestion";
import ThemeToggle from "./components/ThemeToggle";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w342";
const HOME_LIMIT = 16;

const popularMovies = [
  "Superman", "The Godfather", "Nikka Zaildar", "Dune: Part Two",
  "Ballerina","Carry on Jatta", "Mission: Impossible - The Final Reckoning", "The Matrix", "Ardaas", "The Conjuring: Last Rites",
  "Interstellar", "Chhaava", "PK", "Goreyan nu Daffa Karo", "Deadpool & Wolverine",
  "Dakuaan Da Munda 3", "Saiyaara", "Sikander", "Yaar Anmulle", "F1",
  "Gladiator", "Joker", "Furiosa: A Mad Max Saga", "Taarzan: The Wonder Car",
  "Sholay", "Chal Mera Putt 1", "Spider-Man: Into the Spider-Verse", "Transformers",
  "Rabb da Radio 2", "The Avengers", "Angrej"
];

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setLoading(true);
      setError(null);
      
      if (!API_KEY) {
        setError("API Key is missing. Make sure you have a .env file with REACT_APP_TMDB_API_KEY set.");
        setLoading(false);
        return;
      }

      const shuffled = popularMovies.sort(() => 0.5 - Math.random());
      const selectedTitles = shuffled.slice(0, HOME_LIMIT);

      const moviePromises = selectedTitles.map((title) =>
        axios.get(`${BASE_URL}/search/movie`, {
          params: { api_key: API_KEY, query: title, language: "en-US" },
        }).then(res => processMovieData(res.data.results?.[0]))
          // --- THIS IS THE ONLY CHANGE ---
          .catch(err => {
            console.error(`Error fetching movie "${title}":`, err.response || err.message);
            return null;
          })
      );

      try {
        const movies = await Promise.all(moviePromises);
        const validMovies = movies.filter(Boolean);
        
        if (validMovies.length === 0) {
          setError("Could not fetch any movies. Please double-check your API key and network connection.");
        } else {
          setResults(validMovies);
        }
      } catch (err) {
        setError("An unexpected error occurred. Check the console for details.");
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
    if (results.length === 0) return (
      <section className="results-empty">
        <h3>No movies found. Try another search!</h3>
      </section>
    );
    return <Results results={results} openPopup={openPopup} />;
  };

  return (
    <div className="App">
      <ThemeToggle />
      <header>
        <h1><a href="/" style={{ textDecoration: "none", color: "inherit" }}>Find My Movies</a></h1>
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
