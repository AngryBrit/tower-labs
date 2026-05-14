/**
 * Workshop **defense** upgrades: **Health**, **Health Regen**, and **Defense %** use dedicated wiki
 * ladders (`workshopHealth`, `workshopHealthRegen`, `workshopDefensePercent`, `workshopDefenseAbsolute`,
 * `workshopThornDamage`, `workshopLifesteal`, `workshopKnockbackChance`, `workshopKnockbackForce`). Other rows reuse the workshop damage marginal curve as
 * an interim placeholder.
 */

import { formatCoinAbbrev } from '../labCosts'
import { workshopDamageNextMarginalCoins } from './workshopDamage'
import { WORKSHOP_DAMAGE_MAX_LEVEL } from './workshopDamage'
import {
  WORKSHOP_HEALTH_REGEN_MAX_LEVEL,
  workshopHealthRegenNextMarginalCoins,
  workshopHealthRegenStatDisplay,
  workshopHealthRegenStatValue,
} from './workshopHealthRegen'
import {
  WORKSHOP_HEALTH_MAX_LEVEL,
  workshopHealthNextMarginalCoins,
  workshopHealthStatDisplay,
  workshopHealthStatValue,
} from './workshopHealth'
import {
  WORKSHOP_DEFENSE_PERCENT_MAX_LEVEL,
  workshopDefensePercentNextMarginalCoins,
  workshopDefensePercentStatDisplay,
  workshopDefensePercentStatPercentPoints,
} from './workshopDefensePercent'
import {
  WORKSHOP_DEFENSE_ABSOLUTE_MAX_LEVEL,
  workshopDefenseAbsoluteNextMarginalCoins,
  workshopDefenseAbsoluteStatDisplay,
} from './workshopDefenseAbsolute'
import {
  WORKSHOP_THORN_DAMAGE_MAX_LEVEL,
  workshopThornDamageNextMarginalCoins,
  workshopThornDamageStatDisplay,
  workshopThornDamageStatPercentPoints,
} from './workshopThornDamage'
import {
  WORKSHOP_LIFESTEAL_MAX_LEVEL,
  workshopLifestealNextMarginalCoins,
  workshopLifestealStatDisplay,
} from './workshopLifesteal'
import {
  WORKSHOP_KNOCKBACK_CHANCE_MAX_LEVEL,
  workshopKnockbackChanceNextMarginalCoins,
  workshopKnockbackChanceStatDisplay,
} from './workshopKnockbackChance'
import {
  WORKSHOP_KNOCKBACK_FORCE_MAX_LEVEL,
  workshopKnockbackForceNextMarginalCoins,
  workshopKnockbackForceStatDisplay,
} from './workshopKnockbackForce'
import {
  battleConditionsGroup1ResistanceValueDisplay,
  extraExtraOrbsBonusDisplay,
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
      return WORKSHOP_HEALTH_MAX_LEVEL
    case 'healthRegenLevel':
      return WORKSHOP_HEALTH_REGEN_MAX_LEVEL
    case 'defenseAbsoluteLevel':
      return WORKSHOP_DEFENSE_ABSOLUTE_MAX_LEVEL
    case 'defensePercentLevel':
      return WORKSHOP_DEFENSE_PERCENT_MAX_LEVEL
    case 'thornDamageLevel':
      return WORKSHOP_THORN_DAMAGE_MAX_LEVEL
    case 'lifestealLevel':
      return WORKSHOP_LIFESTEAL_MAX_LEVEL
    case 'knockbackChanceLevel':
      return WORKSHOP_KNOCKBACK_CHANCE_MAX_LEVEL
    case 'knockbackForceLevel':
      return WORKSHOP_KNOCKBACK_FORCE_MAX_LEVEL
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

/** Optional simulated Defense labs for workshop **Value** display (coin costs unchanged). */
export type WorkshopDefenseStatDisplayOpts = {
  healthLabMultiplier?: number
  healthRegenLabMultiplier?: number
  /** Additive **Garlic Thorns** lab % (percent points), summed with workshop Thorn Damage. */
  thornDamageLabPercentPoints?: number
  /** Additive **Defense %** lab (percent points), summed with workshop Defense %. */
  defensePercentLabPercentPoints?: number
}

/**
 * When wiki **Value** is **0**, multiplying by a Health-style lab still yields **0** — append **`×m`**
 * so the workshop row reflects the simulated lab like the research card.
 */
function formatAbbrevWithHealthStyleLabMultiplier(base: number, labMult: number): string {
  const rounded = Math.round(base * labMult)
  const main = formatCoinAbbrev(rounded)
  if (base === 0 && labMult > 1 + 1e-9) {
    return `${main} ×${labMult.toFixed(2)}`
  }
  return main
}

/** Interim display (not yet matched to a published lab curve). */
function landMineChanceDisplay(level: number, max: number): string {
  const L = cap(level, max)
  return `+${(0.286 * L).toFixed(2)}%`
}

export function workshopDefenseStatDisplay(
  key: WorkshopDefenseUpgradeKey,
  completedLevels: number,
  opts?: WorkshopDefenseStatDisplayOpts,
): string {
  const max = workshopDefenseMaxLevel(key)
  switch (key) {
    case 'healthLevel': {
      const m = opts?.healthLabMultiplier
      if (m !== undefined && Number.isFinite(m) && m > 0) {
        return formatAbbrevWithHealthStyleLabMultiplier(workshopHealthStatValue(completedLevels), m)
      }
      return workshopHealthStatDisplay(completedLevels)
    }
    case 'healthRegenLevel': {
      const m = opts?.healthRegenLabMultiplier
      if (m !== undefined && Number.isFinite(m) && m > 0) {
        return formatAbbrevWithHealthStyleLabMultiplier(
          workshopHealthRegenStatValue(completedLevels),
          m,
        )
      }
      return workshopHealthRegenStatDisplay(completedLevels)
    }
    case 'defenseAbsoluteLevel':
      return workshopDefenseAbsoluteStatDisplay(completedLevels)
    case 'defensePercentLevel': {
      const labPts = opts?.defensePercentLabPercentPoints
      if (labPts !== undefined && Number.isFinite(labPts)) {
        const w = workshopDefensePercentStatPercentPoints(completedLevels)
        return `+${(w + labPts).toFixed(2)}%`
      }
      return workshopDefensePercentStatDisplay(completedLevels)
    }
    case 'thornDamageLevel': {
      const labPts = opts?.thornDamageLabPercentPoints
      if (labPts !== undefined && Number.isFinite(labPts)) {
        const w = workshopThornDamageStatPercentPoints(completedLevels)
        return `+${(w + labPts).toFixed(2)}%`
      }
      return workshopThornDamageStatDisplay(completedLevels)
    }
    case 'lifestealLevel':
      return workshopLifestealStatDisplay(completedLevels)
    case 'knockbackChanceLevel':
      return workshopKnockbackChanceStatDisplay(completedLevels)
    case 'knockbackForceLevel':
      return workshopKnockbackForceStatDisplay(completedLevels)
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
 * **Health** / **Health Regen** / **Defense %** / **Defense Absolute** / **Thorn Damage** / **Lifesteal** /
 * **Knockback Chance** / **Knockback Force**: dedicated workshop ladders; others: workshop damage curve
 * (placeholder).
 */
export function workshopDefenseNextMarginalCoins(
  key: WorkshopDefenseUpgradeKey,
  completedLevels: number,
): number | undefined {
  const max = workshopDefenseMaxLevel(key)
  if (completedLevels < 0 || completedLevels >= max) return undefined
  if (key === 'healthLevel') {
    return workshopHealthNextMarginalCoins(completedLevels)
  }
  if (key === 'healthRegenLevel') {
    return workshopHealthRegenNextMarginalCoins(completedLevels)
  }
  if (key === 'defensePercentLevel') {
    return workshopDefensePercentNextMarginalCoins(completedLevels)
  }
  if (key === 'defenseAbsoluteLevel') {
    return workshopDefenseAbsoluteNextMarginalCoins(completedLevels)
  }
  if (key === 'thornDamageLevel') {
    return workshopThornDamageNextMarginalCoins(completedLevels)
  }
  if (key === 'lifestealLevel') {
    return workshopLifestealNextMarginalCoins(completedLevels)
  }
  if (key === 'knockbackChanceLevel') {
    return workshopKnockbackChanceNextMarginalCoins(completedLevels)
  }
  if (key === 'knockbackForceLevel') {
    return workshopKnockbackForceNextMarginalCoins(completedLevels)
  }
  const idx = Math.min(completedLevels, WORKSHOP_DAMAGE_MAX_LEVEL - 1)
  return workshopDamageNextMarginalCoins(idx)
}
