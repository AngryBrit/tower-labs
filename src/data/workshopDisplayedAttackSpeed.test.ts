import { describe, expect, it } from 'vitest'
import { workshopAttackSpeedStatValue } from './workshopAttackSpeed'
import {
  computeWorkshopDisplayedAttackSpeed,
  workshopDisplayedAttackSpeedFromWorkshopLevel,
} from './workshopDisplayedAttackSpeed'
import { workshopAttackSpeedCardMultiplier } from './workshopSimCards'
import { workshopAttackSpeedStatDisplay } from './workshopAttackSpeed'
import { workshopEnhanceAttackSpeedMultiplier } from './workshopEnhanceAttack'

describe('workshopDisplayedAttackSpeed', () => {
  it('matches wiki formula order: (W×L×C + sub) × enh', () => {
    const workshop = 10
    const v = computeWorkshopDisplayedAttackSpeed(workshop, {
      labMultiplier: 2,
      attackSpeedCardMultiplier: 1.5,
      moduleSubEffect: 0.7,
      enhancementsMultiplier: 1.01,
    })
    expect(v).toBe((workshop * 2 * 1.5 + 0.7) * 1.01)
  })

  it('workshop base is not rounded before formula', () => {
    expect(workshopAttackSpeedStatValue(1)).toBe(1.05)
    expect(workshopAttackSpeedStatValue(3)).toBe(1.15)
  })

  it('attack speed card stars match wiki multipliers', () => {
    expect(workshopAttackSpeedCardMultiplier(0)).toBe(1)
    expect(workshopAttackSpeedCardMultiplier(1)).toBe(1.25)
    expect(workshopAttackSpeedCardMultiplier(7)).toBe(2.15)
  })

  it('max workshop + lab + card with ancestral submodule and max enhance', () => {
    const workshop = workshopAttackSpeedStatValue(99)
    expect(workshop).toBe(5.95)
    const v = computeWorkshopDisplayedAttackSpeed(workshop, {
      labMultiplier: 2.98,
      attackSpeedCardMultiplier: 2.15,
      moduleSubEffect: 5,
      enhancementsMultiplier: workshopEnhanceAttackSpeedMultiplier(75),
    })
    expect(v).toBe((5.95 * 2.98 * 2.15 + 5) * 1.75)
  })

  it('workshopAttackSpeedStatDisplay uses formula when opts passed', () => {
    const level = 10
    const opts = { labMultiplier: 1.02 }
    expect(workshopAttackSpeedStatDisplay(level, opts)).toBe(
      workshopDisplayedAttackSpeedFromWorkshopLevel(level, opts).toFixed(2),
    )
  })
})
