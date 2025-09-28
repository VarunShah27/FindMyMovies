import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import all components
import Search from './components/Search';
import Results from './components/Results';
import Popup from './components/Popup';
import Suggestion from './components/Suggestion';
import ThemeToggle from './components/ThemeToggle';

const popularMovies = [
  'Inception', 'The Godfather','Nikka Zaildar', 'The Shawshank Redemption', 'Pulp Fiction',
  'Forrest Gump', 'The Matrix','Ardaas', 'Goodfellas', 'Interstellar', 'Dhamaal', 'pk', 
  'Goreyan nu Daffa Karo', 'Carry on Jatta', 'Manje Bistre', 'Housefull', 
  'Sikander 2', 'Yaar Anmulle', 'Parasite', 'Gladiator', 'Joker', 'Whiplash', 
  'The Prestige', 'Taarzan: The Wonder Car', 'Sholay', 'Ashke',
  'Spider-Man: Into the Spider-Verse', 'Saving Private Ryan', 'The Green Mile','Rabb da Radio 2', 
  'The Avengers', 'Angrej'
];

const levenshteinDistance = (s1, s2) => {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
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
  const apiurl = "http://www.omdbapi.com/?apikey=dfe6d885";

  useEffect(() => {
    const shuffled = popularMovies.sort(() => 0.5 - Math.random());
    const selectedMovies = shuffled.slice(0, 8);
    const moviePromises = selectedMovies.map(title => axios(apiurl + "&t=" + title));
    Promise.all(moviePromises).then(responses => {
      const movies = responses.map(res => res.data);
      setState(prevState => ({ ...prevState, results: movies }));
    });
  }, []);

  const search = (term) => {
    axios(apiurl + "&s=" + term).then(({ data }) => {
      const searchResults = data.Search;
      if (!searchResults || searchResults.length === 0) {
        let bestMatch = null;
        let minDistance = Infinity;
        popularMovies.forEach(movie => {
          const distance = levenshteinDistance(term, movie);
          if (distance < minDistance && distance <= 3) {
            minDistance = distance;
            bestMatch = movie;
          }
        });
        setSuggestion(bestMatch);
        setState(prevState => ({ ...prevState, results: [] }));
      } else if (searchResults.length === 1) {
        setSuggestion("");
        axios(apiurl + "&i=" + searchResults[0].imdbID).then(({ data: detailedData }) => {
          setState(prevState => ({ ...prevState, results: [detailedData] }));
        });
      } else {
        setSuggestion("");
        setState(prevState => ({ ...prevState, results: searchResults }));
      }
    }).catch(error => console.error("Search error:", error));
  };

  const handleInput = (e) => setState(prevState => ({ ...prevState, s: e.target.value }));
  const handleSearchEvent = (e) => { if (e.key === "Enter") search(state.s); };
  const handleSuggestionClick = (suggestedTerm) => { setState(prevState => ({ ...prevState, s: suggestedTerm })); search(suggestedTerm); };

  const openPopup = (id) => { axios(apiurl + "&i=" + id).then(({ data }) => setState(prevState => ({ ...prevState, selected: data }))); };
  const closePopup = () => setState(prevState => ({ ...prevState, selected: {} }));

  return (
    <div className="App">
      <ThemeToggle />
      <header>
        <h1>Find My Moviez</h1>
      </header>
      <main>
        <Search handleInput={handleInput} search={handleSearchEvent} />
        {suggestion && <Suggestion suggestion={suggestion} onSuggestionClick={handleSuggestionClick} />}
        <Results results={state.results} openPopup={openPopup} />
        {(typeof state.selected.Title !== "undefined") && <Popup selected={state.selected} closePopup={closePopup} />}
      </main>
    </div>
  );
}

export default App;
