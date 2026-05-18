# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.0] - 2026-05-18

### Added

- **TowerSmith** rebrand: browser title, PWA manifest, Open Graph / Twitter previews, OG banner, and in-app copy; GitHub repository **AngryBrit/tower-smith**.
- **Module loadout presets**: five saved hub configurations (levels, chassis, assist, sub-modules) on the **Modules** tab (`workshopModulePresets`, `WorkshopModulesPanel`).
- **GitHub Sponsors** footer link (`FUNDING.yml`, `appVersion` sponsor URL).

### Changed

- **Modules hub**: polished slot layout, generator connector alignment, and assist positioning with efficiency display (`WorkshopModulesPanel`, `App.css`).

### Docs

- README tower CSV format, share v4, and module-preset persistence notes; expanded OG/PWA/meta descriptions; corrected CHANGELOG 2.3.0 theme/share rows; release template links.

## [2.4.2] - 2026-05-18

### Changed

- **Branding**: App display name is **TowerSmith** (browser title, PWA manifest, Open Graph / Twitter previews, OG banner, and in-app copy). Replaces the previous **The Armoury** / **The Forge** names.
- **Chassis module levels**: Wiki-aligned per-rarity level caps (Epic 60, Legendary 100, Mythic 140, Ancestral 300); picker clamps on rarity change and shows the correct max in the level control (`workshopChassisModuleMaxLevel`, `clampWorkshopChassisModuleLevel`).
- **Sub-module slots**: Eight effect slots with unlock gates at Lv. 1, 1, 41, 101, 141, 161, 201, and 241; slots above the current rarity max show a dedicated locked state in the module picker.
- **i18n**: EN/ES copy for sub-module slots blocked by rarity max level.

### Added

- **Module loadout presets**: Five module configurations (hub levels, chassis, assist, sub-modules) on the **Modules** tab, persisted with the workshop snapshot (`workshopModulePresets`, `WorkshopModulesPanel`).
- **Tests**: Vitest coverage for rarity level caps and clamping (`workshopChassisModuleShared.test.ts`) and module preset select/snapshot round-trip (`workshopModulePresets.test.ts`).

## [2.4.1] - 2026-05-17

### Changed

- **Share codec v4-only**: `?tower=` payloads use a single `LabsShareFile` shape (`v: 4`); theme data in links carries **owned catalog IDs** only (active skin selection is not encoded).
- **Import/compare**: Lab compare and file import accept **tower CSV** (`tower_csv_v1`) and share payloads only; legacy `key,level` CSV and `?labs=` URLs are no longer parsed.
- **Theme apply**: `TowerThemesSnapshot.selection` is optional so CSV/share imports can update owned skins without overwriting the current selection.
- **Modules UI**: Chassis module picker and workshop modules panel layout tweaks.

### Removed

- Share codec versions **v1–v3** and the legacy **`?labs=`** query parameter.

## [2.4.0] - 2026-05-17

### Added

- **Relics tab**: Top-level **Relics** navigation with owned-catalog toggles, displayed-damage relic bonus, toolbar reset, and wiki-aligned stat rollups (`RelicsPage`, `WorkshopRelicsPanel`, `workshopRelics`, `workshopRelicStats`).
- **Chassis modules**: Cannon, armor, core, and generator module catalogs with epic→ancestral tier tables, ability text, and WebP art under `public/modules/` (`workshopCannonModules`, `workshopArmorModules`, `workshopCoreModules`, `workshopGeneratorModules`, `workshopChassisModuleShared`).
- **Module UX**: Equip picker dialog, browsable chassis catalog, and submodule-effects reference (`ChassisModulePickerDialog`, `ChassisModulesCatalog`, `SubmoduleEffectsCatalog`); assist chassis selection with hero-stat readout (`workshopAssistChassisModule`, `workshopChassisModuleHeroStat`).
- **Submodule picks**: Per-slot cannon sub-module effect selections wired into attack-speed sim (`workshopSubmoduleSelection`, `workshopSubmoduleCatalog`).
- **Module art helpers**: Rarity frame sprites and per-module image paths (`workshopModuleArt`, `workshopModuleImages`).
- **Resets**: Separate **reset modules** and **reset relics** flows that preserve other workshop, card, and theme state (`resetWorkshopModules`, `resetWorkshopRelics`).
- **Unified CSV**: Workshop rows for `relicOwnedIds`, equipped chassis module ids, assist chassis, and `simSubmoduleSelections` round-trip in tower CSV import/export.
- **Tests**: Vitest coverage for chassis catalogs, submodule selection, relic stats, module images, assist chassis, and sim-module merges.

### Changed

