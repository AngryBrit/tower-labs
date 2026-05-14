/**
 * Workshop **utility** upgrades: marginal **coins** reuse the damage workshop curve until per-stat
 * tables exist. **Value** lines reuse lab calculator helpers from `types/research.ts` where the
 * utility lab matches; **Free * Upgrade** rows use interim % placeholders (no matching lab export here).
 */

import { workshopDamageNextMarginalCoins } from './workshopDamage'
import { WORKSHOP_DAMAGE_MAX_LEVEL } from './workshopDamage'
import { damageValueDisplay, includePercentTimesLabLevelDisplay } from '../types/research'

export type WorkshopUtilityUpgradeKey =
  | 'cashBonusLevel'
  | 'cashPerWaveLevel'
  | 'coinsKillBonusLevel'
  | 'coinsWaveLevel'
  | 'freeAttackUpgradeLevel'
  | 'freeDefenseUpgradeLevel'
  | 'freeUtilityUpgradeLevel'
  | 'interestPerWaveLevel'
  | 'recoveryAmountLevel'
  | 'maxRecoveryLevel'
  | 'packageChanceLevel'
  | 'enemyAttackLevelSkipLevel'
  | 'enemyHealthLevelSkipLevel'

export const WORKSHOP_UTILITY_UPGRADE_ORDER: readonly WorkshopUtilityUpgradeKey[] = [
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
]

function cap(level: number, max: number): number {
  if (!Number.isFinite(level)) return 0
  return Math.min(Math.max(0, Math.trunc(level)), max)
}

/** Interim % display for free-upgrade workshop rows (no bundled lab row yet). */
function freeUpgradeChanceDisplay(level: number, max: number): string {
  const L = cap(level, max)
  return `+${(0.15 * L).toFixed(2)}%`
}

export function workshopUtilityMaxLevel(key: WorkshopUtilityUpgradeKey): number {
  switch (key) {
    case 'cashBonusLevel':
    case 'cashPerWaveLevel':
    case 'coinsKillBonusLevel':
    case 'coinsWaveLevel':
    case 'interestPerWaveLevel':
      return 99
    case 'freeAttackUpgradeLevel':
    case 'freeDefenseUpgradeLevel':
    case 'freeUtilityUpgradeLevel':
      return 20
    case 'recoveryAmountLevel':
    case 'maxRecoveryLevel':
    case 'packageChanceLevel':
    case 'enemyAttackLevelSkipLevel':
    case 'enemyHealthLevelSkipLevel':
      return 20
  }
}

export function workshopUtilityClampLevel(key: WorkshopUtilityUpgradeKey, n: number): number {
  return cap(n, workshopUtilityMaxLevel(key))
}

export function workshopUtilityStatDisplay(
  key: WorkshopUtilityUpgradeKey,
  completedLevels: number,
): string {
  const max = workshopUtilityMaxLevel(key)
  switch (key) {
    case 'cashBonusLevel':
    case 'cashPerWaveLevel':
    case 'coinsKillBonusLevel':
    case 'coinsWaveLevel':
    case 'interestPerWaveLevel':
      return damageValueDisplay(completedLevels, max)
    case 'freeAttackUpgradeLevel':
    case 'freeDefenseUpgradeLevel':
    case 'freeUtilityUpgradeLevel':
      return freeUpgradeChanceDisplay(completedLevels, max)
    case 'recoveryAmountLevel':
      return includePercentTimesLabLevelDisplay(completedLevels, max, 0.4)
    case 'maxRecoveryLevel':
      return includePercentTimesLabLevelDisplay(completedLevels, max, 1)
    case 'packageChanceLevel':
      return includePercentTimesLabLevelDisplay(completedLevels, max, 0.2)
    case 'enemyAttackLevelSkipLevel':
    case 'enemyHealthLevelSkipLevel':
      return includePercentTimesLabLevelDisplay(completedLevels, max, 0.1)
  }
}

export function workshopUtilityNextMarginalCoins(
  key: WorkshopUtilityUpgradeKey,
  completedLevels: number,
): number | undefined {
  const max = workshopUtilityMaxLevel(key)
  if (completedLevels < 0 || completedLevels >= max) return undefined
  const idx = Math.min(completedLevels, WORKSHOP_DAMAGE_MAX_LEVEL - 1)
  return workshopDamageNextMarginalCoins(idx)
}
