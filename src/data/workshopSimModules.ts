/**
 * Assist **Modules** sim for workshop (cannon damage % from module labs).
 */

import type { ResearchData } from '../types/research'
import { getEffectiveLevel, getLevelBounds } from '../types/research'

export type WorkshopAssistModuleSlot = 'cannon' | 'armor' | 'generator' | 'core'

export const WORKSHOP_ASSIST_MODULE_SLOTS: readonly WorkshopAssistModuleSlot[] = [
  'cannon',
  'armor',
  'generator',
  'core',
] as const

export const WORKSHOP_ASSIST_MODULE_MAX_LEVEL = 999

export const ASSIST_MODULE_LEVEL_KEY = {
  cannon: 'simCannonModuleLevel',
  armor: 'simArmorModuleLevel',
  generator: 'simGeneratorModuleLevel',
  core: 'simCoreModuleLevel',
} as const satisfies Record<
  WorkshopAssistModuleSlot,
  | 'simCannonModuleLevel'
  | 'simArmorModuleLevel'
  | 'simGeneratorModuleLevel'
  | 'simCoreModuleLevel'
>

export function workshopAssistModuleLevel(
  ws: { [K in (typeof ASSIST_MODULE_LEVEL_KEY)[WorkshopAssistModuleSlot]]: number },
  slot: WorkshopAssistModuleSlot,
): number {
  return ws[ASSIST_MODULE_LEVEL_KEY[slot]]
}

export function clampWorkshopAssistModuleLevel(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(WORKSHOP_ASSIST_MODULE_MAX_LEVEL, Math.trunc(n)))
}

const SUBSTATS_LAB: Record<WorkshopAssistModuleSlot, string> = {
  cannon: 'Assist Module Substats - Cannon',
  armor: 'Assist Module Substats - Armor',
  generator: 'Assist Module Substats - Generator',
  core: 'Assist Module Substats - Core',
}

const BONUS_LAB: Record<WorkshopAssistModuleSlot, string> = {
  cannon: 'Assist Module Bonus - Cannon',
  armor: 'Assist Module Bonus - Armor',
  generator: 'Assist Module Bonus - Generator',
  core: 'Assist Module Bonus - Core',
}

function moduleLabLevel(
  data: ResearchData,
  overrides: Record<string, number>,
  labName: string,
): number {
  for (let si = 0; si < data.sections.length; si++) {
    const section = data.sections[si]!
    if (section.sectionSlug !== 'modules') continue
    for (let ii = 0; ii < section.items.length; ii++) {
      const item = section.items[ii]!
      if (item.name !== labName) continue
      const eff = getEffectiveLevel(si, ii, item, overrides)
      const { max } = getLevelBounds(item)
      return max > 0 ? Math.min(Math.max(0, eff), max) : Math.max(0, eff)
    }
  }
  return 0
}

/** Wiki assist module labs: **n%** per level → decimal **n / 100** (substats + bonus). */
export function workshopAssistModuleLabPercentPoints(
  data: ResearchData,
  overrides: Record<string, number>,
  slot: WorkshopAssistModuleSlot,
): { substatsPercent: number; bonusPercent: number; totalPercent: number } {
  const sub = moduleLabLevel(data, overrides, SUBSTATS_LAB[slot])
  const bon = moduleLabLevel(data, overrides, BONUS_LAB[slot])
  return {
    substatsPercent: sub,
    bonusPercent: bon,
    totalPercent: sub + bon,
  }
}

/** **(1 + Cannon Module %)** term when slot is cannon; otherwise 0 added to cannon term. */
export function workshopCannonModulePercentFromLabs(
  data: ResearchData,
  overrides: Record<string, number>,
  slot: WorkshopAssistModuleSlot,
): number {
  if (slot !== 'cannon') return 0
  const { totalPercent } = workshopAssistModuleLabPercentPoints(data, overrides, slot)
  return totalPercent / 100
}
