import { describe, expect, it } from 'vitest'
import { defaultWorkshopPersisted } from '../labPresetsStorage'
import {
  sanitizeChassisModuleId,
  workshopChassisModuleSelection,
} from './workshopChassisModuleSelection'

describe('workshopChassisModuleSelection', () => {
  it('reads empty selection by default', () => {
    const ws = defaultWorkshopPersisted()
    expect(workshopChassisModuleSelection(ws, 'cannon')).toEqual({
      moduleId: null,
      rarity: 'epic',
    })
  })

  it('sanitizes module ids per chassis', () => {
    expect(sanitizeChassisModuleId('cannon', 'deathPenalty')).toBe('deathPenalty')
    expect(sanitizeChassisModuleId('cannon', 'notReal')).toBeNull()
    expect(sanitizeChassisModuleId('armor', 'deathPenalty')).toBeNull()
  })
})
