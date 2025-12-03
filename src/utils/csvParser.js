export function parseScores(scoreStr, side) {
  const sets = scoreStr.split(',').map(s => {
    const cleaned = s.replace(/T|\(|\)/g, '').trim();
    const parts = cleaned.split('-').map(Number);
    return parts;
  });
  if (side === "winner") return sets.map(([w, l]) => w);
  if (side === "loser") return sets.map(([w, l]) => l);
  return [];
}

export function parseCSV(rawText) {
  if (!rawText || rawText.trim() === '') return {};

  const rows = rawText.split('\n').slice(1);
  const data = [];

  rows.forEach(row => {
    if (!row.trim()) return;
    const cols = row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
    const timestamp = new Date(cols[0].replace(/"/g, ''));
    const day = String(timestamp.getDate()).padStart(2, '0');
    const month = String(timestamp.getMonth() + 1).padStart(2, '0');
    const year = timestamp.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;
    const scoreStr = cols[1].replace(/"/g, '');
    const winner = cols[2].replace(/"/g, '').trim();
    const loser = winner === "Tomek" ? "Mateusz" : "Tomek";

    if (!data) data = [];
    data.push({
      player1: winner,
      country1: 'pl',
      score1: parseScores(scoreStr, 'winner'),
      player2: loser,
      country2: 'pl',
      score2: parseScores(scoreStr, 'loser'),
      date: formattedDate
    });
  });

  return data;
}
