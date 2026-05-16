import type { ResearchData } from '../types/research'
import {
  attackResearchDamageStyleLabMultiplier,
  attackResearchHealthStyleLabMultiplier,
  attackResearchSuperCritChanceLabPercentPoints,
  defenseResearchDefensePercentLabPercentPoints,
  defenseResearchExtraExtraOrbsBonus,
  defenseResearchGarlicThornsLabPercentPoints,
  defenseResearchHealthStyleLabMultiplierByName,
  defenseResearchHealthStyleMultiplier,
  defenseResearchLandMineDamageLabPercentPoints,
  defenseResearchOrbsSpeedLabPlus,
  defenseResearchShockwaveSizeLabPlus,
  defenseResearchWallHealthLabPercentPoints,
  defenseResearchWallRebuildLabSecondsReduction,
  utilityResearchDamageStyleLabMultiplier,
  utilityResearchIncludePercentLabPoints,
} from '../types/research'
import type { WorkshopDefenseStatDisplayOpts } from './workshopDefense'

export type WorkshopAttackLabDisplayOpts = {
  criticalFactorLabMultiplier?: number
  attackRangeLabMultiplier?: number
  damagePerMeterLabMultiplier?: number
  superCritChanceLabPercentPoints?: number
  superCritMultLabMultiplier?: number
  /** Equipped Critical Chance card (additive % points). */
  criticalChanceCardPercentPoints?: number
}

export type WorkshopUtilityLabDisplayOpts = {
  cashBonusLabMultiplier?: number
  cashPerWaveLabMultiplier?: number
  coinsKillBonusLabMultiplier?: number
  coinsWaveLabMultiplier?: number
  interestPerWaveLabMultiplier?: number
  recoveryAmountLabPercentPoints?: number
  maxRecoveryLabMultiplier?: number
  packageChanceLabPercentPoints?: number
  enemyAttackLevelSkipLabPercentPoints?: number
  enemyHealthLevelSkipLabPercentPoints?: number
  /** Equipped Free Upgrades card (additive % to all free-upgrade rows). */
  freeUpgradesCardPercentPoints?: number
  /** Equipped Recovery Package Chance card (additive % points). */
  packageChanceCardPercentPoints?: number
}

export function buildWorkshopDefenseLabDisplayOpts(
  research: ResearchData | null | undefined,
  labOverrides: Record<string, number>,
): WorkshopDefenseStatDisplayOpts | undefined {
  if (research == null) return undefined
  return {
    healthLabMultiplier: defenseResearchHealthStyleMultiplier(
      research,
      labOverrides,
      'Health',
    ),
    healthRegenLabMultiplier: defenseResearchHealthStyleMultiplier(
      research,
      labOverrides,
      'Health Regen',
    ),
    thornDamageLabPercentPoints: defenseResearchGarlicThornsLabPercentPoints(
      research,
      labOverrides,
    ),
    defensePercentLabPercentPoints: defenseResearchDefensePercentLabPercentPoints(
      research,
      labOverrides,
    ),
    defenseAbsoluteLabMultiplier: defenseResearchHealthStyleLabMultiplierByName(
      research,
      labOverrides,
      'Defense Absolute',
    ),
    orbSpeedLabPlus: defenseResearchOrbsSpeedLabPlus(research, labOverrides),
    orbsLabBonus: defenseResearchExtraExtraOrbsBonus(research, labOverrides),
    shockwaveSizeLabPlus: defenseResearchShockwaveSizeLabPlus(research, labOverrides),
    landMineDamageLabPercentPoints: defenseResearchLandMineDamageLabPercentPoints(
      research,
      labOverrides,
    ),
    wallHealthLabPercentPoints: defenseResearchWallHealthLabPercentPoints(
      research,
      labOverrides,
    ),
    wallRebuildLabSecondsReduction: defenseResearchWallRebuildLabSecondsReduction(
      research,
      labOverrides,
    ),
  }
}

export function buildWorkshopAttackLabDisplayOpts(
  research: ResearchData | null | undefined,
  labOverrides: Record<string, number>,
): WorkshopAttackLabDisplayOpts | undefined {
  if (research == null) return undefined
  return {
    criticalFactorLabMultiplier: attackResearchHealthStyleLabMultiplier(
      research,
      labOverrides,
      'Critical Factor',
    ),
    attackRangeLabMultiplier: attackResearchDamageStyleLabMultiplier(
      research,
      labOverrides,
      'Range',
    ),
    damagePerMeterLabMultiplier: attackResearchDamageStyleLabMultiplier(
      research,
      labOverrides,
      'Damage / Meter',
    ),
    superCritChanceLabPercentPoints: attackResearchSuperCritChanceLabPercentPoints(
      research,
      labOverrides,
    ),
    superCritMultLabMultiplier: attackResearchDamageStyleLabMultiplier(
      research,
      labOverrides,
      'Super Crit Multi',
    ),
  }
}

export function buildWorkshopUtilityLabDisplayOpts(
  research: ResearchData | null | undefined,
  labOverrides: Record<string, number>,
): WorkshopUtilityLabDisplayOpts | undefined {
  if (research == null) return undefined
  return {
    cashBonusLabMultiplier: utilityResearchDamageStyleLabMultiplier(
      research,
      labOverrides,
      'Cash Bonus',
    ),
    cashPerWaveLabMultiplier: utilityResearchDamageStyleLabMultiplier(
      research,
      labOverrides,
      'Cash / Wave',
    ),
    coinsKillBonusLabMultiplier: utilityResearchDamageStyleLabMultiplier(
      research,
      labOverrides,
      'Coins / Kill Bonus',
    ),
    coinsWaveLabMultiplier: utilityResearchDamageStyleLabMultiplier(
      research,
      labOverrides,
      'Coins / Wave',
    ),
    interestPerWaveLabMultiplier: utilityResearchDamageStyleLabMultiplier(
      research,
      labOverrides,
      'Interest',
    ),
    recoveryAmountLabPercentPoints: utilityResearchIncludePercentLabPoints(
      research,
      labOverrides,
      'Recovery Package Amount',
      0.4,
    ),
    maxRecoveryLabMultiplier: utilityResearchDamageStyleLabMultiplier(
      research,
      labOverrides,
      'Recovery Package Max',
    ),
    packageChanceLabPercentPoints: utilityResearchIncludePercentLabPoints(
      research,
      labOverrides,
      'Recovery Package Chance',
      0.2,
    ),
    enemyAttackLevelSkipLabPercentPoints: utilityResearchIncludePercentLabPoints(
      research,
      labOverrides,
      'Enemy Attack Level Skip',
      0.1,
    ),
    enemyHealthLevelSkipLabPercentPoints: utilityResearchIncludePercentLabPoints(
      research,
      labOverrides,
      'Enemy Health Level Skip',
      0.1,
    ),
  }
}
