import { describe, expect, it } from 'vitest'
import { workshopDamageNextMarginalCoins } from './workshopDamage'

describe('workshopDamage marginal coins', () => {
  it('Lv 5900 wiki row marginal Cost (5899→5900) is 1.97T, not the Total column 315.16T', () => {
    expect(workshopDamageNextMarginalCoins(5899)).toBe(1.97e12)
  })
})
