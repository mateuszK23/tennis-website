export function calculateStats(matches) {
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
