# Mission 01 — Survive the Lunar Cycle · Scenario Script (DRAFT v2)

Status: **Draft v2 for your review.** Once approved, this file is copied word for word into `src/data/scenarios/mission-01.json`.
Target: NASA Space Apps 2026 — *Build a Junior Astronaut Mission Trainer* (ages 7–12)

---

## 0. Decisions made in v2 (chosen to match the challenge's judging criteria)

| Question | Decision | Why the challenge writers will like it |
|---|---|---|
| **Mission name** | **Mission 01 — Survive the Lunar Cycle**. "Lunar Outpost" is the *place* name (shown as `📍 LUNAR OUTPOST`) | The title names the core trade-off: sunlight power by day, battery survival by night. It also matches your Levels design, so that screen needs no change |
| **Radiation display** | **Radiation Dose**: a meter that *fills up*, never goes down, and aborts the mission when full | **Accuracy over polish.** In real life a radiation dose adds up over the whole mission and can't be undone. "Shield integrity" would teach something false. The lesson becomes: *"Every trip outside adds radiation, and you can't take it back."* This is the real reason NASA limits astronaut time in space |
| **Every choice costs something** | Every decision card now shows **at least one red ▼ cost** or a **⏳ "matters later"** badge | The brief says: *"Avoid designing a 'safe' choice that has no cost."* v1 had 4 options with no visible cost. All are fixed |
| **Failure feels like learning** | New **Mission Debrief** on the Aborted screen (§5) | The brief asks players to *"learn from failure without it feeling punitive"* |
| **Real data** | Day 6 uses a **curated list of 7 real solar flares** (§6), labelled *"archived NASA data"* | The brief says *"a curated real dataset embedded directly… is a reasonable and honest alternative — just don't present static data as live"* |

**Changes needed in your designs:**
- Screen 3, Radiation card: "SHIELD INTEGRITY 94%" becomes **"RADIATION DOSE 6%"**, a low bar in violet, with the text *"Protect your crew. Radiation adds up and never goes away."*
- Mission Overview title: **MISSION 01 — SURVIVE THE LUNAR CYCLE**, with `📍 LUNAR OUTPOST` under it.

---

## 1. Design rules

1. **No free choice.** Every option shows at least one red ▼ (a resource goes the wrong way) or a ⏳ badge (*"This choice matters later"*).
2. **Today's choice can cost tomorrow.** Three choices set a *memory flag* that changes a later day (§4).
3. **One situation per day, 14 decisions.** Simple enough for 7-year-olds.
4. **Plain language.** Situations are at most ~40 words, options at most ~15. Each science word is explained the first time it appears and added to the glossary (§7).
5. **Every choice teaches.** After each choice, a **Real Space Fact** card shows one true fact and its source.
6. **Replayable.** Day 6 picks 1 of 7 real solar flares at random, and Day 11 picks 1 of 2 events.
7. **Only three bars.** Food production is taught through the space garden story (plants also make oxygen).

### How decision cards show effects
Arrows, not numbers. Kids reason about trade-offs instead of doing maths.

| Shown on card | Meaning | Colour |
|---|---|---|
| `O₂ ▲` / `⚡ ▲` | Goes up (good) | green |
| `O₂ ▼` / `⚡ ▼` | Goes down (bad) | red |
| `☢ ▲` | Radiation dose goes up (bad) | red |
| `★ ▲` | Science points | gold |
| `⏳` | "This choice matters later" | blue |

Big changes (≥ 10) show a double arrow `▼▼`.

### Symbols used in this document
**O₂** Life Support · **⚡** Power (battery) · **☢** Radiation Dose (only goes up) · **★** Science points · 🏳 sets a memory flag · 🗺 map objects to highlight

> ⚠️ **All numbers are placeholder game-balancing values, not scientific measurements.** They get tuned in Phase 8 with the balancing script.

---

## 2. Daily rules (applied automatically at the end of each day)

| | Days 1–7 (☀ Lunar day) | Days 8–14 (☾ Lunar night) |
|---|---|---|
| O₂ (crew breathing) | −4 | −4 |
| ⚡ (solar charging minus use) | +4 | −8 (no sunlight) |
| ☢ (background space radiation) | +2 | +2 |

