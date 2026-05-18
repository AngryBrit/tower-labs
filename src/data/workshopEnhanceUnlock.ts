/**
 * Enhancement unlock gates (wiki cumulative spend on category enhancements).
 */

import type { WorkshopPersistedV1 } from '../labPresetsStorage'
import { applyWorkshopDiscountToCoins } from '../types/research'
import {
  WORKSHOP_ENHANCE_DEFENSE_UPGRADE_ORDER,
  workshopEnhanceDefenseNextMarginalCoins,
  WORKSHOP_ENHANCE_HEALTH_REGEN_UNLOCK_DEFENSE_ENHANCE_SPENT_COINS,
  WORKSHOP_ENHANCE_DEFENSE_ABSOLUTE_UNLOCK_DEFENSE_ENHANCE_SPENT_COINS,
  WORKSHOP_ENHANCE_LAND_MINE_DAMAGE_UNLOCK_DEFENSE_ENHANCE_SPENT_COINS,
  WORKSHOP_ENHANCE_WALL_HEALTH_UNLOCK_DEFENSE_ENHANCE_SPENT_COINS,
  WORKSHOP_ENHANCE_ORB_SIZE_UNLOCK_DEFENSE_ENHANCE_SPENT_COINS,
  type WorkshopEnhanceDefenseUpgradeKey,
} from './workshopEnhanceDefense'
import {
  WORKSHOP_ENHANCE_UTILITY_UPGRADE_ORDER,
  workshopEnhanceUtilityNextMarginalCoins,
  WORKSHOP_ENHANCE_COIN_BONUS_UNLOCK_UTILITY_ENHANCE_SPENT_COINS,
  WORKSHOP_ENHANCE_CELLS_KILL_BONUS_UNLOCK_UTILITY_ENHANCE_SPENT_COINS,
  WORKSHOP_ENHANCE_FREE_UPGRADES_UNLOCK_UTILITY_ENHANCE_SPENT_COINS,
  WORKSHOP_ENHANCE_RECOVERY_PACKAGE_UNLOCK_UTILITY_ENHANCE_SPENT_COINS,
  WORKSHOP_ENHANCE_ENEMY_LEVEL_SKIP_UNLOCK_UTILITY_ENHANCE_SPENT_COINS,
  type WorkshopEnhanceUtilityUpgradeKey,
} from './workshopEnhanceUtility'
import {
  WORKSHOP_ENHANCE_ATTACK_UPGRADE_ORDER,
  workshopEnhanceAttackNextMarginalCoins,
  WORKSHOP_ENHANCE_REND_ARMOR_UNLOCK_DAMAGE_ENHANCE_SPENT_COINS,
  WORKSHOP_ENHANCE_CRIT_FACTOR_UNLOCK_ATTACK_ENHANCE_SPENT_COINS,
  WORKSHOP_ENHANCE_DAMAGE_PER_METER_UNLOCK_ATTACK_ENHANCE_SPENT_COINS,
  WORKSHOP_ENHANCE_SUPER_CRIT_MULT_UNLOCK_ATTACK_ENHANCE_SPENT_COINS,
  WORKSHOP_ENHANCE_ATTACK_SPEED_UNLOCK_ATTACK_ENHANCE_SPENT_COINS,
  type WorkshopEnhanceAttackUpgradeKey,
} from './workshopEnhanceAttack'

function sumMarginalSteps(
  nextAt: (completed: number) => number | undefined,
  fromLevel: number,
  toExclusive: number,
): number {
  let s = 0
  for (let L = fromLevel; L < toExclusive; L += 1) {
    const c = nextAt(L)
    if (c != null) s += c
  }
  return s
}

function defenseNextAt(
  key: WorkshopEnhanceDefenseUpgradeKey,
  discountPercent: number,
): (completed: number) => number | undefined {
  return (L) => {
    const raw = workshopEnhanceDefenseNextMarginalCoins(key, L)
    if (raw == null) return undefined
    if (!(discountPercent > 0)) return raw
    return applyWorkshopDiscountToCoins(raw, discountPercent)
  }
}

function utilityNextAt(
  key: WorkshopEnhanceUtilityUpgradeKey,
  discountPercent: number,
): (completed: number) => number | undefined {
  return (L) => {
    const raw = workshopEnhanceUtilityNextMarginalCoins(key, L)
    if (raw == null) return undefined
    if (!(discountPercent > 0)) return raw
    return applyWorkshopDiscountToCoins(raw, discountPercent)
  }
}

