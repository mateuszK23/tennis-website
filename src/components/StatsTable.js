import { calculateStats } from "../utils/stats.js";

export function renderStatsDiv(matches, container) {
  matches = Array.isArray(matches) ? matches : [];
  const totalMatches = matches.length;

  if (totalMatches === 0) {
    container.innerHTML = `<p class="no-matches">No matches have been played this season.</p>`;
    return;
  }

  const stats = calculateStats(matches);

  let html = `
    <table class="matches-played-table">
      <thead>
        <tr><th>Matches Played: ${totalMatches}<th></tr>
      </thead>
    </table>
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
  container.innerHTML = html;
}
