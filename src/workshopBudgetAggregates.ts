import {
  WORKSHOP_ATTACK_RANGE_MAX_LEVEL,
  workshopAttackRangeNextMarginalCoins,
} from './data/workshopAttackRange'
import {
  WORKSHOP_ATTACK_SPEED_MAX_LEVEL,
  workshopAttackSpeedNextMarginalCoins,
} from './data/workshopAttackSpeed'
import {
  WORKSHOP_CRITICAL_CHANCE_MAX_LEVEL,
  workshopCriticalChanceNextMarginalCoins,
} from './data/workshopCriticalChance'
import {
  WORKSHOP_CRITICAL_FACTOR_MAX_LEVEL,
  workshopCriticalFactorNextMarginalCoins,
} from './data/workshopCriticalFactor'
import {
  WORKSHOP_DAMAGE_MAX_LEVEL,
  workshopDamageNextMarginalCoins,
} from './data/workshopDamage'
import {
  WORKSHOP_DAMAGE_PER_METER_MAX_LEVEL,
  workshopDamagePerMeterNextMarginalCoins,
} from './data/workshopDamagePerMeter'
import {
  WORKSHOP_MULTISHOT_CHANCE_MAX_LEVEL,
  workshopMultishotChanceNextMarginalCoins,
} from './data/workshopMultishotChance'
import {
  WORKSHOP_MULTISHOT_TARGETS_MAX_LEVEL,
  workshopMultishotTargetsNextMarginalCoins,
} from './data/workshopMultishotTargets'
import {
  WORKSHOP_RAPID_FIRE_CHANCE_MAX_LEVEL,
  WORKSHOP_RAPID_FIRE_DURATION_MAX_LEVEL,
  workshopRapidFireChanceNextMarginalCoins,
  workshopRapidFireDurationNextMarginalCoins,
} from './data/workshopRapidFire'
import {
  WORKSHOP_BOUNCE_SHOT_CHANCE_MAX_LEVEL,
  workshopBounceShotChanceNextMarginalCoins,
} from './data/workshopBounceShotChance'
import {
  WORKSHOP_BOUNCE_SHOT_RANGE_MAX_LEVEL,
  workshopBounceShotRangeNextMarginalCoins,
} from './data/workshopBounceShotRange'
import {
  WORKSHOP_BOUNCE_SHOT_TARGETS_MAX_LEVEL,
  workshopBounceShotTargetsNextMarginalCoins,
} from './data/workshopBounceShotTargets'
import {
  WORKSHOP_SUPER_CRIT_CHANCE_MAX_LEVEL,
  workshopSuperCritChanceNextMarginalCoins,
} from './data/workshopSuperCritChance'
import {
  WORKSHOP_SUPER_CRIT_MULT_MAX_LEVEL,
  workshopSuperCritMultNextMarginalCoins,
} from './data/workshopSuperCritMult'
import {
  WORKSHOP_REND_ARMOR_CHANCE_MAX_LEVEL,
  WORKSHOP_REND_ARMOR_MULT_MAX_LEVEL,
  workshopRendArmorChanceNextMarginalCoins,
  workshopRendArmorMultNextMarginalCoins,
} from './data/workshopRendArmor'
import {
  WORKSHOP_DEFENSE_UPGRADE_ORDER,
  workshopDefenseMaxLevel,
  workshopDefenseNextMarginalCoins,
} from './data/workshopDefense'
import {
  WORKSHOP_UTILITY_UPGRADE_ORDER,
  workshopUtilityMaxLevel,
  workshopUtilityNextMarginalCoins,
} from './data/workshopUtility'
import { formatCoinAbbrev } from './labCosts'
import type { WorkshopPersistedV1 } from './labPresetsStorage'

export type WorkshopCoinAggregates = {
  spentAll: number
  toMaxAll: number
  nextUpgradeVisibleSum: number
}

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

function statSpent(level: number, nextAt: (l: number) => number | undefined): number {
  return sumMarginalSteps(nextAt, 0, Math.max(0, level))
}

function statToMax(
  level: number,
  max: number,
  nextAt: (l: number) => number | undefined,
): number {
  const L = Math.min(Math.max(0, level), max)
  return sumMarginalSteps(nextAt, L, max)
}