function attackNextAt(
  key: WorkshopEnhanceAttackUpgradeKey,
  discountPercent: number,
): (completed: number) => number | undefined {
  return (L) => {
    const raw = workshopEnhanceAttackNextMarginalCoins(key, L)
    if (raw == null) return undefined
    if (!(discountPercent > 0)) return raw
    return applyWorkshopDiscountToCoins(raw, discountPercent)
  }
}

const DEFENSE_UNLOCK_REQUIRED: Record<WorkshopEnhanceDefenseUpgradeKey, number> = {
  enhanceHealthLevel: 0,
  enhanceHealthRegenLevel: WORKSHOP_ENHANCE_HEALTH_REGEN_UNLOCK_DEFENSE_ENHANCE_SPENT_COINS,
  enhanceDefenseAbsoluteLevel: WORKSHOP_ENHANCE_DEFENSE_ABSOLUTE_UNLOCK_DEFENSE_ENHANCE_SPENT_COINS,
  enhanceLandMineDamageLevel: WORKSHOP_ENHANCE_LAND_MINE_DAMAGE_UNLOCK_DEFENSE_ENHANCE_SPENT_COINS,
  enhanceWallHealthLevel: WORKSHOP_ENHANCE_WALL_HEALTH_UNLOCK_DEFENSE_ENHANCE_SPENT_COINS,
  enhanceOrbSizeLevel: WORKSHOP_ENHANCE_ORB_SIZE_UNLOCK_DEFENSE_ENHANCE_SPENT_COINS,
}

const UTILITY_UNLOCK_REQUIRED: Record<WorkshopEnhanceUtilityUpgradeKey, number> = {
  enhanceCashBonusLevel: 0,
  enhanceCoinBonusLevel: WORKSHOP_ENHANCE_COIN_BONUS_UNLOCK_UTILITY_ENHANCE_SPENT_COINS,
  enhanceCellsKillBonusLevel: WORKSHOP_ENHANCE_CELLS_KILL_BONUS_UNLOCK_UTILITY_ENHANCE_SPENT_COINS,
  enhanceFreeUpgradesLevel: WORKSHOP_ENHANCE_FREE_UPGRADES_UNLOCK_UTILITY_ENHANCE_SPENT_COINS,
  enhanceRecoveryPackageLevel: WORKSHOP_ENHANCE_RECOVERY_PACKAGE_UNLOCK_UTILITY_ENHANCE_SPENT_COINS,
  enhanceEnemyLevelSkipLevel: WORKSHOP_ENHANCE_ENEMY_LEVEL_SKIP_UNLOCK_UTILITY_ENHANCE_SPENT_COINS,
}

const ATTACK_UNLOCK_REQUIRED: Record<WorkshopEnhanceAttackUpgradeKey, number> = {
  enhanceDamageLevel: 0,
  enhanceRendArmorLevel: WORKSHOP_ENHANCE_REND_ARMOR_UNLOCK_DAMAGE_ENHANCE_SPENT_COINS,
  enhanceCritFactorLevel: WORKSHOP_ENHANCE_CRIT_FACTOR_UNLOCK_ATTACK_ENHANCE_SPENT_COINS,
  enhanceDamagePerMeterLevel: WORKSHOP_ENHANCE_DAMAGE_PER_METER_UNLOCK_ATTACK_ENHANCE_SPENT_COINS,
  enhanceSuperCritMultLevel: WORKSHOP_ENHANCE_SUPER_CRIT_MULT_UNLOCK_ATTACK_ENHANCE_SPENT_COINS,
  enhanceAttackSpeedLevel: WORKSHOP_ENHANCE_ATTACK_SPEED_UNLOCK_ATTACK_ENHANCE_SPENT_COINS,
}

export function workshopEnhanceDefenseUnlockRequiredCoins(
  key: WorkshopEnhanceDefenseUpgradeKey,
): number {
  return DEFENSE_UNLOCK_REQUIRED[key]
}

export function workshopEnhanceUtilityUnlockRequiredCoins(
  key: WorkshopEnhanceUtilityUpgradeKey,
): number {
  return UTILITY_UNLOCK_REQUIRED[key]
}

