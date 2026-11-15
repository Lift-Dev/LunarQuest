# LunarQuest — Project Plan

Status: **Phase 1 complete — waiting for approval and answers to the open questions (§7).**
Last updated: 2026-11-14

---

## 1. Phase 1 findings: what's in the project

| Item | Found |
|---|---|
| Source code | **None.** No `package.json` and no framework. This is a new project. |
| Git repository | **No.** We should run `git init` before writing any code. |
| Scenario / decision data | **None.** No scenario descriptions, decision trees, or game data are in the folder. **This blocks Phase 6.** |
| UI designs | 4 UX Pilot PDF exports in `image-assets/`, each a single flattened page |

### The 4 supplied designs

| File | Screen | Content |
|---|---|---|
| `uxpilot-export-11-14-26.pdf` | **Screen 1: Welcome** | Photoreal astronaut + dome habitat + Earth background, "LunarQuest" logo, "Explore. Survive. Discover.", "A new adventure beyond Earth awaits.", blue pill **START** button |
| `uxpilot-export-11-14-26 (1).pdf` | **Screen 2: Your Mission** | "BRIEFING INITIATED" chip, "YOU ARE THE / MISSION COMMANDER" (blue gradient), stylised outpost illustration in a glowing rounded frame, text panel with an italic quote and a blue left border, **CONTINUE ›** |
| `uxpilot-export-11-14-26 (2).pdf` | **Screen 3: Learn to Survive** | "THREE RESOURCES. ONE MISSION.", 3 cards with 3D icons: Life Support (cyan, oxygen canister, OXYGEN LEVEL 85%), Power (yellow, energy cell, ENERGY CORE 62%), Radiation (purple, shield dome, SHIELD INTEGRITY 94%), **NEXT** |
| `uxpilot-export-11-14-26 (5).pdf` | **Screen 5: Mission Levels** | "YOUR JOURNEY", a vertical list of 15 levels joined by dashed lines. Level 01 is highlighted with a START button and 5 empty stars. Levels 02–15 are dimmed, locked, and have padlock thumbnails |

### Asset quality
- Each PDF contains the **original embedded raster images** (9–32 per file, up to 2764 px wide). They can be extracted at full quality with PyMuPDF, so the logo, backgrounds, resource icons and 15 level thumbnails are usable now.
- Extracted images may have lost their transparency or been cropped by the layout. Original PNG exports from UX Pilot are better where you can get them (see `ASSET_REQUESTS.md`).
- The "Made with UX Pilot" footer bar is not part of the design and will be left out.
- The design canvas is ~1288 × 915 (about 4:3), not 16:9. The onboarding screens are centred layouts, so they adapt to 16:9 without distortion.

### Design language (from the 4 screens)
- **Background:** deep navy to near-black (`#050a1a`–`#0b1430` range) with soft radial blue/purple glows and sparse star dots
- **Panels:** dark translucent navy, 16–20 px radius, 1 px light-blue/grey border at low opacity, subtle glow
- **Primary button:** royal blue (`~#2563eb` → `#3b82f6`), pill or rounded-rect shape, bold uppercase rounded font, blue outer glow
- **Accent colours:** cyan = life support, amber/yellow = power, violet = radiation, gold = stars
- **Type:** headings use a heavy, rounded, geometric uppercase display face with a glow. Body text is a rounded geometric sans. **Exact font names are still needed** (question Q4).

### Gaps and inconsistencies
1. **Screens not designed yet:** How to Play, Mission Overview, Gameplay/Decision, Inspection panel, Pause, Mission Aborted, Mission Complete, and completed/unlocked states on the Levels screen.
2. **Mission 01 has two names.** Your brief says "Mission 01 — Lunar Outpost", but the Levels design says "Survive the Lunar Cycle".
3. **Radiation goes in opposite directions.** The brief says radiation *accumulates* and must stay *below* a threshold (low is good). The design shows "SHIELD INTEGRITY 94%" (high is good).
4. **Levels 02–15** have names and thumbnails only. For the MVP they stay locked placeholders with no content.

