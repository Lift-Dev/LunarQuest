# Data sources

Every Real Space Fact in LunarQuest comes from NASA, and so does almost every number (the few game assumptions are listed at the bottom). Each page below was opened and read on 2026-11-15, and the exact sentence each one supports is quoted in [SCENARIOS_MISSION_01.md](SCENARIOS_MISSION_01.md) §6. The same list is the source of truth in [`src/data/sources.ts`](../src/data/sources.ts).

| # | Source | Used for |
|---|---|---|
| 1 | [NASA — The Lunar South Pole Region](https://www.nasa.gov/reference/moonbase-environment/) | Fact: Day 1 · why the panels sit in shadow |
| 2 | [NASA — The Challenge of Lunar Dust (NTRS 20220008062)](https://ntrs.nasa.gov/citations/20220008062) | Fact: Day 3 · dust on the panels; dust halves panel output |
| 3 | [NASA — Dust Shield Successfully Repels Lunar Regolith on Moon (2025)](https://www.nasa.gov/image-article/nasas-dust-shield-successfully-repels-lunar-regolith-on-moon/) | Fact: Day 3 · NASA dust shield on the Moon |
| 4 | [NASA — Plume Surface Interaction (PSI) project](https://www.nasa.gov/plume-surface-interaction/) | Background reading (not yet cited by a scenario) |
| 5 | [NASA — Earth’s Moon Hit by Surprising Number of Meteoroids (LRO, 2016)](https://www.nasa.gov/press-release/goddard/2016/lro-lunar-cratering) | Fact: Day 5 · small meteoroid hits |
| 6 | [NASA OCHMO — Design for Ionizing Radiation Protection (OCHMO-TB-020)](https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-020-radiation-protection.pdf) | Fact: Day 7 · water blocks radiation |
| 7 | [NASA Apollo Lunar Surface Journal — Radiation and the August 1972 solar storm](https://www.nasa.gov/wp-content/uploads/static/history/alsj/WOTM/WOTM-Radiation.html) | Fact: Day 7 · the August 1972 solar storm |
| 8 | [NASA Kennedy — Breathes Life into Moon Soil Testing (2025)](https://www.nasa.gov/centers-and-facilities/kennedy/nasa-kennedy-breathes-life-into-moon-soil-testing) | Fact: Day 9 · oxygen from Moon soil |
| 9 | [NASA OCHMO — Carbon Dioxide (OCHMO-TB-004)](https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-004-carbon-dioxide.pdf) | Fact: Day 11 · carbon dioxide removal |
| 10 | [NASA — Apollo 17 Mission Details](https://www.nasa.gov/missions/apollo/apollo-17-mission-details/) | Fact: Day 13 · Apollo 17 moonwalks |
| 11 | [NASA DONKI — Space Weather Database Of Notifications, Knowledge, Information](https://ccmc.gsfc.nasa.gov/tools/DONKI/) | Data: the seven archived solar flares replayed on Day 7 |
| 12 | [NASA-STD-3001 — Human Performance: radiation exposure limits](https://www.nasa.gov/reference/4-0-human-performance/) | Number: 250 mSv radiation abort limit |
| 13 | [NASA Lifetime Surveillance of Astronaut Health Newsletter, 2023 Vol. 28 Issue 2 (space radiation doses)](https://www.nasa.gov/wp-content/uploads/2023/10/lsah-newsletter-2023-vol28-issue2.pdf) | Number: about 0.5 mSv per day on the lunar surface |
| 14 | [NASA — ISS oxygen and nitrogen usage (ICES-2015-146, NTRS 20150010425)](https://ntrs.nasa.gov/citations/20150010425) | Number: 0.85 kg of oxygen per astronaut per day |
| 15 | [NASA — Lunar ISRU progress review (Sanders, NTRS 20250003730)](https://ntrs.nasa.gov/citations/20250003730) | Number: scale of Moon-soil oxygen production |

## Archived solar flares (NASA DONKI)

The Day 7 storm is one of these seven real events, picked at random each run and always labelled "Archived NASA data", never "live". Each flare was chosen because DONKI links it to a solar energetic particle (SEP) event, the part of a storm that raises radiation. Full details and the DONKI IDs are in [SCENARIOS_MISSION_01.md](SCENARIOS_MISSION_01.md) §5 and [`src/data/solar-flares.ts`](../src/data/solar-flares.ts).

| Date (UTC) | Class | Particles above 100 MeV |
|---|---|---|
| 10 Sep 2017 | X8.2 | Yes |
| 7 Mar 2012 | X5.4 | Yes |
| 11 Nov 2025 | X5.1 | Yes |
| 6 Sep 2017 | X9.3 | No |
| 31 Dec 2023 | X5.0 | No |
| 25 Feb 2014 | X4.9 | No |
| 14 Sep 2024 | X4.5 | No |

## What is a game assumption, not a NASA number

The battery size, how much power the panels make per day, and the oxygen reserve at which a mission aborts are design choices. Only their ratios (for example, dust halving the panel output) come from NASA. Each one is marked as an assumption in [`src/data/missions/mission-01/balance.ts`](../src/data/missions/mission-01/balance.ts).
