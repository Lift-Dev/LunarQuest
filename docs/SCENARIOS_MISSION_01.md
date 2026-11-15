# Mission 01 — Survive the Lunar Cycle · Scenario Script (v3, NASA-sourced)

Status: **v3, 2026-11-15.** Replaces the 16-scenario v2 draft. The game reads `src/data/missions/mission-01/content.json`; a test checks that every player-facing sentence there appears word for word in this file.
Target: NASA Space Apps 2026 — *Build a Junior Astronaut Mission Trainer* (ages 7–12)

---

## 0. What changed in v3

| Change | Why |
|---|---|
| **16 scenarios → 7.** One scenario every two days (Days 1, 3, 5, 7, 9, 11, 13). Each decision covers two days of the 14-day stay | Your scenario list. Fewer, weightier decisions |
| **Site: the lunar South Pole, no lunar night.** Every day is a daylight day | NASA: near the South Pole "the Sun stays low on the horizon", and some sites "can remain sunlit for long periods of time" with "reduced duration of lunar nights". The old 7-day/7-night cycle described the equator |
| **Every number has a unit and a source** (§2). Radiation is in mSv against NASA's real limit, air is in kilograms of oxygen | The challenge asks for real NASA data "rather than invented statistics" |
| **Solar storm uses DONKI's particle data** (§5). Storms where DONKI recorded protons above 100 MeV are much more dangerous | Links the shielding decision to real space-weather data, a stand-out feature named in the challenge |
| **Bad choices can end the mission by the 4th scenario** (§7) | Your request: mistakes compound, as they do in real missions |
| **No radiation from ordinary spacewalks beyond the daily background** | NASA's numbers: the lunar surface dose is "on the order of 0.5 mSv/day". A few hours outside barely changes that. Only a solar storm can push a crew toward the limit, so that is the one place radiation is dangerous |

---

## 1. Design rules

1. **No free choice.** Every option costs a resource, carries a ⏳ later consequence, or gives up the science the other option earns.
2. **Today's choice can cost tomorrow.** Two choices set a memory flag that drains power every day afterwards (§4).
3. **Every choice teaches.** After each choice, a **Real Space Fact** card shows one true fact and its NASA source (§6 has the exact quote behind each fact).
4. **Replayable.** Day 7 picks one of 7 real DONKI storms at random, and three of them carry super-fast particles (§5).
5. **Only three bars**: Life Support, Power, Radiation Dose. Science stars are the reward.

---

## 2. The simulation: units, daily rules, limits

The three bars use real units. The HUD shows each bar as a percentage.

| Bar | Unit | Full / limit | Source |
|---|---|---|---|
| **Life Support** | 1 point = **0.85 kg of oxygen**, one astronaut's daily use | Full = 85 kg | ISS "Metabolic Usage: 0.85 kg/crew/day O₂" (NASA ICES-2015-146) |
| **Power** | % of battery charge | 100% | Battery size and panel output are **game assumptions**; only their ratios come from NASA (dust halves output) |
| **Radiation Dose** | 1 point = **0.5 mSv** | Abort at **250 mSv** (500 points) | NASA-STD-3001 [V1 4031]: protect crew from the design solar storm "to less than an effective dose of 250 mSv" |

**Daily rules (applied at the end of every day, two days per decision):**

| | Per day | Why |
|---|---|---|
| Life Support | **−4** | Crew of four × 0.85 kg/day |
| Power | **+5** | Sunlit, clean panels make ~10/day; the outpost uses ~5/day *(assumption)* |
| Radiation | **+1** (0.5 mSv) | Lunar surface "dose is projected to be on the order of 0.5 mSv/day (the moon provides some protection)" (NASA LSAH newsletter 2023) |

**Start:** Life Support 100, Power 50 ("the battery is only half charged"), Radiation 0.

**Abort levels (the crew goes home early):**

| | Level | Meaning |
|---|---|---|
| Life Support | ≤ 20 | 17 kg of oxygen, about 5 days for four astronauts: the reserve kept for the trip home *(assumption)* |
| Power | ≤ 10% | Too little to run heaters and life support *(assumption)* |
| Radiation | ≥ 250 mSv | NASA-STD-3001 solar-storm limit |

**Warning levels (UI only):** Life Support 35, Power 25%, Radiation 125 mSv (50% of the limit).

