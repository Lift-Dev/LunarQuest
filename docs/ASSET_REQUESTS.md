# LunarQuest — UI Asset Requests

Please create these in UX Pilot (or any tool) in the **same visual style as the 4 existing screens**. Save each file with **exactly the name shown**. Each item has a status checkbox so we can track progress.

## How to deliver
- **Screen references** → `LunarQuest/image-assets/screens/`. A full-screen mockup (PNG or PDF), **1920 × 1080 (16:9)** if possible.
- **Individual assets** → `LunarQuest/image-assets/parts/`. A single element, **PNG with a transparent background**, at least 2× the size it appears on screen.
- If UX Pilot can export the images inside a design separately (logo, illustrations, icons), please do. Separate files with transparency always beat images cut out of a full screen.

Naming pattern: `<screen-number>-<screen-name>__<element>.png`. All lowercase, hyphens, no spaces.

---

## A. Screen references: designs needed for missing screens (priority order)

| ✔ | File name | What it should show |
|---|---|---|
| ☐ | `07-gameplay.png` | **Most important.** The main game screen at 16:9. **Top:** resource HUD bar (Life Support, Power, Radiation gauges in cyan/amber/violet; 5 science stars; "DAY 3 / 14" with a sun or moon icon; pause button). **Centre/left:** the outpost map area. **Right or bottom:** scenario panel (day label, daylight/night tag, scenario title, description, small image). **Bottom:** two decision cards side by side (illustration, title, short explanation, CHOOSE button). |
| ☐ | `07-gameplay-night.png` | The same screen during lunar night (days 8–14): darker map, moon indicator, "NIGHT" tag |
| ☐ | `07-gameplay-tablet-portrait.png` | The same screen arranged for a tablet held upright (about 834 × 1194): map on top, scenario + cards below |
| ☐ | `07b-decision-confirm.png` | Pop-up after a card is clicked: "Are you sure?" with the chosen card, the effect preview (e.g. +O₂, −Power), CONFIRM and BACK buttons |
| ☐ | `07c-inspection-panel.png` | Small floating panel that opens when equipment is clicked. Example: **BATTERY STORAGE**, Status: Normal (green dot), Charge: 78% with a bar, "Connected to:" list (Solar Array 01, Habitat, Life Support), close ✕. Show it on top of the map with the battery highlighted and its cables glowing |
| ☐ | `07d-pause-menu.png` | Pause overlay: RESUME, HOW TO PLAY, RESTART MISSION, MISSION LEVELS |
| ☐ | `07e-day-transition.png` | Short banner between days, e.g. "DAY 8 — LUNAR NIGHT BEGINS" (and a daylight version if it differs) |
| ☐ | `03-learn-to-survive.png` | *(Small update to your existing design)* Radiation card: "SHIELD INTEGRITY 94%" becomes **"RADIATION DOSE 6%"** (a low violet bar) with the text "Protect your crew. Radiation adds up and never goes away." |
| ☐ | `06-mission-overview.png` | "MISSION 01 — SURVIVE THE LUNAR CYCLE" with "📍 LUNAR OUTPOST" under it, "14 Earth Days \| 7 Days of Daylight \| 7 Days of Night", the description paragraph from the brief, two objective cards (**SURVIVE** and **EXPLORE**), BEGIN MISSION button |
| ☐ | `04-how-to-play.png` | 4 steps: 1 Observe situations, 2 Inspect the outpost, 3 Make decisions, 4 Discover & complete research. Each with an icon or illustration. NEXT button |
| ☐ | `08-mission-aborted.png` | Failure screen: "MISSION ABORTED", "Power ran out on Day 12", "The crew got home safely", a **"What used the most power"** list with 2 past decisions, a 💡 tip box, stats (day reached, final resource levels, stars), TRY AGAIN and MISSION LEVELS buttons. Friendly and encouraging, not scary (see SCENARIOS §5) |
| ☐ | `07f-fact-card.png` | Pop-up after each decision: a short "REAL SPACE FACT" card with an icon, 1–2 sentences, a small source line ("Source: NASA"), and a CONTINUE button |
| ☐ | `07g-solar-flare-alert.png` | Day 6 alert card: "⚠ SPACE WEATHER ALERT", a real flare date + class (e.g. "6 Sep 2017 · X9.3"), and an "Archived NASA DONKI data" badge |
| ☐ | `10-science-sources.png` | Simple list screen: every fact/dataset with its NASA source name and link. Opened from Pause and Mission Complete |
| ☐ | `09-mission-complete.png` | Success screen: "MISSION COMPLETE", 1–5 stars earned (show e.g. 3 of 5 filled), final resource levels, decisions made, NEXT MISSION and MISSION LEVELS buttons |
| ☐ | `05-mission-levels-progress.png` | The existing Levels screen in a later state: Level 01 **completed** (e.g. 3 gold stars, "REPLAY" button), Level 02 **unlocked / next** (highlighted, START) |
| ☐ | `01-welcome-continue.png` | *(Optional)* Welcome screen for a returning player: CONTINUE MISSION (main) and NEW GAME (secondary) buttons |

