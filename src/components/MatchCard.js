export function createFlag(country) {
  return `<img src="https://flagcdn.com/24x18/${country}.png" alt="${country}" class="flag">`;
}

export function renderMatchCard(match) {
  const player1Scores = match.score1.map((score, i) => {
    const isWinnerSet = score > match.score2[i];
    return `<span class="score${isWinnerSet ? ' winner-set' : ''}">${score}</span>`;
  }).join('');

  const player2Scores = match.score2.map((score, i) => {
    const isWinnerSet = score > match.score1[i];
    return `<span class="score${isWinnerSet ? ' winner-set' : ''}">${score}</span>`;
  }).join('');

  return `
    <div class="match-card">
      <div class="round">${match.round}</div>
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
    </div>
  `;
}
