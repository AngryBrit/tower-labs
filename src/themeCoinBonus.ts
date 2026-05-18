import { GAME_THEMES, type ThemeCategory } from './data/gameThemes'

/** Categories that contribute to the passive coin multiplier. */
export const THEME_COIN_BONUS_CATEGORIES = [
  'tower',
  'background',
  'music',
  'menus',
  'banners',
  'guardian',
] as const satisfies readonly ThemeCategory[]

export type ThemeCoinBonusCategory = (typeof THEME_COIN_BONUS_CATEGORIES)[number]

/** Per-owned decimal rate: Coin bonus += rate × quantity (wiki). */
export const THEME_COIN_BONUS_RATE: Record<ThemeCoinBonusCategory, number> = {
  tower: 0.004,
  background: 0.008,
  music: 0.006,
  menus: 0.006,
  banners: 0.006,
  guardian: 0.006,
}

/** Tab label % (rate × 100). */
export const THEME_COIN_BONUS_PERCENT: Record<ThemeCoinBonusCategory, number> = {
  tower: 0.4,
  background: 0.8,
  music: 0.6,
  menus: 0.6,
  banners: 0.6,
  guardian: 0.6,
}

export type ThemeOwnedQuantities = Record<ThemeCoinBonusCategory, number>

export function countOwnedThemesForCoinBonus(
  ownedIds: ReadonlySet<string>,
): ThemeOwnedQuantities {
  const counts: ThemeOwnedQuantities = {
    tower: 0,
    background: 0,
    music: 0,
    menus: 0,
    banners: 0,
    guardian: 0,
  }
  for (const entry of GAME_THEMES) {
    if (!ownedIds.has(entry.id)) continue
    if (entry.category in counts) {
      counts[entry.category as ThemeCoinBonusCategory] += 1
    }
  }
  return counts
}

/**
 * Coin Bonus = 1 + 0.004×Tower + 0.008×Background + 0.006×Music + 0.006×Menus + 0.006×Banners + 0.006×Guardian
 * (quantities = owned theme counts per category)
 */
export function computeThemeCoinBonusMultiplier(
  quantities: ThemeOwnedQuantities,
): number {
  let bonus = 1
  for (const category of THEME_COIN_BONUS_CATEGORIES) {
    bonus += THEME_COIN_BONUS_RATE[category] * quantities[category]
  }
  return bonus
}

/** e.g. 1.024 → "×1.024" */
export function formatThemeCoinBonusMultiplier(multiplier: number): string {
  const decimals = multiplier >= 10 ? 2 : 3
  const trimmed = multiplier.toFixed(decimals).replace(/\.?0+$/, '')
  return `×${trimmed}`
}

/** Added bonus above 1.0 as a percentage string, e.g. 0.024 → "+2.4%". */
export function formatThemeCoinBonusPercentAboveBase(multiplier: number): string {
  const pct = (multiplier - 1) * 100
  const decimals = pct >= 10 ? 1 : 2
  const text = pct.toFixed(decimals).replace(/\.?0+$/, '')
  return `+${text}%`
}
