export function createFlag(country) {
  return `<img src="https://flagcdn.com/24x18/${country}.png" alt="${country}" class="flag">`;
}

function weatherIcon(code) {
  const map = {
    0: "☀️",      // Clear sky
    1: "🌤️",     // Mainly clear
    2: "⛅",      // Partly cloudy
    3: "☁️",      // Overcast
    45: "🌫️",     // Fog
    48: "🌫️",     // Depositing rime fog
    51: "🌦️",     // Drizzle: Light
    53: "🌦️",     // Drizzle: Moderate
    55: "🌧️",     // Drizzle: Dense
    56: "🌦️❄️",  // Freezing Drizzle: Light
    57: "🌧️❄️",  // Freezing Drizzle: Dense
    61: "🌧️",     // Rain: Slight
    63: "🌧️",     // Rain: Moderate
    65: "🌧️",     // Rain: Heavy
    66: "🌧️❄️",  // Freezing Rain: Light
    67: "🌧️❄️",  // Freezing Rain: Heavy
    71: "❄️",     // Snow fall: Slight
    73: "❄️",     // Snow fall: Moderate
    75: "❄️",     // Snow fall: Heavy
    77: "🌨️",     // Snow grains
    80: "🌧️",     // Rain showers: Slight
    81: "🌧️",     // Rain showers: Moderate
    82: "🌧️",     // Rain showers: Violent
    85: "🌨️",     // Snow showers: Slight
    86: "🌨️",     // Snow showers: Heavy
    95: "⛈️",     // Thunderstorm: Slight/Moderate
    96: "⛈️🌨️",  // Thunderstorm with slight hail
    99: "⛈️🌨️"   // Thunderstorm with heavy hail
  };
  return map[code] || "❓"; // fallback if unknown code
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

  const weatherHTML = weatherForDay
    ? `
      <div class="weather">
        <span class="icon">${weatherIcon(weatherForDay.code)}</span>
        <span>${weatherForDay.max}° / ${weatherForDay.min}°</span>
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
      </div>
    </div>
  `;
}