**Start:** O₂ 100 · ⚡ 80 (max 100) · ☢ 0 · ★ 0
**Mission aborted if:** O₂ ≤ 15 · ⚡ ≤ 10 · ☢ ≥ 60
**Stars:** ★1 = 20 pts · ★2 = 45 · ★3 = 70 · ★4 = 95 · ★5 = 120

The HUD shows ☢ as a 0–100 % meter, where 100 % is the abort level (☢ 60).

---

## 3. The 14 days

### ☀ DAY 1 — Wake Up the Outpost
🗺 `solar-array-01`, `solar-array-02`, `battery-storage`, `science-lab`

**Situation:** Welcome, Commander! Your crew has just landed. The Sun is shining on the solar panels and the batteries are not full yet. What should the outpost do first?

| | Option A — **Start the science lab** | Option B — **Aim the panels at the Sun** |
|---|---|---|
| Explanation | Turn on the lab right away and start research. | Two astronauts go outside and tilt the panels to catch more light. |
| Effect | ★ +10 · ⚡ −10 | ⚡ +12 · O₂ −2 · ☢ +1 |
| Card shows | `★ ▲` `⚡ ▼▼` | `⚡ ▲▲` `O₂ ▼` `☢ ▲` |

**Real Space Fact:** Solar panels only make electricity when sunlight hits them, and they work best when they face the Sun. On the real Moon, one day lasts about two Earth weeks, and so does one night! We made them shorter in this game. *(Source: NASA Moon facts)*

---

### ☀ DAY 2 — Dusty Panels
🗺 `solar-array-01`, `solar-array-02`

**Situation:** Your landing kicked up lots of Moon dust, and now it's covering the solar panels. Dusty panels make less power.

| | Option A — **Go outside and clean them** | Option B — **Leave the dust for now** |
|---|---|---|
| Explanation | Two astronauts put on spacesuits and wipe the panels. | Stay safe inside. The panels will charge more slowly. |
| Effect | ⚡ +6 · O₂ −6 · ☢ +3 | 🏳 `dusty-panels` |
| Card shows | `⚡ ▲` `O₂ ▼` `☢ ▲` | `⏳` *"Panels will charge slower every day"* |

**Real Space Fact:** Moon dust is sharp like tiny bits of glass and sticks to everything. Apollo astronauts found it on their suits, their tools and even inside their spacecraft. *(Source: NASA Apollo mission reports)*

---

### ☀ DAY 3 — Seeds from Earth
🗺 `habitat` (greenhouse corner)

**Situation:** You brought a box of seeds from Earth! Plants make oxygen and food, but they need warm lights, and lights need power.

| | Option A — **Plant a space garden** | Option B — **Keep the seeds packed** |
|---|---|---|
| Explanation | Set up grow lights and plant the seeds. | Save the power for other systems. |
| Effect | ★ +10 · ⚡ −8 · 🏳 `garden-planted` | ⚡ +4 |
| Card shows | `★ ▲` `⚡ ▼` `⏳` *"Your garden will grow later"* | `⚡ ▲` `⏳` *"No fresh food or oxygen later"* |

**Real Space Fact:** In 2022, NASA-funded scientists grew small plants in real Moon soil that Apollo astronauts brought back. On the Space Station, astronauts have grown and eaten their own lettuce! *(Source: NASA; Univ. of Florida study, 2022; NASA Veggie experiment)*

---

### ☀ DAY 4 — Build a Shield
🗺 `radiation-shelter`, `rover`

**Situation:** Mission Control says the Sun is getting busy. The Moon has no thick air to protect you from space radiation. You can make the shelter safer by piling Moon soil on top of it.

| | Option A — **Pile soil on the shelter** | Option B — **Collect rock samples instead** |
|---|---|---|
| Explanation | Use the rover to cover the shelter with thick Moon soil. | Use today to gather interesting rocks. |
| Effect | ⚡ −8 · O₂ −4 · ☢ +2 · 🏳 `shelter-shielded` | ★ +15 · O₂ −5 · ☢ +3 |
| Card shows | `⚡ ▼` `O₂ ▼` `☢ ▲` `⏳` *"Protects the crew in a future storm"* | `★ ▲▲` `O₂ ▼` `☢ ▲` |

