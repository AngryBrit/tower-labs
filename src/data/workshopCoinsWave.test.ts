import { describe, expect, it } from 'vitest'
import {
  WORKSHOP_COINS_WAVE_BASE_AMOUNT,
  WORKSHOP_COINS_WAVE_MAX_LEVEL,
  WORKSHOP_COINS_WAVE_UNLOCK_COINS,
  workshopCoinsWaveNextMarginalCoins,
  workshopCoinsWaveStatDisplay,
  workshopCoinsWaveStatAmount,
} from './workshopCoinsWave'

describe('workshopCoinsWave', () => {
  it('uses exact 1 + level for Value and wiki marginal Cost', () => {
    expect(WORKSHOP_COINS_WAVE_UNLOCK_COINS).toBe(100)
    expect(workshopCoinsWaveStatAmount(0)).toBe(WORKSHOP_COINS_WAVE_BASE_AMOUNT)
    expect(workshopCoinsWaveStatDisplay(0)).toBe('1')
    expect(workshopCoinsWaveStatAmount(1)).toBe(2)
    expect(workshopCoinsWaveStatAmount(10)).toBe(11)
    expect(workshopCoinsWaveStatAmount(149)).toBe(150)
    expect(workshopCoinsWaveStatDisplay(149)).toBe('150')

    expect(workshopCoinsWaveNextMarginalCoins(0)).toBe(50)
    expect(workshopCoinsWaveNextMarginalCoins(9)).toBe(838)
    expect(workshopCoinsWaveNextMarginalCoins(148)).toBe(467_980)
    expect(workshopCoinsWaveNextMarginalCoins(149)).toBeUndefined()
  })

  it('max level is 149', () => {
    expect(WORKSHOP_COINS_WAVE_MAX_LEVEL).toBe(149)
  })
})
