import { describe, expect, it } from 'vitest'
import {
  WORKSHOP_COINS_KILL_BONUS_ANCHOR_MULTIPLIERS,
  WORKSHOP_COINS_KILL_BONUS_MAX_LEVEL,
  WORKSHOP_COINS_KILL_BONUS_UNLOCK_COINS,
  workshopCoinsKillBonusNextMarginalCoins,
  workshopCoinsKillBonusStatDisplay,
  workshopCoinsKillBonusStatMultiplier,
} from './workshopCoinsKillBonus'

describe('workshopCoinsKillBonus', () => {
  it('uses exact +0.01 per level without rounding the multiplier', () => {
    expect(workshopCoinsKillBonusStatMultiplier(0)).toBe(1)
    expect(workshopCoinsKillBonusStatMultiplier(1)).toBe(1.01)
    expect(workshopCoinsKillBonusStatMultiplier(10)).toBe(1.1)
    expect(workshopCoinsKillBonusStatMultiplier(149)).toBe(2.49)
    expect(workshopCoinsKillBonusStatDisplay(0)).toBe('x1.00')
    expect(workshopCoinsKillBonusStatDisplay(149)).toBe('x2.49')

    for (let i = 0; i < WORKSHOP_COINS_KILL_BONUS_ANCHOR_MULTIPLIERS.length; i++) {
      const level = [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 149][i]!
      expect(workshopCoinsKillBonusStatMultiplier(level)).toBe(
        WORKSHOP_COINS_KILL_BONUS_ANCHOR_MULTIPLIERS[i],
      )
    }
  })

  it('matches wiki milestone marginal Cost', () => {
    expect(WORKSHOP_COINS_KILL_BONUS_UNLOCK_COINS).toBe(100)
    expect(workshopCoinsKillBonusNextMarginalCoins(0)).toBe(50)
    expect(workshopCoinsKillBonusNextMarginalCoins(9)).toBe(838)
    expect(workshopCoinsKillBonusNextMarginalCoins(148)).toBe(467_980)
    expect(workshopCoinsKillBonusNextMarginalCoins(149)).toBeUndefined()
  })

  it('max level is 149', () => {
    expect(WORKSHOP_COINS_KILL_BONUS_MAX_LEVEL).toBe(149)
  })
})
