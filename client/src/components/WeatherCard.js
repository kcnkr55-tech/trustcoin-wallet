import React from 'react';
import '../styles/WeatherCard.css';

function WeatherCard({ weather, unit, convertTemp, getWeatherIcon, city }) {
  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2>{city}</h2>
        <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="weather-main">
        <div className="weather-icon">
          <img src={getWeatherIcon(weather.weather[0].icon)} alt="Weather Icon" />
        </div>
        <div className="weather-info">
          <div className="temperature">
            <span className="temp-value">{convertTemp(weather.main.temp)}°</span>
            <span className="temp-unit">{unit}</span>
          </div>
          <p className="weather-description">{weather.weather[0].main}</p>
          <p className="weather-details">{weather.weather[0].description}</p>
        </div>
      </div>

      <div className="weather-details-grid">
        <div className="detail-box">
          <span className="detail-label">💧 Humidity</span>
          <span className="detail-value">{weather.main.humidity}%</span>
        </div>
        <div className="detail-box">
          <span className="detail-label">💨 Wind Speed</span>
          <span className="detail-value">{Math.round(weather.wind.speed)} m/s</span>
        </div>
        <div className="detail-box">
          <span className="detail-label">🌡️ Feels Like</span>
          <span className="detail-value">{convertTemp(weather.main.feels_like)}°{unit}</span>
        </div>
        <div className="detail-box">
          <span className="detail-label">🔽 Pressure</span>
          <span className="detail-value">{weather.main.pressure} mb</span>
        </div>
        <div className="detail-box">
          <span className="detail-label">👁️ Visibility</span>
          <span className="detail-value">{(weather.visibility / 1000).toFixed(1)} km</span>
        </div>
        <div className="detail-box">
          <span className="detail-label">☁️ Cloudiness</span>
          <span className="detail-value">{weather.clouds.all}%</span>
        </div>
      </div>

      <div className="temp-range">
        <div className="temp-max">
          <span>High</span>
          <strong>{convertTemp(weather.main.temp_max)}°{unit}</strong>
        </div>
        <div className="temp-min">
          <span>Low</span>
          <strong>{convertTemp(weather.main.temp_min)}°{unit}</strong>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
