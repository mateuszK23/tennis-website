import { calculateStats } from "../utils/stats.js";
import { createFlag } from '../utils/createFlag.js';

export function renderStatsDiv(matches, container) {
  matches = Array.isArray(matches) ? matches : [];
  const totalMatches = matches.length;

  if (totalMatches === 0) {
    container.innerHTML = `<p class="no-matches">No matches have been played this season.</p>`;
    return false;
  }

  const stats = calculateStats(matches);

  let html = `
    <table class="stats-table">
      <thead>
        <tr>
          <th>Player</th>
          <th>Won</th>
          <th>Win Ratio</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (const player in stats) {
    html += `<tr>
      <td>${createFlag('pl')} <strong>${player}</strong></td>
      <td>${stats[player].won}</td>
      <td>${stats[player].ratio}%</td>
    </tr>`;
  }

  html += `</tbody></table>`;
  container.innerHTML = html;

  return true;
}
