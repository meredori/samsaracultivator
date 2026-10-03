# Samsara Cultivator

A cultivation / xianxia incremental game about time, lifespan, reincarnation and mastery. Design notes live in the Samsara Cultivator Design Wiki in Notion.

## Stack

- **TypeScript** throughout
- **`src/sim`**: pure TS simulation with no React, Pixi or DOM imports, tested headless with **Vitest**
- **React** for all interface (`src/ui`)
- **PixiJS 8** for the character, scenes and combat (`src/render`)
- **Zustand + Immer** for observable game state (`src/state`)
- **Zod** for save schemas and validation (`src/save`)
- Seeded RNG (`src/sim/rng.ts`) so each Lower Realm regenerates exactly from its seed
- **Playwright** for full-game tests (`e2e`)
- **Vite** for dev and build
- **Tauri 2** desktop shell (`src-tauri`) for desktop / Steam release

## Commands

```sh
npm install
npm run dev          # browser dev server on http://localhost:5173
npm test             # simulation and save tests (Vitest)
npm run test:e2e     # Playwright (run `npx playwright install` once first)
npm run typecheck
npm run lint
npm run build        # production web build into dist/
npm run tauri dev    # desktop window (needs Rust and the Tauri system prerequisites)
npm run tauri build  # desktop installers
```

Tauri prerequisites per OS: https://v2.tauri.app/start/prerequisites/

## CI and builds

- **CI** (`ci.yml`), on every PR and push to main: typecheck, lint, Vitest, build, Playwright smoke test, Tauri `cargo check`.
- **Pages** (`pages.yml`): main is hosted at https://meredori.github.io/samsaracultivator/ and every PR gets a preview at `.../pr-preview/pr-<number>/`, removed when the PR closes. Pages must be set to deploy from the `gh-pages` branch.
- **Desktop builds** (`desktop.yml`): PRs into main build Windows (`.msi`, `.exe`) and Linux (`.AppImage`, `.deb`, `.rpm`) installers as workflow artifacts; each merge to main publishes them as a `build-<run>` prerelease.

## UI mockup

`npm run dev`, then open http://localhost:5173/mockup.html (or `mockup.html` on the Pages site or a PR preview) for a clickable mockup of the main screen, built from the concept art in `art/concepts/`. It uses static placeholder data (`src/mockup/data.ts`) and a throwaway store, not the simulation; pick an action card to change the scene, and the pause button stops time. The layout targets a window around 1280px wide or more.

Sprites in `src/assets/sprites/` are generated from the concept renders with `python3 tools/pixelize.py` (needs Pillow), which reduces each ~1254px render back to its ~100px pixel grid.
