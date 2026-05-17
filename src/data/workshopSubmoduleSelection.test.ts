import { describe, expect, it } from 'vitest'
import { defaultWorkshopPersisted, sanitizeWorkshopPersisted } from '../labPresetsStorage'
import { submoduleEffectId } from './workshopSubmoduleCatalog'
import {
  CANNON_ATTACK_SPEED_EFFECT_ID,
  cannonSubmoduleAttackSpeedFromSelections,
  defaultWorkshopSubmoduleSelections,
  parseSubmoduleSelectionsJson,
  sanitizeSubmoduleSelectionMap,
  toggleSubmoduleSelection,
  workshopPersistedWithSubmoduleSelections,
} from './workshopSubmoduleSelection'

describe('workshopSubmoduleSelection', () => {
  it('builds stable effect ids from labels', () => {
    expect(submoduleEffectId('Attack Speed')).toBe('attack-speed')
    expect(submoduleEffectId('Crit Chance [%]')).toBe('crit-chance')
  })

  it('toggles selection on valid cells and clears on repeat click', () => {
    let map = toggleSubmoduleSelection({}, CANNON_ATTACK_SPEED_EFFECT_ID, 'epic', '0.7')
    expect(map).toEqual({ [CANNON_ATTACK_SPEED_EFFECT_ID]: 'epic' })
    map = toggleSubmoduleSelection(map, CANNON_ATTACK_SPEED_EFFECT_ID, 'epic', '0.7')
    expect(map).toEqual({})
  })

  it('ignores n/a cells', () => {
    expect(
      toggleSubmoduleSelection({}, CANNON_ATTACK_SPEED_EFFECT_ID, 'common', null),
    ).toEqual({})
  })

  it('derives cannon attack speed from attack-speed pick', () => {
    const map = { [CANNON_ATTACK_SPEED_EFFECT_ID]: 'legendary' as const }
    expect(cannonSubmoduleAttackSpeedFromSelections(map)).toBe(1)
  })

  it('syncs simAttackSpeedModuleSubEffect when cannon selections change', () => {
    const ws = defaultWorkshopPersisted()
    const next = workshopPersistedWithSubmoduleSelections(ws, 'cannon', {
      [CANNON_ATTACK_SPEED_EFFECT_ID]: 'mythic',
    })
    expect(next.simAttackSpeedModuleSubEffect).toBe(3)
    expect(next.simSubmoduleSelections.cannon).toEqual({
      [CANNON_ATTACK_SPEED_EFFECT_ID]: 'mythic',
    })
  })

  it('sanitizes persisted submodule selections and legacy attack speed', () => {
    const ws = sanitizeWorkshopPersisted({
      simAttackSpeedModuleSubEffect: 2.5,
      simSubmoduleSelections: {
        cannon: { [CANNON_ATTACK_SPEED_EFFECT_ID]: 'mythic', bogus: 'epic' },
      },
    })
    expect(ws.simSubmoduleSelections.cannon).toEqual({
      [CANNON_ATTACK_SPEED_EFFECT_ID]: 'mythic',
    })
    expect(ws.simAttackSpeedModuleSubEffect).toBe(3)
  })

  it('keeps legacy attack speed when no cannon sub-module pick', () => {
    const ws = sanitizeWorkshopPersisted({ simAttackSpeedModuleSubEffect: 2.5 })
    expect(ws.simSubmoduleSelections).toEqual(defaultWorkshopSubmoduleSelections())
    expect(ws.simAttackSpeedModuleSubEffect).toBe(2.5)
  })

  it('drops unknown effect ids per slot', () => {
    expect(
      sanitizeSubmoduleSelectionMap('armor', {
        'health-regen': 'rare',
        'attack-speed': 'epic',
        bogus: 'mythic',
      }),
    ).toEqual({ 'health-regen': 'rare' })
  })

  it('parses JSON selections from CSV-style strings', () => {
    const parsed = parseSubmoduleSelectionsJson(
      JSON.stringify({ cannon: { 'attack-speed': 'common' } }),
    )
    expect(parsed.cannon).toEqual({ 'attack-speed': 'common' })
  })
})
