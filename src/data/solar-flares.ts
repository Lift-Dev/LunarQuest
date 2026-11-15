/**
 * Real X-class solar flares used by the Day 7 "Solar Storm Warning!" scenario.
 *
 * ARCHIVED data, embedded in the game — never presented as live.
 * Every row was checked against NASA DONKI (https://ccmc.gsfc.nasa.gov/DONKI/WS/get/FLR and /SEP)
 * on 2026-11-15. `donkiId` is the DONKI flrID; `sepIds` are the solar energetic particle (SEP)
 * events DONKI links to that flare.
 *
 * `fastParticles` = DONKI has a linked SEP event on the GOES ">100 MeV" proton channel.
 * Protons that fast get through spacesuits and thin walls, so on those storms staying outside
 * on Day 7 exceeds NASA's 250 mSv solar-storm limit (see docs/SCENARIOS_MISSION_01.md §2).
 * Each flare was picked because DONKI links it to an SEP event: a flare alone
 * (light) is not a radiation storm, the particles are.
 */
import type { SolarFlare } from '../game/types';

export const solarFlares: SolarFlare[] = [
  // Storms with >100 MeV protons (GOES), the kind that get through spacesuits.
  {
    id: 'flare-2017-09-10',
    date: '2017-09-10',
    classType: 'X8.2',
    note: 'GOES recorded protons above 100 MeV',
    donkiId: '2017-09-10T15:35:00-FLR-001',
    sepIds: ['2017-09-10T16:25:00-SEP-001', '2017-09-10T16:45:00-SEP-001', '2017-09-10T20:00:00-SEP-001'],
    fastParticles: true,
    verified: true,
  },
  {
    id: 'flare-2012-03-07',
    date: '2012-03-07',
    classType: 'X5.4',
    note: 'GOES recorded protons above 100 MeV',
    donkiId: '2012-03-07T00:00:00-FLR-001',
    sepIds: ['2012-03-07T01:44:00-SEP-001', '2012-03-07T04:05:00-SEP-001', '2012-03-07T05:00:00-SEP-001'],
    fastParticles: true,
    verified: true,
  },
  {
    id: 'flare-2025-11-11',
    date: '2025-11-11',
    classType: 'X5.1',
    note: 'GOES recorded protons above 100 MeV',
    donkiId: '2025-11-11T09:49:00-FLR-001',
    sepIds: ['2025-11-11T09:45:00-SEP-001', '2025-11-11T10:20:00-SEP-001', '2025-11-11T11:09:00-SEP-001'],
    fastParticles: true,
    verified: true,
  },
  // Storms whose particles DONKI recorded only at lower energies (>10 MeV or 15–50 MeV).
  {
    id: 'flare-2017-09-06',
    date: '2017-09-06',
    classType: 'X9.3',
    note: 'Particles recorded by SOHO at 15.8–39.8 MeV',
    donkiId: '2017-09-06T11:53:00-FLR-001',
    sepIds: ['2017-09-06T23:30:00-SEP-001'],
    fastParticles: false,
    verified: true,
  },
  {
    id: 'flare-2023-12-31',
    date: '2023-12-31',
    classType: 'X5.0',
    note: 'GOES recorded protons above 10 MeV',
    donkiId: '2023-12-31T21:40:00-FLR-001',
    sepIds: ['2024-01-02T23:22:00-SEP-001', '2024-01-02T23:22:00-SEP-002', '2024-01-03T20:05:00-SEP-001'],
    fastParticles: false,
    verified: true,
  },
  {
    id: 'flare-2014-02-25',
    date: '2014-02-25',
    classType: 'X4.9',
    note: 'GOES recorded protons above 10 MeV',
    donkiId: '2014-02-25T00:41:00-FLR-001',
    sepIds: ['2014-02-25T06:05:00-SEP-001', '2014-02-25T13:55:00-SEP-001'],
    fastParticles: false,
    verified: true,
  },
  {
    id: 'flare-2024-09-14',
    date: '2024-09-14',
    classType: 'X4.5',
    note: 'GOES recorded protons above 10 MeV',
    donkiId: '2024-09-14T15:13:00-FLR-001',
    sepIds: ['2024-09-17T04:40:00-SEP-001', '2024-09-17T07:35:00-SEP-001'],
    fastParticles: false,
    verified: true,
  },
];