function addAttackDefenseUtilityTotals(
  ws: WorkshopPersistedV1,
  sink: { spent: number; toMax: number },
): void {
  const attackPairs: readonly {
    level: number
    max: number
    next: (l: number) => number | undefined
  }[] = [
    { level: ws.damageLevel, max: WORKSHOP_DAMAGE_MAX_LEVEL, next: workshopDamageNextMarginalCoins },
    {
      level: ws.attackSpeedLevel,
      max: WORKSHOP_ATTACK_SPEED_MAX_LEVEL,
      next: workshopAttackSpeedNextMarginalCoins,
    },
    {
      level: ws.critChanceLevel,
      max: WORKSHOP_CRITICAL_CHANCE_MAX_LEVEL,
      next: workshopCriticalChanceNextMarginalCoins,
    },
    {
      level: ws.critFactorLevel,
      max: WORKSHOP_CRITICAL_FACTOR_MAX_LEVEL,
      next: workshopCriticalFactorNextMarginalCoins,
    },
    {
      level: ws.attackRangeLevel,
      max: WORKSHOP_ATTACK_RANGE_MAX_LEVEL,
      next: workshopAttackRangeNextMarginalCoins,
    },
    {
      level: ws.damagePerMeterLevel,
      max: WORKSHOP_DAMAGE_PER_METER_MAX_LEVEL,
      next: workshopDamagePerMeterNextMarginalCoins,
    },
    {
      level: ws.multishotChanceLevel,
      max: WORKSHOP_MULTISHOT_CHANCE_MAX_LEVEL,
      next: workshopMultishotChanceNextMarginalCoins,
    },
    {
      level: ws.multishotTargetsLevel,
      max: WORKSHOP_MULTISHOT_TARGETS_MAX_LEVEL,
      next: workshopMultishotTargetsNextMarginalCoins,
    },
    {
      level: ws.rapidFireChanceLevel,
      max: WORKSHOP_RAPID_FIRE_CHANCE_MAX_LEVEL,
      next: workshopRapidFireChanceNextMarginalCoins,
    },
    {
      level: ws.rapidFireDurationLevel,
      max: WORKSHOP_RAPID_FIRE_DURATION_MAX_LEVEL,
      next: workshopRapidFireDurationNextMarginalCoins,
    },
    {
      level: ws.bounceShotChanceLevel,
      max: WORKSHOP_BOUNCE_SHOT_CHANCE_MAX_LEVEL,
      next: workshopBounceShotChanceNextMarginalCoins,
    },
    {
      level: ws.bounceShotTargetsLevel,
      max: WORKSHOP_BOUNCE_SHOT_TARGETS_MAX_LEVEL,
      next: workshopBounceShotTargetsNextMarginalCoins,
    },
    {
      level: ws.bounceShotRangeLevel,
      max: WORKSHOP_BOUNCE_SHOT_RANGE_MAX_LEVEL,
      next: workshopBounceShotRangeNextMarginalCoins,
    },
    {
      level: ws.superCritChanceLevel,
      max: WORKSHOP_SUPER_CRIT_CHANCE_MAX_LEVEL,
      next: workshopSuperCritChanceNextMarginalCoins,
    },
    {
      level: ws.superCritMultLevel,
      max: WORKSHOP_SUPER_CRIT_MULT_MAX_LEVEL,
      next: workshopSuperCritMultNextMarginalCoins,
    },
    {
      level: ws.rendArmorChanceLevel,
      max: WORKSHOP_REND_ARMOR_CHANCE_MAX_LEVEL,
      next: workshopRendArmorChanceNextMarginalCoins,
    },
    {
      level: ws.rendArmorMultLevel,
      max: WORKSHOP_REND_ARMOR_MULT_MAX_LEVEL,
      next: workshopRendArmorMultNextMarginalCoins,
    },
  ]

  for (const { level, max, next } of attackPairs) {
    sink.spent += statSpent(level, next)
    sink.toMax += statToMax(level, max, next)
  }

  for (const key of WORKSHOP_DEFENSE_UPGRADE_ORDER) {
    const max = workshopDefenseMaxLevel(key)
    const level = ws[key]
    sink.spent += statSpent(level, (L) => workshopDefenseNextMarginalCoins(key, L))
    sink.toMax += statToMax(level, max, (L) => workshopDefenseNextMarginalCoins(key, L))
  }

  for (const key of WORKSHOP_UTILITY_UPGRADE_ORDER) {
    const max = workshopUtilityMaxLevel(key)
    const level = ws[key]
    sink.spent += statSpent(level, (L) => workshopUtilityNextMarginalCoins(key, L))
    sink.toMax += statToMax(level, max, (L) => workshopUtilityNextMarginalCoins(key, L))
  }
}

