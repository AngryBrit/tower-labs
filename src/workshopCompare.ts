import {
  WORKSHOP_ULTIMATE_ACTIVE_ORDER,
  WORKSHOP_ULTIMATE_UPGRADE_ORDER,
} from './data/workshopUltimate'
import type { WorkshopPersistedV1 } from './labPresetsStorage'

export type WorkshopCompareRow = {
  field: keyof WorkshopPersistedV1
  valueA: string
  valueB: string
  differs: boolean
}

function displayWorkshopField(v: WorkshopPersistedV1, k: keyof WorkshopPersistedV1): string {
  const x = v[k]
  if (typeof x === 'boolean') return x ? 'true' : 'false'
  return String(x)
}

const WORKSHOP_COMPARE_KEYS: readonly (keyof WorkshopPersistedV1)[] = [
  'hideMaxed',
  'mainTab',
  'category',
  'multiplier',
  'damageLevel',
  'attackSpeedLevel',
  'critChanceLevel',
  'critFactorLevel',
  'attackRangeLevel',
  'damagePerMeterLevel',
  'multishotChanceLevel',
  'multishotTargetsLevel',
  'rapidFireChanceLevel',
  'rapidFireDurationLevel',
  'bounceShotChanceLevel',
  'bounceShotTargetsLevel',
  'bounceShotRangeLevel',
  'superCritChanceLevel',
  'superCritMultLevel',
  'rendArmorChanceLevel',
  'rendArmorMultLevel',
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
  'cashBonusLevel',
  'cashPerWaveLevel',
  'coinsKillBonusLevel',
  'coinsWaveLevel',
  'freeAttackUpgradeLevel',
  'freeDefenseUpgradeLevel',
  'freeUtilityUpgradeLevel',
  'interestPerWaveLevel',
  'recoveryAmountLevel',
  'maxRecoveryLevel',
  'packageChanceLevel',
  'enemyAttackLevelSkipLevel',
  'enemyHealthLevelSkipLevel',
  'enhanceDamageLevel',
  'enhanceRendArmorLevel',
  'enhanceCritFactorLevel',
  'enhanceDamagePerMeterLevel',
  'enhanceSuperCritMultLevel',
  'enhanceAttackSpeedLevel',
  'enhanceHealthLevel',
  'enhanceHealthRegenLevel',
  'enhanceDefenseAbsoluteLevel',
  'enhanceLandMineDamageLevel',
  'enhanceWallHealthLevel',
  'enhanceOrbSizeLevel',
  'enhanceCashBonusLevel',
  'enhanceCoinBonusLevel',
  'enhanceCellsKillBonusLevel',
  'enhanceFreeUpgradesLevel',
  'enhanceRecoveryPackageLevel',
  'enhanceEnemyLevelSkipLevel',
  'simDamageCardStars',
  'simAttackSpeedCardStars',
  'simAttackSpeedModuleSubEffect',
  'simBerserkerCardStars',
  'simBerserkerDamageTaken',
  'simRelicsBonusFraction',
  'simPerkDamageQuantity',
  'simAssistModuleSlot',
  ...WORKSHOP_ULTIMATE_UPGRADE_ORDER,
  ...WORKSHOP_ULTIMATE_ACTIVE_ORDER,
]

/** Row-wise string compare for persisted workshop state (for Tools / compare UI). */
export function compareWorkshopPersisted(
  a: WorkshopPersistedV1,
  b: WorkshopPersistedV1,
): WorkshopCompareRow[] {
  return WORKSHOP_COMPARE_KEYS.map((field) => {
    const valueA = displayWorkshopField(a, field)
    const valueB = displayWorkshopField(b, field)
    return {
      field,
      valueA,
      valueB,
      differs: valueA !== valueB,
    }
  })
}

export function workshopDiffCount(rows: readonly WorkshopCompareRow[]): number {
  return rows.reduce((n, r) => n + (r.differs ? 1 : 0), 0)
}
