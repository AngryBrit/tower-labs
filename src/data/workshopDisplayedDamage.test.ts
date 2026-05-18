import { describe, expect, it } from 'vitest'
import { formatCoinAbbrev } from '../labCosts'
import { workshopDamageStatAtLevel } from './workshopDamage'
import {
  computeWorkshopDisplayedDamage,
  computeWorkshopDisplayedDamagePreBerserker,
  workshopDisplayedDamageFromWorkshopLevel,
  workshopDisplayedDamagePerkMultiplier,
} from './workshopDisplayedDamage'
import { workshopBerserkerDisplayedDamageAdd } from './workshopSimCards'
import { workshopDamageStatDisplay } from './workshopDamage'

describe('workshopDisplayedDamage', () => {
  it('matches wiki product at max workshop + ×3 lab (213.33 M)', () => {
    const workshop = workshopDamageStatAtLevel(6000)
    expect(workshop).toBeCloseTo(71.11e6, -3)
    const displayed = computeWorkshopDisplayedDamage(workshop, { labMultiplier: 3 })
    expect(displayed).toBeCloseTo(213.33e6, -3)
    expect(formatCoinAbbrev(displayed)).toBe('213.33 M')
  })

  it('applies enhancement and perk factors in order', () => {
    const workshop = 1000
    const v = computeWorkshopDisplayedDamage(workshop, {
      labMultiplier: 2,
      damageCardMultiplier: 1.5,
      relicsBonus: 0.1,
      cannonModulePercent: 0.2,
      enhancementsMultiplier: 1.01,
      perkDamageQuantity: 2,
      standardPerkBonus: 0.25,
      berserkerDamageAdd: 500,
    })
    const perk = workshopDisplayedDamagePerkMultiplier({
      perkDamageQuantity: 2,
      standardPerkBonus: 0.25,
    })
    expect(perk).toBe(1.625)
    expect(v).toBe(workshop * 2 * 1.5 * 1.1 * 1.2 * 1.01 * perk + 500)
  })

  it('workshopDamageStatDisplay accepts legacy lab-only number', () => {
    const level = 1
    expect(workshopDamageStatDisplay(level, 1.02)).toBe(
      formatCoinAbbrev(workshopDamageStatAtLevel(level) * 1.02),
    )
  })

  it('workshopDisplayedDamageFromWorkshopLevel without opts returns workshop only', () => {
    expect(workshopDisplayedDamageFromWorkshopLevel(100)).toBe(
      workshopDamageStatAtLevel(100),
    )
  })

  it('wiki berserker: product 1000 + capped add 7000', () => {
    const pre = computeWorkshopDisplayedDamagePreBerserker(1000, {
      labMultiplier: 1,
      perkDamageQuantity: 0,
    })
    const add = workshopBerserkerDisplayedDamageAdd(pre, 1_000_000, 1)
    expect(add).toBe(7000)
    expect(computeWorkshopDisplayedDamage(1000, { berserkerDamageAdd: add })).toBe(
      8000,
    )
  })
})