---

## 2. Recommended tech stack

The goal is a reliable, offline-capable game for children aged 7–12 that's easy to grow mission by mission.

| Layer | Your proposal | Recommendation | Why |
|---|---|---|---|
| Frontend | Vite + React + TS + Tailwind | ✅ **Keep.** Vite 6, React 19, TypeScript strict, Tailwind v4 | Good fit for this project |
| Routing | — | **React Router** | Real URLs per screen, plus route guards so locked missions can't be opened |
| Game state | — | **Zustand** + `persist` middleware (localStorage) | Small, no boilerplate, built-in save/resume. The game rules live in a **pure TypeScript engine** that has no React in it |
| Data validation | — | **Zod** | Validates scenario/mission JSON at load time, so a typo in the data shows a clear error instead of a broken game |
| Outpost map | Three.js | ⚠️ **SVG + layered illustrated PNGs for the MVP.** Three.js later, only if we get 3D models | See §2.1 |
| Animation | — | **Motion** (formerly Framer Motion) | Screen transitions, card flips, glow pulses, number tweens on the HUD |
| Fonts | — | **@fontsource** (self-hosted) | Works offline. No Google Fonts requests, which matters for a children's product |
| Icons | — | **Lucide** for UI icons (pause, lock, chevron). Your art for game icons | Consistent and lightweight |
| Unit tests | — | **Vitest** | Tests the game engine: effects, thresholds, branching, win/lose |
| End-to-end tests | — | **Playwright** | Automates the 12 required test scenarios through a real browser |
| Offline / tablet | — | **vite-plugin-pwa** | Installable on classroom tablets and works without internet |
| Backend | Python + FastAPI | ⏸ **Not in the MVP** | The MVP is local-only (your brief, §11). Add a backend later when there's a real need: teacher dashboards, cloud saves, analytics |
| Database | Supabase / PostgreSQL | ⏸ **Post-MVP.** Supabase is a good choice then | Accounts for under-13s bring COPPA/GDPR-K obligations (parental consent, data minimisation). Design for that before collecting any data |
| AI | LLM API | ⏸ **Post-MVP, and as an *authoring* tool, not live to children** | Your rule is "do not invent scenario text". A live LLM in a kids' game also needs moderation. Better use: an internal tool that drafts new scenarios for **you** to review |
| Data processing | Python + NumPy | 🔁 **A TypeScript balancing script** | It reuses the game engine to play every path through the decision tree and report which paths fail or succeed. A Python version would need a second copy of the rules |
| Deployment | Vercel | ✅ **Vercel** (static SPA) | Free tier, preview deploys per branch |
| Package manager | — | **pnpm** | Fast and strict |
| Code quality | — | ESLint + Prettier + `tsc --noEmit` in CI (GitHub Actions) | Catches errors early |

### 2.1 Why not Three.js for the map (yet)
- Your art is **2D painted illustration**. A Three.js map would need 3D models in the same style, which don't exist and are expensive to make well.
- The required interactions (click to inspect, highlight, glowing cable paths, scenario highlights) are **simpler and sharper with SVG**. You get pixel-accurate hit areas, CSS glow, accessible focus states, and good performance on low-end tablets.
- **Plan:** an isometric base illustration plus one transparent PNG per equipment piece, with an **SVG overlay** for hit areas and cables. The map component reads one data file, `outpost-map.ts`, which lists equipment, positions and connections. That keeps the rendering layer swappable, so a React-Three-Fiber renderer could replace it later without changing any game logic.

---

## 3. Architecture

