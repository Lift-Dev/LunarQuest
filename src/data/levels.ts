/**
 * The 15 levels on the "Your Journey" screen, in unlock order.
 * Only levels with a `contentId` are playable; the rest show "Coming soon"
 * once unlocked. Titles match the supplied Mission Levels design.
 */
import type { Level } from '../game/types';
import { asset } from '../lib/asset';

const titles = [
  'Lunar Outpost',
  'The Red Planet',
  'Growing Beyond Earth',
  'Lost Connection',
  'Meteor Storm',
  'Frozen Ice Caves',
  'Solar Flare Rescue',
  'Crater Rover Race',
  'Water Hunters',
  'Dust Storm Shelter',
  'Ocean Moon Dive',
  'Signal Relay',
  'Asteroid Belt Crossing',
  'Alien Crystal Cave',
  'Homecoming Orbit',
];

export const levels: Level[] = titles.map((title, i) => {
  const number = i + 1;
  const nn = String(number).padStart(2, '0');
  return {
    number,
    id: `level-${nn}`,
    title,
    // Only Level 01 has a colour thumbnail so far; 02–15 use the greyscale locked art.
    thumbnail: number === 1 ? asset('assets/levels/thumb-01.jpg') : asset(`assets/levels/thumb-${nn}-locked.png`),
    contentId: number === 1 ? 'mission-01' : null,
  };
});
