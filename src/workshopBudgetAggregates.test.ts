import { describe, expect, it } from 'vitest'
import { workshopDamageNextMarginalCoins } from './data/workshopDamage'
import { defaultWorkshopPersisted } from './labPresetsStorage'
import { computeWorkshopCoinAggregates } from './workshopBudgetAggregates'

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

  it('uses zero visible next sum on Enhance tab', () => {
    const ws = { ...defaultWorkshopPersisted(), mainTab: 'enhance' as const }
    expect(computeWorkshopCoinAggregates(ws).nextUpgradeVisibleSum).toBe(0)
  })

  it('uses zero visible next sum on Ultimate category (no coin cards yet)', () => {
    const ws = {
      ...defaultWorkshopPersisted(),
      mainTab: 'upgrade' as const,
      category: 'ultimate' as const,
    }
    expect(computeWorkshopCoinAggregates(ws).nextUpgradeVisibleSum).toBe(0)
  })
})