```
lunarquest/
├─ docs/                      ← this plan, asset requests, balancing notes
├─ image-assets/              ← your original UX Pilot exports (reference only, never edited)
├─ public/
│  └─ assets/                 ← final game images, organised by screen (see ASSET_REQUESTS.md)
├─ src/
│  ├─ app/                    ← router, providers, App shell, 16:9 stage
│  ├─ design-system/          ← tokens.css, Button, Panel, Chip, ProgressBar, StarRating, Modal, ScreenBackground
│  ├─ screens/                ← Welcome, Briefing, LearnToSurvive, HowToPlay, MissionLevels,
│  │                             MissionOverview, Gameplay, MissionAborted, MissionComplete
│  ├─ features/
│  │  ├─ hud/                 ← ResourceHUD, ResourceGauge, DayIndicator
│  │  ├─ scenario/            ← ScenarioPanel, DecisionCard, ConfirmDecisionModal
│  │  └─ outpost-map/         ← OutpostMap, EquipmentNode, CableLayer, InspectionPanel
│  ├─ game/                   ← ★ PURE TYPESCRIPT, NO REACT ★
│  │  ├─ engine.ts            ← startMission, applyDecision, advanceDay, checkOutcome
│  │  ├─ types.ts             ← Mission, Scenario, Decision, Effect, GameState…
│  │  ├─ schema.ts            ← Zod schemas that validate the data files
│  │  └─ engine.test.ts
│  ├─ data/                   ← ★ CONTENT, NO LOGIC ★
│  │  ├─ missions.ts          ← 15 levels: id, title, thumbnail, unlock order
│  │  ├─ balance/mission-01.ts← all numbers: start values, rates, thresholds (PLACEHOLDERS, labelled)
│  │  ├─ scenarios/mission-01.json ← your scenarios and decisions, word for word
│  │  └─ maps/outpost-01.ts   ← equipment, positions, connections
│  └─ store/
│     └─ gameStore.ts         ← Zustand: progress (unlocks, stars) + active mission save
├─ scripts/balance-sim.ts     ← runs every decision path and reports outcomes
└─ e2e/                       ← Playwright tests
```

**Rules:**
1. UI components never compute game results. They call `engine` functions through the store.
2. All numbers live in `data/balance/`. No magic numbers in components.
3. All text from your scenarios lives in `data/scenarios/`, copied word for word.
4. Adding Mission 02 means adding data files only. No new screens.

### 3.1 Core data model (draft — final shape depends on your scenario files)

```ts
type ResourceId = 'lifeSupport' | 'power' | 'radiation';

interface ResourceEffect { lifeSupport?: number; power?: number; radiation?: number }

interface Decision {
  id: string;                 // "s03-a"
  title: string;              // your text, verbatim
  explanation: string;        // your text, verbatim
  image?: string;             // asset path
  effects: ResourceEffect;    // applied immediately
  science?: number;           // science points earned
  next: string | null;        // next scenario id (branching); null = continue on the default timeline
  ongoingEffects?: { perDay: ResourceEffect; days: number }; // only if your scenarios need it
}

interface Scenario {
  id: string;                 // "s03"
  day: number;                // 1–14
  phase: 'day' | 'night';     // derived from day by default
  title: string;
  description: string;
  image?: string;
  mapHighlights: string[];    // equipment ids, e.g. ['battery-storage']; [] = no highlight
  decisions: [Decision, Decision];
}

interface MissionBalance {
  durationDays: 14; daylightDays: 7;
  start:    { lifeSupport: number; power: number; radiation: number };
  perDay:   { lifeSupportUse: number; powerUse: number; solarGenDay: number; radiationBaseline: number };
  abortAt:  { lifeSupportBelow: number; powerBelow: number; radiationAbove: number };
  maxPower: number;
  starThresholds: [number, number, number, number, number]; // science points needed for 1…5 stars
}
```

**Game loop:** show scenario → player inspects map (optional) → picks decision → confirm → engine applies effects + science → logs to history → checks abort → if day advances, apply daily tick (O₂ use, solar gen in daylight, battery drain, radiation baseline) → check abort → next scenario or Mission Complete.

