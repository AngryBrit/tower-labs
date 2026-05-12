## Tower Labs — research & lab reference

Static reference UI for **The Tower** research trees and lab upgrade data: browse section JSON, cards, costs, and related metadata in one place.

Repository: [AngryBrit/tower-labs](https://github.com/AngryBrit/tower-labs)

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![Version](https://img.shields.io/badge/version-0.1.0-2ea44f)

---

## Requirements

- **Node.js** 20+ (LTS recommended)

---

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/`). The app loads `public/research/manifest.json` and the section files it references.

Production build:

```bash
npm run build
npm run preview
```

---

## Project layout

| Path | Purpose |
|------|--------|
| `public/research/` | Manifest + per-section JSON consumed at runtime |
| `src/data/tower-labs.json` | Lab upgrade costs / times used by the UI |
| `src/data/card-mastery-tier-labels.json` | Labels supporting card mastery display |
| `src/types/research.ts` | Parsing and types for research JSON |
| `src/components/` | `SelectResearch`, `ResearchCard`, `ResearchSection` |
| `scripts/import-lab-csv.mjs` | CSV → lab data helper (`npm run import-lab`) |
| `scripts/build-module-tower-labs.mjs` | Build pipeline for module lab JSON |
| `scripts/merge-module-tower-labs.mjs` | Merge module exports into `tower-labs.json` |

Edit `public/research/` and `src/data/tower-labs.json`, then refresh the browser to see changes.

---

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Typecheck + production bundle to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (unit tests) |
| `npm run import-lab` | Run `scripts/import-lab-csv.mjs` |

Module lab maintenance (run with `node` as needed):

```bash
node scripts/build-module-tower-labs.mjs
node scripts/merge-module-tower-labs.mjs
```

---

## Versioning & releases

- Canonical release version is stored in **`VERSION`** and mirrored in **`package.json`** / **`package-lock.json`**.
- User-facing history lives in **`CHANGELOG.md`** (Keep a Changelog).
- For GitHub releases, start from **`RELEASE_NOTES_TEMPLATE.md`**.

---

## Licence & credits

Licensed under **CC BY-NC-SA 4.0** — see [`LICENCE`](LICENCE).

Contributors are listed in [`AUTHORS`](AUTHORS).
