import { describe, expect, it } from 'vitest'
import {
  WORKSHOP_CASH_PER_WAVE_MAX_LEVEL,
  workshopCashPerWaveNextMarginalCoins,
  workshopCashPerWaveStatDisplay,
  workshopCashPerWaveStatAmount,
} from './workshopCashPerWave'

describe('workshopCashPerWave', () => {
  it('matches wiki milestone Value and marginal Cost', () => {
    expect(workshopCashPerWaveStatAmount(0)).toBe(0)
    expect(workshopCashPerWaveStatDisplay(0)).toBe('0')
    expect(workshopCashPerWaveStatAmount(1)).toBe(4)
    expect(workshopCashPerWaveStatAmount(10)).toBe(40)
    expect(workshopCashPerWaveStatAmount(149)).toBe(596)
    expect(workshopCashPerWaveStatDisplay(149)).toBe('596')

    expect(workshopCashPerWaveNextMarginalCoins(0)).toBe(30)
    expect(workshopCashPerWaveNextMarginalCoins(9)).toBe(674)
    expect(workshopCashPerWaveNextMarginalCoins(148)).toBe(352_360)
    expect(workshopCashPerWaveNextMarginalCoins(149)).toBeUndefined()
  })

  it('max level is 149', () => {
    expect(WORKSHOP_CASH_PER_WAVE_MAX_LEVEL).toBe(149)
  })
})
