import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_THEME_SELECTION,
  type ThemeCategory,
} from './data/gameThemes'

export const THEME_SELECTION_STORAGE_KEY = 'tower-export-theme-selection-v2'

export type ThemeSelectionState = Record<ThemeCategory, string>

const CHANGE_EVENT = 'tower-export-theme-selection-change'

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null
}

export function readThemeSelection(): ThemeSelectionState {
  try {
    const raw = localStorage.getItem(THEME_SELECTION_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_THEME_SELECTION }
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed)) return { ...DEFAULT_THEME_SELECTION }
    return {
      tower:
        typeof parsed.tower === 'string' ? parsed.tower : DEFAULT_THEME_SELECTION.tower,
      background:
        typeof parsed.background === 'string'
          ? parsed.background
          : DEFAULT_THEME_SELECTION.background,
      music:
        typeof parsed.music === 'string' ? parsed.music : DEFAULT_THEME_SELECTION.music,
      menus:
        typeof parsed.menus === 'string' ? parsed.menus : DEFAULT_THEME_SELECTION.menus,
      banners:
        typeof parsed.banners === 'string'
          ? parsed.banners
          : DEFAULT_THEME_SELECTION.banners,
      guardian:
        typeof parsed.guardian === 'string'
          ? parsed.guardian
          : DEFAULT_THEME_SELECTION.guardian,
    }
  } catch {
    return { ...DEFAULT_THEME_SELECTION }
  }
}

export function writeThemeSelection(next: ThemeSelectionState): void {
  try {
    localStorage.setItem(THEME_SELECTION_STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
}

export function useThemeSelection(): [
  ThemeSelectionState,
  (category: ThemeCategory, themeId: string) => void,
] {
  const [selection, setSelection] = useState<ThemeSelectionState>(readThemeSelection)

  useEffect(() => {
    const sync = () => setSelection(readThemeSelection())
    window.addEventListener(CHANGE_EVENT, sync)
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_SELECTION_STORAGE_KEY || e.key === null) sync()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const selectTheme = useCallback((category: ThemeCategory, themeId: string) => {
    setSelection((prev) => {
      const next = { ...prev, [category]: themeId }
      writeThemeSelection(next)
      return next
    })
  }, [])

  return [selection, selectTheme]
}
