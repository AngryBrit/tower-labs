import { describe, expect, it } from 'vitest'
import { defaultWorkshopPersisted } from '../labPresetsStorage'
import {
  assistModuleConflictsWithMain,
  clampAssistStoneEfficiency,
  workshopAssistChassisModuleSelection,
} from './workshopAssistChassisModule'

describe('workshopAssistChassisModule', () => {
  it('defaults assist slots unlocked with epic rarity', () => {
    const ws = defaultWorkshopPersisted()
    expect(workshopAssistChassisModuleSelection(ws, 'cannon')).toMatchObject({
      unlocked: true,
      moduleId: null,
      rarity: 'epic',
      stoneEfficiency: 1,
    })
  })

  it('detects duplicate main/assist module names', () => {
    const ws = {
      ...defaultWorkshopPersisted(),
      simCannonChassisModuleId: 'deathPenalty',
      simCannonAssistChassisModuleId: 'astralDeliverance',
    }
    expect(assistModuleConflictsWithMain('cannon', ws, 'deathPenalty')).toBe(true)
    expect(assistModuleConflictsWithMain('cannon', ws, 'astralDeliverance')).toBe(false)
  })

  it('clamps stone efficiency to 0–70', () => {
    expect(clampAssistStoneEfficiency(0)).toBe(0)
    expect(clampAssistStoneEfficiency(71)).toBe(70)
    expect(clampAssistStoneEfficiency(34)).toBe(34)
  })
})
