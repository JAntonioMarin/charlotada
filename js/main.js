import { TOTAL_ROUNDS }              from './config.js';
import { events, upcomingEvents }    from './data.js';
import { buildStandings }            from './engine.js';
import { renderGeneral, renderPerfectScores, renderByType, renderEvent, renderUpcoming } from './render.js';
import { initAnimations, initCollapsibles } from './animations.js';

const standings = buildStandings(events);

const standingsByType = {
  f1:    buildStandings(events.filter(e => e.type === 'f1')),
  moto:  buildStandings(events.filter(e => e.type === 'moto')),
  rally: buildStandings(events.filter(e => e.type === 'rally')),
};

document.getElementById('stat-completed').textContent = events.length;
document.getElementById('stat-remaining').textContent = TOTAL_ROUNDS - events.length;
document.getElementById('stat-players').textContent   = standings.length;
document.getElementById('stat-maxpts').textContent    = standings[0]?.pts ?? 0;

document.getElementById('app').innerHTML =
  renderUpcoming(upcomingEvents) +
  renderGeneral(standings) +
  renderPerfectScores(standings) +
  renderByType(standingsByType) +
  `<section>
    <div class="sec-title"><h2>Pronósticos por Evento</h2><div class="sec-line"></div></div>
    <div style="display:flex;flex-direction:column;gap:1.25rem">
      ${events.map(renderEvent).join('')}
    </div>
  </section>`;

initCollapsibles();
initAnimations();
