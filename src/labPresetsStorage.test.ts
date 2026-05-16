import { describe, expect, it } from 'vitest'
import {
  buildLabPresetsPayload,
  defaultWorkshopPersisted,
  parseLabPresetsFile,
  resetWorkshopCards,
  resetWorkshopUpgradeLevels,
} from './labPresetsStorage'

describe('parseLabPresetsFile', () => {
  it('accepts a valid v1 file', () => {
    const raw = {
      v: 1,
      activePresetId: 'a',
      presets: [{ id: 'a', name: 'A', levelOverrides: { '0-0': 1 } }],
      scratchOverrides: { '0-1': 2 },
    }
    expect(parseLabPresetsFile(raw)).toEqual(raw)
  })

  it('rejects invalid preset entries', () => {
    expect(
      parseLabPresetsFile({
        v: 1,
        presets: [{ id: 1, name: 'x', levelOverrides: {} }],
        scratchOverrides: {},
      }),
    ).toBeNull()
  })
})

describe('resetWorkshopCards', () => {
  it('clears card state but keeps workshop upgrade levels', () => {
    const before = {
      ...defaultWorkshopPersisted(),
      damageLevel: 42,
      enhanceDamageLevel: 3,
      simAssistModuleSlot: 'armor' as const,
      simRelicsBonusFraction: 0.25,
      cardStars: { ...defaultWorkshopPersisted().cardStars, damage: 5 },
      cardEquipSlots: 8,
    }
    before.cardPresetLoadouts[0] = ['damage', 'health']
    const after = resetWorkshopCards(before)
    expect(after.damageLevel).toBe(42)
    expect(after.enhanceDamageLevel).toBe(3)
    expect(after.simAssistModuleSlot).toBe('armor')
    expect(after.simRelicsBonusFraction).toBe(0.25)
    expect(after.cardStars.damage).toBe(0)
    expect(after.cardEquipSlots).toBe(1)
    expect(after.cardPresetLoadouts[0]).toEqual([])
    expect(after.simDamageCardStars).toBe(0)
  })
})

describe('resetWorkshopUpgradeLevels', () => {
  it('clears upgrade levels but keeps cards and modules sim', () => {
    const before = {
      ...defaultWorkshopPersisted(),
      damageLevel: 42,
      enhanceDamageLevel: 3,
      cardStars: { ...defaultWorkshopPersisted().cardStars, damage: 5 },
      simAssistModuleSlot: 'armor' as const,
      simAttackSpeedModuleSubEffect: 12,
    }
    const after = resetWorkshopUpgradeLevels(before)
    expect(after.damageLevel).toBe(0)
    expect(after.enhanceDamageLevel).toBe(0)
    expect(after.cardStars.damage).toBe(5)
    expect(after.simAssistModuleSlot).toBe('armor')
    expect(after.simAttackSpeedModuleSubEffect).toBe(12)
    expect(after.simDamageCardStars).toBe(0)
  })
})

describe('buildLabPresetsPayload', () => {
  const def = defaultWorkshopPersisted()

  it('merges active preset levels into presets array', () => {
    const p = buildLabPresetsPayload(
      'a',
      [{ id: 'a', name: 'A', levelOverrides: { '0-0': 0 } }],
      { '0-0': 5 },
      {},
      def,
      def,
    )
    expect(p.presets[0].levelOverrides).toEqual({ '0-0': 5 })
    expect(p.presets[0].workshop).toEqual(def)
    expect(p.scratchOverrides).toEqual({})
    expect(p.scratchWorkshop).toEqual(def)
  })

  it('writes scratch when no active preset', () => {
    const p = buildLabPresetsPayload(null, [], { '1-1': 3 }, {}, def, def)
    expect(p.scratchOverrides).toEqual({ '1-1': 3 })
    expect(p.scratchWorkshop).toEqual(def)
  })
})
