/**
 * Real X-class solar flares used by the Day 6 "Solar Storm Warning!" scenario.
 *
 * ARCHIVED data, embedded in the game — never presented as live.
 * `verified: false` until each row is confirmed in NASA DONKI and its flrID
 * recorded in `donkiId` (the DONKI API was unreachable on 2026-11-14).
 */
import type { SolarFlare } from '../game/types';

export const solarFlares: SolarFlare[] = [
  { id: 'flare-2017-09-06', date: '2017-09-06', classType: 'X9.3', note: 'One of the biggest flares in over 10 years', donkiId: null, verified: false },
  { id: 'flare-2017-09-10', date: '2017-09-10', classType: 'X8.2', note: 'Sent fast particles all the way to Earth', donkiId: null, verified: false },
  { id: 'flare-2024-10-03', date: '2024-10-03', classType: 'X9.0', note: 'One of the strongest flares of the current solar cycle', donkiId: null, verified: false },
  { id: 'flare-2024-05-14', date: '2024-05-14', classType: 'X8.7', note: 'Came days after the big May 2024 storm that made auroras visible in many places', donkiId: null, verified: false },
  { id: 'flare-2011-08-09', date: '2011-08-09', classType: 'X6.9', donkiId: null, verified: false },
  { id: 'flare-2012-03-07', date: '2012-03-07', classType: 'X5.4', donkiId: null, verified: false },
  { id: 'flare-2014-10-24', date: '2014-10-24', classType: 'X3.1', note: 'From a giant sunspot bigger than Jupiter', donkiId: null, verified: false },
];
