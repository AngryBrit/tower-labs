/**
 * Workshop **utility** upgrades: coin rows through **Coins / Wave** use dedicated wiki ladders;
 * other coin rows reuse the damage workshop curve until per-stat tables exist. **Value** lines reuse
 * lab calculator helpers from `types/research.ts` where the utility lab matches; **Free * Upgrade** rows
 * use interim % placeholders (no matching lab export here).
 */

import {
  WORKSHOP_CASH_BONUS_MAX_LEVEL,
  workshopCashBonusNextMarginalCoins,
  workshopCashBonusStatDisplay,
} from './workshopCashBonus'
import {
  WORKSHOP_CASH_PER_WAVE_MAX_LEVEL,
  workshopCashPerWaveNextMarginalCoins,
  workshopCashPerWaveStatDisplay,
} from './workshopCashPerWave'
import {
  WORKSHOP_COINS_KILL_BONUS_MAX_LEVEL,
  workshopCoinsKillBonusNextMarginalCoins,
  workshopCoinsKillBonusStatDisplay,
} from './workshopCoinsKillBonus'
import {
  WORKSHOP_COINS_WAVE_MAX_LEVEL,
  workshopCoinsWaveNextMarginalCoins,
  workshopCoinsWaveStatDisplay,
} from './workshopCoinsWave'
import {
  WORKSHOP_FREE_ATTACK_UPGRADE_MAX_LEVEL,
  workshopFreeAttackUpgradeNextMarginalCoins,
  workshopFreeAttackUpgradeStatDisplay,
} from './workshopFreeAttackUpgrade'
import {
  WORKSHOP_FREE_DEFENSE_UPGRADE_MAX_LEVEL,
  workshopFreeDefenseUpgradeNextMarginalCoins,
  workshopFreeDefenseUpgradeStatDisplay,
} from './workshopFreeDefenseUpgrade'
import {
  WORKSHOP_FREE_UTILITY_UPGRADE_MAX_LEVEL,
  workshopFreeUtilityUpgradeNextMarginalCoins,
  workshopFreeUtilityUpgradeStatDisplay,
} from './workshopFreeUtilityUpgrade'
import {
  WORKSHOP_INTEREST_PER_WAVE_MAX_LEVEL,
  workshopInterestPerWaveNextMarginalCoins,
  workshopInterestPerWaveStatDisplay,
} from './workshopInterestPerWave'
import {
  WORKSHOP_RECOVERY_AMOUNT_MAX_LEVEL,
  workshopRecoveryAmountNextMarginalCoins,
  workshopRecoveryAmountStatDisplay,
} from './workshopRecoveryAmount'
import {
  WORKSHOP_MAX_RECOVERY_MAX_LEVEL,
  workshopMaxRecoveryNextMarginalCoins,
  workshopMaxRecoveryStatDisplay,
} from './workshopMaxRecovery'
import {
  WORKSHOP_PACKAGE_CHANCE_MAX_LEVEL,
  workshopPackageChanceNextMarginalCoins,
  workshopPackageChanceStatDisplay,
} from './workshopPackageChance'
export { WORKSHOP_RECOVERY_UNLOCK_COINS } from './workshopRecoveryShared'
export { WORKSHOP_ENEMY_LEVEL_SKIP_UNLOCK_COINS } from './workshopEnemyLevelSkipShared'
import {
  WORKSHOP_ENEMY_ATTACK_LEVEL_SKIP_MAX_LEVEL,
  workshopEnemyAttackLevelSkipNextMarginalCoins,
  workshopEnemyAttackLevelSkipStatDisplay,
} from './workshopEnemyAttackLevelSkip'
import {
  WORKSHOP_ENEMY_HEALTH_LEVEL_SKIP_MAX_LEVEL,
  workshopEnemyHealthLevelSkipNextMarginalCoins,
  workshopEnemyHealthLevelSkipStatDisplay,
} from './workshopEnemyHealthLevelSkip'

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

