import { describe, expect, it } from 'vitest'
import { workshopDefenseNextMarginalCoins } from './data/workshopDefense'
import { workshopEnhanceAttackNextMarginalCoins } from './data/workshopEnhanceAttack'
import { workshopEnhanceDefenseNextMarginalCoins } from './data/workshopEnhanceDefense'
import { workshopEnhanceUtilityNextMarginalCoins } from './data/workshopEnhanceUtility'
import { workshopDamageNextMarginalCoins } from './data/workshopDamage'
import { defaultWorkshopPersisted } from './labPresetsStorage'
import { applyWorkshopDiscountToCoins } from './types/research'
import {
  computeWorkshopCoinAggregates,
  computeWorkshopStoneAggregates,
} from './workshopBudgetAggregates'
import { workshopUltimateNextMarginalStones } from './data/workshopUltimate'

describe('computeWorkshopCoinAggregates', () => {
  it('starts at zero spent with default snapshot', () => {
    const ws = defaultWorkshopPersisted()
    const a = computeWorkshopCoinAggregates(ws)
    expect(a.spentAll).toBe(0)
    expect(a.toMaxAll).toBeGreaterThan(0)
  })

  it('counts damage workshop spend after one level', () => {
    const m0 = workshopDamageNextMarginalCoins(0)!
    const ws = { ...defaultWorkshopPersisted(), damageLevel: 1 }
    const a = computeWorkshopCoinAggregates(ws)
    expect(a.spentAll).toBe(m0)
  })

  it('applies Workshop Attack Discount to attack workshop spend', () => {
    const m0 = workshopDamageNextMarginalCoins(0)!
    const ws = {
      ...defaultWorkshopPersisted(),
      damageLevel: 1,
    }
    const discounted = applyWorkshopDiscountToCoins(m0, 10)
    const a = computeWorkshopCoinAggregates(ws, { attackDiscountPercent: 10 })
    expect(a.spentAll).toBe(discounted)
    expect(discounted).toBeLessThan(m0)
  })

  it('applies Workshop Defense Discount to defense workshop spend', () => {
    const m0 = workshopDefenseNextMarginalCoins('healthLevel', 0)!
    const ws = {
      ...defaultWorkshopPersisted(),
      healthLevel: 1,
    }
    const discounted = applyWorkshopDiscountToCoins(m0, 10)
    const a = computeWorkshopCoinAggregates(ws, { defenseDiscountPercent: 10 })
    expect(a.spentAll).toBe(discounted)
    expect(discounted).toBeLessThan(m0)
  })

  it('sums only unlocked attack enhancement next upgrades at level 0', () => {
    const damageNext = workshopEnhanceAttackNextMarginalCoins('enhanceDamageLevel', 0)!
    const ws = {
      ...defaultWorkshopPersisted(),
      mainTab: 'enhance' as const,
      category: 'attack' as const,
    }
    const a = computeWorkshopCoinAggregates(ws)
    expect(a.nextUpgradeVisibleSum).toBe(damageNext)
  })

  it('sums zero enhancement next upgrades when Workshop Enhancements lab is locked', () => {
    const ws = {
      ...defaultWorkshopPersisted(),
      mainTab: 'enhance' as const,
      category: 'attack' as const,
    }
    const a = computeWorkshopCoinAggregates(ws, {
      workshopEnhancementsLabUnlocked: false,
    })
    expect(a.nextUpgradeVisibleSum).toBe(0)
  })

  it('includes more attack enhancement next upgrades after category spend unlocks', () => {
    const ws = {
      ...defaultWorkshopPersisted(),
      mainTab: 'enhance' as const,
      category: 'attack' as const,
      enhanceDamageLevel: 400,
    }
    const a = computeWorkshopCoinAggregates(ws)
    expect(a.nextUpgradeVisibleSum).toBeGreaterThan(5e9)
  })

  it('sums only unlocked defense enhancement next upgrades at level 0', () => {
    const healthNext = workshopEnhanceDefenseNextMarginalCoins('enhanceHealthLevel', 0)!
    const ws = {
      ...defaultWorkshopPersisted(),
      mainTab: 'enhance' as const,
      category: 'defense' as const,
    }
    const a = computeWorkshopCoinAggregates(ws)
    expect(a.nextUpgradeVisibleSum).toBe(healthNext)
  })

  it('includes more defense enhancement next upgrades after category spend unlocks', () => {
    const ws = {
      ...defaultWorkshopPersisted(),
      mainTab: 'enhance' as const,
      category: 'defense' as const,
      enhanceHealthLevel: 400,
    }
    const a = computeWorkshopCoinAggregates(ws)
    expect(a.nextUpgradeVisibleSum).toBeGreaterThan(5e9)
  })

  it('sums only unlocked utility enhancement next upgrades at level 0', () => {
    const cashNext = workshopEnhanceUtilityNextMarginalCoins('enhanceCashBonusLevel', 0)!
    const ws = {
      ...defaultWorkshopPersisted(),
      mainTab: 'enhance' as const,
      category: 'utility' as const,
    }
    const a = computeWorkshopCoinAggregates(ws)
    expect(a.nextUpgradeVisibleSum).toBe(cashNext)
  })

  it('includes more utility enhancement next upgrades after category spend unlocks', () => {
    const ws = {
      ...defaultWorkshopPersisted(),
      mainTab: 'enhance' as const,
      category: 'utility' as const,
      enhanceCashBonusLevel: 400,
    }
    const a = computeWorkshopCoinAggregates(ws)
    expect(a.nextUpgradeVisibleSum).toBeGreaterThan(5e9)
  })

  it('uses zero visible next sum on Enhance tab for ultimate category', () => {
    const ws = {
      ...defaultWorkshopPersisted(),
      mainTab: 'enhance' as const,
      category: 'ultimate' as const,
    }
    expect(computeWorkshopCoinAggregates(ws).nextUpgradeVisibleSum).toBe(0)
  })

  it('excludes ultimate power stones from coin spent/to-max totals', () => {
    const ws = {
      ...defaultWorkshopPersisted(),
      goldenTowerBonusLevel: 1,
    }
    const coinsOnly = computeWorkshopCoinAggregates({
      ...ws,
      goldenTowerBonusLevel: 0,
    })
    const withUltimate = computeWorkshopCoinAggregates(ws)
    expect(withUltimate.spentAll).toBe(coinsOnly.spentAll)
  })
})

