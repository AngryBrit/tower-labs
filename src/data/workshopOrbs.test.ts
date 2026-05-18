import { describe, expect, it } from 'vitest'
import {
  WORKSHOP_ORBS_MAX_LEVEL,
  workshopOrbsNextMarginalCoins,
  workshopOrbsStatDisplay,
  workshopOrbsStatCount,
} from './workshopOrbs'

describe('workshopOrbs', () => {
  it('has 4 marginal costs matching wiki total spend', () => {
    let sum = 0
    for (let k = 0; k < WORKSHOP_ORBS_MAX_LEVEL; k += 1) {
      const c = workshopOrbsNextMarginalCoins(k)
      expect(c).toBeDefined()
      sum += c!
    }
    expect(sum).toBe(493_000)
  })

  it('matches wiki Value and Cost spot checks', () => {
    expect(workshopOrbsStatCount(0)).toBe(0)
    expect(workshopOrbsStatDisplay(1)).toBe('1')
    expect(workshopOrbsStatDisplay(4)).toBe('4')
    expect(workshopOrbsNextMarginalCoins(0)).toBe(3_000)
    expect(workshopOrbsNextMarginalCoins(3)).toBe(350_000)
    expect(workshopOrbsNextMarginalCoins(4)).toBeUndefined()
  })
})
