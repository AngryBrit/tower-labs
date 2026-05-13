# Tower Labs — research & lab reference

Static web app for **The Tower**: browse research trees from exported JSON, see lab upgrade costs and timings, compare builds, and share lab configurations from the browser.

**Repository:** [AngryBrit/tower-labs](https://github.com/AngryBrit/tower-labs)

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![Version](https://img.shields.io/badge/version-1.0.4-2ea44f)

---

## Features

- **Research browser** — Loads [`public/research/manifest.json`](public/research/manifest.json) and every section file it lists (main, attack, defense, utility, ultimate weapon, cards, perks, bots, enemies, modules, card mastery, battle conditions). Cards show costs and benefits where data allows.
- **Lab economics** — Upgrade costs and build times from [`src/data/tower-labs.json`](src/data/tower-labs.json), aligned with the in-game lab grid.
- **Lab compare** — Side-by-side comparison, budget-style rollups, named presets (stored locally), and safe handling of pasted or imported level payloads.
- **Shareable builds** — Encode the current lab selection in the `?labs=` query string; optional QR code for sharing.
- **Languages** — English and Spanish UI; Spanish titles and card names are overlaid from bundled JSON (see [Internationalization](#internationalization)).
- **Persistence** — Section collapse state and locale choice survive reloads (`localStorage`).

For a full list of what shipped in **1.0.4**, see [`CHANGELOG.md`](CHANGELOG.md).

---

## Requirements

- **Node.js** 20 or newer (current LTS is recommended).

---

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (by default `http://localhost:5173/`). The dev server serves `public/` at the site root, so `/research/manifest.json` resolves to `public/research/manifest.json`.

**Production build**

```bash
npm run build
npm run preview
```

`npm run build` runs the TypeScript project build and Vite; output is written to `dist/`.

---

## npm scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start the Vite dev server with HMR. |
| `npm run build` | Typecheck and emit a production bundle to `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Run ESLint on the repo. |
| `npm run test` | Run Vitest unit tests (`src/**/*.test.ts`). |
| `npm run import-lab` | Wrapper for [`scripts/import-lab-csv.mjs`](scripts/import-lab-csv.mjs) (CSV → lab helper). |

---

## Maintenance scripts (`scripts/`)

These are run with Node directly when you update data or regenerate assets:

| Script | Purpose |
|--------|--------|
| [`import-lab-csv.mjs`](scripts/import-lab-csv.mjs) | Import lab rows from CSV (also available as `npm run import-lab`). |
| [`build-module-tower-labs.mjs`](scripts/build-module-tower-labs.mjs) | Build pipeline for per-module lab JSON. |
| [`merge-module-tower-labs.mjs`](scripts/merge-module-tower-labs.mjs) | Merge module exports into `src/data/tower-labs.json`. |
| [`write-research-overlay.mjs`](scripts/write-research-overlay.mjs) | Regenerate [`src/i18n/research-overlay.es.json`](src/i18n/research-overlay.es.json) from the manifest and Spanish string tables. |
| [`gen-dissonant-echo-labs.mjs`](scripts/gen-dissonant-echo-labs.mjs) | Generate Dissonant Echo lab duration/cost rows and patch `tower-labs.json` (wiki-aligned). |
| [`gen-enhancement-coin-discount-labs.mjs`](scripts/gen-enhancement-coin-discount-labs.mjs) | Generate enhancement coin discount lab rows and patch `tower-labs.json`. |

Example:

```bash
node scripts/merge-module-tower-labs.mjs
node scripts/write-research-overlay.mjs
```

---

## Project layout

| Path | Role |
|------|------|
| [`public/research/`](public/research/) | Runtime research data: `manifest.json` and `sections/*.json`. |
| [`src/data/tower-labs.json`](src/data/tower-labs.json) | Lab upgrade costs, durations, and metadata used by the UI. |
| [`src/data/card-mastery-tier-labels.json`](src/data/card-mastery-tier-labels.json) | Tier labels for card mastery display. |
| [`src/types/research.ts`](src/types/research.ts) | Typed parsing and validation helpers for research JSON. |
| [`src/loadResearchData.ts`](src/loadResearchData.ts) | Fetches manifest + sections and returns typed `ResearchData`. |
| [`src/components/`](src/components/) | UI: `SelectResearch`, `ResearchCard`, `ResearchSection`, `LabCompareDialog`, and related pieces. |
| [`src/i18n/`](src/i18n/) | Locale provider, copy, Spanish research overlay, and benefit translation helpers. |
| [`src/labCompare.ts`](src/labCompare.ts), [`src/labBudgetAggregates.ts`](src/labBudgetAggregates.ts), … | Lab comparison, budgets, presets, slugs, and share codec (`labsShareCodec.ts`). |
| [`src/appVersion.ts`](src/appVersion.ts) | `APP_VERSION` and changelog URL (from `package.json`). |

After you edit files under `public/research/` or `src/data/`, save and refresh the browser (or let Vite HMR pick up changes).

---

## Sharing lab builds

The app can serialize the selected lab levels into the **`labs`** query parameter. Copy the URL from the share control, or use the QR path where offered. Anyone opening that URL with the same app version should decode to the same selection (within the limits of the codec and data).

---

## Internationalization

- Supported locales: **English (`en`)** and **Spanish (`es`)**.
- UI strings live under [`src/i18n/`](src/i18n/). Locale is stored under the key documented in [`src/i18n/constants.ts`](src/i18n/constants.ts).
- Spanish research **names** (sections and cards) come from [`src/i18n/research-overlay.es.json`](src/i18n/research-overlay.es.json), maintained by `scripts/write-research-overlay.mjs` when you refresh translations from your tables.

---

## Development notes

- **Lint and tests** — Run `npm run lint` and `npm run test` before pushing substantive changes.
- **Windows / OneDrive** — This repo sets Vite [`cacheDir`](vite.config.ts) to `.vite` in the project root to reduce permission issues when the tree lives under OneDrive or aggressive antivirus. If you still see EPERM on cache clears, keep the project outside synced folders or exclude `.vite` from sync.

---

## Versioning and releases

- The canonical version string is in [`VERSION`](VERSION) and mirrored in [`package.json`](package.json) and the root package entry in [`package-lock.json`](package-lock.json). The in-app badge reads `package.json` via [`src/appVersion.ts`](src/appVersion.ts).
- Human-readable history is in [`CHANGELOG.md`](CHANGELOG.md) (Keep a Changelog, SemVer).
- GitHub release notes can follow [`RELEASE_NOTES_TEMPLATE.md`](RELEASE_NOTES_TEMPLATE.md).

---

## Licence and credits

Licensed under **CC BY-NC-SA 4.0** — see [`LICENCE`](LICENCE).

Contributors are listed in [`AUTHORS`](AUTHORS).
