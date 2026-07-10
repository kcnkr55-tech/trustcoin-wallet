import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/WeatherDashboard.css';
import WeatherCard from '../components/WeatherCard';
import Forecast from '../components/Forecast';

function WeatherDashboard() {
  const [city, setCity] = useState('New York');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('C'); // Celsius or Fahrenheit
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favoriteLocations')) || []);
  const [searchInput, setSearchInput] = useState('');

  const API_KEY = 'b6fd43b69b910284e09b95dfcc953d73'; // Free OpenWeatherMap API key
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  useEffect(() => {
    fetchWeatherData(city);
  }, []);

  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    setError('');
    try {
      const weatherResponse = await axios.get(
        `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      setWeather(weatherResponse.data);
      setCity(cityName);

      // Fetch 5-day forecast
      const forecastResponse = await axios.get(
        `${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      setForecast(forecastResponse.data);
    } catch (err) {
      setError('City not found. Please try another location.');
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeatherData(searchInput);
      setSearchInput('');
    }
  };

  const toggleFavorite = () => {
    if (favorites.includes(city)) {
      setFavorites(favorites.filter(fav => fav !== city));
      localStorage.setItem('favoriteLocations', JSON.stringify(favorites.filter(fav => fav !== city)));
    } else {
      const updatedFavorites = [...favorites, city];
      setFavorites(updatedFavorites);
      localStorage.setItem('favoriteLocations', JSON.stringify(updatedFavorites));
    }
  };

  const handleUnitChange = () => {
    setUnit(unit === 'C' ? 'F' : 'C');
  };

  const convertTemp = (celsius) => {
    if (unit === 'F') {
      return Math.round((celsius * 9/5) + 32);
    }
    return Math.round(celsius);
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  const getDailyForecasts = () => {
    if (!forecast) return [];
    const dailyData = {};
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(item);
    });

    return Object.entries(dailyData).slice(0, 5).map(([date, items]) => {
      const temps = items.map(item => item.main.temp);
      const avgTemp = Math.round(temps.reduce((a, b) => a + b) / temps.length);
      const maxTemp = Math.max(...temps);
      const minTemp = Math.min(...temps);
      const icon = items[0].weather[0].icon;
      const description = items[0].weather[0].main;

      return {
        date,
        avg: convertTemp(avgTemp),
        max: convertTemp(maxTemp),
        min: convertTemp(minTemp),
        icon: getWeatherIcon(icon),
        description
      };
    });
  };

  return (
    <div className="weather-dashboard">
      <div className="weather-container">
        <h1>🌤️ Weather Dashboard</h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for a city..."
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>

        {/* Unit Toggle & Favorites */}
        <div className="controls">
          <button onClick={handleUnitChange} className="unit-toggle">
            °{unit === 'C' ? 'F' : 'C'}
          </button>
          <button
            onClick={toggleFavorite}
            className={`favorite-btn ${favorites.includes(city) ? 'active' : ''}`}
            title="Add to favorites"
          >
            ♥ {favorites.includes(city) ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Favorites List */}
        {favorites.length > 0 && (
          <div className="favorites-section">
            <h3>📍 Favorite Locations</h3>
            <div className="favorites-list">
              {favorites.map(fav => (
                <button
                  key={fav}
                  onClick={() => fetchWeatherData(fav)}
                  className={`favorite-item ${city === fav ? 'active' : ''}`}
                >
                  {fav}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && <div className="error-message">❌ {error}</div>}

        {/* Loading State */}
        {loading && <div className="loading">⏳ Loading weather data...</div>}

        {/* Current Weather */}
        {weather && !loading && (
          <>
            <WeatherCard
              weather={weather}
              unit={unit}
              convertTemp={convertTemp}
              getWeatherIcon={getWeatherIcon}
              city={city}
            />

            {/* 5-Day Forecast */}
            {forecast && (
              <Forecast
                forecasts={getDailyForecasts()}
                unit={unit}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default WeatherDashboard;