- **Modules page & panel**: Expanded `ModulesPage` and `WorkshopModulesPanel` for chassis equip, assist levels, submodule picks, and catalog visibility toggles (`modulesCatalogVisibility`, `submodulesCatalogVisibility`).
- **Displayed stats**: Chassis modules, relic bonus, and submodule attack-speed effects fold into workshop sim and compare paths (`workshopSimModules`, `workshopCompare`).
- **Persistence**: `WorkshopPersistedV1` adds relic ownership, chassis equip fields, assist chassis, and submodule selections; presets and compare import apply the expanded snapshot.
- **i18n**: EN/ES strings for Relics navigation, module catalogs, chassis picker, submodule effects, and reset affordances.

## [2.3.0] - 2026-05-17

### Added

- **Themes tab**: Dedicated in-panel **Themes** navigation with tower, background, music, menus, banners, and guardian categories; coin-bonus summary, owned catalog, selection per category, and reset (`ThemesPage`, `gameThemes.ts`).
- **Theme catalog & art**: Event and guild tower skins, background events, menu guild seasons, banner guild rows, and guardian entries with WebP previews under `public/themes/` (`towerEventGuildSkins`, `backgroundEventGuildSkins`, `bannerGuildSkins`, `menuGuildSkins`, `guardianThemeImages`).
- **Multi-build CSV**: `serializeTowerUnifiedCsvBuilds` exports several named lab + workshop + card builds in one file; `towerUnifiedPrimaryBuild` for single-build callers.
- **Themes in backup**: `theme,ownedIds` row in unified CSV (owned catalog IDs); `TowerThemesSnapshot` read/apply/sanitize helpers (`towerDataThemes.ts`).
- **Share codec v4**: Share payloads can include theme selection and owned catalog IDs (`LabsShareFileV4`); query param was **`?labs=`** until renamed to **`?tower=`** in 2.4.1.
- **Lab presets UX**: Share-link copy with success notice, delete build, and themes folded into `buildLabPresetsPayload`.
- **Main panel persistence**: Last-selected top-level panel (research, workshop, modules, cards, themes, tools/settings) survives reload (`mainPanelStorage`).
- **Tests**: Vitest coverage for multi-build CSV, theme roundtrip, share v4, main panel sanitization, and preset payload themes.

### Changed

- **Lab compare / import**: Unified CSV and share URLs apply themes when present; parsing aligned with multi-build tower CSV format.
- **Guardian previews**: Updated Finn, Nyra, Orbie, and Rolo guardian theme art.
- **i18n**: EN/ES strings for themes navigation, skin groups, coin bonus, and preset share/delete affordances.

## [2.2.0] - 2026-05-16

### Added

- **Full card inventory**: All **31 in-game cards** with wiki-aligned star tables (Lv.1–7), rarities, descriptions, and gem slot costs (`workshopGameCards`, `workshopGameCardWiki`); WebP art in `public/` for each card.
- **Card loadouts**: Five **preset tabs**, per-preset equip lists, configurable **equip slots** (up to 28 with Harmony keys), and star controls on the **Cards** page (`WorkshopCardsPanel`, `CardsPage`).
- **Card Mastery**: Card Mastery lab levels from the research `card-mastery` section scale equipped card effects via tier multipliers (`workshopCardMastery`).
- **Workshop stat wiring**: Equipped cards on the active preset (stars × Card Mastery) feed **displayed damage**, **attack speed**, and other workshop upgrade readouts (`workshopCardWorkshopDisplay`).
- **Reset cards**: Toolbar control and confirmation dialog to clear card stars, presets, and equip slots without touching workshop upgrade/enhance levels (`resetWorkshopCards`).
- **Tests**: Vitest coverage for card wiki tables, mastery multipliers, equipped-star rules, preset loadouts, and displayed-stat merges.

### Changed

- **Persistence**: `WorkshopPersistedV1` adds `cardStars`, `cardPresetLoadouts`, `cardActivePresetIndex`, and `cardEquipSlots`; legacy `simDamageCardStars` / `simAttackSpeedCardStars` / `simBerserkerCardStars` migrate into the new card model on load.
- **Workshop reset**: `resetWorkshopUpgradeLevels` now preserves card loadouts; card-only reset is separate from upgrade/enhance reset.
- **Displayed stats**: Damage, attack speed, defense, and utility workshop modules merge lab multipliers with equipped-card products (`workshopCardMultProduct`, `workshopCardAddPercentPoints`).
- **i18n**: EN/ES strings for all 31 card names, the Cards page, preset tabs, equip slots, and reset-cards affordances.

## [2.1.0] - 2026-05-16

### Added

