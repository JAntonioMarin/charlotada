import { TOTAL_ROUNDS }              from './config.js';
import { events }                    from './data.js';
import { buildStandings }            from './engine.js';
import { renderGeneral, renderPerfectScores, renderEvent } from './render.js';

const standings = buildStandings(events);

document.getElementById('stat-completed').textContent = events.length;
document.getElementById('stat-remaining').textContent = TOTAL_ROUNDS - events.length;
document.getElementById('stat-players').textContent   = standings.length;
document.getElementById('stat-maxpts').textContent    = standings[0]?.pts ?? 0;

document.getElementById('app').innerHTML =
  renderGeneral(standings) +
  renderPerfectScores(standings) +
  `<section>
    <div class="sec-title"><h2>Pronósticos por Evento</h2><div class="sec-line"></div></div>
    <div style="display:flex;flex-direction:column;gap:1.25rem">
      ${events.map(renderEvent).join('')}
    </div>
  </section>`;
