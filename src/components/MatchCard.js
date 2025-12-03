import { createFlag } from '../utils/createFlag.js';

function weatherIcon(code) {
  const map = {
    0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️", 45: "🌫️", 48: "🌫️",
    51: "🌦️", 53: "🌦️", 55: "🌧️", 56: "🌦️❄️", 57: "🌧️❄️",
    61: "🌧️", 63: "🌧️", 65: "🌧️", 66: "🌧️❄️", 67: "🌧️❄️",
    71: "❄️", 73: "❄️", 75: "❄️", 77: "🌨️", 80: "🌧️",
    81: "🌧️", 82: "🌧️", 85: "🌨️", 86: "🌨️", 95: "⛈️",
    96: "⛈️🌨️", 99: "⛈️🌨️"
  };
  return map[code] || "❓";
}

function windIcon(direction) {
  // Simple emoji mapping for cardinal directions
  if (direction >= 337.5 || direction < 22.5) return "⬆️";   // N
  if (direction >= 22.5 && direction < 67.5) return "↗️";      // NE
  if (direction >= 67.5 && direction < 112.5) return "➡️";     // E
  if (direction >= 112.5 && direction < 157.5) return "↘️";    // SE
  if (direction >= 157.5 && direction < 202.5) return "⬇️";    // S
  if (direction >= 202.5 && direction < 247.5) return "↙️";    // SW
  if (direction >= 247.5 && direction < 292.5) return "⬅️";    // W
  if (direction >= 292.5 && direction < 337.5) return "↖️";    // NW
  return "";
}

export function renderMatchCard(match, weatherForDay) {
  const player1Scores = match.score1.map((score, i) => {
    const isWinnerSet = score > match.score2[i];
    return `<span class="score${isWinnerSet ? ' winner-set' : ''}">${score}</span>`;
  }).join('');

  const player2Scores = match.score2.map((score, i) => {
    const isWinnerSet = score > match.score1[i];
    return `<span class="score${isWinnerSet ? ' winner-set' : ''}">${score}</span>`;
  }).join('');

const weatherHTML = (weatherForDay && weatherForDay.code !== undefined && weatherForDay.max !== undefined && weatherForDay.min !== undefined)
  ? `
    <div class="weather">
      <span class="icon">${weatherIcon(weatherForDay.code)}</span>
      <span>${weatherForDay.max}° / ${weatherForDay.min}°</span>
    </div>
  `
  : '';

  const windHTML = (weatherForDay && weatherForDay.windSpeed !== undefined && weatherForDay.windDirection !== undefined)
    ? `
      <div class="wind">
        <span>💨 ${weatherForDay.windSpeed} km/h ${windIcon(weatherForDay.windDirection)}</span>
      </div>
    `
    : ``;

  return `
    <div class="match-card">
      <div class="match-card-header">
        <div class="date">${match.date}</div>
      </div>

      <div class="match-row">
        <div class="player${match.score1[0] > match.score2[0] ? ' winner' : ''}">
          ${createFlag(match.country1)} ${match.player1}
        </div>
        <div class="scores">${player1Scores}</div>
      </div>

      <div class="match-row">
        <div class="player${match.score2[0] > match.score1[0] ? ' winner' : ''}">
          ${createFlag(match.country2)} ${match.player2}
        </div>
        <div class="scores">${player2Scores}</div>
      </div>

      <div class="match-card-footer">
        <div class="date">Cardiff Rhiwbina LTC</div>
        ${weatherHTML}
        ${windHTML}
      </div>
    </div>
  `;
}