---

## B. Individual assets from the existing screens ✅ extracted from your PDFs

These were pulled from the PDFs at full quality and with transparency, so **you don't need to send them**. Originals are in `image-assets/extracted/`.

| ✔ | Asset | Status |
|---|---|---|
| ☑ | Logo | Extracted (1440 px, transparent) |
| ☑ | Welcome background without text | Extracted (1920 × 1088) |
| ☑ | Briefing illustration | Extracted (1440 px) |
| ☑ | 3 resource icons | Extracted (1440 px, transparent) |
| ☑ | Level 01 thumbnail (colour) | Extracted |
| ☐ | `05-levels__thumb-02.png` … `05-levels__thumb-15.png` | **Still needed later:** colour versions of levels 2–15. Only greyscale "locked" versions are in the PDF. Not needed until those missions exist |
| ☑ | Stars | Drawn in code to match the design |
| ☑ | Fonts | Identified: **Fredoka** (from the PDF) |

## C. Outpost map assets (needed for Phase 5)

Everything on the map should share **one camera angle**: top-down, slightly isometric (about 30° tilt), **open roofs** so you can see inside the buildings. Same painted style as the briefing illustration. Few or no astronauts.

| ✔ | File name | Description |
|---|---|---|
| ☐ | `07-map__reference-full.png` | **Start here.** One full image of the complete outpost with everything placed, 1920 × 1080. This is the master layout; all parts below should match it exactly |
| ☐ | `07-map__terrain-day.png` | Ground only (lunar surface, craters, rover tracks), no buildings, same size and angle |
| ☐ | `07-map__terrain-night.png` | *(Optional)* Same terrain at night. I can darken the day version in code instead |
| ☐ | `07-map__solar-array.png` | One solar panel array (I'll place it twice) |
| ☐ | `07-map__battery-storage.png` | Battery storage unit(s) |
| ☐ | `07-map__power-distribution.png` | Small power hub or junction box where cables meet |
| ☐ | `07-map__habitat.png` | Crew habitat module, open roof showing bunks and table |
| ☐ | `07-map__life-support.png` | Oxygen generator + O₂ tanks |
| ☐ | `07-map__science-lab.png` | Lab module, open roof showing microscope and sample containers |
| ☐ | `07-map__comms-antenna.png` | Communication dish/antenna |
| ☐ | `07-map__radiation-shelter.png` | Shielded shelter (thick walls, or buried under regolith) |
| ☐ | `07-map__rover.png` | Lunar rover |
| ☐ | `07-map__sample-area.png` | Marked sample collection zone (flags, sample boxes, drill) |

**Cables are not needed as images.** I'll draw them in code so they can glow and animate when highlighted.

---

## D. Scenario and decision illustrations (after Q1 is answered)

Once I have your scenario list, I'll send you an exact list of file names. The pattern will be:

- `scenario__s01.png`: supporting image for scenario 1 (landscape, ~16:9)
- `decision__s01-a.png`, `decision__s01-b.png`: illustrations for its two decision cards (square or 4:3)

Until those arrive, the game uses a neutral placeholder that is easy to replace.

---

## Priority order
1. `07-gameplay.png` + `07c-inspection-panel.png` + `07-map__reference-full.png`: these shape the most complex part of the game
2. `06-mission-overview.png`, `04-how-to-play.png`
3. `08-mission-aborted.png`, `09-mission-complete.png`, `07b-decision-confirm.png`, `07d-pause-menu.png`
5. Section C map parts
6. The rest
