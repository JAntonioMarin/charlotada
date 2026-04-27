import { describe, it, expect } from 'vitest';
import { calcPoints, countPerfects, buildStandings } from '../engine.js';

// Resultado de referencia para la mayoría de tests
const R = ['A', 'B', 'C', 'D', 'E'];

// ── calcPoints ──────────────────────────────────────────────────────────────

describe('calcPoints', () => {
  it('pleno: todas las posiciones correctas → 15 pts', () => {
    expect(calcPoints(R, ['A', 'B', 'C', 'D', 'E'])).toBe(15);
  });

  it('ningún acierto → 0 pts', () => {
    expect(calcPoints(R, ['X', 'X', 'X', 'X', 'X'])).toBe(0);
  });

  it('solo 1º correcta → 5 pts', () => {
    expect(calcPoints(R, ['A', 'X', 'X', 'X', 'X'])).toBe(5);
  });

  it('solo 2º correcta → 4 pts', () => {
    expect(calcPoints(R, ['X', 'B', 'X', 'X', 'X'])).toBe(4);
  });

  it('solo 3º correcta → 3 pts', () => {
    expect(calcPoints(R, ['X', 'X', 'C', 'X', 'X'])).toBe(3);
  });

  it('solo 4º correcta → 2 pts', () => {
    expect(calcPoints(R, ['X', 'X', 'X', 'D', 'X'])).toBe(2);
  });

  it('solo 5º correcta → 1 pt', () => {
    expect(calcPoints(R, ['X', 'X', 'X', 'X', 'E'])).toBe(1);
  });

  it('1º y 3º correctas → 8 pts', () => {
    expect(calcPoints(R, ['A', 'X', 'C', 'X', 'X'])).toBe(8);
  });

  it('2º, 4º y 5º correctas → 4+2+1 = 7 pts', () => {
    expect(calcPoints(R, ['X', 'B', 'X', 'D', 'E'])).toBe(7);
  });

  it('piloto correcto en posición incorrecta → 0 pts', () => {
    // B existe en el resultado pero no está en pos 0
    expect(calcPoints(R, ['B', 'X', 'X', 'X', 'X'])).toBe(0);
  });

  it('guiones (jugador no participa) → 0 pts', () => {
    expect(calcPoints(R, ['-', '-', '-', '-', '-'])).toBe(0);
  });

  it('suma total correcta con todos los acertados → 5+4+3+2+1', () => {
    expect(calcPoints(R, ['A', 'B', 'C', 'D', 'E'])).toBe(5 + 4 + 3 + 2 + 1);
  });
});

// ── countPerfects ───────────────────────────────────────────────────────────

describe('countPerfects', () => {
  it('un evento, un jugador con pleno', () => {
    const events = [{
      result: R,
      picks: [
        { player: 'Ana',  guesses: ['A', 'B', 'C', 'D', 'E'] },
        { player: 'Luis', guesses: ['A', 'X', 'X', 'X', 'X'] },
      ],
    }];
    expect(countPerfects(events)).toEqual({ Ana: 1 });
  });

  it('sin plenos en ningún evento → objeto vacío', () => {
    const events = [{
      result: R,
      picks: [
        { player: 'Ana',  guesses: ['A', 'X', 'X', 'X', 'X'] },
        { player: 'Luis', guesses: ['X', 'B', 'X', 'X', 'X'] },
      ],
    }];
    expect(countPerfects(events)).toEqual({});
  });

  it('dos jugadores con plenos en distintos eventos', () => {
    const events = [
      {
        result: R,
        picks: [
          { player: 'Ana',  guesses: ['A', 'B', 'C', 'D', 'E'] }, // pleno
          { player: 'Luis', guesses: ['X', 'X', 'X', 'X', 'X'] },
        ],
      },
      {
        result: R,
        picks: [
          { player: 'Ana',  guesses: ['X', 'X', 'X', 'X', 'X'] },
          { player: 'Luis', guesses: ['A', 'B', 'C', 'D', 'E'] }, // pleno
        ],
      },
    ];
    expect(countPerfects(events)).toEqual({ Ana: 1, Luis: 1 });
  });

  it('un jugador con varios plenos acumulados', () => {
    const events = [
      {
        result: R,
        picks: [{ player: 'Ana', guesses: ['A', 'B', 'C', 'D', 'E'] }],
      },
      {
        result: R,
        picks: [{ player: 'Ana', guesses: ['A', 'B', 'C', 'D', 'E'] }],
      },
      {
        result: R,
        picks: [{ player: 'Ana', guesses: ['A', 'B', 'C', 'D', 'E'] }],
      },
    ];
    expect(countPerfects(events)).toEqual({ Ana: 3 });
  });

  it('14 pts no cuenta como pleno (solo 15)', () => {
    const events = [{
      result: R,
      picks: [
        // 5+4+3+2 = 14 pts, le falta el 5º
        { player: 'Ana', guesses: ['A', 'B', 'C', 'D', 'X'] },
      ],
    }];
    expect(countPerfects(events)).toEqual({});
  });

  it('lista de eventos vacía → objeto vacío', () => {
    expect(countPerfects([])).toEqual({});
  });
});

// ── buildStandings ──────────────────────────────────────────────────────────