**Science stars:** a star option is worth 10 points (Day 13: 15 for the experiment, 5 for packing samples). Stars at 5 / 15 / 25 / 35 / 45 points, so taking every science option earns 5 stars, and skipping one earns 4.

### How each decision number was set

| Number | Value | Derivation |
|---|---|---|
| Spacewalk (Days 3, 5) | O₂ **−9** | ISS: "EVA Usage: 6.8 kg/EVA O₂" + "US EVA Air Loss: 0.91 kg" = 7.7 kg ≈ 9 points. About two days of the crew's oxygen |
| Spacewalk radiation | **+1** (0.5 mSv) | Spacesuits shield less than the habitat. The extra dose is small next to the 0.5 mSv/day background |
| Dust on panels | **−5 power/day** | "Power output from PV cells is cut in half by a covering of less than 3 mg/cm²" (NASA, *The Challenge of Lunar Dust*): 10/day → 5/day |
| Backup cable | **−5 power/day** | "Carries only half the power" (scenario assumption, same halving) |
| Storm, shelter | **+20** (10 mSv); fast storm **+70** (35 mSv) | NASA OCHMO-TB-020: water and stowage used as a shelter cut a crew's dose from a big solar storm from 210–259 mSv to 65–83 mSv in a capsule. On the Moon the ground blocks half the sky, so ≈35 mSv for a storm with >100 MeV protons. Calmer storms (DONKI: only >10 MeV) are mostly stopped: ≈10 mSv |
| Storm, stay out | **+120** (60 mSv); fast storm **+520** (260 mSv → abort) | Spacesuits shield far less than a capsule. NASA's Apollo Lunar Surface Journal: a crew on the lunar surface during the August 1972 storm "would have received … a dose to the blood-forming organs of 130 rem" (1,300 mSv). Staying out for the start of a fast storm passes 250 mSv |
| Oxygen machine | O₂ **+6**, power **−30** | NASA ISRU review: "O₂ production yield of >20% gm O₂ per gm regolith", ">20 g O₂/kW-hr thermal". One 25 kg batch (the size of NASA Kennedy's 2025 test) → ~5 kg O₂ ≈ 6 points, using ~250 kWh of heat: a big share of the battery *(battery size is an assumption)* |
| CO₂: spare canister | O₂ **−4** | Lithium hydroxide is used up; the spare comes out of the life-support supplies |
| CO₂: bake the filters | power **−15** | CDRA beds are "heated" to release CO₂; "does not require consumables other than power" (NASA OCHMO-TB-004) |
| Science lab, experiments | power **−25 to −30** | Game assumption: research is the outpost's biggest optional load |

---

## 3. The 7 scenarios

### DAY 1 — Shadows on the Panels
🗺 solar-array-01, solar-array-02, battery-storage, science-lab

> Your crew of four has landed near the Moon's **South Pole**. The Sun sits low in the sky, so a ridge's long shadow covers some solar panels. The battery is only half charged.

| | Option | Explanation | Effect |
|---|---|---|---|
| A | **Start the science lab** | Begin research now, using battery power. | ⚡ −30 · ★ +10 |
| B | **Save power first** | Pause research and let the panels recharge the battery. | ⚡ +10 |

**Real Space Fact:** Near the Moon's South Pole, the Sun stays close to the horizon. Mountains and crater rims cast long shadows that move across the ground, so some spots get long stretches of sunlight while others stay dark.
*Source: NASA — The Lunar South Pole Region*

---

### DAY 3 — Dust on the Panels
🗺 solar-array-01, solar-array-02

> The automatic dust cleaner has stopped working. Dust blasted up by your lander's rocket engines is covering the solar panels, so they make less power.

| | Option | Explanation | Effect |
|---|---|---|---|
| A | **Clean the panels by hand** | Two astronauts go outside with brushes. Spacesuits use extra oxygen. | O₂ −9 · ☢ +0.5 mSv |
| B | **Leave the dust** | Stay safe inside. The panels will make less power every day. | 🏳 `dusty-panels` · ⏳ Dusty panels make less power every day |

**Real Space Fact:** Moon dust is sharp and sticks to everything. NASA studies show that even a very thin layer of dust can cut a solar panel's power in half. In 2025, NASA's Electrodynamic Dust Shield used electricity to lift dust off surfaces on the Moon.
*Sources: NASA — The Challenge of Lunar Dust; NASA — Dust Shield Successfully Repels Lunar Regolith on Moon (2025)*

The situation is based on NASA's Plume Surface Interaction project ("surface particles that are ejected" by a lander's rocket plume). An automatic dust cleaner on a base is a future technology; NASA's Electrodynamic Dust Shield was a 2025 test on Blue Ghost Mission 1.

