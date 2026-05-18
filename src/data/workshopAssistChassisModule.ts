/**
 * Second chassis module (assist) per hub slot — weaker copy of main module effects.
 */

import type { WorkshopChassisModuleRarity } from './workshopChassisModuleShared'
import {
  sanitizeChassisModuleId,
  sanitizeChassisModuleRarity,
  workshopChassisModuleDefForSlot,
  workshopChassisModuleSelection,
  type WorkshopChassisModuleSelection,
} from './workshopChassisModuleSelection'
import type { WorkshopAssistModuleSlot } from './workshopSimModules'

export const ASSIST_STONE_EFFICIENCY_MAX = 70
export const ASSIST_STONE_EFFICIENCY_DEFAULT = 1

export const ASSIST_CHASSIS_UNLOCKED_KEY = {
  cannon: 'simCannonAssistUnlocked',
  armor: 'simArmorAssistUnlocked',
  generator: 'simGeneratorAssistUnlocked',
  core: 'simCoreAssistUnlocked',
} as const

export const ASSIST_CHASSIS_MODULE_ID_KEY = {
  cannon: 'simCannonAssistChassisModuleId',
  armor: 'simArmorAssistChassisModuleId',
  generator: 'simGeneratorAssistChassisModuleId',
  core: 'simCoreAssistChassisModuleId',
} as const

export const ASSIST_CHASSIS_MODULE_RARITY_KEY = {
  cannon: 'simCannonAssistChassisModuleRarity',
  armor: 'simArmorAssistChassisModuleRarity',
  generator: 'simGeneratorAssistChassisModuleRarity',
  core: 'simCoreAssistChassisModuleRarity',
} as const

export const ASSIST_STONE_EFFICIENCY_KEY = {
  cannon: 'simCannonAssistStoneEfficiency',
  armor: 'simArmorAssistStoneEfficiency',
  generator: 'simGeneratorAssistStoneEfficiency',
  core: 'simCoreAssistStoneEfficiency',
} as const

export type WorkshopAssistChassisPersisted = {
  [K in (typeof ASSIST_CHASSIS_UNLOCKED_KEY)[WorkshopAssistModuleSlot]]: boolean
} & {
  [K in (typeof ASSIST_CHASSIS_MODULE_ID_KEY)[WorkshopAssistModuleSlot]]: string
} & {
  [K in (typeof ASSIST_CHASSIS_MODULE_RARITY_KEY)[WorkshopAssistModuleSlot]]: string
} & {
  [K in (typeof ASSIST_STONE_EFFICIENCY_KEY)[WorkshopAssistModuleSlot]]: number
}

export function clampAssistStoneEfficiency(n: number): number {
  if (!Number.isFinite(n)) return ASSIST_STONE_EFFICIENCY_DEFAULT
  return Math.max(0, Math.min(ASSIST_STONE_EFFICIENCY_MAX, Math.trunc(n)))
}

export function workshopAssistChassisModuleSelection(
  ws: WorkshopAssistChassisPersisted,
  slot: WorkshopAssistModuleSlot,
): WorkshopChassisModuleSelection & { unlocked: boolean; stoneEfficiency: number } {
  const idKey = ASSIST_CHASSIS_MODULE_ID_KEY[slot]
  const rKey = ASSIST_CHASSIS_MODULE_RARITY_KEY[slot]
  const unlocked = ws[ASSIST_CHASSIS_UNLOCKED_KEY[slot]] === true
  return {
    unlocked,
    stoneEfficiency: clampAssistStoneEfficiency(ws[ASSIST_STONE_EFFICIENCY_KEY[slot]]),
    moduleId: unlocked ? sanitizeChassisModuleId(slot, ws[idKey]) : null,
    rarity: sanitizeChassisModuleRarity(ws[rKey]),
  }
}

export function assistModuleConflictsWithMain(
  slot: WorkshopAssistModuleSlot,
  ws: WorkshopAssistChassisPersisted & Parameters<typeof workshopChassisModuleSelection>[0],
  assistModuleId: string,
): boolean {
  const main = workshopChassisModuleSelection(ws, slot)
  return main.moduleId != null && main.moduleId === assistModuleId
}

export function defaultAssistChassisFields(): WorkshopAssistChassisPersisted {
  return {
    simCannonAssistUnlocked: true,
    simArmorAssistUnlocked: true,
    simGeneratorAssistUnlocked: true,
    simCoreAssistUnlocked: true,
    simCannonAssistChassisModuleId: '',
    simArmorAssistChassisModuleId: '',
    simGeneratorAssistChassisModuleId: '',
    simCoreAssistChassisModuleId: '',
    simCannonAssistChassisModuleRarity: 'epic',
    simArmorAssistChassisModuleRarity: 'epic',
    simGeneratorAssistChassisModuleRarity: 'epic',
    simCoreAssistChassisModuleRarity: 'epic',
    simCannonAssistStoneEfficiency: ASSIST_STONE_EFFICIENCY_DEFAULT,
    simArmorAssistStoneEfficiency: ASSIST_STONE_EFFICIENCY_DEFAULT,
    simGeneratorAssistStoneEfficiency: ASSIST_STONE_EFFICIENCY_DEFAULT,
    simCoreAssistStoneEfficiency: ASSIST_STONE_EFFICIENCY_DEFAULT,
  }
}

/** Assist unique-effect efficiency as a fraction (1% → 0.01). */
export function assistChassisEfficiencyFraction(stoneEfficiency: number): number {
  return clampAssistStoneEfficiency(stoneEfficiency) / 100
}

export function formatAssistChassisModuleLabel(
  slot: WorkshopAssistModuleSlot,
  moduleId: string,
  rarity: WorkshopChassisModuleRarity,
): string {
  const def = workshopChassisModuleDefForSlot(slot, moduleId)
  return `${def.name} (${rarity})`
}
