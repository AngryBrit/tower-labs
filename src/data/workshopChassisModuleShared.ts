/**
 * Shared chassis module catalog types (Cannon, Armor, …).
 */

export type WorkshopChassisModuleRarity = 'epic' | 'legendary' | 'mythic' | 'ancestral'

export const WORKSHOP_CHASSIS_MODULE_RARITIES: readonly WorkshopChassisModuleRarity[] = [
  'epic',
  'legendary',
  'mythic',
  'ancestral',
] as const

/** CSS class per chassis module rarity (see `.modules-rarity--*` in App.css). */
export const WORKSHOP_CHASSIS_MODULE_RARITY_CLASS: Record<
  WorkshopChassisModuleRarity,
  `modules-rarity--${WorkshopChassisModuleRarity}`
> = {
  epic: 'modules-rarity--epic',
  legendary: 'modules-rarity--legendary',
  mythic: 'modules-rarity--mythic',
  ancestral: 'modules-rarity--ancestral',
}

export type WorkshopChassisModuleValueKind =
  | 'percent'
  | 'count'
  | 'seconds'
  | 'mult'
  | 'damageMult'
  | 'addMeters'

export type WorkshopChassisModuleDef = {
  name: string
  /** Wiki ability; `[x]` is replaced with the tier value. */
  description: string
  kind: WorkshopChassisModuleValueKind
  values: Record<WorkshopChassisModuleRarity, number>
}

function formatNum(n: number): string {
  if (Number.isInteger(n)) return String(n)
  const t = n.toFixed(2)
  return t.replace(/\.?0+$/, '')
}

export function formatWorkshopChassisModuleValue(
  kind: WorkshopChassisModuleValueKind,
  value: number,
): string {
  switch (kind) {
    case 'percent':
      return `${formatNum(value)}%`
    case 'seconds':
      return `${formatNum(value)}s`
    case 'mult':
      return `×${formatNum(value)}`
    case 'damageMult':
      return `${formatNum(value)}x`
    case 'addMeters':
      return `+${formatNum(value)}m`
    case 'count':
    default:
      return formatNum(value)
  }
}

/** Ability text with `[x]` filled for the given rarity. */
export function formatWorkshopChassisModuleAbility(
  def: WorkshopChassisModuleDef,
  rarity: WorkshopChassisModuleRarity,
): string {
  const v = def.values[rarity]
  return def.description.replace('[x]', formatWorkshopChassisModuleValue(def.kind, v))
}