**Real Space Fact:** On Earth, our air and magnetic field block most space radiation. The Moon has neither. Radiation adds up in your body over time, so NASA plans how long astronauts can spend outside. A thick layer of Moon soil (called **regolith**) on top of a base can help block it. *(Source: NASA)*

---

### ☀ DAY 5 — Crater Expedition
🗺 `rover`, `sample-area`

**Situation:** Scientists on Earth spotted a big crater 3 km away with very old rocks on its edge. The trip is long, and the rover needs a lot of power.

| | Option A — **Drive to the crater** | Option B — **Search near the base** |
|---|---|---|
| Explanation | A long rover trip to find the best rocks. | A short walk to collect rocks close by. |
| Effect | ★ +20 · ⚡ −10 · O₂ −6 · ☢ +4 | ★ +8 · O₂ −2 · ☢ +1 |
| Card shows | `★ ▲▲` `⚡ ▼▼` `O₂ ▼` `☢ ▲` | `★ ▲` `O₂ ▼` `☢ ▲` |

**Real Space Fact:** Apollo astronauts brought 382 kg (842 lb) of Moon rocks and soil back to Earth. That's about as heavy as a grand piano! Scientists are still studying them today. *(Source: NASA Astromaterials)*

---

### ☀ DAY 6 — Solar Storm Warning! 🎲 Real NASA data
🗺 `radiation-shelter`, `comms-antenna`

**Situation:** ⚠ Space weather alert! A big explosion on the Sun, called a **solar flare**, has just happened. Fast radiation particles might reach the Moon soon.

**Real event card** (one random flare from §6):
> *This storm is based on a real solar flare: **{date}**, strength **{class}**.*
> *X-class flares are the strongest kind. Archived data from NASA DONKI.*

| | Option A — **Everyone to the shelter** | Option B — **Finish the experiment outside** |
|---|---|---|
| Explanation | Stay safe inside the shelter until the storm passes. | Keep working. The experiment is almost done. |
| Effect | ⚡ −4 · ☢ +1 | ★ +10 · ☢ +20 (only +10 if 🏳 `shelter-shielded`) |
| Card shows | `⚡ ▼` `☢ ▲` | `★ ▲` `☢ ▲▲` |

If 🏳 `shelter-shielded` is set, the result shows: *"Your soil shield from Day 4 cut the radiation in half!"* This makes the delayed consequence visible.

**Real Space Fact:** In August 1972, a huge solar storm happened between the Apollo 16 and Apollo 17 missions. Luckily, no astronauts were on the Moon. Today NASA watches the Sun all the time so it can warn astronauts. *(Source: NASA; DONKI)*

---

### ☀ DAY 7 — Last Day of Sunlight
🗺 `battery-storage`, `solar-array-01`, `solar-array-02`, `science-lab`

**Situation:** Tomorrow the Sun sets and the long, cold lunar night begins. Your solar panels will stop working. How will you use the last sunny day?

| | Option A — **Fill the batteries** | Option B — **Finish experiments before dark** |
|---|---|---|
| Explanation | Go outside to tilt the panels toward the low Sun, and switch off the lab. | Use the last sunlight to complete your research. |
| Effect | ⚡ +12 · O₂ −2 · ☢ +1 | ★ +12 · ⚡ −6 |
| Card shows | `⚡ ▲▲` `O₂ ▼` `☢ ▲` | `★ ▲▲` `⚡ ▼` |

**Real Space Fact:** A Moon night can get colder than −130 °C (−208 °F). That's colder than anywhere ever measured on Earth! Machines need heaters to survive. *(Source: NASA Moon facts)*

---

### ☾ DAY 8 — Night Falls
🗺 `habitat`, `science-lab`, `battery-storage`, `power-distribution`

**Situation:** It's dark and getting very cold. Heaters keep the outpost warm, but heaters use lots of battery power.

| | Option A — **Heat the whole outpost** | Option B — **Heat only the habitat** |
|---|---|---|
| Explanation | Keep the lab warm so night research can continue. | Close the lab and keep the crew warm. |
| Effect | ★ +6 · ⚡ −10 | ⚡ −4 |
| Card shows | `★ ▲` `⚡ ▼▼` | `⚡ ▼` |

