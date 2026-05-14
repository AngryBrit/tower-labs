import { describe, expect, it } from 'vitest'
import {
  WORKSHOP_REND_ARMOR_CHANCE_MAX_LEVEL,
  workshopRendArmorChanceNextMarginalCoins,
  workshopRendArmorChancePercent,
  workshopRendArmorChanceStatDisplay,
  workshopRendArmorMultNextMarginalCoins,
  workshopRendArmorMultStatDisplay,
  workshopRendArmorMultValue,
} from './workshopRendArmor'

describe('workshopRendArmor', () => {
  it('matches wiki milestone marginals', () => {
    expect(workshopRendArmorChanceNextMarginalCoins(0)).toBe(600_000_000)
    expect(workshopRendArmorChanceNextMarginalCoins(8)).toBe(614_098_750)
    expect(workshopRendArmorChanceNextMarginalCoins(9)).toBe(627_210_000)
    expect(workshopRendArmorChanceNextMarginalCoins(298)).toBe(19.83e15)
  })

  it('shares the same ladder for mult next cost', () => {
    expect(workshopRendArmorMultNextMarginalCoins(0)).toBe(
      workshopRendArmorChanceNextMarginalCoins(0),
    )
  })

  it('sums 299 purchases to wiki total 418.97q', () => {
    let sum = 0n
    for (let i = 0; i < WORKSHOP_REND_ARMOR_CHANCE_MAX_LEVEL; i += 1) {
      const c = workshopRendArmorChanceNextMarginalCoins(i)
      expect(c).toBeDefined()
      sum += BigInt(Math.round(c!))
    }
    expect(sum).toBe(418_970_000_000_000_000n)
  })

  it('stat displays at min and max', () => {
    expect(workshopRendArmorChanceStatDisplay(0)).toBe('0.10%')
    expect(workshopRendArmorChanceStatDisplay(299)).toBe('30.00%')
    expect(workshopRendArmorChancePercent(299)).toBe(30)

    expect(workshopRendArmorMultStatDisplay(0)).toBe('0.0010X')
    expect(workshopRendArmorMultStatDisplay(299)).toBe('0.3000X')
    expect(workshopRendArmorMultValue(299)).toBe(0.3)
  })
})
