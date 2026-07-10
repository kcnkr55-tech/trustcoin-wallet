import React from 'react';
import '../styles/Forecast.css';

function Forecast({ forecasts, unit }) {
  return (
    <div className="forecast-section">
      <h3>📅 5-Day Forecast</h3>
      <div className="forecast-grid">
        {forecasts.map((day, index) => (
          <div key={index} className="forecast-card">
            <p className="forecast-date">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
            <img src={day.icon} alt={day.description} className="forecast-icon" />
            <p className="forecast-description">{day.description}</p>
            <div className="forecast-temps">
              <span className="forecast-temp-max">↑ {day.max}°{unit}</span>
              <span className="forecast-temp-min">↓ {day.min}°{unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;
