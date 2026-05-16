/**
 * Cannon submodule **Attack Speed** flat add (wiki Sub-Module Effects table).
 */

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

/** Flat attack speed added inside **(Workshop × Lab × Card + …)**. */
export const CANNON_SUBMODULE_ATTACK_SPEED_ADD: Record<
  WorkshopSubmoduleRarity,
  number
> = {
  common: 0.3,
  rare: 0.5,
  epic: 0.7,
  legendary: 1,
  mythic: 3,
  ancestral: 5,
}

export function cannonSubmoduleAttackSpeedAdd(
  rarity: WorkshopSubmoduleRarity | 'none',
): number {
  if (rarity === 'none') return 0
  return CANNON_SUBMODULE_ATTACK_SPEED_ADD[rarity]
}
