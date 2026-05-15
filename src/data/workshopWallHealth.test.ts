import { describe, expect, it } from 'vitest'
import {
  WORKSHOP_WALL_HEALTH_MAX_LEVEL,
  workshopWallHealthNextMarginalCoins,
  workshopWallHealthStatDisplay,
  workshopWallHealthStatPercent,
} from './workshopWallHealth'

describe('workshopWallHealth', () => {
  it('matches wiki milestone Value and marginal Cost', () => {
    expect(workshopWallHealthStatPercent(0)).toBe(0)
    expect(workshopWallHealthStatPercent(1)).toBe(20.1)
    expect(workshopWallHealthStatPercent(100)).toBe(30)
    expect(workshopWallHealthStatPercent(1800)).toBe(200)
    expect(workshopWallHealthStatDisplay(1)).toBe('+20.10%')

    expect(workshopWallHealthNextMarginalCoins(0)).toBe(8e6)
    expect(workshopWallHealthNextMarginalCoins(99)).toBe(31.91e6)
    expect(workshopWallHealthNextMarginalCoins(1799)).toBe(23.48e12)
    expect(workshopWallHealthNextMarginalCoins(1800)).toBeUndefined()
  })

  it('max level is 1800', () => {
    expect(WORKSHOP_WALL_HEALTH_MAX_LEVEL).toBe(1800)
  })
})
