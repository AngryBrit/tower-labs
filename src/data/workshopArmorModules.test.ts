import { describe, expect, it } from 'vitest'
import {
  formatWorkshopArmorModuleAbility,
  formatWorkshopArmorModuleValue,
  WORKSHOP_ARMOR_MODULES,
  WORKSHOP_ARMOR_MODULE_NOTES,
  WORKSHOP_ARMOR_MODULE_ORDER,
  workshopArmorModuleValue,
} from './workshopArmorModules'

describe('workshopArmorModules', () => {
  it('lists six armor modules with four rarity tiers each', () => {
    expect(WORKSHOP_ARMOR_MODULE_ORDER).toHaveLength(6)
    for (const id of WORKSHOP_ARMOR_MODULE_ORDER) {
      const def = WORKSHOP_ARMOR_MODULES[id]
      expect(def.values.epic).toBeDefined()
      expect(def.values.ancestral).toBeDefined()
    }
  })

  it('matches wiki values for key modules', () => {
    expect(workshopArmorModuleValue('wormholeRedirector', 'ancestral')).toBe(100)
    expect(workshopArmorModuleValue('orbitalAugment', 'mythic')).toBe(6)
    expect(formatWorkshopArmorModuleValue('mult', 1.25)).toBe('×1.25')
    expect(formatWorkshopArmorModuleValue('damageMult', 15)).toBe('15x')
  })

  it('fills [x] in ability descriptions', () => {
    expect(formatWorkshopArmorModuleAbility('antiCubePortal', 'epic')).toContain('10x damage')
    expect(formatWorkshopArmorModuleAbility('sharpFortitude', 'legendary')).toContain('×1.5')
    expect(formatWorkshopArmorModuleAbility('negativeMassProjector', 'ancestral')).toContain(
      '2.5%',
    )
  })

  it('includes wiki notes', () => {
    expect(WORKSHOP_ARMOR_MODULE_NOTES.length).toBeGreaterThanOrEqual(2)
  })
})
