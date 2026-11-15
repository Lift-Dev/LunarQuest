# LunarQuest

A Junior Astronaut Mission Trainer for kids aged 7–12, built for the **2026 NASA Space Apps Challenge** ("Build a Junior Astronaut Mission Trainer").

Players command a lunar outpost for 14 Earth days (7 of daylight, 7 of night). Every daily decision trades off **Life Support (O₂)**, **Power** and **Radiation Dose**, and ends with a short "Real Space Fact" and its NASA source.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # engine, scoring and data tests
npm run build      # typecheck + production build
```

## Stack

Vite · React · TypeScript · Tailwind CSS v4 · Zustand · Zod · React Router · Motion · Vitest

## Project layout

- `src/game/`: pure TypeScript engine, schemas, scoring (no React)
- `src/data/`: Mission 01 content, balance numbers, levels, solar flares, sources
- `src/screens/`, `src/features/`, `src/design-system/`: UI
- `docs/`: project plan, scenario script, asset requests
- `image-assets/`: UI design references

## NASA data

Day 6 uses archived real solar flares (NASA DONKI), labelled as archived, not live. Facts cite NASA sources (Apollo, Artemis, LCROSS, ISS and others). Source links are still to be verified before launch.

## Status

Mission 01 is playable end to end. Still to do: interactive outpost map and inspection panel, saving/resuming, balance testing.