export function workshopUtilityMaxLevel(key: WorkshopUtilityUpgradeKey): number {
  switch (key) {
    case 'cashBonusLevel':
      return WORKSHOP_CASH_BONUS_MAX_LEVEL
    case 'cashPerWaveLevel':
      return WORKSHOP_CASH_PER_WAVE_MAX_LEVEL
    case 'coinsKillBonusLevel':
      return WORKSHOP_COINS_KILL_BONUS_MAX_LEVEL
    case 'coinsWaveLevel':
      return WORKSHOP_COINS_WAVE_MAX_LEVEL
    case 'interestPerWaveLevel':
      return WORKSHOP_INTEREST_PER_WAVE_MAX_LEVEL
    case 'freeAttackUpgradeLevel':
      return WORKSHOP_FREE_ATTACK_UPGRADE_MAX_LEVEL
    case 'freeDefenseUpgradeLevel':
      return WORKSHOP_FREE_DEFENSE_UPGRADE_MAX_LEVEL
    case 'freeUtilityUpgradeLevel':
      return WORKSHOP_FREE_UTILITY_UPGRADE_MAX_LEVEL
    case 'recoveryAmountLevel':
      return WORKSHOP_RECOVERY_AMOUNT_MAX_LEVEL
    case 'maxRecoveryLevel':
      return WORKSHOP_MAX_RECOVERY_MAX_LEVEL
    case 'packageChanceLevel':
      return WORKSHOP_PACKAGE_CHANCE_MAX_LEVEL
    case 'enemyAttackLevelSkipLevel':
      return WORKSHOP_ENEMY_ATTACK_LEVEL_SKIP_MAX_LEVEL
    case 'enemyHealthLevelSkipLevel':
      return WORKSHOP_ENEMY_HEALTH_LEVEL_SKIP_MAX_LEVEL
  }
}

export function workshopUtilityClampLevel(key: WorkshopUtilityUpgradeKey, n: number): number {
  return cap(n, workshopUtilityMaxLevel(key))
}

export function workshopUtilityStatDisplay(
  key: WorkshopUtilityUpgradeKey,
  completedLevels: number,
): string {
  switch (key) {
    case 'cashBonusLevel':
      return workshopCashBonusStatDisplay(completedLevels)
    case 'cashPerWaveLevel':
      return workshopCashPerWaveStatDisplay(completedLevels)
    case 'coinsKillBonusLevel':
      return workshopCoinsKillBonusStatDisplay(completedLevels)
    case 'coinsWaveLevel':
      return workshopCoinsWaveStatDisplay(completedLevels)
    case 'interestPerWaveLevel':
      return workshopInterestPerWaveStatDisplay(completedLevels)
    case 'freeAttackUpgradeLevel':
      return workshopFreeAttackUpgradeStatDisplay(completedLevels)
    case 'freeDefenseUpgradeLevel':
      return workshopFreeDefenseUpgradeStatDisplay(completedLevels)
    case 'freeUtilityUpgradeLevel':
      return workshopFreeUtilityUpgradeStatDisplay(completedLevels)
    case 'recoveryAmountLevel':
      return workshopRecoveryAmountStatDisplay(completedLevels)
    case 'maxRecoveryLevel':
      return workshopMaxRecoveryStatDisplay(completedLevels)
    case 'packageChanceLevel':
      return workshopPackageChanceStatDisplay(completedLevels)
    case 'enemyAttackLevelSkipLevel':
      return workshopEnemyAttackLevelSkipStatDisplay(completedLevels)
    case 'enemyHealthLevelSkipLevel':
      return workshopEnemyHealthLevelSkipStatDisplay(completedLevels)
  }
}

export function workshopUtilityNextMarginalCoins(
  key: WorkshopUtilityUpgradeKey,
  completedLevels: number,
): number | undefined {
  const max = workshopUtilityMaxLevel(key)
  if (completedLevels < 0 || completedLevels >= max) return undefined
  if (key === 'cashBonusLevel') {
    return workshopCashBonusNextMarginalCoins(completedLevels)
  }
  if (key === 'cashPerWaveLevel') {
    return workshopCashPerWaveNextMarginalCoins(completedLevels)
  }
  if (key === 'coinsKillBonusLevel') {
    return workshopCoinsKillBonusNextMarginalCoins(completedLevels)
  }
  if (key === 'coinsWaveLevel') {
    return workshopCoinsWaveNextMarginalCoins(completedLevels)
  }
  if (key === 'freeAttackUpgradeLevel') {
    return workshopFreeAttackUpgradeNextMarginalCoins(completedLevels)
  }
  if (key === 'freeDefenseUpgradeLevel') {
    return workshopFreeDefenseUpgradeNextMarginalCoins(completedLevels)
  }
  if (key === 'freeUtilityUpgradeLevel') {
    return workshopFreeUtilityUpgradeNextMarginalCoins(completedLevels)
  }
  if (key === 'interestPerWaveLevel') {
    return workshopInterestPerWaveNextMarginalCoins(completedLevels)
  }
  if (key === 'recoveryAmountLevel') {
    return workshopRecoveryAmountNextMarginalCoins(completedLevels)
  }
  if (key === 'maxRecoveryLevel') {
    return workshopMaxRecoveryNextMarginalCoins(completedLevels)
  }
  if (key === 'packageChanceLevel') {
    return workshopPackageChanceNextMarginalCoins(completedLevels)
  }
  if (key === 'enemyAttackLevelSkipLevel') {
    return workshopEnemyAttackLevelSkipNextMarginalCoins(completedLevels)
  }
  if (key === 'enemyHealthLevelSkipLevel') {
    return workshopEnemyHealthLevelSkipNextMarginalCoins(completedLevels)
  }
  return undefined
}
