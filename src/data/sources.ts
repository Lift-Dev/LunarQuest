/**
 * Every source cited by a Real Space Fact or dataset. Shown on the Science
 * Sources screen.
 *
 * `url: null, verified: false` means a human still has to find and check the
 * NASA page. URLs are deliberately NOT guessed — judges will click them.
 */
import type { Source } from '../game/types';

const unverified = (id: string, name: string): Source => ({ id, name, url: null, verified: false });

export const sources: Source[] = [
  unverified('nasa-moon-facts', 'NASA — Moon facts'),
  unverified('nasa-apollo-reports', 'NASA — Apollo mission reports (lunar dust)'),
  unverified('nasa-lunar-soil-plants-2022', 'NASA / University of Florida — Plants grown in lunar soil (2022)'),
  unverified('nasa-veggie', 'NASA — Veggie plant growth system on the ISS'),
  unverified('nasa-space-radiation', 'NASA — Space radiation and astronaut health'),
  unverified('nasa-astromaterials', 'NASA Astromaterials — Apollo lunar samples'),
  unverified('nasa-space-weather', 'NASA — Solar storms and the Apollo missions'),
  unverified('nasa-donki', 'NASA DONKI — Space Weather Database Of Notifications, Knowledge, Information'),
  unverified('nasa-fission-surface-power', 'NASA — Fission Surface Power project'),
  unverified('nasa-apollo-13', 'NASA — Apollo 13'),
  unverified('nasa-plant-research', 'NASA — Plant research for space'),
  unverified('nasa-iss-life-support', 'NASA — ISS Oxygen Generation System'),
  unverified('nasa-apollo-seismometers', 'NASA — Apollo seismometers and moonquakes'),
  unverified('nasa-micrometeorites', 'NASA — Micrometeoroids on the Moon'),
  unverified('nasa-comms-delay', 'NASA — Communicating with the Moon and Mars'),
  unverified('nasa-lcross', 'NASA — LCROSS mission'),
  unverified('nasa-artemis', 'NASA — Artemis program'),
  unverified('nasa-osdr', 'NASA Open Science Data Repository (OSDR)'),
];