### 3.2 Placeholder balance values ⚠️ TEMPORARY GAME-BALANCING ASSUMPTIONS, NOT SCIENTIFIC DATA

| Value | Placeholder | Notes |
|---|---|---|
| Life support start / daily use / abort | 100 / −4 per day / abort at ≤ 15 | Doing nothing for 14 days leaves 44, so decisions decide the outcome |
| Power start / max / daily use | 80 / 100 / −8 per day | |
| Solar generation (days 1–7) | +12 per day | Net +4 per day in daylight, −8 per day at night |
| Power abort | ≤ 10 | |
| Radiation start / daily baseline / abort | 0 / +2 per day / abort at ≥ 80 | |
| Science stars | 1★ 20 · 2★ 40 · 3★ 60 · 4★ 80 · 5★ 100 points | |

These get tuned in Phase 8 with the balancing script.

### 3.3 Outpost map: equipment and connections (draft)

```
Solar Array 01 ─┐
                ├─ cable ─► Battery Storage ─► Power Distribution ─┬─► Habitat Module (crew quarters)
Solar Array 02 ─┘                                                   ├─► Life Support (O₂ generator + tanks) ─► Habitat
                                                                    ├─► Science Lab
                                                                    ├─► Comms Antenna
                                                                    ├─► Radiation Shelter
                                                                    └─► Rover Charging Bay ─ Sample Collection Area
```
Each node has an id, name, kid-friendly description, status derived from game state (e.g. Battery charge = Power %), and a list of connections. Selecting a node highlights its node, its cables (animated flow), and the nodes it connects to.

---

## 4. Screen flow

```
Welcome ─► Your Mission ─► Learn to Survive ─► How to Play ─► Mission Levels ─► Mission Overview ─► Gameplay
   │ (if a save exists: "Continue mission" / "New game")                ▲                            │
   │                                                                     │          ┌─────────────────┤
   └─────────────────────────────────────────────────────────────────────┘          ▼                 ▼
                                                                         Mission Aborted     Mission Complete
                                                                          (Retry / Levels)   (Next mission / Levels)
Gameplay ⇄ Pause menu (Resume / Restart mission / Back to Levels)
```
Onboarding screens are skipped automatically after the first run. A "How to play" link stays available from Pause.

---

## 5. Step-by-step roadmap

Each phase ends with: a summary of what was done, what remains, checks run (`tsc`, lint, tests), and a screenshot or demo for your review **before we move on**.

### ✅ Phase 1: Project analysis (done)
- [x] Inspect folder, assets, data
- [x] Report findings, stack recommendation, architecture draft
- [ ] **You:** answer the open questions (§7) and send the first assets from `ASSET_REQUESTS.md`

