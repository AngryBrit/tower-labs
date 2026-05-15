/**
 * Workshop **defense** upgrades: **Health**, **Health Regen**, and **Defense %** use dedicated wiki
 * ladders (`workshopHealth`, `workshopHealthRegen`, `workshopDefensePercent`, `workshopDefenseAbsolute`,
 * `workshopThornDamage`, `workshopLifesteal`, `workshopKnockbackChance`, `workshopKnockbackForce`, `workshopOrbSpeed`,
 * `workshopOrbs`, `workshopShockwaveSize`, `workshopShockwaveFrequency`, `workshopLandMineChance`,
 * `workshopLandMineDamage`, `workshopLandMineRadius`, `workshopDeathDefy`, `workshopWallHealth`, `workshopWallRebuild`).
 * Other rows reuse the workshop damage marginal curve as
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
  WORKSHOP_ORB_SPEED_MAX_LEVEL,
  workshopOrbSpeedNextMarginalCoins,
  workshopOrbSpeedStatDisplay,
} from './workshopOrbSpeed'
import {
  WORKSHOP_ORBS_MAX_LEVEL,
  workshopOrbsNextMarginalCoins,
  workshopOrbsStatDisplay,
} from './workshopOrbs'
import {
  WORKSHOP_SHOCKWAVE_SIZE_MAX_LEVEL,
  workshopShockwaveSizeNextMarginalCoins,
  workshopShockwaveSizeStatDisplay,
} from './workshopShockwaveSize'
import {
  WORKSHOP_SHOCKWAVE_FREQUENCY_MAX_LEVEL,
  workshopShockwaveFrequencyNextMarginalCoins,
  workshopShockwaveFrequencyStatDisplay,
} from './workshopShockwaveFrequency'
import {
  WORKSHOP_LAND_MINE_CHANCE_MAX_LEVEL,
  workshopLandMineChanceNextMarginalCoins,
  workshopLandMineChanceStatDisplay,
} from './workshopLandMineChance'
import {
  WORKSHOP_LAND_MINE_DAMAGE_MAX_LEVEL,
  workshopLandMineDamageNextMarginalCoins,
  workshopLandMineDamageStatDisplay,
} from './workshopLandMineDamage'
import {
  WORKSHOP_LAND_MINE_RADIUS_MAX_LEVEL,
  workshopLandMineRadiusNextMarginalCoins,
  workshopLandMineRadiusStatDisplay,
} from './workshopLandMineRadius'
import {
  WORKSHOP_DEATH_DEFY_MAX_LEVEL,
  workshopDeathDefyNextMarginalCoins,
  workshopDeathDefyStatDisplay,
} from './workshopDeathDefy'
import {
  WORKSHOP_WALL_HEALTH_MAX_LEVEL,
  workshopWallHealthNextMarginalCoins,
  workshopWallHealthStatDisplay,
} from './workshopWallHealth'
import {
  WORKSHOP_WALL_REBUILD_MAX_LEVEL,
  workshopWallRebuildNextMarginalCoins,
  workshopWallRebuildStatDisplay,
} from './workshopWallRebuild'

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
      return WORKSHOP_ORB_SPEED_MAX_LEVEL
    case 'shockwaveSizeLevel':
      return WORKSHOP_SHOCKWAVE_SIZE_MAX_LEVEL
    case 'shockwaveFrequencyLevel':
      return WORKSHOP_SHOCKWAVE_FREQUENCY_MAX_LEVEL
    case 'landMineDamageLevel':
      return WORKSHOP_LAND_MINE_DAMAGE_MAX_LEVEL
    case 'landMineRadiusLevel':
      return WORKSHOP_LAND_MINE_RADIUS_MAX_LEVEL
    case 'wallRebuildLevel':
      return WORKSHOP_WALL_REBUILD_MAX_LEVEL
    case 'orbsLevel':
      return WORKSHOP_ORBS_MAX_LEVEL
    case 'landMineChanceLevel':
      return WORKSHOP_LAND_MINE_CHANCE_MAX_LEVEL
    case 'deathDefyLevel':
      return WORKSHOP_DEATH_DEFY_MAX_LEVEL
    case 'wallHealthLevel':
      return WORKSHOP_WALL_HEALTH_MAX_LEVEL
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

export function workshopDefenseStatDisplay(
  key: WorkshopDefenseUpgradeKey,
  completedLevels: number,
  opts?: WorkshopDefenseStatDisplayOpts,
): string {
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
      return workshopOrbSpeedStatDisplay(completedLevels)
    case 'orbsLevel':
      return workshopOrbsStatDisplay(completedLevels)
    case 'shockwaveSizeLevel':
      return workshopShockwaveSizeStatDisplay(completedLevels)
    case 'shockwaveFrequencyLevel':
      return workshopShockwaveFrequencyStatDisplay(completedLevels)
    case 'landMineChanceLevel':
      return workshopLandMineChanceStatDisplay(completedLevels)
    case 'landMineDamageLevel':
      return workshopLandMineDamageStatDisplay(completedLevels)
    case 'landMineRadiusLevel':
      return workshopLandMineRadiusStatDisplay(completedLevels)
    case 'deathDefyLevel':
      return workshopDeathDefyStatDisplay(completedLevels)
    case 'wallHealthLevel':
      return workshopWallHealthStatDisplay(completedLevels)
    case 'wallRebuildLevel':
      return workshopWallRebuildStatDisplay(completedLevels)
  }
}

/**
 * Coins for the next purchase when `completedLevels` upgrades are already done.
 * **Health** / **Health Regen** / **Defense %** / **Defense Absolute** / **Thorn Damage** / **Lifesteal** /
 * **Knockback Chance** / **Knockback Force** / **Orb Speed** / **Orbs** / **Shockwave Size** / **Shockwave
 * Frequency** / **Land Mine Chance** / **Land Mine Damage** / **Land Mine Radius** / **Death Defy** / **Wall
 * Health** / **Wall Rebuild**: dedicated workshop ladders; others: workshop
 * damage curve (placeholder) for rows not listed above.
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
  if (key === 'orbSpeedLevel') {
    return workshopOrbSpeedNextMarginalCoins(completedLevels)
  }
  if (key === 'orbsLevel') {
    return workshopOrbsNextMarginalCoins(completedLevels)
  }
  if (key === 'shockwaveSizeLevel') {
    return workshopShockwaveSizeNextMarginalCoins(completedLevels)
  }
  if (key === 'shockwaveFrequencyLevel') {
    return workshopShockwaveFrequencyNextMarginalCoins(completedLevels)
  }
  if (key === 'landMineChanceLevel') {
    return workshopLandMineChanceNextMarginalCoins(completedLevels)
  }
  if (key === 'landMineDamageLevel') {
    return workshopLandMineDamageNextMarginalCoins(completedLevels)
  }
  if (key === 'landMineRadiusLevel') {
    return workshopLandMineRadiusNextMarginalCoins(completedLevels)
  }
  if (key === 'deathDefyLevel') {
    return workshopDeathDefyNextMarginalCoins(completedLevels)
  }
  if (key === 'wallHealthLevel') {
    return workshopWallHealthNextMarginalCoins(completedLevels)
  }
  if (key === 'wallRebuildLevel') {
    return workshopWallRebuildNextMarginalCoins(completedLevels)
  }
  const idx = Math.min(completedLevels, WORKSHOP_DAMAGE_MAX_LEVEL - 1)
  return workshopDamageNextMarginalCoins(idx)
}