---

### DAY 5 — Damaged Power Cable
🗺 power-distribution, battery-storage, solar-array-01

> A small space rock crashed near the outpost. Bits of flying rock cut the main power cable that brings electricity from the solar panels.

| | Option | Explanation | Effect |
|---|---|---|---|
| A | **Repair the cable** | Two astronauts go outside to fix it. Spacesuits use extra oxygen. | O₂ −9 · ⚡ −2 · ☢ +0.5 mSv |
| B | **Switch to the backup cable** | Stay inside. The thin backup cable carries only half the power. | 🏳 `backup-cable` · ⏳ The backup cable carries less power every day |

**Real Space Fact:** Space rocks still hit the Moon today. By comparing before-and-after pictures, NASA's Lunar Reconnaissance Orbiter found over 200 new craters, about 3 to 43 meters wide, that formed while it was watching.
*Source: NASA — Earth's Moon Hit by Surprising Number of Meteoroids (LRO, 2016)*

---

### DAY 7 — Solar Storm Warning! 🎲 Real NASA DONKI data
🗺 radiation-shelter, sample-area, comms-antenna

> Mission Control has spotted a burst of fast particles from the Sun heading your way. Two astronauts are outside collecting rock samples.

The card shows the real flare picked at mission start (§5).

| | Option | Explanation | Calmer storm | Storm with >100 MeV protons |
|---|---|---|---|---|
| A | **Go to the storm shelter** | Come inside and hide behind the water tanks. Leave the rocks. | ☢ +10 mSv | ☢ +35 mSv |
| B | **Finish collecting samples** | Stay out a little longer to finish the job, then come in. | ☢ +60 mSv · O₂ −2 · ★ +10 | ☢ +260 mSv → **Mission aborted** |

Notes shown after the choice, only on a storm with >100 MeV protons:
- A: This storm had super-fast particles, but the water walls kept your crew safe.
- B: This storm had super-fast particles that went right through the spacesuits.

**Real Space Fact:** Water has lots of hydrogen, which is good at blocking space radiation, so NASA plans storm shelters surrounded by water containers. NASA estimates that astronauts caught on the Moon without shelter during the big solar storm of August 1972 would have received a dangerous dose.
*Sources: NASA OCHMO-TB-020 Design for Ionizing Radiation Protection; NASA Apollo Lunar Surface Journal — Radiation*

---

### DAY 9 — Oxygen from Moon Soil
🗺 science-lab, life-support, battery-storage

> Your crew brought a test machine that melts Moon soil to pull out the oxygen hidden inside it. It makes fresh air, but it needs lots of electricity.

| | Option | Explanation | Effect |
|---|---|---|---|
| A | **Run the oxygen machine** | Melt one batch of Moon soil to make oxygen. | O₂ +6 · ⚡ −30 · ★ +10 |
| B | **Keep it switched off** | Save the electricity for the outpost. | (gives up the science) |

**Real Space Fact:** In 2025, NASA scientists at Kennedy Space Center melted fake Moon soil made on Earth at 1,700 °C (3,100 °F), then used electricity to pull pure oxygen out of it. It was a test on Earth: no machine makes oxygen on the Moon yet.
*Source: NASA Kennedy — Breathes Life into Moon Soil Testing (2025)*

---

### DAY 11 — Carbon Dioxide Alert
🗺 life-support, habitat

> The machine that removes carbon dioxide, the gas we breathe out, is almost full. If it stops, the air will become unsafe to breathe.

| | Option | Explanation | Effect |
|---|---|---|---|
| A | **Use a spare filter canister** | Swap in a fresh chemical canister. It can only be used once. | O₂ −4 |
| B | **Bake the filters clean** | Heat the filters so they can be reused. It uses lots of power. | ⚡ −15 |

**Real Space Fact:** The Space Station's main carbon dioxide remover traps the gas in tiny crystals, then heats them so the gas escapes into space and the crystals can be used again. Lithium hydroxide canisters, used on Apollo and the Space Shuttle, are the backup. They get used up as they work.
*Source: NASA OCHMO-TB-004 Carbon Dioxide*

---

### DAY 13 — Final Countdown
🗺 science-lab, sample-area, battery-storage