describe('buildStandings', () => {
  it('un evento: orden correcto por puntos', () => {
    const events = [{
      result: R,
      picks: [
        { player: 'Luis', guesses: ['A', 'X', 'X', 'X', 'X'] }, // 5 pts
        { player: 'Ana',  guesses: ['A', 'B', 'C', 'D', 'E'] }, // 15 pts
        { player: 'Pepe', guesses: ['X', 'X', 'C', 'X', 'X'] }, // 3 pts
      ],
    }];
    const s = buildStandings(events);
    expect(s[0].name).toBe('Ana');
    expect(s[1].name).toBe('Luis');
    expect(s[2].name).toBe('Pepe');
  });

  it('posiciones 1-indexed', () => {
    const events = [{
      result: R,
      picks: [
        { player: 'Ana',  guesses: ['A', 'B', 'C', 'D', 'E'] },
        { player: 'Luis', guesses: ['X', 'X', 'X', 'X', 'X'] },
      ],
    }];
    const s = buildStandings(events);
    expect(s[0].pos).toBe(1);
    expect(s[1].pos).toBe(2);
  });

  it('puntos acumulados correctamente entre varios eventos', () => {
    const events = [
      {
        result: R,
        picks: [{ player: 'Ana', guesses: ['A', 'X', 'X', 'X', 'X'] }], // 5
      },
      {
        result: R,
        picks: [{ player: 'Ana', guesses: ['X', 'B', 'X', 'X', 'X'] }], // 4
      },
    ];
    const s = buildStandings(events);
    expect(s[0].pts).toBe(9);
  });

  it('campo perfects incluido en cada entrada', () => {
    const events = [{
      result: R,
      picks: [
        { player: 'Ana',  guesses: ['A', 'B', 'C', 'D', 'E'] }, // pleno
        { player: 'Luis', guesses: ['X', 'X', 'X', 'X', 'X'] },
      ],
    }];
    const s = buildStandings(events);
    expect(s.find(d => d.name === 'Ana').perfects).toBe(1);
    expect(s.find(d => d.name === 'Luis').perfects).toBe(0);
  });

  it('desempate en puntos: más plenos → posición superior', () => {
    // Ana: evento reciente 5pts + evento previo 10pts = 15pts, 0 plenos
    // Luis: evento reciente 0pts + evento previo 15pts = 15pts, 1 pleno → gana el desempate
    const events = [
      {
        result: R,
        picks: [
          { player: 'Ana',  guesses: ['A', 'X', 'X', 'X', 'X'] }, // 5 pts
          { player: 'Luis', guesses: ['X', 'X', 'X', 'X', 'X'] }, // 0 pts
        ],
      },
      {
        result: R,
        picks: [
          { player: 'Ana',  guesses: ['A', 'B', 'X', 'X', 'E'] }, // 5+4+1 = 10 pts
          { player: 'Luis', guesses: ['A', 'B', 'C', 'D', 'E'] }, // 15 pts (pleno)
        ],
      },
    ];
    // Ana: 15pts, 0 plenos — Luis: 15pts, 1 pleno → Luis 1º
    const s = buildStandings(events);
    expect(s[0].name).toBe('Luis');
    expect(s[1].name).toBe('Ana');
  });

  it('sin empate en puntos: los plenos no alteran el orden', () => {
    const events = [{
      result: R,
      picks: [
        { player: 'Ana',  guesses: ['A', 'B', 'C', 'D', 'E'] }, // 15 pts, 1 pleno
        { player: 'Luis', guesses: ['A', 'B', 'C', 'D', 'X'] }, // 14 pts, 0 plenos
      ],
    }];
    const s = buildStandings(events);
    expect(s[0].name).toBe('Ana');
  });

  it('prev refleja la posición antes del evento más reciente', () => {
    // Evento previo: Luis 1º, Ana 2º
    // Evento reciente: Ana sube al 1º
    const events = [
      {
        result: R,
        picks: [
          { player: 'Ana',  guesses: ['A', 'B', 'C', 'D', 'E'] }, // +15 → total 20
          { player: 'Luis', guesses: ['X', 'X', 'X', 'X', 'X'] }, // +0  → total 10
        ],
      },
      {
        result: R,
        picks: [
          { player: 'Ana',  guesses: ['X', 'X', 'X', 'X', 'X'] }, // 0 pts
          { player: 'Luis', guesses: ['A', 'B', 'X', 'X', 'X'] }, // 9 pts (era 1º)
        ],
      },
    ];
    // Prev (solo eventos[1]): Luis 9pts → 1º, Ana 0pts → 2º
    // Ahora: Ana 15pts → 1º (prev=2), Luis 9pts → 2º (prev=1)
    const s = buildStandings(events);
    const ana  = s.find(d => d.name === 'Ana');
    const luis = s.find(d => d.name === 'Luis');
    expect(ana.pos).toBe(1);
    expect(ana.prev).toBe(2);
    expect(luis.pos).toBe(2);
    expect(luis.prev).toBe(1);
  });

  it('jugador nuevo (solo en evento reciente): prev = posición actual', () => {
    const events = [
      {
        result: R,
        picks: [
          { player: 'Nuevo', guesses: ['A', 'X', 'X', 'X', 'X'] }, // solo aquí
          { player: 'Ana',   guesses: ['A', 'X', 'X', 'X', 'X'] },
        ],
      },
      {
        result: R,
        picks: [
          { player: 'Ana', guesses: ['X', 'X', 'X', 'X', 'X'] },
          // Nuevo no aparece aquí
        ],
      },
    ];
    const s = buildStandings(events);
    const nuevo = s.find(d => d.name === 'Nuevo');
    expect(nuevo.prev).toBe(nuevo.pos);
  });

  it('evento único: prev = pos para todos (no hay historial)', () => {
    const events = [{
      result: R,
      picks: [
        { player: 'Ana',  guesses: ['A', 'B', 'C', 'D', 'E'] },
        { player: 'Luis', guesses: ['A', 'X', 'X', 'X', 'X'] },
        { player: 'Pepe', guesses: ['X', 'X', 'X', 'X', 'X'] },
      ],
    }];
    const s = buildStandings(events);
    s.forEach(d => expect(d.prev).toBe(d.pos));
  });
});
