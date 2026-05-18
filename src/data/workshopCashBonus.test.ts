import { describe, expect, it } from 'vitest'
import {
  WORKSHOP_CASH_BONUS_BASE_MULTIPLIER,
  WORKSHOP_CASH_BONUS_MAX_LEVEL,
  workshopCashBonusNextMarginalCoins,
  workshopCashBonusStatDisplay,
  workshopCashBonusStatMultiplier,
} from './workshopCashBonus'

describe('workshopCashBonus', () => {
  it('matches wiki milestone Value and marginal Cost', () => {
    expect(workshopCashBonusStatMultiplier(0)).toBe(WORKSHOP_CASH_BONUS_BASE_MULTIPLIER)
    expect(workshopCashBonusStatDisplay(0)).toBe('x1.00')
    expect(workshopCashBonusStatMultiplier(1)).toBe(1.01)
    expect(workshopCashBonusStatMultiplier(10)).toBe(1.1)
    expect(workshopCashBonusStatMultiplier(149)).toBe(2.49)
    expect(workshopCashBonusStatDisplay(149)).toBe('x2.49')

    expect(workshopCashBonusNextMarginalCoins(0)).toBe(30)
    expect(workshopCashBonusNextMarginalCoins(9)).toBe(674)
    expect(workshopCashBonusNextMarginalCoins(148)).toBe(352_360)
    expect(workshopCashBonusNextMarginalCoins(149)).toBeUndefined()
  })

  it('max level is 149', () => {
    expect(WORKSHOP_CASH_BONUS_MAX_LEVEL).toBe(149)
  })
})