> It's your last day before the trip home. There's time for one more experiment, or you can carefully pack the rock samples.

| | Option | Explanation | Effect |
|---|---|---|---|
| A | **One last experiment** | Run the lab one more time. It uses lots of power. | ⚡ −25 · ★ +15 |
| B | **Pack up for the trip home** | Seal the rock samples so they reach Earth safely. | ⚡ −5 · ★ +5 |

**Real Space Fact:** On Apollo 17 in 1972, astronauts spent about 22 hours exploring outside on three moonwalks and brought home about 110 kilograms of Moon rocks and soil.
*Source: NASA — Apollo 17 Mission Details*

---

## 4. Memory flags

| Flag | Set by | Effect every day afterwards | End-of-day note |
|---|---|---|---|
| `dusty-panels` | Day 3, B | ⚡ −5 | Dusty panels made only half their power. |
| `backup-cable` | Day 5, B | ⚡ −5 | The backup cable carried only half the power. |
| `fast-particle-storm` | Set by the engine at mission start when the picked storm had >100 MeV protons | Day 7 radiation values switch to the right-hand column | (notes in Day 7) |

Both power flags together make power fall by 5 per day, so the battery cannot recover.

---

## 5. Real NASA data: DONKI solar storms for Day 7

Downloaded from NASA DONKI (`https://ccmc.gsfc.nasa.gov/DONKI/WS/get/FLR` and `/SEP`, every 60-day window from 2010 to 2026-11-14) on 2026-11-15. Each flare below is one DONKI links to a **solar energetic particle (SEP) event**, the part of a storm that raises radiation. The flare's light alone does not. The list is stored inside the app and labelled "Archived NASA data", never "live".

| Date (UTC) | Class | DONKI flrID | Linked SEP channels | >100 MeV? |
|---|---|---|---|---|
| 10 Sep 2017 | X8.2 | 2017-09-10T15:35:00-FLR-001 | GOES13 >100 MeV, GOES13 >10 MeV, SOHO 15.8–39.8 MeV | **Yes** |
| 7 Mar 2012 | X5.4 | 2012-03-07T00:00:00-FLR-001 | STEREO B 13–100 MeV, GOES13 >100 MeV, GOES13 >10 MeV | **Yes** |
| 11 Nov 2025 | X5.1 | 2025-11-11T09:49:00-FLR-001 | GOES-P >10 MeV, GOES-P >100 MeV, SOHO 15.8–39.8 MeV | **Yes** |
| 6 Sep 2017 | X9.3 | 2017-09-06T11:53:00-FLR-001 | SOHO 15.8–39.8 MeV | No |
| 31 Dec 2023 | X5.0 | 2023-12-31T21:40:00-FLR-001 | SOHO 15.8–50.1 MeV, GOES-P >10 MeV | No |
| 25 Feb 2014 | X4.9 | 2014-02-25T00:41:00-FLR-001 | STEREO A 13–100 MeV, GOES13 >10 MeV | No |
| 14 Sep 2024 | X4.5 | 2024-09-14T15:13:00-FLR-001 | SOHO 15.8–39.8 MeV, GOES-P >10 MeV | No |

Removed from v2: 3 Oct 2024 (X9.0), 14 May 2024 (X8.7) and 24 Oct 2014 (X3.1). DONKI links **no** particle event to them, so they were not radiation storms.

Note that the biggest flare (X9.3) is a "calm" storm here, while a smaller X5.1 carried the fastest particles. A flare's size does not tell you its radiation danger.

---

## 6. Sources and the exact sentence each one supports

All sources were opened and read on 2026-11-15. URLs are in `src/data/sources.ts`.

