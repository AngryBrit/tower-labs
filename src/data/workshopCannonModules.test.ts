import { describe, expect, it } from 'vitest'
import {
  formatWorkshopCannonModuleAbility,
  formatWorkshopCannonModuleValue,
  WORKSHOP_CANNON_MODULES,
  WORKSHOP_CANNON_MODULE_ORDER,
  workshopCannonModuleValue,
} from './workshopCannonModules'

describe('workshopCannonModules', () => {
  it('lists six cannon modules with four rarity tiers each', () => {
    expect(WORKSHOP_CANNON_MODULE_ORDER).toHaveLength(6)
    for (const id of WORKSHOP_CANNON_MODULE_ORDER) {
      const def = WORKSHOP_CANNON_MODULES[id]
      expect(def.values.epic).toBeDefined()
      expect(def.values.ancestral).toBeDefined()
    }
  })

  it('matches wiki values for Astral Deliverance and Amplifying Strike', () => {
    expect(workshopCannonModuleValue('astralDeliverance', 'mythic')).toBe(60)
    expect(workshopCannonModuleValue('amplifyingStrike', 'ancestral')).toBe(26)
    expect(formatWorkshopCannonModuleValue('seconds', 11)).toBe('11s')
  })

  it('fills [x] in ability descriptions', () => {
    expect(formatWorkshopCannonModuleAbility('beingAnnihilator', 'epic')).toContain(
      'next 3 attacks',
    )
    expect(formatWorkshopCannonModuleAbility('deathPenalty', 'legendary')).toContain(
      'Chance of 8%',
    )
    expect(formatWorkshopCannonModuleAbility('amplifyingStrike', 'epic')).toContain('for 5s')
    expect(formatWorkshopCannonModuleAbility('havocBringer', 'ancestral')).toContain('20% chance')
    expect(formatWorkshopCannonModuleAbility('havocBringer', 'ancestral')).not.toContain('%%')
  })
})