describe('computeWorkshopStoneAggregates', () => {
  it('sums visible ultimate next upgrades on Ultimate tab when weapons are active', () => {
    const ws = {
      ...defaultWorkshopPersisted(),
      mainTab: 'upgrade' as const,
      category: 'ultimate' as const,
      goldenTowerActive: true,
    }
    const a = computeWorkshopStoneAggregates(ws)
    expect(a.nextUpgradeVisibleSum).toBeGreaterThan(0)
  })

  it('counts golden tower bonus spend in stones', () => {
    const stones = workshopUltimateNextMarginalStones('goldenTowerBonusLevel', 0)!
    const ws = { ...defaultWorkshopPersisted(), goldenTowerBonusLevel: 1 }
    expect(computeWorkshopStoneAggregates(ws).spentAll).toBe(stones)
  })

  it('excludes inactive weapons from visible next-upgrade stone sum', () => {
    const noneActive = computeWorkshopStoneAggregates({
      ...defaultWorkshopPersisted(),
      mainTab: 'upgrade',
      category: 'ultimate',
    }).nextUpgradeVisibleSum
    const allActive = computeWorkshopStoneAggregates({
      ...defaultWorkshopPersisted(),
      mainTab: 'upgrade',
      category: 'ultimate',
      goldenTowerActive: true,
      blackHoleActive: true,
      spotlightActive: true,
      deathWaveActive: true,
      chainLightningActive: true,
      smartMissilesActive: true,
      innerLandMinesActive: true,
      poisonSwampActive: true,
      chronoFieldActive: true,
    }).nextUpgradeVisibleSum
    expect(noneActive).toBe(0)
    expect(allActive).toBeGreaterThan(0)
  })
})
