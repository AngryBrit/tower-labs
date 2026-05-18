import { describe, expect, it } from 'vitest'
import { formatWorkshopChassisModuleHeroStat } from './workshopChassisModuleHeroStat'
import { WORKSHOP_ARMOR_MODULES } from './workshopArmorModules'
import { WORKSHOP_CANNON_MODULES } from './workshopCannonModules'

describe('formatWorkshopChassisModuleHeroStat', () => {
  it('scales Amplifying Strike proc mult by module level', () => {
    const line = formatWorkshopChassisModuleHeroStat(
      'cannon',
      WORKSHOP_CANNON_MODULES.amplifyingStrike,
      'mythic',
      { moduleLevel: 101 },
    )
    expect(line).toBe('x2.460 Tower Damage')
  })

  it('shows base proc mult when module level is 0', () => {
    const line = formatWorkshopChassisModuleHeroStat(
      'cannon',
      WORKSHOP_CANNON_MODULES.amplifyingStrike,
      'epic',
    )
    expect(line).toBe('x5 Tower Damage')
  })

  it('stacks Sharp Fortitude with Health card mult at module level 100', () => {
    const line = formatWorkshopChassisModuleHeroStat(
      'armor',
      WORKSHOP_ARMOR_MODULES.sharpFortitude,
      'legendary',
      { moduleLevel: 100, healthMult: 2 },
    )
    expect(line).toBe('x2.270 Tower Health')
  })

  it('stacks Sharp Fortitude with Health+ enhance at module level 100', () => {
    const line = formatWorkshopChassisModuleHeroStat(
      'armor',
      WORKSHOP_ARMOR_MODULES.sharpFortitude,
      'legendary',
      { moduleLevel: 100, enhanceHealthLevel: 100 },
    )
    expect(line).toBe('x2.270 Tower Health')
  })

  it('uses module scaling only when no health card or enhance', () => {
    const line = formatWorkshopChassisModuleHeroStat(
      'armor',
      WORKSHOP_ARMOR_MODULES.sharpFortitude,
      'legendary',
      { moduleLevel: 100 },
    )
    expect(line).toBe('x1.270 Tower Health')
  })

  it('formats armor percent modules with label', () => {
    const line = formatWorkshopChassisModuleHeroStat(
      'armor',
      { name: 'Test', description: '[x]% health', kind: 'percent', values: { epic: 1.15, legendary: 1.15, mythic: 1.15, ancestral: 1.15 } },
      'epic',
    )
    expect(line).toBe('1.15% Defense')
  })
})
