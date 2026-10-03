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
