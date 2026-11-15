/**
 * Every source cited by a Real Space Fact, the solar-flare dataset or a balance number. Shown on
 * the Science Sources screen.
 *
 * All of these are NASA pages or NASA technical reports (ntrs.nasa.gov). Each URL was opened and
 * read on 2026-11-15, and the sentence each fact or number relies on is quoted in
 * docs/SCENARIOS_MISSION_01.md §6. `verified: true` means exactly that; never set it for a URL
 * nobody has read.
 */
import type { Source } from '../game/types';

const checked = (id: string, name: string, url: string): Source => ({ id, name, url, verified: true });

export const sources: Source[] = [
  // Real Space Facts (shown on the feedback card)
  checked('nasa-south-pole-region', 'NASA — The Lunar South Pole Region', 'https://www.nasa.gov/reference/moonbase-environment/'),
  checked('nasa-lunar-dust-challenge', 'NASA — The Challenge of Lunar Dust (NTRS 20220008062)', 'https://ntrs.nasa.gov/citations/20220008062'),
  checked('nasa-dust-shield-2025', 'NASA — Dust Shield Successfully Repels Lunar Regolith on Moon (2025)', 'https://www.nasa.gov/image-article/nasas-dust-shield-successfully-repels-lunar-regolith-on-moon/'),
  checked('nasa-plume-surface', 'NASA — Plume Surface Interaction (PSI) project', 'https://www.nasa.gov/plume-surface-interaction/'),
  checked('nasa-lro-new-craters', 'NASA — Earth’s Moon Hit by Surprising Number of Meteoroids (LRO, 2016)', 'https://www.nasa.gov/press-release/goddard/2016/lro-lunar-cratering'),
  checked('nasa-radiation-protection-brief', 'NASA OCHMO — Design for Ionizing Radiation Protection (OCHMO-TB-020)', 'https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-020-radiation-protection.pdf'),
  checked('nasa-alsj-radiation', 'NASA Apollo Lunar Surface Journal — Radiation and the August 1972 solar storm', 'https://www.nasa.gov/wp-content/uploads/static/history/alsj/WOTM/WOTM-Radiation.html'),
  checked('nasa-ksc-moon-soil-oxygen', 'NASA Kennedy — Breathes Life into Moon Soil Testing (2025)', 'https://www.nasa.gov/centers-and-facilities/kennedy/nasa-kennedy-breathes-life-into-moon-soil-testing'),
  checked('nasa-co2-brief', 'NASA OCHMO — Carbon Dioxide (OCHMO-TB-004)', 'https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-004-carbon-dioxide.pdf'),
  checked('nasa-apollo-17', 'NASA — Apollo 17 Mission Details', 'https://www.nasa.gov/missions/apollo/apollo-17-mission-details/'),
  // Datasets and balance numbers
  checked('nasa-donki', 'NASA DONKI — Space Weather Database Of Notifications, Knowledge, Information', 'https://ccmc.gsfc.nasa.gov/tools/DONKI/'),
  checked('nasa-std-3001-radiation', 'NASA-STD-3001 — Human Performance: radiation exposure limits', 'https://www.nasa.gov/reference/4-0-human-performance/'),
  checked('nasa-lsah-2023', 'NASA Lifetime Surveillance of Astronaut Health Newsletter, 2023 Vol. 28 Issue 2 (space radiation doses)', 'https://www.nasa.gov/wp-content/uploads/2023/10/lsah-newsletter-2023-vol28-issue2.pdf'),
  checked('nasa-iss-oxygen-ices-2015', 'NASA — ISS oxygen and nitrogen usage (ICES-2015-146, NTRS 20150010425)', 'https://ntrs.nasa.gov/citations/20150010425'),
  checked('nasa-isru-progress-2025', 'NASA — Lunar ISRU progress review (Sanders, NTRS 20250003730)', 'https://ntrs.nasa.gov/citations/20250003730'),
];
