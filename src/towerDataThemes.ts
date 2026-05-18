import { DEFAULT_THEME_SELECTION, type ThemeCategory } from './data/gameThemes'
import {
  readThemeOwnedIds,
  writeThemeOwnedIds,
} from './themeOwnedStorage'
import {
  readThemeSelection,
  writeThemeSelection,
  type ThemeSelectionState,
} from './themeSelectionStorage'

export type TowerThemesSnapshot = {
  /** Omitted when only owned catalog is imported (e.g. tower CSV). */
  selection?: ThemeSelectionState
  ownedIds: string[]
}

const THEME_CATEGORIES: readonly ThemeCategory[] = [
  'tower',
  'background',
  'music',
  'menus',
  'banners',
  'guardian',
]

export function readTowerThemesSnapshot(): TowerThemesSnapshot {
  return {
    selection: readThemeSelection(),
    ownedIds: [...readThemeOwnedIds()].sort(),
  }
}

export function applyTowerThemes(snapshot: TowerThemesSnapshot | undefined): void {
  if (!snapshot) return
  if (snapshot.selection !== undefined) writeThemeSelection(snapshot.selection)
  writeThemeOwnedIds(new Set(snapshot.ownedIds))
}

export function sanitizeThemeSelection(raw: unknown): ThemeSelectionState {
  const d = { ...DEFAULT_THEME_SELECTION }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return d
  const o = raw as Record<string, unknown>
  for (const cat of THEME_CATEGORIES) {
    const v = o[cat]
    if (typeof v === 'string' && v.trim()) d[cat] = v.trim()
  }
  return d
}

export function sanitizeThemeOwnedIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [...readThemeOwnedIds()]
  return [
    ...new Set(
      raw.filter((x): x is string => typeof x === 'string' && x.trim().length > 0),
    ),
  ]
    .map((s) => s.trim())
    .sort()
}

export function themesEqual(a: TowerThemesSnapshot, b: TowerThemesSnapshot): boolean {
  if (a.selection !== undefined && b.selection !== undefined) {
    if (JSON.stringify(a.selection) !== JSON.stringify(b.selection)) return false
  } else if (a.selection !== undefined || b.selection !== undefined) {
    return false
  }
  if (a.ownedIds.length !== b.ownedIds.length) return false
  for (let i = 0; i < a.ownedIds.length; i++) {
    if (a.ownedIds[i] !== b.ownedIds[i]) return false
  }
  return true
}

export function defaultTowerThemesSnapshot(): TowerThemesSnapshot {
  return {
    selection: { ...DEFAULT_THEME_SELECTION },
    ownedIds: [...readThemeOwnedIds()].sort(),
  }
}