| Source | Supports | Quote |
|---|---|---|
| NASA — The Lunar South Pole Region | Day 1 fact; no-night site | "The Sun remains close to the horizon, casting long shadows that move across the rugged terrain. Depending on the surrounding topography, some locations experience extended periods of sunlight while others remain in darkness." · "rare areas that can remain sunlit for long periods of time … reduced duration of lunar nights" |
| NASA — The Challenge of Lunar Dust (NTRS 20220008062) | Day 3 fact; dust −5/day | "Modeling and ground-based analysis shows power output from PV cells is cut in half by a covering of less than 3 mg/cm²" |
| NASA — Dust Shield Successfully Repels Lunar Regolith on Moon | Day 3 fact | The Electrodynamic Dust Shield "successfully demonstrated its ability to remove regolith" on Blue Ghost Mission 1 (ended March 16, 2025) |
| NASA — Plume Surface Interaction | Day 3 situation | "When the rocket plume of a lander interacts with planetary regolith … Another danger landers face is surface particles that are ejected from the area." |
| NASA — Earth's Moon Hit by Surprising Number of Meteoroids | Day 5 fact | "the team identified over 200 impact craters that formed during the LRO mission, ranging in size from about 10 to 140 feet (approximately 3 to 43 meters) in diameter" |
| NASA OCHMO-TB-020 Radiation Protection | Day 7 fact; shelter dose | "This can be achieved by rearranging items such as water containers and/or high hydrogen content materials" · effective dose 210–259 mSv without, 65–83 mSv with water/stowage shelter |
| NASA ALSJ — Radiation | Day 7 fact; stay-out dose | "a crew on the lunar surface at the time of the event would have received a skin dose of 600 rem and a dose to the blood-forming organs of 130 rem" |
| NASA Kennedy — Breathes Life into Moon Soil Testing | Day 9 fact | about 55 pounds (25 kg) of simulated regolith heated to 3100°F (1700°C); "This is the first time NASA has produced molecular oxygen using this process" |
| NASA Lunar ISRU progress review (NTRS 20250003730) | Day 9 numbers | "Oxygen extraction demonstrated >20 g O₂/kW-hr thermal; O₂ production yield of >20% gm O₂ per gm regolith" |
| NASA OCHMO-TB-004 Carbon Dioxide | Day 11 fact and numbers | "zeolite crystals … to remove excess carbon dioxide" · bed "exposed to space vacuum and heated, causing the adsorbed CO₂ to be released and vented to space" · LiOH: "Primary CO₂ removal system aboard Apollo and the Space Shuttle, and currently used as backup" |
| NASA — Apollo 17 Mission Details | Day 13 fact | "Three extravehicular activities, or EVAs, lasted a total of 22 hours, four minutes" · "Astronauts gathered 110.4 kilograms, or 243 pounds, of material" |
| NASA DONKI | Day 7 storms | §5 |
| NASA-STD-3001 (Human Performance) | Radiation abort level | "protect crewmembers from exposure to the design reference Solar Particle Event (SPE) environment … to less than an effective dose of 250 mSv" |
| NASA LSAH Newsletter 2023 | Daily radiation | "on the lunar surface, the dose is projected to be on the order of 0.5 mSv/day (the moon provides some protection)" |
| NASA ICES-2015-146 (NTRS 20150010425) | Life Support units, spacewalk cost | "Metabolic Usage: 0.85 kg … /crew/day O₂", "EVA Usage: 6.8 kg … /EVA O₂", "US EVA Air Loss: 0.91 kg" |

### What is a game assumption (not from NASA)
- The outpost's **battery size, panel output and research power use** (the power bar's scale). Their ratios follow NASA (dust halves output), and their size is chosen for gameplay.
- The **oxygen tank size** (85 kg), the **5-day oxygen reserve** abort level, and the **10% battery** abort level.
- The **storm doses** are estimates scaled from NASA's numbers (§2), not measurements of these exact storms on the Moon.
- The **crew of four** and **two-person spacewalks**.

---

## 7. Balance check (every path)

All 128 choice paths were simulated with the numbers above (`src/game/engine.test.ts` runs the same walk).

| Storm | Survive | Aborted: power | Aborted: air | Aborted: radiation | Earliest abort |
|---|---|---|---|---|---|
| Calmer (4 of 7 storms) | 64 | 60 | 4 | 0 | 4th scenario (Day 8) |
| >100 MeV (3 of 7 storms) | 34 | 30 | 0 | 64 | 4th scenario (Day 7) |

| Play style | Calmer storm | >100 MeV storm |
|---|---|---|
| **Lazy start**: lab on Day 1, leave the dust, backup cable | Power runs out on Day 8 | Same |
| **Science-greedy**: every ★ option | Survives with 5 ★ (a lucky storm) | Radiation abort on Day 7 |
| **Spacewalk-heavy**: fix everything outside, stay out in the storm, skip the oxygen machine, use the spare canister | Air runs out on Day 14 | Radiation abort on Day 7 |
| **Balanced**: save power, fix things, shelter, run the machine | Survives with 3 ★ | Survives with 3 ★ |
| **Stay inside**: never go outside except to shelter | Survives with 1 ★, battery at 15% | Same |
