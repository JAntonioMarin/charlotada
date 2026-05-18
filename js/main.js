import { TOTAL_ROUNDS, LAST_UPDATE, EVENT_ORDER } from './config.js';
import { events, upcomingEvents } from './data.js';
import { buildStandings } from './engine.js';
import {
  renderGeneral, renderPerfectScores, renderByType,
  renderEvents, renderUpcoming,
} from './render.js';
import { initAnimations, initCollapsibles } from './animations.js';

const eventsByType = EVENT_ORDER.reduce((acc, key) => ({ ...acc, [key]: [] }), {});
events.forEach(ev => eventsByType[ev.type]?.push(ev));

const standings       = buildStandings(events);
const standingsByType = Object.fromEntries(
  EVENT_ORDER.map(key => [key, buildStandings(eventsByType[key])])
);

const stats = {
  'stat-completed': events.length,
  'stat-remaining': TOTAL_ROUNDS - events.length,
  'stat-players':   standings.length,
  'stat-maxpts':    standings[0]?.pts ?? 0,
};
Object.entries(stats).forEach(([id, value]) => {
  document.getElementById(id).textContent = value;
});

const footer = document.getElementById('footer-update');
if (footer) footer.textContent = LAST_UPDATE;

document.getElementById('app').innerHTML = [
  renderUpcoming(upcomingEvents),
  renderGeneral(standings),
  renderPerfectScores(standings),
  renderByType(standingsByType),
  renderEvents(events),
].join('');

initCollapsibles();
initAnimations();
