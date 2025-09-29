import React from 'react';

function Suggestion({ suggestion, onSuggestionClick }) {
  return (
    <div className="suggestion-wrap">
      Did you mean: <button onClick={() => onSuggestionClick(suggestion)}>{suggestion}</button>?
    </div>
  );
}

export default Suggestion;