import { describe, it, expect } from 'vitest';
import { events } from '../data.js';
import { validatePicks } from '../engine.js';

describe('integridad de data.js', () => {
  it('todos los picks usan nombres de piloto válidos', () => {
    const errors = validatePicks(events);

    if (errors.length > 0) {
      const detail = errors
        .map(e => `  · ${e.event} — ${e.player} pos${e.position}: "${e.name}"`)
        .join('\n');
      expect.fail(`Nombres inválidos encontrados:\n${detail}`);
    }

    expect(errors).toHaveLength(0);
  });
});
