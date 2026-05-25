import { SVG } from './icons.js';
import { calcPoints } from './engine.js';
import { POINTS, EVENT_LABELS, EVENT_ORDER } from './config.js';

const ARROW_UP   = `<svg width="9" height="11" viewBox="0 0 9 11" fill="currentColor"><path d="M4.5 0L9 5.5H6.2V11H2.8V5.5H0Z"/></svg>`;
const ARROW_DOWN = `<svg width="9" height="11" viewBox="0 0 9 11" fill="currentColor"><path d="M4.5 11L9 5.5H6.2V0H2.8V5.5H0Z"/></svg>`;
const DASH       = `<svg width="12" height="3" viewBox="0 0 12 3" fill="currentColor"><rect width="12" height="3" rx="1.5"/></svg>`;

const CHEVRON = `<svg class="toggle-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 6 8 10 12 6"/></svg>`;

const POS_CLASS = { 1: 'pos p1', 2: 'pos p2', 3: 'pos p3' };
const posClass  = p => POS_CLASS[p] || 'pos';

const POSITION_HEADERS = POINTS.map((_, i) => `<th class="tc">${i + 1}º</th>`).join('');

function changeIndicator(change) {
  if (change > 0) return `<span class="chg up">${ARROW_UP}${change}</span>`;
  if (change < 0) return `<span class="chg dn">${ARROW_DOWN}${Math.abs(change)}</span>`;
  return `<span class="chg eq">${DASH}</span>`;
}

function section(title, body) {
  return `<section>
    <div class="sec-title"><h2>${title}</h2><div class="sec-line"></div></div>
    ${body}
  </section>`;
}

function tableShell(headers, rows) {
  return `<div class="tbl-wrap"><div class="tbl-scroll">
    <table>
      <thead><tr>${headers}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div></div>`;
}

function eventHead(ev) {
  const lbl = EVENT_LABELS[ev.type];
  return `<div class="ev-head">
    <div class="ev-icon bg-${ev.type}">${SVG[ev.type]}</div>
    <div class="ev-info">
      <div class="ev-type-lbl">${lbl} · Ronda ${ev.round}</div>
      <div class="ev-name">${ev.name}</div>
      <div class="ev-detail">📍 ${ev.location} &nbsp;·&nbsp; 📅 ${ev.date}</div>
    </div>
    <span class="ev-pill pill-${ev.type}">${lbl}</span>
  </div>`;
}

function standingsRow(d, maxPts, barWidth, barClass = '') {
  const width = Math.round((d.pts / maxPts) * barWidth);
  return `<tr class="${d.pos === 1 ? 'leader' : ''}">
    <td><span class="${posClass(d.pos)}">${d.pos}</span></td>
    <td>${changeIndicator(d.change)}</td>
    <td><span class="dname">${d.name}</span></td>
    <td>
      <div class="pts-cell">
        <span class="pts${d.pos === 1 ? ' gold' : ''}">${d.pts}</span>
        <div class="pts-bar${barClass ? ' ' + barClass : ''}" style="width:${width}px"></div>
      </div>
    </td>
  </tr>`;
}

const STANDINGS_HEADERS = `<th>POS</th><th>CAMBIO</th><th>JUGADOR</th><th>PTS</th></tr>`;

export function renderGeneral(standings) {
  const maxPts = standings[0]?.pts || 1;
  const rows = standings.map(d => standingsRow(d, maxPts, 88)).join('');
  return section('🏆 Clasificación General', tableShell(STANDINGS_HEADERS, rows));
}

export function renderByType(standingsByType) {
  const tables = EVENT_ORDER.map(key => {
    const s = standingsByType[key];
    if (!s?.length) return '';
    const maxPts = s[0].pts || 1;
    const rows = s.map(d => standingsRow(d, maxPts, 72, `pts-bar--${key}`)).join('');
    return `<div class="type-block">
      <div class="type-block-hdr type-block-hdr--${key}">${EVENT_LABELS[key]}</div>
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

  return section('⭐ Tabla de Plenos', tableShell(`<th>POS</th><th>JUGADOR</th><th>PLENOS</th>`, tableRows));
}

export function renderUpcoming(upcoming) {
  if (upcoming.length === 0) {
    return section('📅 Próximos Eventos', `<div class="upcoming-empty">No hay eventos programados para esta semana</div>`);
  }

  const cards = upcoming.map(ev => `<div class="upcoming-card upcoming-${ev.type}">
    ${eventHead(ev)}
    <div class="upcoming-deadline">
      <span class="deadline-label">Enviar pronóstico antes del</span>
      <span class="deadline-time">⏰ ${ev.deadline}</span>
    </div>
  </div>`).join('');

  return section('📅 Próximos Eventos', `<div class="upcoming-grid">${cards}</div>`);
}

function pickCell(guess, expected) {
  const ok = guess === expected;
  return `<td class="tc"><span class="pick ${ok ? 'pick-ok' : 'pick-fail'}">${ok ? '✓ ' : ''}${guess}</span></td>`;
}

function pickRow({ player, guesses }, result) {
  const pts = calcPoints(result, guesses);
  const cells = guesses.map((g, i) => pickCell(g, result[i])).join('');
  return `<tr>
    <td><span class="dname">${player}</span></td>
    ${cells}
    <td><span class="pts${pts > 0 ? ' gold' : ''}">${pts}</span></td>
  </tr>`;
}

function resultStrip(result) {
  const items = result
    .map((pilot, i) => `<span class="res-item"><span class="res-pos">${i + 1}º</span>${pilot}</span>`)
    .join('');
  return `<div class="result-strip">
    <span class="res-label">Resultado oficial</span>
    ${items}
  </div>`;
}

export function renderEvent(ev) {
  const sorted = ev.picks
    .map(p => ({ ...p, total: calcPoints(ev.result, p.guesses) }))
    .sort((a, b) => b.total - a.total);

  const headers = `<th>JUGADOR</th>${POSITION_HEADERS}<th>TOTAL</th>`;
  const rows = sorted.map(p => pickRow(p, ev.result)).join('');

  return `<div class="ev-card ev-${ev.type}">
    ${eventHead(ev)}
    ${resultStrip(ev.result)}
    <div class="tbl-scroll">
      <table>
        <thead><tr>${headers}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>`;
}

export function renderEvents(events) {
  return section('Pronósticos por Evento', `<div class="events-list">${events.map(renderEvent).join('')}</div>`);
}
