# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2026-05-13

### Added

- **Social link previews**: Open Graph and Twitter Card meta tags in `index.html` so URLs unfurl to a rich preview card in Discord, Slack, iMessage, and other unfurlers. Title, description, site name, locale, and a `summary_large_image` card are all declared.
- **OG banner**: `public/og-banner.png` (real PNG, 1200×630) used as the `og:image` / `twitter:image`; shows a stylized lab/research dashboard alongside the Tower Labs brand and tagline.

### Changed

- **Asset extensions**: Renamed `public/*.png` images (`cash`, `coin`, `elite-cell`, `gem`, `medal`, `power-stone`, `tower-site-logo`) to `*.webp` since the files were always WebP behind a `.png` extension. Updated references in `index.html`, `src/components/SelectResearch.tsx`, and `src/components/ResearchCard.tsx`. The favicon `<link>` now declares `type="image/webp"`.

## [1.0.2] - 2026-05-13

### Changed

- **Mobile layout**: Research cards stay **two columns** on narrow viewports; removed the temporary single-column and stacked-filter overrides. Below **36rem** viewport width, root `html` font-size is **100%** (desktop remains **200%**) so spacing and type scale down and the panel fits more comfortably on phones.

## [1.0.1] - 2026-05-13

### Changed

- **Mobile layout**: Research sections use a single-column card grid below 36rem viewport width; narrow phones stack filter controls and wrap the preset row for usable tap targets. Root padding respects safe-area insets; viewport meta includes `viewport-fit=cover`; `html` sets `text-size-adjust` for steadier mobile text scaling.
- **Research card display**: Golden Tower Bonus lab value strings include a leading `+` (e.g. `+0.15`) for consistency with other signed benefit lines.

## [1.0.0] - 2026-05-12

### Added

- **Lab compare**: `LabCompareDialog` plus `labCompare`, `labBudgetAggregates`, preset save/load (`labPresetsStorage`), URL-safe lab slugs (`labSlug`), sanitized level overrides (`labLevelOverridesSanitize`), and parsing for pasted/shared lab level payloads (`parseLabLevelsPayload`), each covered by tests where applicable.
- **Internationalization**: `I18nProvider` / context / hooks, English and Spanish UI strings, Spanish research overlay JSON, and benefit-line translation helpers for research cards.
- **Research data loading**: `loadResearchData` merges the static `public/research/` tree with overlay JSON; `scripts/write-research-overlay.mjs` writes overlay files from game strings.
- **Lab data scripts**: `scripts/gen-dissonant-echo-labs.mjs` and `scripts/gen-enhancement-coin-discount-labs.mjs` for generating tower-lab entries.
- **Shareable builds**: encode/decode full lab selections in the `?labs=` query parameter (`labsShareCodec`) with QR-friendly sharing support (`qrcode` dependency).
- **Version surface**: README badge and in-app version/changelog affordances driven by `package.json` via `src/appVersion.ts`.
- **Branding**: Tower wiki logo in the app header and as the favicon.

### Changed

- **Select research & layout**: Major `SelectResearch` expansion (filters, grouping, compare entry points, version UI, accessibility copy); updates to `ResearchSection`, `ResearchCard`, `App.tsx`, `main.tsx`, and substantial `App.css` work.
- **Types & costs**: Broader `src/types/research.ts` model; `labCosts` and research benefit calculations/tests aligned with new cards and overlays.
- **Data**: Large updates to `src/data/tower-labs.json` and `public/research/sections/main-research.json`.
- **UX polish**: Persisted section collapse state; trimmed development-only chrome and footer clutter.
- **Release metadata**: Set release to **1.0.0** in `VERSION`, `package.json`, and root entries in `package-lock.json`; README version badge updated to match.

## [0.1.0] - 2026-05-12

### Added

- Project documentation aligned with sibling repositories: `VERSION`, `AUTHORS`, `LICENCE`, `CHANGELOG.md`, and `RELEASE_NOTES_TEMPLATE.md`.
- Public research viewer: React + Vite app loading `public/research/` manifest and section JSON with typed parsing and lab cost integration from `src/data/tower-labs.json`.
- Supporting scripts under `scripts/` for lab CSV import and module tower-labs merge/build workflows.

### Changed

- `README.md` replaced the default Vite template with project-specific setup, layout, and licence notes.
- `package.json` version set to `0.1.0` to match `VERSION`.
