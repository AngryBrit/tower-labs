import { describe, expect, it } from 'vitest'
import {
  WORKSHOP_CHASSIS_MODULE_MAX_LEVEL_BY_RARITY,
  clampWorkshopChassisModuleLevel,
  workshopChassisModuleMaxLevel,
} from './workshopChassisModuleShared'

describe('workshopChassisModuleMaxLevel', () => {
  it('matches wiki merge-tier caps (Epic 60 … Ancestral 5★ 300)', () => {
    expect(WORKSHOP_CHASSIS_MODULE_MAX_LEVEL_BY_RARITY).toEqual({
      epic: 60,
      legendary: 100,
      mythic: 140,
      ancestral: 300,
    })
    expect(workshopChassisModuleMaxLevel('mythic')).toBe(140)
  })

  it('clamps module level to the selected rarity max', () => {
    expect(clampWorkshopChassisModuleLevel(101, 'epic')).toBe(60)
    expect(clampWorkshopChassisModuleLevel(-3, 'legendary')).toBe(0)
    expect(clampWorkshopChassisModuleLevel(250.9, 'ancestral')).toBe(250)
  })
})