**Real Space Fact:** Surviving the long lunar night is one of the hardest problems for a Moon base. NASA is developing small nuclear power systems that can make electricity day and night. *(Source: NASA Fission Surface Power project)*

---

### ☾ DAY 9 — Air Filter Alert
🗺 `life-support`, `habitat`

**Situation:** Beep beep! The air filter that removes the gas we breathe out (**carbon dioxide**, CO₂) is getting clogged. The air is getting stuffy.

| | Option A — **Install a new filter** | Option B — **Rest and breathe slowly** |
|---|---|---|
| Explanation | Put in a fresh filter. The fan needs extra power. | The crew rests today so they make less CO₂. |
| Effect | O₂ +6 · ⚡ −4 | ⚡ +3 · O₂ −4 |
| Card shows | `O₂ ▲` `⚡ ▼` | `⚡ ▲` `O₂ ▼` |

**Real Space Fact:** On Apollo 13, the air filters stopped working. Engineers on Earth invented a fix using tape, plastic bags and cardboard, and the astronauts built it in space! *(Source: NASA Apollo 13)*

---

### ☾ DAY 10 — branches on Day 3

#### 10-A — Harvest Time! *(only if 🏳 `garden-planted`)*
🗺 `habitat` (greenhouse corner)

**Situation:** Your space garden is growing! The little plants are green and healthy. What will you do with them?

| | Option A — **Let them keep growing** | Option B — **Harvest them for science** |
|---|---|---|
| Explanation | Plants keep making fresh oxygen, but grow lights use power. | Freeze the plants in the lab to study how they grew on the Moon. |
| Effect | O₂ +8 · ⚡ −4 | ★ +12 · ⚡ −2 |
| Card shows | `O₂ ▲` `⚡ ▼` | `★ ▲▲` `⚡ ▼` |

**Real Space Fact:** Plants take in the carbon dioxide we breathe out and give back oxygen. Future Moon and Mars bases will need gardens for both food and air. *(Source: NASA plant research)*

#### 10-B — Running Low on Air *(if no garden)*
🗺 `life-support`

**Situation:** The oxygen tanks are emptying faster than planned. Without plants, the crew has to make oxygen another way.

| | Option A — **Split water to make oxygen** | Option B — **Rest in the warm habitat** |
|---|---|---|
| Explanation | A machine uses electricity to turn water into oxygen. | Less work means less oxygen used, but the heaters run longer. |
| Effect | O₂ +10 · ⚡ −10 | O₂ +5 · ⚡ −3 |
| Card shows | `O₂ ▲▲` `⚡ ▼▼` | `O₂ ▲` `⚡ ▼` |

**Real Space Fact:** The International Space Station makes oxygen by using electricity to split water (H₂O) into hydrogen and oxygen. This is called **electrolysis**. *(Source: NASA ISS life support)*

---

### ☾ DAY 11 — Random Event 🎲 (one of two)

#### 11-A — Moonquake!
🗺 `habitat`, `science-lab`

**Situation:** The ground is shaking! Your **seismometer** (a machine that feels vibrations) detected a **moonquake**.

| | Option A — **Check every module outside** | Option B — **Stay inside and record data** |
|---|---|---|
| Explanation | Walk around the outpost to look for damage and measure the shaking. | Let the instruments collect the data safely. |
| Effect | ★ +10 · O₂ −5 · ☢ +2 | ★ +4 · ⚡ −2 |
| Card shows | `★ ▲▲` `O₂ ▼` `☢ ▲` | `★ ▲` `⚡ ▼` |

**Real Space Fact:** Apollo astronauts left seismometers on the Moon. They recorded moonquakes, and some shook for up to 10 minutes! *(Source: NASA)*

#### 11-B — Tiny Space Rock Hit
🗺 `power-distribution` + cable from `battery-storage`

**Situation:** A tiny space rock, smaller than a pea, hit a power cable! Some electricity is leaking away.

