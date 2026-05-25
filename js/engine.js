import { POINTS, PERFECT_SCORE, PILOTS } from './config.js';

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
      if (calcPoints(ev.result, guesses) === PERFECT_SCORE) {
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

function byPointsThenPerfects(perfects) {
  return ([nameA, ptsA], [nameB, ptsB]) =>
    ptsB !== ptsA
      ? ptsB - ptsA
      : (perfects[nameB] || 0) - (perfects[nameA] || 0);
}

function rankWithTies(sorted) {
  // pos:     dense ranking      (1, 2, 2, 3, 4) — lo que se muestra
  // compPos: competition ranking (1, 2, 2, 4, 5) — para calcular el cambio sin inflar
  let lastPts = null;
  let densePos = 0;
  let compPos = 0;
  return sorted.map(([name, pts], i) => {
    if (pts !== lastPts) {
      densePos += 1;
      compPos = i + 1;
    }
    lastPts = pts;
    return { name, pts, pos: densePos, compPos };
  });
}

function rankingMap(totals, perfects) {
  const sorted = Object.entries(totals).sort(byPointsThenPerfects(perfects));
  return Object.fromEntries(rankWithTies(sorted).map(({ name, compPos }) => [name, compPos]));
}

export function buildStandings(events) {
  const current  = sumTotals(events);
  const perfects = countPerfects(events);

  const prevEvents   = events.slice(1);
  const prevRanking  = rankingMap(prevEvents.length ? sumTotals(prevEvents) : {}, countPerfects(prevEvents));

  const sorted = Object.entries(current).sort(byPointsThenPerfects(perfects));

  return rankWithTies(sorted).map(({ name, pts, pos, compPos }) => {
    const prev = prevRanking[name] ?? compPos;
    return {
      pos,
      prev,
      change: prev - compPos,
      name,
      pts,
      perfects: perfects[name] || 0,
    };
  });
}