- **Workshop Enhance tab**: Attack, defense, and utility enhancement panels with per-stat level controls, coin ladders, unlock spend gates, and Vitest coverage (`workshopEnhanceAttack`, `workshopEnhanceDefense`, `workshopEnhanceUtility`, tier-400/200 ladders, orb size, recovery package, free upgrades, enemy level skip).
- **Displayed stats**: Wiki-aligned **displayed damage** and **displayed attack speed** on workshop upgrade cards, driven by lab multipliers, enhancement tiers, and sim inputs (`workshopDisplayedDamage`, `workshopDisplayedAttackSpeed`, `workshopSimCards`, `workshopSimModules`, `workshopLabDisplayOpts`).
- **Cards & modules**: Top-level **Cards** and **Modules** navigation plus dedicated workshop panels; card stars, relics, perk quantity, berserker inputs, and assist-module substats feed displayed-stat formulas.
- **Tools & settings**: Combined `ToolsSettingsPage` (lab import/export/compare tools plus app settings); setting to show or hide lab and workshop budget panels (`budgetPanelsVisibility`).
- **Unified CSV**: Workshop snapshot keys (`ws,…`) alongside lab rows in `towerUnifiedCsv` for single-file backup and restore.
- **Maintenance**: `scripts/gen-utility-enhance-coins.mjs` to regenerate utility enhancement coin tables from wiki scrape data.

### Changed

- **Navigation**: Main app tabs for Research, Workshop, Modules, Cards, and Tools/Settings; workshop toolbar portaled into the in-panel header on the Workshop tab.
- **Workshop budgets & compare**: Extended `workshopBudgetAggregates` and `workshopCompare` for enhance spend and sim state; defense and utility upgrade modules aligned with lab-display options.
- **Persistence**: `WorkshopPersistedV1` expanded with enhance levels, sim card/module fields, and `mainTab` (`upgrade` | `enhance` | `modules` | `cards`).
- **i18n**: EN/ES strings for enhance stats, simulators, budget toggle, and new navigation labels.

## [2.0.0] - 2026-05-14

### Added

- **Workshop**: dedicated workshop experience with per-stat upgrade tables (damage, defense, attack speed/range, crit and super-crit, multishot, bounce shot, rapid fire, rend armor, utility, etc.), Vitest coverage on key curves, and resource glyphs (coin, power stone).
- **Workshop tooling**: `towerUnifiedCsv` for unified tower CSV handling; `workshopCompare` and `workshopBudgetAggregates` for comparisons and rollups; integration with the main app navigation and styling.

### Changed

- **Labs & research**: extensions to lab level CSV helpers, share codec, parse payload behaviour, presets storage, research types/cards, lab compare dialog, and i18n strings to align with the larger workshop surface.

## [1.0.7] - 2026-05-14

### Changed

- **Research sections**: tighter vertical footprint for the expand/collapse-all control (padding, line-height, smaller checkbox) so the first head row does not add extra gap before the next section.

## [1.0.6] - 2026-05-13

### Added

- **CSV lab backup**: import and export custom lab levels as CSV (`key,level` rows, UTF-8 BOM on export for Excel) from the lab backup dialog, with `labLevelOverridesCsv` helpers and Vitest coverage.

### Changed

- **Lab compare**: pasted payloads are **CSV** (same format as file export), a **page URL with `?labs=`**, or a raw **`u`/`z` share string** only; JSON lab exports are no longer accepted. **Insert current workspace** pastes CSV. Parser errors and EN/ES copy updated accordingly (`parseLabLevelsPayload`, `LabCompareDialog`, `dictionary`).

## [1.0.5] - 2026-05-13

### Added

- **`Bot Bot - Cooldown`** marginal ladder in `tower-labs.json` (25 levels); bots card milestone **T6 90**; toolkit alias **`Bot Bot Cooldown`** → hyphenated key.

### Changed

- **`Super Crit Multi`**: canonical `tower-labs.json` lab key renamed from **Super Crit Mult**; legacy **`Super Crit Mult`** name still resolves via toolkit alias.
- **Research / labs**: expanded benefit tests and JSDoc; minor updates to research JSON exports, lab aggregates, Spanish benefit strings, and Vite config.

## [1.0.4] - 2026-05-13

### Added

- **Favicon set**: PNG icons at 16×16, 32×32, 180×180 (apple-touch-icon), 192×192, and 512×512, generated from `public/tower-site-logo.webp`. Browser tabs and iOS Home Screen now show a sharp brand icon instead of a downscaled WebP.
- **Web app manifest**: `public/manifest.webmanifest` declares name, theme/background colours (`#0b1220` = `--sr-bg`), and 192 / 512 / maskable-512 icons, enabling "Add to Home Screen" on Android with a clean adaptive icon.
- **`theme-color` meta** in `index.html` tints the mobile browser UI to the app's dark background.

### Changed

- Removed the leftover Vite-template `public/favicon.svg` (unrelated purple-lightning artwork) and the `<link rel="icon">` pointing at `tower-site-logo.webp`; `index.html` now declares the full favicon / apple-touch-icon / manifest set.

## [1.0.3] - 2026-05-13

### Added

- **Social link previews**: Open Graph and Twitter Card meta tags in `index.html` so URLs unfurl to a rich preview card in Discord, Slack, iMessage, and other unfurlers. Title, description, site name, locale, and a `summary_large_image` card are all declared.
- **OG banner**: `public/og-banner.png` (real PNG, 1200×630) used as the `og:image` / `twitter:image`; shows a stylized lab/research dashboard alongside the app brand and tagline.

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