| | Option A — **Repair it outside** | Option B — **Use the backup cable** |
|---|---|---|
| Explanation | An astronaut goes out in the cold and dark to fix it. | Send power through a longer backup cable, but some power is lost. |
| Effect | ⚡ +4 · O₂ −5 · ☢ +3 | ⚡ −6 |
| Card shows | `⚡ ▲` `O₂ ▼` `☢ ▲` | `⚡ ▼` |

**Real Space Fact:** Without air to burn them up, tiny space rocks called **micrometeorites** hit the Moon's surface all the time. *(Source: NASA)*

---

### ☾ DAY 12 — Call Home
🗺 `comms-antenna`

**Situation:** It's time to send your science results to Earth. The big antenna needs a lot of power to send all the data.

| | Option A — **Send all the data** | Option B — **Send a short message** |
|---|---|---|
| Explanation | Scientists on Earth get all your discoveries. | Send only the most important results and save power. |
| Effect | ★ +10 · ⚡ −8 | ★ +3 · ⚡ −2 |
| Card shows | `★ ▲▲` `⚡ ▼` | `★ ▲` `⚡ ▼` |

**Real Space Fact:** A radio message takes about 1.3 seconds to travel from the Moon to Earth. From Mars it takes about 5 to 20 minutes, so astronauts on Mars can't have a normal phone call with Earth! *(Source: NASA)*

---

### ☾ DAY 13 — Ice in the Shadows
🗺 `rover`, `sample-area`

**Situation:** A spacecraft circling the Moon found signs of frozen water in a dark crater nearby. Water can be used for drinking, making oxygen and even rocket fuel!

| | Option A — **Drive to the crater and drill** | Option B — **Study the maps from inside** |
|---|---|---|
| Explanation | A cold night trip with the rover to look for ice. | Learn about the crater from spacecraft data, safe and warm. |
| Effect | ★ +20 · ⚡ −10 · O₂ −5 · ☢ +3 | ★ +6 · ⚡ −3 |
| Card shows | `★ ▲▲` `⚡ ▼▼` `O₂ ▼` `☢ ▲` | `★ ▲` `⚡ ▼` |

**Real Space Fact:** In 2009, NASA's LCROSS mission crashed a rocket into a dark crater near the Moon's south pole and found water ice in the cloud it kicked up! *(Source: NASA LCROSS)*

---

### ☾ DAY 14 — Sunrise Is Coming
🗺 `science-lab`, `battery-storage`

**Situation:** This is the last day of your mission! The Sun will rise soon and your ride home is on the way. Do you have enough energy left for one more experiment?

| | Option A — **One last big experiment** | Option B — **Pack up safely** |
|---|---|---|
| Explanation | Use the remaining power for one more discovery. | Pack the samples carefully and save power. |
| Effect | ★ +12 · ⚡ −8 | ★ +2 · ⚡ −2 |
| Card shows | `★ ▲▲` `⚡ ▼` | `★ ▲` `⚡ ▼` |

**Real Space Fact:** NASA's Artemis program plans to send astronauts to the Moon's south pole, where they will live and work for longer missions. *(Source: NASA Artemis)*

---

## 4. Memory flags (how branching works)

| Flag | Set on | Effect later | How the player sees it |
|---|---|---|---|
| `dusty-panels` | Day 2, B | Daytime charging +4 → +2 per day (days 3–7) | End-of-day note: *"Dusty panels made less power today."* |
| `garden-planted` | Day 3, A | Day 10 shows **Harvest Time!** instead of **Running Low on Air** | The scenario itself changes |
| `shelter-shielded` | Day 4, A | Day 6 Option B radiation +20 → +10 | Result note: *"Your soil shield cut the radiation in half!"* |

Random picks are made when the mission starts and saved, so reloading the page doesn't re-roll them:
- Day 6: one flare from §6
- Day 11: 11-A or 11-B

---

## 5. Learning from failure: Mission Debrief

When a mission is aborted, the Aborted screen shows a short, friendly debrief instead of just "You lost":

> **Mission Aborted: Power ran out on Day 12**
> The crew got home safely, but the outpost had to shut down.
>
> **What used the most power:**
> ⚡ Day 5: Drove to the crater (▼▼)
> ⚡ Day 8: Heated the whole outpost (▼▼)
>
> 💡 **Tip:** At night there's no sunlight to recharge. Try saving power before Day 8!
> **[ TRY AGAIN ]**

