import matches2025CSV from './data/matches-2025.csv?raw';
import matches2026CSV from './data/matches-2026.csv?raw';

export default function App() {

  const container = document.createElement('div');

  container.innerHTML = `
  <h1>Tennis Match Results</h1>
  <div class="tabs">
    <button class="tab-btn active" data-season="2025">2025</button>
    <button class="tab-btn" data-season="2026">2026</button>
  </div>
  <div id="stats" class="stats"></div>
  <div id="matches" class="matches"></div>
`;

  const statsDiv = container.querySelector("#stats");
  const tabs = container.querySelectorAll(".tab-btn");
  const matchesDiv = container.querySelector("#matches");

  function createFlag(country) {
    return `<img src="https://flagcdn.com/24x18/${country}.png" alt="${country}" class="flag">`;
  }

  function parseScores(scoreStr, side) {
    const sets = scoreStr.split(',').map(s => {
      const cleaned = s.replace(/T|\(|\)/g, '').trim();
      const parts = cleaned.split('-').map(Number);
      return parts;
    });
    if (side === "winner") return sets.map(([w, l]) => w);
    if (side === "loser") return sets.map(([w, l]) => l);
    return [];
  }

  function parseCSV(rawText) {
    if (!rawText || rawText.trim() === '') return {}; // early exit for empty CSV

    const rows = rawText.split('\n').slice(1); // skip header
    const data = {};
    rows.forEach(row => {
      if (!row.trim()) return;
      const cols = row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
      const timestamp = new Date(cols[0].replace(/"/g, ''));
      const season = timestamp.getFullYear();
      const day = String(timestamp.getDate()).padStart(2, '0');
      const month = String(timestamp.getMonth() + 1).padStart(2, '0');
      const year = timestamp.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      const scoreStr = cols[1].replace(/"/g, '');
      const winner = cols[2].replace(/"/g, '').trim();
      const loser = winner === "Tomek" ? "Mateusz" : "Tomek";

      if (!data[season]) data[season] = [];
      data[season].push({
        player1: winner,
        country1: 'pl',
        score1: parseScores(scoreStr, 'winner'),
        player2: loser,
        country2: 'pl',
        score2: parseScores(scoreStr, 'loser'),
        round: formattedDate
      });
    });
    return data;
  }

  function calculateStats(matches) {
    const stats = {};
    matches.forEach(match => {
      [match.player1, match.player2].forEach(player => {
        if (!stats[player]) stats[player] = { played: 0, won: 0 };
        stats[player].played++;
      });
      const winner = match.score1.reduce((a, b, i) => a + (b > match.score2[i] ? 1 : 0), 0) >
        match.score2.reduce((a, b, i) => a + (b > match.score1[i] ? 1 : 0), 0)
        ? match.player1 : match.player2;
      stats[winner].won++;
    });
    Object.keys(stats).forEach(player => {
      stats[player].ratio = stats[player].played > 0 ? Math.round((stats[player].won / stats[player].played) * 100) : 0;
    });
    return stats;
  }

  function renderStatsDiv(matches) {
    matches = Array.isArray(matches) ? matches : [];
    const totalMatches = matches.length;

    if (totalMatches === 0) {
      statsDiv.innerHTML = `<p class="no-matches">No matches have been played this season.</p>`;
      return;
    }

    const stats = calculateStats(matches);

    // Matches Played table
    let html = `
    <table class="matches-played-table">
      <thead>
        <tr>
          <th>Matches Played: ${totalMatches}<th>
        </tr>
      </thead>
    </table>
  `;

    // Player stats table
    html += `
    <table class="stats-table">
      <thead>
        <tr>
          <th>Player</th>
          <th>Matches Won</th>
          <th>Win Ratio</th>
        </tr>
      </thead>
      <tbody>
  `;

    for (const player in stats) {
      html += `<tr>
      <td>${player}</td>
      <td>${stats[player].won}</td>
      <td>${stats[player].ratio}%</td>
    </tr>`;
    }

    html += `</tbody></table>`;

    statsDiv.innerHTML = html;
  }

  function renderMatches(data, season) {
    console.log("Loading season:");
    console.log(season)
    matchesDiv.innerHTML = "";
    const matches = Array.isArray(data[season]) ? data[season] : [];
    console.log(matches);
    renderStatsDiv(matches);

    if (matches.length === 0) {
      return;
    }

    matches.forEach(match => {
      const div = document.createElement("div");
      div.className = "match-card";

      const player1Scores = match.score1.map((score, i) => {
        const isWinnerSet = score > match.score2[i];
        return `<span class="score${isWinnerSet ? ' winner-set' : ''}">${score}</span>`;
      }).join('');

      const player2Scores = match.score2.map((score, i) => {
        const isWinnerSet = score > match.score1[i];
        return `<span class="score${isWinnerSet ? ' winner-set' : ''}">${score}</span>`;
      }).join('');

      div.innerHTML = `
      <div class="round">${match.round}</div>
      <div class="match-row">
        <div class="player${match.score1[0] > match.score2[0] ? ' winner' : ''}">${createFlag(match.country1)} ${match.player1}</div>
        <div class="scores">${player1Scores}</div>
      </div>
      <div class="match-row">
        <div class="player${match.score2[0] > match.score1[0] ? ' winner' : ''}">${createFlag(match.country2)} ${match.player2}</div>
        <div class="scores">${player2Scores}</div>
      </div>
    `;
      matchesDiv.appendChild(div);
    });
  }

  const seasonData = {
    2025: parseCSV(matches2025CSV)[2025] || [],
    2026: parseCSV(matches2026CSV)[2026] || []
  };

  function init() {
    // Render default active tab
    const activeTab = container.querySelector(".tab-btn.active");
    console.log(seasonData);
    if (activeTab) {
      renderMatches(seasonData, activeTab.dataset.season);
    }

    // Add tab click handlers
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        container.querySelector(".tab-btn.active").classList.remove("active");
        tab.classList.add("active");
        renderMatches(seasonData, tab.dataset.season);
      });
    });
  }

  init();

  return container;

}