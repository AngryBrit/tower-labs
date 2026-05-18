import { describe, expect, it } from 'vitest'
import {
  formatWorkshopGeneratorModuleAbility,
  formatWorkshopGeneratorModuleValue,
  WORKSHOP_GENERATOR_MODULES,
  WORKSHOP_GENERATOR_MODULE_NOTES,
  WORKSHOP_GENERATOR_MODULE_ORDER,
  workshopGeneratorModuleValue,
} from './workshopGeneratorModules'

describe('workshopGeneratorModules', () => {
  it('lists six generator modules with four rarity tiers each', () => {
    expect(WORKSHOP_GENERATOR_MODULE_ORDER).toHaveLength(6)
    for (const id of WORKSHOP_GENERATOR_MODULE_ORDER) {
      const def = WORKSHOP_GENERATOR_MODULES[id]
      expect(def.values.epic).toBeDefined()
      expect(def.values.ancestral).toBeDefined()
    }
  })

  it('matches wiki values for key modules', () => {
    expect(workshopGeneratorModuleValue('projectFunding', 'epic')).toBe(12.5)
    expect(workshopGeneratorModuleValue('restorativeBonus', 'ancestral')).toBe(30)
  })

  it('fills [x] in ability descriptions', () => {
    expect(formatWorkshopGeneratorModuleAbility('singularityHarness', 'epic')).toContain('+5m')
    expect(formatWorkshopGeneratorModuleAbility('galaxyCompressor', 'mythic')).toContain('17s')
    expect(formatWorkshopGeneratorModuleAbility('restorativeBonus', 'epic')).toContain('for 15s')
    expect(formatWorkshopGeneratorModuleAbility('blackHoleDigestor', 'legendary')).toContain('5%')
  })

  it('formats meter tier cells with m suffix', () => {
    expect(formatWorkshopGeneratorModuleValue('addMeters', 5)).toBe('+5m')
    expect(WORKSHOP_GENERATOR_MODULES.singularityHarness.kind).toBe('addMeters')
    expect(
      formatWorkshopGeneratorModuleValue(
        WORKSHOP_GENERATOR_MODULES.singularityHarness.kind,
        WORKSHOP_GENERATOR_MODULES.singularityHarness.values.epic,
      ),
    ).toBe('+5m')
  })

  it('formats duration tier cells with s suffix', () => {
    expect(formatWorkshopGeneratorModuleValue('seconds', 15)).toBe('15s')
    expect(WORKSHOP_GENERATOR_MODULES.restorativeBonus.kind).toBe('seconds')
    expect(
      formatWorkshopGeneratorModuleValue(
        WORKSHOP_GENERATOR_MODULES.restorativeBonus.kind,
        WORKSHOP_GENERATOR_MODULES.restorativeBonus.values.epic,
      ),
    ).toBe('15s')
  })

  it('includes wiki notes', () => {
    expect(WORKSHOP_GENERATOR_MODULE_NOTES).toHaveLength(4)
  })
})
