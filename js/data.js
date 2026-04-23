import { EVENT_TYPES } from './config.js';

/**
 * Lista de eventos disputados.
 * type:   EVENT_TYPES value
 * result: top-5 pilotos reales en orden de llegada
 * picks:  pronóstico de cada jugador para las posiciones 1º–5º
 */
export const events = [
  {
    type: EVENT_TYPES.RALLY,
    round: 4,
    name: 'Rally de Monte Carlo',
    location: 'Mónaco / Francia',
    date: '23–26 Ene 2026',
    result: ['Sainz', 'Rovanperä', 'Neuville', 'Verstappen', 'Norris'],
    picks: [
      { player: 'Choro',    guesses: ['Sainz',     'Rovanperä',  'Verstappen', 'Neuville',   'Norris'    ] },
      { player: 'Dani',     guesses: ['Rovanperä', 'Sainz',      'Neuville',   'Verstappen', 'Loeb'      ] },
      { player: 'Juanra',   guesses: ['Sainz',     'Neuville',   'Rovanperä',  'Norris',     'Verstappen'] },
      { player: 'Juano',    guesses: ['Neuville',  'Rovanperä',  'Sainz',      'Verstappen', 'Norris'    ] },
      { player: 'Sarri',    guesses: ['Sainz',     'Rovanperä',  'Neuville',   'Norris',     'Verstappen'] },
      { player: 'Lechero',  guesses: ['Rovanperä', 'Neuville',   'Sainz',      'Verstappen', 'Evans'     ] },
      { player: 'Cebolla',  guesses: ['Sainz',     'Rovanperä',  'Verstappen', 'Neuville',   'Evans'     ] },
      { player: 'Amador',   guesses: ['Neuville',  'Sainz',      'Rovanperä',  'Verstappen', 'Norris'    ] },
      { player: 'Pilili',   guesses: ['Sainz',     'Neuville',   'Rovanperä',  'Verstappen', 'Norris'    ] },
      { player: 'Calcetin', guesses: ['Rovanperä', 'Sainz',      'Neuville',   'Verstappen', 'Evans'     ] },
      { player: 'Angel',    guesses: ['Sainz',     'Rovanperä',  'Neuville',   'Verstappen', 'Evans'     ] },
      { player: 'David',    guesses: ['Neuville',  'Verstappen', 'Sainz',      'Rovanperä',  'Norris'    ] },
    ],
  },
  {
    type: EVENT_TYPES.F1,
    round: 2,
    name: 'Gran Premio de España',
    location: 'Circuit de Barcelona-Catalunya',
    date: '1 Feb 2026',
    result: ['Verstappen', 'Norris', 'Leclerc', 'Sainz', 'Russell'],
    picks: [
      { player: 'Choro',    guesses: ['Verstappen', 'Norris',     'Leclerc',    'Sainz',    'Russell'  ] },
      { player: 'Dani',     guesses: ['Verstappen', 'Leclerc',    'Norris',     'Russell',  'Sainz'    ] },
      { player: 'Juanra',   guesses: ['Norris',     'Verstappen', 'Sainz',      'Leclerc',  'Russell'  ] },
      { player: 'Juano',    guesses: ['Verstappen', 'Norris',     'Russell',    'Sainz',    'Leclerc'  ] },
      { player: 'Sarri',    guesses: ['Leclerc',    'Verstappen', 'Norris',     'Sainz',    'Russell'  ] },
      { player: 'Lechero',  guesses: ['Verstappen', 'Sainz',      'Norris',     'Leclerc',  'Russell'  ] },
      { player: 'Cebolla',  guesses: ['Norris',     'Verstappen', 'Leclerc',    'Russell',  'Sainz'    ] },
      { player: 'Amador',   guesses: ['Verstappen', 'Norris',     'Leclerc',    'Sainz',    'Hamilton' ] },
      { player: 'Pilili',   guesses: ['Leclerc',    'Norris',     'Verstappen', 'Sainz',    'Russell'  ] },
      { player: 'Calcetin', guesses: ['Verstappen', 'Leclerc',    'Sainz',      'Norris',   'Russell'  ] },
      { player: 'Angel',    guesses: ['Norris',     'Leclerc',    'Verstappen', 'Russell',  'Sainz'    ] },
      { player: 'David',    guesses: ['Verstappen', 'Norris',     'Sainz',      'Leclerc',  'Hamilton' ] },
    ],
  },
  {
    type: EVENT_TYPES.MOTO,
    round: 1,
    name: 'Gran Premio de Italia',
    location: 'Autodromo Internazionale del Mugello',
    date: '15 Feb 2026',
    result: ['Márquez', 'Bagnaia', 'Martín', 'Viñales', 'Rins'],
    picks: [
      { player: 'Choro',    guesses: ['Márquez',  'Bagnaia',  'Martín',   'Rins',       'Viñales'   ] },
      { player: 'Dani',     guesses: ['Bagnaia',  'Márquez',  'Martín',   'Quartararo', 'Binder'    ] },
      { player: 'Juanra',   guesses: ['Márquez',  'Martín',   'Bagnaia',  'Rins',       'Viñales'   ] },
      { player: 'Juano',    guesses: ['Martín',   'Bagnaia',  'Márquez',  'Viñales',    'Binder'    ] },
      { player: 'Sarri',    guesses: ['Márquez',  'Bagnaia',  'Rins',     'Martín',     'Viñales'   ] },
      { player: 'Lechero',  guesses: ['Bagnaia',  'Márquez',  'Martín',   'Viñales',    'Binder'    ] },
      { player: 'Cebolla',  guesses: ['Márquez',  'Martín',   'Bagnaia',  'Viñales',    'Binder'    ] },
      { player: 'Amador',   guesses: ['Márquez',  'Bagnaia',  'Martín',   'Rins',       'Viñales'   ] },
      { player: 'Pilili',   guesses: ['Martín',   'Márquez',  'Bagnaia',  'Binder',     'Viñales'   ] },
      { player: 'Calcetin', guesses: ['Bagnaia',  'Martín',   'Márquez',  'Viñales',    'Rins'      ] },
      { player: 'Angel',    guesses: ['Márquez',  'Bagnaia',  'Viñales',  'Martín',     'Rins'      ] },
      { player: 'David',    guesses: ['Bagnaia',  'Márquez',  'Rins',     'Martín',     'Viñales'   ] },
    ],
  },
];
