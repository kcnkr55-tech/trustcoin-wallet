import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/JokeGenerator.css';
import JokeCard from '../components/JokeCard';

function JokeGenerator() {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('any');
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favoriteJokes')) || []);
  const [showFavorites, setShowFavorites] = useState(false);
  const [jokesCount, setJokesCount] = useState(0);

  const JOKE_API = 'https://v2.jokeapi.dev/joke';
  const categories = ['any', 'programming', 'general', 'dark', 'knock-knock'];

  useEffect(() => {
    fetchJoke();
  }, []);

  const fetchJoke = async () => {
    setLoading(true);
    setError('');
    try {
      const categoryPath = category === 'any' ? 'Any' : category.charAt(0).toUpperCase() + category.slice(1);
      const response = await axios.get(`${JOKE_API}/${categoryPath}?format=json`);
      
      let jokeText = '';
      if (response.data.type === 'single') {
        jokeText = response.data.joke;
      } else {
        jokeText = `${response.data.setup}\n\n${response.data.delivery}`;
      }
      
      setJoke({
        ...response.data,
        jokeText,
        id: Math.random()
      });
      setJokesCount(jokesCount + 1);
    } catch (err) {
      setError('Failed to load joke. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (currentJoke) => {
    const isAlreadyFavorite = favorites.some(fav => fav.jokeText === currentJoke.jokeText);
    
    if (isAlreadyFavorite) {
      const updatedFavorites = favorites.filter(fav => fav.jokeText !== currentJoke.jokeText);
      setFavorites(updatedFavorites);
      localStorage.setItem('favoriteJokes', JSON.stringify(updatedFavorites));
    } else {
      const updatedFavorites = [...favorites, currentJoke];
      setFavorites(updatedFavorites);
      localStorage.setItem('favoriteJokes', JSON.stringify(updatedFavorites));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('✓ Copied to clipboard!');
  };

  const isFavorite = joke && favorites.some(fav => fav.jokeText === joke.jokeText);

  return (
    <div className="joke-generator">
      <div className="joke-container">
        <h1>😂 Random Joke Generator</h1>
        <p className="joke-subtitle">Get a laugh with random jokes from various categories</p>

        {/* Stats */}
        <div className="joke-stats">
          <div className="stat-box">
            <span className="stat-label">Jokes Loaded</span>
            <span className="stat-value">{jokesCount}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Favorites</span>
            <span className="stat-value">{favorites.length}</span>
          </div>
        </div>

        {/* Category Selector */}
        <div className="category-selector">
          <label>🏷️ Select Category:</label>
          <div className="category-buttons">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`category-btn ${category === cat ? 'active' : ''}`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="error-message">❌ {error}</div>}

        {/* Loading State */}
        {loading && <div className="loading-spinner">⏳ Loading joke...</div>}

        {/* Joke Display */}
        {joke && !loading && !showFavorites && (
          <JokeCard
            joke={joke}
            isFavorite={isFavorite}
            onFavorite={() => toggleFavorite(joke)}
            onShare={() => copyToClipboard(joke.jokeText)}
          />
        )}

        {/* Action Buttons */}
        {!showFavorites && (
          <div className="action-buttons">
            <button onClick={fetchJoke} className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Loading...' : '😄 Next Joke'}
            </button>
            <button
              onClick={() => setShowFavorites(true)}
              className="btn btn-secondary"
            >
              ⭐ Favorites ({favorites.length})
            </button>
          </div>
        )}

        {/* Favorites View */}
        {showFavorites && (
          <div className="favorites-view">
            <button
              onClick={() => setShowFavorites(false)}
              className="btn btn-back"
            >
              ← Back to Generator
            </button>
            <h2>⭐ My Favorite Jokes</h2>
            {favorites.length > 0 ? (
              <div className="favorites-list">
                {favorites.map((fav, index) => (
                  <div key={index} className="favorite-item">
                    <p className="favorite-text">{fav.jokeText}</p>
                    <div className="favorite-actions">
                      <button
                        onClick={() => copyToClipboard(fav.jokeText)}
                        className="btn-small btn-copy"
                      >
                        📋 Copy
                      </button>
                      <button
                        onClick={() => toggleFavorite(fav)}
                        className="btn-small btn-remove"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-favorites">
                <p>No favorite jokes yet. Start adding some! 😊</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default JokeGenerator;
