import { POINTS } from './config.js';

/**
 * Calcula los puntos que un jugador obtiene en un evento concreto.
 * @param {string[]} result  - Top-5 pilotos reales en orden.
 * @param {string[]} guesses - Pronóstico del jugador en el mismo orden.
 * @returns {number}
 */
export function calcPoints(result, guesses) {
  return guesses.reduce((sum, g, i) => sum + (g === result[i] ? POINTS[i] : 0), 0);
}

/** Suma puntos de un subconjunto de eventos y devuelve { name → pts }. */
function sumTotals(events) {
  const totals = {};
  events.forEach(ev => {
    ev.picks.forEach(({ player, guesses }) => {
      totals[player] = (totals[player] || 0) + calcPoints(ev.result, guesses);
    });
  });
  return totals;
}

/**
 * Construye el array de clasificación general ordenado por puntos.
 * La posición anterior se calcula excluyendo el primer evento de la lista
 * (events[0] es siempre el más reciente; los eventos se añaden al principio).
 * @param {object[]} events - Array de eventos, del más reciente al más antiguo.
 * @returns {{ pos, prev, name, pts }[]}
 */
export function buildStandings(events) {
  const current = sumTotals(events);

  const prevTotals  = sumTotals(events.slice(1));
  const prevRanking = Object.entries(prevTotals)
    .sort(([, a], [, b]) => b - a)
    .reduce((map, [name], i) => ({ ...map, [name]: i + 1 }), {});

  return Object.entries(current)
    .sort(([, a], [, b]) => b - a)
    .map(([name, pts], i) => ({
      pos:  i + 1,
      prev: prevRanking[name] ?? i + 1,
      name,
      pts,
    }));
}
