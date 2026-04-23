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
