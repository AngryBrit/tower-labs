import { describe, expect, it } from 'vitest'
import {
  computeThemeCoinBonusMultiplier,
  countOwnedThemesForCoinBonus,
  formatThemeCoinBonusMultiplier,
} from './themeCoinBonus'

describe('computeThemeCoinBonusMultiplier', () => {
  it('returns 1 when no themes are owned', () => {
    expect(
      computeThemeCoinBonusMultiplier({
        tower: 0,
        background: 0,
        music: 0,
        menus: 0,
        banners: 0,
        guardian: 0,
      }),
    ).toBe(1)
  })

  it('matches wiki formula for sample quantities', () => {
    expect(
      computeThemeCoinBonusMultiplier({
        tower: 10,
        background: 5,
        music: 3,
        menus: 7,
        banners: 4,
        guardian: 8,
      }),
    ).toBeCloseTo(
      1 + 0.004 * 10 + 0.008 * 5 + 0.006 * 3 + 0.006 * 7 + 0.006 * 4 + 0.006 * 8,
      10,
    )
  })
})

describe('countOwnedThemesForCoinBonus', () => {
  it('counts owned themes in every coin category including music', () => {
    const counts = countOwnedThemesForCoinBonus(
      new Set([
        'music-krisu-oceans-sings',
        'music-krisu-forest-bathing',
        'tower-shuriken',
        'bg-volcano',
        'menu-mech',
        'banner-mech',
        'guardian-butter',
      ]),
    )
    expect(counts).toEqual({
      tower: 1,
      background: 1,
      music: 2,
      menus: 1,
      banners: 1,
      guardian: 1,
    })
  })
})

describe('formatThemeCoinBonusMultiplier', () => {
  it('formats multiplier with × prefix', () => {
    expect(formatThemeCoinBonusMultiplier(1.024)).toBe('×1.024')
  })
})
