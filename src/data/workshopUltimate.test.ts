import { describe, expect, it } from 'vitest'
import {
  workshopUltimateIsActive,
  workshopUltimateMaxLevel,
  workshopUltimateNextMarginalStones,
  workshopUltimateStatDisplay,
  workshopUltimateTotalStonesToMaxFrom,
} from './workshopUltimate'

describe('workshop ultimate wiki spot checks', () => {
  it('Chain Lightning chance L5 shows 12.50% with next cost 98', () => {
    expect(workshopUltimateStatDisplay('chainLightningChanceLevel', 5)).toBe('12.50%')
    expect(workshopUltimateNextMarginalStones('chainLightningChanceLevel', 5)).toBe(98)
  })

  it('Chain Lightning quantity L2 shows 2 with next cost 150', () => {
    expect(workshopUltimateStatDisplay('chainLightningQuantityLevel', 2)).toBe('2')
    expect(workshopUltimateNextMarginalStones('chainLightningQuantityLevel', 2)).toBe(150)
  })

  it('Death Wave quantity L2 shows 3 with next cost 850', () => {
    expect(workshopUltimateStatDisplay('deathWaveQuantityLevel', 2)).toBe('3')
    expect(workshopUltimateNextMarginalStones('deathWaveQuantityLevel', 2)).toBe(850)
  })

  it('Death Wave cooldown L10 shows 3m 20s with next cost 168', () => {
    expect(workshopUltimateStatDisplay('deathWaveCooldownLevel', 10)).toBe('3m 20s')
    expect(workshopUltimateNextMarginalStones('deathWaveCooldownLevel', 10)).toBe(168)
  })

  it('Death Wave basic upgrades match wiki totals (29,391 stones)', () => {
    expect(workshopUltimateMaxLevel('deathWaveDamageLevel')).toBe(30)
    expect(workshopUltimateMaxLevel('deathWaveQuantityLevel')).toBe(4)
    expect(workshopUltimateMaxLevel('deathWaveCooldownLevel')).toBe(25)
    expect(workshopUltimateStatDisplay('deathWaveDamageLevel', 30)).toBe('x9119')
    expect(workshopUltimateStatDisplay('deathWaveCooldownLevel', 25)).toBe('50s')
    expect(workshopUltimateTotalStonesToMaxFrom('deathWaveDamageLevel', 0)).toBe(17_591)
    expect(workshopUltimateTotalStonesToMaxFrom('deathWaveQuantityLevel', 0)).toBe(2_950)
    expect(workshopUltimateTotalStonesToMaxFrom('deathWaveCooldownLevel', 0)).toBe(8_850)
    expect(
      workshopUltimateTotalStonesToMaxFrom('deathWaveDamageLevel', 0) +
        workshopUltimateTotalStonesToMaxFrom('deathWaveQuantityLevel', 0) +
        workshopUltimateTotalStonesToMaxFrom('deathWaveCooldownLevel', 0),
    ).toBe(29_391)
  })

  it('Golden Tower bonus L16 shows x17.8 with next cost 950', () => {
    expect(workshopUltimateStatDisplay('goldenTowerBonusLevel', 16)).toBe('x17.8')
    expect(workshopUltimateNextMarginalStones('goldenTowerBonusLevel', 16)).toBe(950)
  })

  it('Spotlight angle L0 shows 30°', () => {
    expect(workshopUltimateStatDisplay('spotlightAngleLevel', 0)).toBe('30°')
  })

  it('Black Hole size L7 shows 44.00m with next cost 64', () => {
    expect(workshopUltimateStatDisplay('blackHoleSizeLevel', 7)).toBe('44.00m')
    expect(workshopUltimateNextMarginalStones('blackHoleSizeLevel', 7)).toBe(64)
  })

  it('Black Hole cooldown L0 shows 3m 20s with next cost 10', () => {
    expect(workshopUltimateStatDisplay('blackHoleCooldownLevel', 0)).toBe('3m 20s')
    expect(workshopUltimateNextMarginalStones('blackHoleCooldownLevel', 0)).toBe(10)
  })

  it('treats missing active flags as off', () => {
    expect(workshopUltimateIsActive({}, 'goldenTower')).toBe(false)
    expect(workshopUltimateIsActive({ goldenTowerActive: true }, 'goldenTower')).toBe(true)
  })

  it('every ultimate row has a finite max level', () => {
    expect(workshopUltimateMaxLevel('spotlightAngleLevel')).toBeGreaterThan(0)
    expect(
      workshopUltimateNextMarginalStones(
        'spotlightAngleLevel',
        workshopUltimateMaxLevel('spotlightAngleLevel'),
      ),
    ).toBeUndefined()
  })
})