- The 2 decisions that cost the failing resource the most are pulled from the mission history.
- There is one tip per resource (O₂ / ⚡ / ☢), stored in the mission data file.
- "The crew got home safely" makes "abort" mean *coming home early*, not anything scary. That suits ages 7–12.

---

## 6. Real NASA data: curated solar flares for Day 6

| # | Date (UTC) | Class | Note for kids |
|---|---|---|---|
| 1 | 6 Sep 2017 | **X9.3** | One of the biggest flares in over 10 years |
| 2 | 10 Sep 2017 | **X8.2** | Sent fast particles all the way to Earth |
| 3 | 3 Oct 2024 | **X9.0** | One of the strongest flares of the current solar cycle |
| 4 | 14 May 2024 | **X8.7** | Came days after the big May 2024 storm that made auroras visible in many places |
| 5 | 9 Aug 2011 | **X6.9** | |
| 6 | 7 Mar 2012 | **X5.4** | |
| 7 | 24 Oct 2014 | **X3.1** | From a giant sunspot bigger than Jupiter |

⚠️ **These come from well-documented events, but I couldn't confirm them against DONKI today.** NASA's `api.nasa.gov/DONKI` endpoint returned *404*, and the direct server `kauai.ccmc.gsfc.nasa.gov` timed out. Before launch, each row will be checked in DONKI and stored with its `flrID` as proof. The finished game stores this list inside the app, so it doesn't depend on the API being up, and labels it *"archived data"*, never *"live"*.

### Other real data
| Where | What | Source |
|---|---|---|
| Mission Complete screen | One astronaut-health fact, e.g. *"NASA studies how space radiation affects astronauts' bodies, like in the NASA Twins Study."* | NASA / **OSDR** |
| Every fact card | Moon temperatures, Apollo, LCROSS, ISS electrolysis, comms delay | NASA public pages |
| **Science Sources** screen | Every fact and dataset, with a link | (from Pause menu and Mission Complete) |

**Stretch goal (post-MVP):** on the Mission Complete screen, *"Right now on the real Sun…"* would show the latest flare from DONKI, clearly labelled **live**, with the archived list as a fallback. That links the in-game shielding decision to real current space weather, which the brief names as a stand-out feature. It needs a tiny server-side proxy (one Vercel function) to hide the API key and cache results.

### Facts still to verify with a link before launch
The −130 °C (−208 °F) night temperature, 382 kg of samples, 10-minute moonquakes, 1.3 s and 5–20 min radio delays, the August 1972 storm, LCROSS 2009, the 2022 lunar-soil plants and the 2015 ISS lettuce. I'm confident in all of them, but judges will check sources, so each needs a NASA URL.

---

## 7. Glossary (shown in-game when a word first appears)

| Word | Kid-friendly meaning |
|---|---|
| Regolith | Moon soil: loose dust and broken rock covering the Moon |
| Solar flare | A giant flash of energy from the Sun |
| Radiation dose | How much space radiation your body has soaked up. It adds up and doesn't go away |
| Carbon dioxide (CO₂) | The gas we breathe out |
| Electrolysis | Using electricity to split water into hydrogen and oxygen |
| Seismometer | A machine that feels and measures shaking |
| Micrometeorite | A space rock smaller than a grain of sand or a pea |
| Lunar night | The time when the Sun isn't shining on your part of the Moon |

---

## 8. Quick balance check (placeholder numbers)

| Play style | Result |
|---|---|
| **Science-greedy** (always the ★ option) | Power hits the abort level around **Day 12**. Teaches that you can't do everything |
| **Reckless outdoors** (Day 2A, 4B, 5A, 6B unshielded, 11A, 13A) | ☢ ≈ 63 → *Aborted: Radiation* |
| **Balanced** | Survives with ~3–4 ★ |
| **Ultra-cautious** (never the ★ option) | Survives with ~1–2 ★. Surviving isn't the same as a great mission |

These are hand estimates. The balancing script (Phase 8) will check every path and tune the numbers.
