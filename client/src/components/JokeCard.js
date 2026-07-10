import React from 'react';
import '../styles/JokeCard.css';

function JokeCard({ joke, isFavorite, onFavorite, onShare }) {
  return (
    <div className="joke-card">
      <div className="joke-header">
        <span className="joke-category">{joke.category ? joke.category.toUpperCase() : 'JOKE'}</span>
        {joke.flags && joke.flags.explicit && <span className="joke-flag">⚠️ EXPLICIT</span>}
      </div>
      
      <div className="joke-content">
        <p className="joke-text">{joke.jokeText}</p>
      </div>

      <div className="joke-actions">
        <button
          onClick={onFavorite}
          className={`action-btn favorite-btn ${isFavorite ? 'active' : ''}`}
          title="Add to favorites"
        >
          {isFavorite ? '♥️ Saved' : '🤍 Favorite'}
        </button>
        <button
          onClick={onShare}
          className="action-btn share-btn"
          title="Copy to clipboard"
        >
          📋 Share
        </button>
      </div>
    </div>
  );
}

export default JokeCard;