function attackCardVisible(
  hideMaxed: boolean,
  level: number,
  max: number,
): boolean {
  return !hideMaxed || level < max
}

function maybeAddNext(
  sum: { n: number },
  visible: boolean,
  level: number,
  max: number,
  nextAt: (l: number) => number | undefined,
): void {
  if (!visible || level >= max) return
  const c = nextAt(level)
  if (c != null) sum.n += c
}

/**
 * Coin totals for every modeled workshop upgrade row (attack, defense, utility).
 * Marginal curves match the per-card “next upgrade” coin lines in the UI.
 */
export function computeWorkshopCoinAggregates(
  ws: WorkshopPersistedV1,
): WorkshopCoinAggregates {
  const sink = { spent: 0, toMax: 0 }
  addAttackDefenseUtilityTotals(ws, sink)

  let nextUpgradeVisibleSum = 0
  if (ws.mainTab !== 'upgrade') {
    return {
      spentAll: sink.spent,
      toMaxAll: sink.toMax,
      nextUpgradeVisibleSum: 0,
    }
  }

  const { hideMaxed, category } = ws
  const sum = { n: 0 }

  if (category === 'attack') {
    maybeAddNext(sum, attackCardVisible(hideMaxed, ws.damageLevel, WORKSHOP_DAMAGE_MAX_LEVEL), ws.damageLevel, WORKSHOP_DAMAGE_MAX_LEVEL, workshopDamageNextMarginalCoins)
    maybeAddNext(sum, attackCardVisible(hideMaxed, ws.attackSpeedLevel, WORKSHOP_ATTACK_SPEED_MAX_LEVEL), ws.attackSpeedLevel, WORKSHOP_ATTACK_SPEED_MAX_LEVEL, workshopAttackSpeedNextMarginalCoins)
    maybeAddNext(sum, attackCardVisible(hideMaxed, ws.critChanceLevel, WORKSHOP_CRITICAL_CHANCE_MAX_LEVEL), ws.critChanceLevel, WORKSHOP_CRITICAL_CHANCE_MAX_LEVEL, workshopCriticalChanceNextMarginalCoins)
    maybeAddNext(sum, attackCardVisible(hideMaxed, ws.critFactorLevel, WORKSHOP_CRITICAL_FACTOR_MAX_LEVEL), ws.critFactorLevel, WORKSHOP_CRITICAL_FACTOR_MAX_LEVEL, workshopCriticalFactorNextMarginalCoins)
    maybeAddNext(sum, attackCardVisible(hideMaxed, ws.attackRangeLevel, WORKSHOP_ATTACK_RANGE_MAX_LEVEL), ws.attackRangeLevel, WORKSHOP_ATTACK_RANGE_MAX_LEVEL, workshopAttackRangeNextMarginalCoins)
    maybeAddNext(sum, attackCardVisible(hideMaxed, ws.damagePerMeterLevel, WORKSHOP_DAMAGE_PER_METER_MAX_LEVEL), ws.damagePerMeterLevel, WORKSHOP_DAMAGE_PER_METER_MAX_LEVEL, workshopDamagePerMeterNextMarginalCoins)
    maybeAddNext(sum, attackCardVisible(hideMaxed, ws.multishotChanceLevel, WORKSHOP_MULTISHOT_CHANCE_MAX_LEVEL), ws.multishotChanceLevel, WORKSHOP_MULTISHOT_CHANCE_MAX_LEVEL, workshopMultishotChanceNextMarginalCoins)
    maybeAddNext(sum, attackCardVisible(hideMaxed, ws.multishotTargetsLevel, WORKSHOP_MULTISHOT_TARGETS_MAX_LEVEL), ws.multishotTargetsLevel, WORKSHOP_MULTISHOT_TARGETS_MAX_LEVEL, workshopMultishotTargetsNextMarginalCoins)
    maybeAddNext(sum, attackCardVisible(hideMaxed, ws.rapidFireChanceLevel, WORKSHOP_RAPID_FIRE_CHANCE_MAX_LEVEL), ws.rapidFireChanceLevel, WORKSHOP_RAPID_FIRE_CHANCE_MAX_LEVEL, workshopRapidFireChanceNextMarginalCoins)
    maybeAddNext(sum, attackCardVisible(hideMaxed, ws.rapidFireDurationLevel, WORKSHOP_RAPID_FIRE_DURATION_MAX_LEVEL), ws.rapidFireDurationLevel, WORKSHOP_RAPID_FIRE_DURATION_MAX_LEVEL, workshopRapidFireDurationNextMarginalCoins)
    maybeAddNext(sum, attackCardVisible(hideMaxed, ws.bounceShotChanceLevel, WORKSHOP_BOUNCE_SHOT_CHANCE_MAX_LEVEL), ws.bounceShotChanceLevel, WORKSHOP_BOUNCE_SHOT_CHANCE_MAX_LEVEL, workshopBounceShotChanceNextMarginalCoins)
    maybeAddNext(sum, attackCardVisible(hideMaxed, ws.bounceShotTargetsLevel, WORKSHOP_BOUNCE_SHOT_TARGETS_MAX_LEVEL), ws.bounceShotTargetsLevel, WORKSHOP_BOUNCE_SHOT_TARGETS_MAX_LEVEL, workshopBounceShotTargetsNextMarginalCoins)
    maybeAddNext(sum, attackCardVisible(hideMaxed, ws.bounceShotRangeLevel, WORKSHOP_BOUNCE_SHOT_RANGE_MAX_LEVEL), ws.bounceShotRangeLevel, WORKSHOP_BOUNCE_SHOT_RANGE_MAX_LEVEL, workshopBounceShotRangeNextMarginalCoins)
    maybeAddNext(sum, attackCardVisible(hideMaxed, ws.superCritChanceLevel, WORKSHOP_SUPER_CRIT_CHANCE_MAX_LEVEL), ws.superCritChanceLevel, WORKSHOP_SUPER_CRIT_CHANCE_MAX_LEVEL, workshopSuperCritChanceNextMarginalCoins)
    maybeAddNext(sum, attackCardVisible(hideMaxed, ws.superCritMultLevel, WORKSHOP_SUPER_CRIT_MULT_MAX_LEVEL), ws.superCritMultLevel, WORKSHOP_SUPER_CRIT_MULT_MAX_LEVEL, workshopSuperCritMultNextMarginalCoins)
    maybeAddNext(sum, attackCardVisible(hideMaxed, ws.rendArmorChanceLevel, WORKSHOP_REND_ARMOR_CHANCE_MAX_LEVEL), ws.rendArmorChanceLevel, WORKSHOP_REND_ARMOR_CHANCE_MAX_LEVEL, workshopRendArmorChanceNextMarginalCoins)
    maybeAddNext(sum, attackCardVisible(hideMaxed, ws.rendArmorMultLevel, WORKSHOP_REND_ARMOR_MULT_MAX_LEVEL), ws.rendArmorMultLevel, WORKSHOP_REND_ARMOR_MULT_MAX_LEVEL, workshopRendArmorMultNextMarginalCoins)
  } else if (category === 'defense') {
    for (const key of WORKSHOP_DEFENSE_UPGRADE_ORDER) {
      const max = workshopDefenseMaxLevel(key)
      const level = ws[key]
      const visible = !hideMaxed || level < max
      maybeAddNext(sum, visible, level, max, (L) => workshopDefenseNextMarginalCoins(key, L))
    }
  } else if (category === 'utility') {
    for (const key of WORKSHOP_UTILITY_UPGRADE_ORDER) {
      const max = workshopUtilityMaxLevel(key)
      const level = ws[key]
      const visible = !hideMaxed || level < max
      maybeAddNext(sum, visible, level, max, (L) => workshopUtilityNextMarginalCoins(key, L))
    }
  }

  nextUpgradeVisibleSum = sum.n

  return {
    spentAll: sink.spent,
    toMaxAll: sink.toMax,
    nextUpgradeVisibleSum,
  }
}

export function formatWorkshopCoinAggregates(a: WorkshopCoinAggregates): {
  spentLabel: string
  toMaxLabel: string
  nextVisibleLabel: string
} {
  return {
    spentLabel: formatCoinAbbrev(a.spentAll),
    toMaxLabel: formatCoinAbbrev(a.toMaxAll),
    nextVisibleLabel: formatCoinAbbrev(a.nextUpgradeVisibleSum),
  }
}
