/**
 * Sub-module effects helpers (wiki Sub-Module Effects tables).
 */

import { cannonSubmoduleAttackSpeedByRarity } from './workshopSubmoduleCatalog'

export type WorkshopSubmoduleRarity =
  | 'common'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythic'
  | 'ancestral'

export const WORKSHOP_SUBMODULE_RARITIES: readonly WorkshopSubmoduleRarity[] = [
  'common',
  'rare',
  'epic',
  'legendary',
  'mythic',
  'ancestral',
] as const

/** CSS class per rarity (see `.modules-rarity--*` in App.css). */
export const WORKSHOP_SUBMODULE_RARITY_CLASS: Record<
  WorkshopSubmoduleRarity,
  `modules-rarity--${WorkshopSubmoduleRarity}`
> = {
  common: 'modules-rarity--common',
  rare: 'modules-rarity--rare',
  epic: 'modules-rarity--epic',
  legendary: 'modules-rarity--legendary',
  mythic: 'modules-rarity--mythic',
  ancestral: 'modules-rarity--ancestral',
}

/** Flat attack speed added inside **(Workshop × Lab × Card + …)**. */
export const CANNON_SUBMODULE_ATTACK_SPEED_ADD: Record<
  WorkshopSubmoduleRarity,
  number
> = cannonSubmoduleAttackSpeedByRarity()

export function cannonSubmoduleAttackSpeedAdd(
  rarity: WorkshopSubmoduleRarity | 'none',
): number {
  if (rarity === 'none') return 0
  return CANNON_SUBMODULE_ATTACK_SPEED_ADD[rarity]
}