export function workshopEnhanceAttackUnlockRequiredCoins(
  key: WorkshopEnhanceAttackUpgradeKey,
): number {
  return ATTACK_UNLOCK_REQUIRED[key]
}

export function workshopEnhanceAttackCategorySpentCoins(
  ws: WorkshopPersistedV1,
  enhancementAttackDiscountPercent = 0,
): number {
  let total = 0
  for (const key of WORKSHOP_ENHANCE_ATTACK_UPGRADE_ORDER) {
    const level = ws[key]
    total += sumMarginalSteps(attackNextAt(key, enhancementAttackDiscountPercent), 0, Math.max(0, level))
  }
  return total
}

export function workshopEnhanceAttackDamageEnhanceSpentCoins(
  ws: WorkshopPersistedV1,
  enhancementAttackDiscountPercent = 0,
): number {
  const level = ws.enhanceDamageLevel
  return sumMarginalSteps(
    attackNextAt('enhanceDamageLevel', enhancementAttackDiscountPercent),
    0,
    Math.max(0, level),
  )
}

/** Spend counted toward unlocking this attack enhancement (wiki damage-only vs category). */
export function workshopEnhanceAttackUnlockSpentCoins(
  key: WorkshopEnhanceAttackUpgradeKey,
  ws: WorkshopPersistedV1,
  enhancementAttackDiscountPercent = 0,
): number {
  if (key === 'enhanceRendArmorLevel') {
    return workshopEnhanceAttackDamageEnhanceSpentCoins(ws, enhancementAttackDiscountPercent)
  }
  return workshopEnhanceAttackCategorySpentCoins(ws, enhancementAttackDiscountPercent)
}

export function workshopEnhanceDefenseCategorySpentCoins(
  ws: WorkshopPersistedV1,
  enhancementDefenseDiscountPercent = 0,
): number {
  let total = 0
  for (const key of WORKSHOP_ENHANCE_DEFENSE_UPGRADE_ORDER) {
    const level = ws[key]
    total += sumMarginalSteps(defenseNextAt(key, enhancementDefenseDiscountPercent), 0, Math.max(0, level))
  }
  return total
}

export function workshopEnhanceUtilityCategorySpentCoins(
  ws: WorkshopPersistedV1,
  enhancementUtilityDiscountPercent = 0,
): number {
  let total = 0
  for (const key of WORKSHOP_ENHANCE_UTILITY_UPGRADE_ORDER) {
    const level = ws[key]
    total += sumMarginalSteps(utilityNextAt(key, enhancementUtilityDiscountPercent), 0, Math.max(0, level))
  }
  return total
}

export function workshopEnhanceDefenseIsUnlocked(
  key: WorkshopEnhanceDefenseUpgradeKey,
  categorySpentCoins: number,
): boolean {
  return categorySpentCoins >= DEFENSE_UNLOCK_REQUIRED[key]
}

export function workshopEnhanceUtilityIsUnlocked(
  key: WorkshopEnhanceUtilityUpgradeKey,
  categorySpentCoins: number,
): boolean {
  return categorySpentCoins >= UTILITY_UNLOCK_REQUIRED[key]
}

export function workshopEnhanceAttackIsUnlocked(
  key: WorkshopEnhanceAttackUpgradeKey,
  unlockSpentCoins: number,
): boolean {
  return unlockSpentCoins >= ATTACK_UNLOCK_REQUIRED[key]
}

export function workshopEnhanceDefenseUnlockRemainingCoins(
  key: WorkshopEnhanceDefenseUpgradeKey,
  categorySpentCoins: number,
): number {
  return Math.max(0, DEFENSE_UNLOCK_REQUIRED[key] - categorySpentCoins)
}

export function workshopEnhanceUtilityUnlockRemainingCoins(
  key: WorkshopEnhanceUtilityUpgradeKey,
  categorySpentCoins: number,
): number {
  return Math.max(0, UTILITY_UNLOCK_REQUIRED[key] - categorySpentCoins)
}

export function workshopEnhanceAttackUnlockRemainingCoins(
  key: WorkshopEnhanceAttackUpgradeKey,
  unlockSpentCoins: number,
): number {
  return Math.max(0, ATTACK_UNLOCK_REQUIRED[key] - unlockSpentCoins)
}
