/**
 * Workshop **defense** upgrades: modeled with the same marginal **coin** curve as workshop damage
 * (`workshopDamageNextMarginalCoins`) until per-stat tables are wired. **Value** readouts reuse the
 * lab calculator stepping from `types/research.ts` where a matching defense lab exists; a few rows
 * use interim linear placeholders (marked in the switch).
 */

import { workshopDamageNextMarginalCoins } from './workshopDamage'
import { WORKSHOP_DAMAGE_MAX_LEVEL } from './workshopDamage'
import {
  battleConditionsGroup1ResistanceValueDisplay,
  criticalFactorValueDisplay,
  defensePercentValueDisplay,
  extraExtraOrbsBonusDisplay,
  garlicThornsPercentValueDisplay,
  innerMineBlastRadiusValueDisplay,
  innerMineRotationSpeedValueDisplay,
  landMineDamagePercentDisplay,
  orbsSpeedPlusValueDisplay,
  shockwaveSizePlusDisplay,
  wallHealthPercentValueDisplay,
  wallRebuildSecondsDisplay,
} from '../types/research'

export type WorkshopDefenseUpgradeKey =
  | 'healthLevel'
  | 'healthRegenLevel'
  | 'defensePercentLevel'
  | 'defenseAbsoluteLevel'
  | 'thornDamageLevel'
  | 'lifestealLevel'
  | 'knockbackChanceLevel'
  | 'knockbackForceLevel'
  | 'orbSpeedLevel'
  | 'orbsLevel'
  | 'shockwaveSizeLevel'
  | 'shockwaveFrequencyLevel'
  | 'landMineChanceLevel'
  | 'landMineDamageLevel'
  | 'landMineRadiusLevel'
  | 'deathDefyLevel'
  | 'wallHealthLevel'
  | 'wallRebuildLevel'

export const WORKSHOP_DEFENSE_UPGRADE_ORDER: readonly WorkshopDefenseUpgradeKey[] = [
  'healthLevel',
  'healthRegenLevel',
  'defensePercentLevel',
  'defenseAbsoluteLevel',
  'thornDamageLevel',
  'lifestealLevel',
  'knockbackChanceLevel',
  'knockbackForceLevel',
  'orbSpeedLevel',
  'orbsLevel',
  'shockwaveSizeLevel',
  'shockwaveFrequencyLevel',
  'landMineChanceLevel',
  'landMineDamageLevel',
  'landMineRadiusLevel',
  'deathDefyLevel',
  'wallHealthLevel',
  'wallRebuildLevel',
]

function cap(level: number, max: number): number {
  if (!Number.isFinite(level)) return 0
  return Math.min(Math.max(0, Math.trunc(level)), max)
}

/** Max workshop level per defense row (aligned with defense / utility labs where applicable). */
export function workshopDefenseMaxLevel(key: WorkshopDefenseUpgradeKey): number {
  switch (key) {
    case 'healthLevel':
    case 'healthRegenLevel':
    case 'defenseAbsoluteLevel':
      return 100
    case 'defensePercentLevel':
      return 50
    case 'thornDamageLevel':
      return 10
    case 'lifestealLevel':
    case 'knockbackChanceLevel':
    case 'knockbackForceLevel':
      return 50
    case 'orbSpeedLevel':
    case 'shockwaveSizeLevel':
    case 'shockwaveFrequencyLevel':
    case 'landMineDamageLevel':
    case 'landMineRadiusLevel':
    case 'wallRebuildLevel':
      return 20
    case 'orbsLevel':
      return 10
    case 'landMineChanceLevel':
      return 35
    case 'deathDefyLevel':
      return 10
    case 'wallHealthLevel':
      return 50
  }
}

export function workshopDefenseClampLevel(key: WorkshopDefenseUpgradeKey, n: number): number {
  return cap(n, workshopDefenseMaxLevel(key))
}

/** Interim display (not yet matched to a published lab curve). */
function lifestealPercentDisplay(level: number, max: number): string {
  const L = cap(level, max)
  return `+${(0.04 * L).toFixed(2)}%`
}

function knockbackChanceDisplay(level: number, max: number): string {
  const L = cap(level, max)
  return `+${(0.1 * L).toFixed(2)}%`
}

function knockbackForceMultiplierDisplay(level: number, max: number): string {
  const L = cap(level, max)
  const mult = 1 + 0.02 * L
  return `x${mult.toFixed(2)}`
}

function landMineChanceDisplay(level: number, max: number): string {
  const L = cap(level, max)
  return `+${(0.286 * L).toFixed(2)}%`
}

export function workshopDefenseStatDisplay(
  key: WorkshopDefenseUpgradeKey,
  completedLevels: number,
): string {
  const max = workshopDefenseMaxLevel(key)
  switch (key) {
    case 'healthLevel':
    case 'healthRegenLevel':
    case 'defenseAbsoluteLevel':
      return criticalFactorValueDisplay(completedLevels, max)
    case 'defensePercentLevel':
      return defensePercentValueDisplay(completedLevels, max)
    case 'thornDamageLevel':
      return garlicThornsPercentValueDisplay(completedLevels, max)
    case 'lifestealLevel':
      return lifestealPercentDisplay(completedLevels, max)
    case 'knockbackChanceLevel':
      return knockbackChanceDisplay(completedLevels, max)
    case 'knockbackForceLevel':
      return knockbackForceMultiplierDisplay(completedLevels, max)
    case 'orbSpeedLevel':
      return orbsSpeedPlusValueDisplay(completedLevels, max)
    case 'orbsLevel':
      return extraExtraOrbsBonusDisplay(completedLevels, max)
    case 'shockwaveSizeLevel':
      return shockwaveSizePlusDisplay(completedLevels, max)
    case 'shockwaveFrequencyLevel':
      return innerMineRotationSpeedValueDisplay(completedLevels, max)
    case 'landMineChanceLevel':
      return landMineChanceDisplay(completedLevels, max)
    case 'landMineDamageLevel':
      return landMineDamagePercentDisplay(completedLevels, max)
    case 'landMineRadiusLevel':
      return innerMineBlastRadiusValueDisplay(completedLevels, max)
    case 'deathDefyLevel':
      return battleConditionsGroup1ResistanceValueDisplay(completedLevels, max)
    case 'wallHealthLevel':
      return wallHealthPercentValueDisplay(completedLevels, max)
    case 'wallRebuildLevel':
      return wallRebuildSecondsDisplay(completedLevels, max)
  }
}

/**
 * Coins for the next purchase when `completedLevels` upgrades are already done.
 * Reuses the damage workshop marginal curve, indexed in a safe range.
 */
export function workshopDefenseNextMarginalCoins(
  key: WorkshopDefenseUpgradeKey,
  completedLevels: number,
): number | undefined {
  const max = workshopDefenseMaxLevel(key)
  if (completedLevels < 0 || completedLevels >= max) return undefined
  const idx = Math.min(completedLevels, WORKSHOP_DAMAGE_MAX_LEVEL - 1)
  return workshopDamageNextMarginalCoins(idx)
}
