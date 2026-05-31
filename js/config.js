export const POINTS = [5, 4, 3, 2, 1];

export const TOTAL_ROUNDS = 58;

export const PERFECT_SCORE = POINTS.reduce((sum, p) => sum + p, 0);

export const LAST_UPDATE = '31 de Mayo de 2026';

export const EVENT_TYPES = {
  RALLY: 'rally',
  F1:    'f1',
  MOTO:  'moto',
};

export const EVENT_LABELS = {
  rally: 'Rally WRC',
  f1:    'Fórmula 1',
  moto:  'MotoGP',
};

export const EVENT_ORDER = ['f1', 'moto', 'rally'];

export const PILOTS = {
  rally: new Set([
    'Ogier', 'Evans', 'Neuville', 'Solberg', 'Fourmaux',
    'Katsuta', 'Pajari', 'Sordo', 'Paddon', 'Lappi',
    'Virves', 'YRossel', 'LRossel', 'McErlean', 'Sesks',
    'Tanak', 'Loeb',
  ]),
  f1: new Set([
    'Antonelli', 'Russell', 'Hamilton', 'Leclerc', 'Piastri',
    'Norris', 'Verstappen', 'Hadjar', 'Bearman', 'Alonso',
    'Sainz', 'Hulkenberg', 'Gasly', 'Stroll', 'Albon',
    'Tsunoda', 'Lawson', 'Colapinto',
  ]),
  moto: new Set([
    'M Marquez', 'A Marquez', 'Bezzecchi', 'Giannantonio', 'Martin',
    'Acosta', 'Ogura', 'Fernandez', 'Bagnaia', 'Bastianini',
    'Miller', 'Binder', 'Zarco', 'Morbidelli', 'Rins',
    'Nakagami', 'Quartararo', 'Mir', 'Aldeguer',
  ]),
};
