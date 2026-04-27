import { POINTS, PILOTS } from './config.js';

export function calcPoints(result, guesses) {
  return guesses.reduce((sum, g, i) => sum + (g === result[i] ? POINTS[i] : 0), 0);
}

function sumTotals(events) {
  const totals = {};
  events.forEach(ev => {
    ev.picks.forEach(({ player, guesses }) => {
      totals[player] = (totals[player] || 0) + calcPoints(ev.result, guesses);
    });
  });
  return totals;
}

export function countPerfects(events) {
  const counts = {};
  events.forEach(ev => {
    ev.picks.forEach(({ player, guesses }) => {
      if (calcPoints(ev.result, guesses) === 15) {
        counts[player] = (counts[player] || 0) + 1;
      }
    });
  });
  return counts;
}

export function validatePicks(events) {
  const errors = [];
  events.forEach(ev => {
    const valid = PILOTS[ev.type];
    ev.picks.forEach(({ player, guesses }) => {
      guesses.forEach((g, i) => {
        if (g !== '-' && !valid.has(g)) {
          errors.push({ event: ev.name, player, position: i + 1, name: g });
        }
      });
    });
  });
  return errors;
}

export function buildStandings(events) {
  const current  = sumTotals(events);
  const perfects = countPerfects(events);

  const prevEvents   = events.slice(1);
  const prevTotals   = sumTotals(prevEvents);
  const prevPerfects = countPerfects(prevEvents);

  const prevRanking = Object.entries(prevTotals)
    .sort(([nA, a], [nB, b]) => b !== a ? b - a : (prevPerfects[nB] || 0) - (prevPerfects[nA] || 0))
    .reduce((map, [name], i) => ({ ...map, [name]: i + 1 }), {});

  return Object.entries(current)
    .sort(([nA, a], [nB, b]) => b !== a ? b - a : (perfects[nB] || 0) - (perfects[nA] || 0))
    .map(([name, pts], i) => ({
      pos:     i + 1,
      prev:    prevRanking[name] ?? i + 1,
      name,
      pts,
      perfects: perfects[name] || 0,
    }));
}