### ✅ Phase 2: Architecture and project setup (done 2026-11-15)
- [x] `git init`, scaffold Vite 8 + React 19 + TypeScript 7 + Tailwind v4. **npm** is used instead of pnpm (pnpm isn't installed, and npm is fine for this size)
- [x] Installed React Router 8, Zustand 5, Zod 4, Motion, Vitest 5. Playwright is deferred to Phase 8; ESLint/Prettier will be added in Phase 3
- [x] Game data model: `src/game/schema.ts` (Zod) → `types.ts` (inferred types + save-state types)
- [x] `src/game/loadMission.ts`: shape checks + reference checks (days 1–14, flags set before read, map ids, source ids, branching fallback, radiation never decreases)
- [x] Mission 01 data: `src/data/missions/mission-01/content.json` (text word for word) + `balance.ts` (placeholder numbers)
- [x] Supporting data: `sources.ts` (unverified until URLs are checked), `solar-flares.ts` (7 real flares, to confirm in DONKI), `levels.ts` (15 levels), `maps/outpost-01.ts` (equipment ids)
- [x] App shell: router with every screen route (placeholders), `routes.ts` path helpers
- [x] Checks: `npm run typecheck` ✅ · `npm test` 10/10 ✅ · `npm run build` ✅ · `npm run dev` ✅
- **Done when:** ✅ dev server runs and tests validate the real data, including a test that the data matches SCENARIOS_MISSION_01.md word for word

### ✅ Phase 3: Design system and assets (done 2026-11-15)
- [x] **Font identified from the PDFs: Fredoka** (400 body, 700 headings/buttons), bundled via `@fontsource-variable/fredoka` (works offline)
- [x] Exact sizes and colours read from the PDF vectors: the designs use a 1440px canvas and stock Tailwind colours, so they map 1:1 to Tailwind classes
- [x] 30 embedded images extracted. Full-size originals are in `image-assets/extracted/`; optimised copies (2× display size, 17 MB → 1.8 MB) are in `public/assets/`
- [x] Tokens in `src/index.css` (`@theme`): font, `space` background, resource colours, glows, reduced-motion support, focus rings
- [x] Components in `src/design-system/`: `Button` (pill / primary / raised / ghost), `Panel` (card / solid / row / active), `Chip`, `ProgressBar`, `StarRating`, `ScreenBackground`
- [x] The 4 designed screens were rebuilt to test the components: Welcome, Your Mission, Learn to Survive, Your Journey. Compared side by side with the PDFs at 1440×1024 and checked at tablet portrait 834×1194
- [ ] Not done: a separate `/dev/components` page. The four real screens act as the component sheet. ESLint/Prettier are moved to Phase 8
- **Done when:** you approve the side-by-side comparisons

### Phase 4: Screens and navigation (~1.5 days)
- [x] Welcome, Your Mission, Learn to Survive, Mission Levels: pixel-matched to your PDFs (done early, in Phase 3)
- [x] How to Play, Mission Overview, Levels (horizontal Journey Map), Mission Complete, Mission Aborted, Pause + Settings overlay: built 2026-11-15 from the PNG references (results screens take real run data via navigation state; `/dev/complete|aborted|pause` preview routes in dev only)
- [x] Router + guards (locked/unknown mission → redirect to Levels)
- [ ] Desktop 16:9 + tablet landscape/portrait layouts
- **Done when:** you can click from Welcome to Mission Overview and every screen matches its reference

### Phase 5: Interactive outpost map (~2–3 days)
- [ ] `outpost-01.ts` map data: equipment, positions, cable paths, connections
- [ ] Base illustration + equipment layers + SVG hit areas
- [ ] Hover/focus/selected states, keyboard and touch support
- [ ] Inspection panel: name, status, resource reading, "Connected to" list
- [ ] Connection highlighting with animated power/air flow along cables
- [ ] Scenario-driven highlights (pulse) from `scenario.mapHighlights`
- [ ] Inspect only. No controls that change game state
- **Done when:** every object can be inspected, its connections light up correctly, and you approve how it looks

### Phase 6: Gameplay (~2–3 days)
- [ ] Pure engine: `startMission`, `applyDecision`, `advanceDay`, `checkOutcome` + unit tests
- [ ] Resource HUD (O₂, Power, Radiation, ★, Day X/14, ☀/☾, Pause)
- [ ] Scenario panel + 2 decision cards + confirm modal
- [ ] Branching via `decision.next`, history log, day/night transition banner
- [ ] Abort → Mission Aborted (cause + stats + Retry). Day 14 → Mission Complete (resources, ★, decisions, Next)
- [ ] Unlocking Mission 02 on completion (shows "Coming soon" since it has no content)
- **Done when:** Mission 01 can be played start to finish, with both a win path and an abort path

### Phase 7: Persistence (~0.5 day)
- [ ] Zustand `persist` with a **versioned save schema** + migration, so old saves don't crash after updates
- [ ] Auto-save after every decision. "Continue mission" on Welcome
- [ ] Restart mission (Pause menu, with confirmation). Reset all progress (settings, double confirmation)
- [ ] Corrupted save → safe fallback + message, never a blank screen
- **Done when:** refreshing mid-mission resumes on the exact same scenario with the same values

### Phase 8: Testing and balancing (~1–2 days)
- [ ] Playwright e2e for all 12 required checks (§6)
- [ ] `balance-sim.ts`: walk every branch, report win/abort rate and star distribution, then tune the placeholder numbers with you
- [ ] Accessibility pass: contrast, focus rings, tap targets ≥ 44 px, reduced-motion, readable text for ages 7–12
- [ ] Performance pass on a mid-range tablet (image sizes → WebP/AVIF, lazy loading)
- [ ] Fix all major bugs, then deploy to Vercel as a preview + PWA install test
- **Done when:** all tests pass and you've played it on desktop and tablet

### Post-MVP (later, optional)
Sound and music · day/night map lighting · Mission 02+ content · FastAPI/Supabase cloud save and teacher dashboard (with COPPA design) · LLM-assisted scenario authoring tool · localisation · Three.js map upgrade

**Rough total: 10–13 working days of implementation after the blockers are resolved.**

---

## 6. Test checklist (from your brief)

| # | Check | How |
|---|---|---|
| 1 | Welcome → Mission One navigation | Playwright |
| 2 | Every equipment object can be inspected | Playwright (loops through map data) |
| 3 | Connections highlight correctly | Unit test (graph) + Playwright |
| 4 | Scenario text matches the source exactly | Snapshot test against your source file |
| 5 | Both decision options work | Playwright |
| 6 | Resource effects applied correctly | Vitest (engine) |
| 7 | Stars awarded correctly | Vitest |
| 8 | Branching advances correctly | Vitest + balance-sim (every path ends) |
| 9 | Thresholds trigger abort (each resource) | Vitest + Playwright |
| 10 | Surviving 14 days → Complete | Vitest + Playwright |
| 11 | Save/restore after reload | Playwright (reload mid-mission) |
| 12 | Locked missions inaccessible (UI + direct URL) | Playwright |

---

## 7. Open questions: I need these answered before Phase 2

> **Update:** The project targets NASA Space Apps 2026, *Build a Junior Astronaut Mission Trainer*. Q1 and Q5 are now answered by the draft in [SCENARIOS_MISSION_01.md](SCENARIOS_MISSION_01.md): one scenario per day, 14 days, 3 memory flags, 2 random events. Waiting for your review.

**Blocking**
- **Q1 (drafted, awaiting review): Scenario and decision data.** Your brief says they already exist, but they aren't in the project. Please add them (any format: doc, PDF, spreadsheet, text) to `LunarQuest/scenarios/`. I need, per scenario: day, title, description, the 2 decisions (title + explanation), and if you have them, each decision's resource and science effects and which scenario comes next. Missing effects get labelled placeholders that you approve.
- **Q2 ✅ decided:** "Mission 01 — Survive the Lunar Cycle". "Lunar Outpost" is the place name.
- **Q3 ✅ decided:** **Radiation Dose**, a meter that fills up and never goes down. It's scientifically accurate (dose is cumulative), which the challenge prioritises. Screen 3's "SHIELD INTEGRITY 94%" becomes "RADIATION DOSE 6%". Details in [SCENARIOS_MISSION_01.md §0](SCENARIOS_MISSION_01.md).

**Important but not blocking**
- **Q4: Fonts.** Which fonts did UX Pilot use (check the design's text settings)? If unknown, I'll match them as closely as possible from open fonts.
- **Q5: Scenario pacing.** How many scenarios per day? One per day (14 decisions), or some days with none or several?
- **Q6: Balance values.** OK to start with the placeholders in §3.2?
- **Q7: Stack.** Do you approve deferring FastAPI, Supabase and the LLM to post-MVP, and using SVG instead of Three.js for the map?
