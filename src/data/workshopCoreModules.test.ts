import { describe, expect, it } from 'vitest'
import {
  formatWorkshopCoreModuleAbility,
  formatWorkshopCoreModuleValue,
  WORKSHOP_CORE_MODULES,
  WORKSHOP_CORE_MODULE_NOTES,
  WORKSHOP_CORE_MODULE_ORDER,
  workshopCoreModuleValue,
} from './workshopCoreModules'

describe('workshopCoreModules', () => {
  it('lists six core modules with four rarity tiers each', () => {
    expect(WORKSHOP_CORE_MODULE_ORDER).toHaveLength(6)
    for (const id of WORKSHOP_CORE_MODULE_ORDER) {
      const def = WORKSHOP_CORE_MODULES[id]
      expect(def.values.epic).toBeDefined()
      expect(def.values.ancestral).toBeDefined()
    }
  })

  it('matches wiki values including negative Multiverse Nexus ancestral', () => {
    expect(workshopCoreModuleValue('multiverseNexus', 'ancestral')).toBe(-10)
    expect(workshopCoreModuleValue('omChip', 'mythic')).toBe(7)
    expect(formatWorkshopCoreModuleValue('mult', 15)).toBe('×15')
    expect(formatWorkshopCoreModuleValue('count', -10)).toBe('-10')
  })

  it('fills [x] in ability descriptions', () => {
    expect(formatWorkshopCoreModuleAbility('omChip', 'epic')).toContain('increasing by ×2')
    expect(formatWorkshopCoreModuleAbility('omChip', 'ancestral')).not.toContain('××')
    expect(formatWorkshopCoreModuleAbility('multiverseNexus', 'epic')).toContain('20')
    expect(formatWorkshopCoreModuleAbility('harmonyConductor', 'ancestral')).toContain(
      '30% chance',
    )
    expect(formatWorkshopCoreModuleAbility('harmonyConductor', 'ancestral')).not.toContain('%%')
    expect(formatWorkshopCoreModuleAbility('primordialCollapse', 'ancestral')).toContain(
      'decreased by 80%',
    )
    expect(formatWorkshopCoreModuleAbility('primordialCollapse', 'ancestral')).not.toContain('%%')
  })

  it('includes Dimension Core wiki notes', () => {
    expect(WORKSHOP_CORE_MODULE_NOTES.length).toBe(3)
    expect(WORKSHOP_CORE_MODULE_NOTES[0]).toContain('1.66')
  })
})
