import { SVG } from './icons.js';
import { calcPoints } from './engine.js';

const LABELS = {
  rally: 'Rally WRC',
  f1:    'Fórmula 1',
  moto:  'MotoGP',
};

const ARROW_UP   = `<svg width="9" height="11" viewBox="0 0 9 11" fill="currentColor"><path d="M4.5 0L9 5.5H6.2V11H2.8V5.5H0Z"/></svg>`;
const ARROW_DOWN = `<svg width="9" height="11" viewBox="0 0 9 11" fill="currentColor"><path d="M4.5 11L9 5.5H6.2V0H2.8V5.5H0Z"/></svg>`;
const DASH       = `<svg width="12" height="3" viewBox="0 0 12 3" fill="currentColor"><rect width="12" height="3" rx="1.5"/></svg>`;

function changeIndicator(cur, prev) {
  const d = prev - cur;
  if (d > 0) return `<span class="chg up">${ARROW_UP}${d}</span>`;
  if (d < 0) return `<span class="chg dn">${ARROW_DOWN}${Math.abs(d)}</span>`;
  return `<span class="chg eq">${DASH}</span>`;
}

function posClass(p) {
  if (p === 1) return 'pos p1';
  if (p === 2) return 'pos p2';
  if (p === 3) return 'pos p3';
  return 'pos';
}

function buildResultStrip(result) {
  return result
    .map((pilot, i) => `<span class="res-item"><span class="res-pos">${i + 1}º</span>${pilot}</span>`)
    .join('');
}

function buildPickRow(player, guesses, result) {
  const pts = calcPoints(result, guesses);
  const cells = guesses.map((g, i) => {
    const ok = g === result[i];
    return `<td class="tc"><span class="pick ${ok ? 'pick-ok' : 'pick-fail'}">${ok ? '✓ ' : ''}${g}</span></td>`;
  }).join('');

  return `<tr>
    <td><span class="dname">${player}</span></td>
    ${cells}
    <td><span class="pts${pts > 0 ? ' gold' : ''}">${pts}</span></td>
  </tr>`;
}

const CHEVRON = `<svg class="toggle-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 6 8 10 12 6"/></svg>`;

export function renderUpcoming(upcoming) {
  if (upcoming.length === 0) {
    return `<section>
      <div class="sec-title"><h2>📅 Próximos Eventos</h2><div class="sec-line"></div></div>
      <div class="upcoming-empty">No hay eventos programados para esta semana</div>
    </section>`;
  }

  const cards = upcoming.map(ev => {
    const lbl = LABELS[ev.type];
    return `<div class="upcoming-card upcoming-${ev.type}">
      <div class="ev-head">
        <div class="ev-icon bg-${ev.type}">${SVG[ev.type]}</div>
        <div class="ev-info">
          <div class="ev-type-lbl">${lbl} · Ronda ${ev.round}</div>
          <div class="ev-name">${ev.name}</div>
          <div class="ev-detail">📍 ${ev.location} &nbsp;·&nbsp; 📅 ${ev.date}</div>
        </div>
        <span class="ev-pill pill-${ev.type}">${lbl}</span>
      </div>
      <div class="upcoming-deadline">
        <span class="deadline-label">Enviar pronóstico antes del</span>
        <span class="deadline-time">⏰ ${ev.deadline}</span>
      </div>
    </div>`;
  }).join('');

  return `<section>
    <div class="sec-title"><h2>📅 Próximos Eventos</h2><div class="sec-line"></div></div>
    <div class="upcoming-grid">${cards}</div>
  </section>`;
}

