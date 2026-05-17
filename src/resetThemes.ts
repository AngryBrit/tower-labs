import { DEFAULT_THEME_SELECTION } from './data/gameThemes'
import { writeThemeOwnedIds } from './themeOwnedStorage'
import { writeThemeSelection } from './themeSelectionStorage'

/** Restore default active selections and clear all owned (FALSE) flags. */
export function resetAllThemes(): void {
  writeThemeSelection({ ...DEFAULT_THEME_SELECTION })
  writeThemeOwnedIds(new Set())
}