export function renderByType(standingsByType) {
  const TYPES = [
    { key: 'f1',    label: 'Fórmula 1' },
    { key: 'moto',  label: 'MotoGP' },
    { key: 'rally', label: 'Rally WRC' },
  ];

  const tables = TYPES.map(({ key, label }) => {
    const s = standingsByType[key];
    if (!s.length) return '';
    const maxPts = s[0].pts || 1;

    const rows = s.map(d => {
      const barWidth = Math.round((d.pts / maxPts) * 72);
      return `<tr class="${d.pos === 1 ? 'leader' : ''}">
        <td><span class="${posClass(d.pos)}">${d.pos}</span></td>
        <td>${changeIndicator(d.pos, d.prev)}</td>
        <td><span class="dname">${d.name}</span></td>
        <td>
          <div class="pts-cell">
            <span class="pts${d.pos === 1 ? ' gold' : ''}">${d.pts}</span>
            <div class="pts-bar pts-bar--${key}" style="width:${barWidth}px"></div>
          </div>
        </td>
      </tr>`;
    }).join('');

    return `<div class="type-block">
      <div class="type-block-hdr type-block-hdr--${key}">${label}</div>
      <div class="tbl-wrap type-block-tbl"><div class="tbl-scroll">
        <table>
          <thead><tr><th>POS</th><th>CHG</th><th>JUGADOR</th><th>PTS</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div></div>
    </div>`;
  }).join('');

  return `<div class="collapsible">
    <button class="collapsible-trigger" aria-expanded="false">
      <span>Clasificación por Disciplina</span>
      ${CHEVRON}
    </button>
    <div class="collapsible-body">
      <div class="type-grid">${tables}</div>
    </div>
  </div>`;
}

export function renderPerfectScores(standings) {
  const rows = standings
    .filter(d => d.perfects > 0)
    .sort((a, b) => b.perfects - a.perfects);

  if (rows.length === 0) return '';

  const tableRows = rows.map((d, i) => `<tr>
    <td><span class="${posClass(i + 1)}">${i + 1}</span></td>
    <td><span class="dname">${d.name}</span></td>
    <td><span class="pts gold">${d.perfects}</span></td>
  </tr>`).join('');

  return `<section>
    <div class="sec-title"><h2>⭐ Tabla de Plenos</h2><div class="sec-line"></div></div>
    <div class="tbl-wrap"><div class="tbl-scroll">
      <table>
        <thead><tr><th>POS</th><th>JUGADOR</th><th>PLENOS</th></tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div></div>
  </section>`;
}

export function renderGeneral(standings) {
  const maxPts = standings[0]?.pts || 1;

  const rows = standings.map(d => {
    const barWidth = Math.round((d.pts / maxPts) * 88);
    return `<tr class="${d.pos === 1 ? 'leader' : ''}">
      <td><span class="${posClass(d.pos)}">${d.pos}</span></td>
      <td>${changeIndicator(d.pos, d.prev)}</td>
      <td><span class="dname">${d.name}</span></td>
      <td>
        <div class="pts-cell">
          <span class="pts${d.pos === 1 ? ' gold' : ''}">${d.pts}</span>
          <div class="pts-bar" style="width:${barWidth}px"></div>
        </div>
      </td>
    </tr>`;
  }).join('');

  return `<section>
    <div class="sec-title"><h2>🏆 Clasificación General</h2><div class="sec-line"></div></div>
    <div class="tbl-wrap"><div class="tbl-scroll">
      <table>
        <thead><tr><th>POS</th><th>CAMBIO</th><th>JUGADOR</th><th>PTS</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div></div>
  </section>`;
}

export function renderEvent(ev) {
  const lbl = LABELS[ev.type];

  const sorted = ev.picks
    .map(p => ({ ...p, total: calcPoints(ev.result, p.guesses) }))
    .sort((a, b) => b.total - a.total);

  return `<div class="ev-card ev-${ev.type}">
    <div class="ev-head">
      <div class="ev-icon bg-${ev.type}">${SVG[ev.type]}</div>
      <div class="ev-info">
        <div class="ev-type-lbl">${lbl} · Ronda ${ev.round}</div>
        <div class="ev-name">${ev.name}</div>
        <div class="ev-detail">📍 ${ev.location} &nbsp;·&nbsp; 📅 ${ev.date}</div>
      </div>
      <span class="ev-pill pill-${ev.type}">${lbl}</span>
    </div>
    <div class="result-strip">
      <span class="res-label">Resultado oficial</span>
      ${buildResultStrip(ev.result)}
    </div>
    <div class="tbl-scroll">
      <table>
        <thead><tr>
          <th>JUGADOR</th>
          <th class="tc">1º</th><th class="tc">2º</th><th class="tc">3º</th><th class="tc">4º</th><th class="tc">5º</th>
          <th>TOTAL</th>
        </tr></thead>
        <tbody>${sorted.map(p => buildPickRow(p.player, p.guesses, ev.result)).join('')}</tbody>
      </table>
    </div>
  </div>`;
}
