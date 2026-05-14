import { describe, expect, it } from 'vitest'
import { formatCoinAbbrev } from '../labCosts'
import {
  workshopDefenseMaxLevel,
  workshopDefenseNextMarginalCoins,
  workshopDefenseStatDisplay,
} from './workshopDefense'
import {
  WORKSHOP_DEFENSE_ABSOLUTE_MAX_LEVEL,
  workshopDefenseAbsoluteNextMarginalCoins,
  workshopDefenseAbsoluteStatValue,
} from './workshopDefenseAbsolute'
import {
  WORKSHOP_DEFENSE_PERCENT_MAX_LEVEL,
  workshopDefensePercentNextMarginalCoins,
} from './workshopDefensePercent'
import { WORKSHOP_HEALTH_MAX_LEVEL, workshopHealthNextMarginalCoins, workshopHealthStatValue } from './workshopHealth'
import {
  WORKSHOP_HEALTH_REGEN_MAX_LEVEL,
  workshopHealthRegenNextMarginalCoins,
} from './workshopHealthRegen'
import {
  WORKSHOP_THORN_DAMAGE_MAX_LEVEL,
  workshopThornDamageNextMarginalCoins,
} from './workshopThornDamage'
import {
  WORKSHOP_LIFESTEAL_MAX_LEVEL,
  workshopLifestealNextMarginalCoins,
} from './workshopLifesteal'
import {
  WORKSHOP_KNOCKBACK_CHANCE_MAX_LEVEL,
  workshopKnockbackChanceNextMarginalCoins,
} from './workshopKnockbackChance'
import {
  WORKSHOP_KNOCKBACK_FORCE_MAX_LEVEL,
  workshopKnockbackForceNextMarginalCoins,
} from './workshopKnockbackForce'

describe('workshopDefenseNextMarginalCoins', () => {
  it('Health uses workshop wiki ladder', () => {
    expect(workshopDefenseMaxLevel('healthLevel')).toBe(WORKSHOP_HEALTH_MAX_LEVEL)
    expect(workshopDefenseNextMarginalCoins('healthLevel', 0)).toBe(30)
    expect(workshopDefenseNextMarginalCoins('healthLevel', 90)).toBe(
      workshopHealthNextMarginalCoins(90),
    )
    expect(workshopDefenseNextMarginalCoins('healthLevel', 5099)).toBe(1.67e9)
  })

  it('Health Regen uses workshop wiki ladder (differs from Health at high tiers)', () => {
    expect(workshopDefenseMaxLevel('healthRegenLevel')).toBe(WORKSHOP_HEALTH_REGEN_MAX_LEVEL)
    expect(workshopDefenseNextMarginalCoins('healthRegenLevel', 5099)).toBe(1.25e9)
    expect(workshopDefenseNextMarginalCoins('healthRegenLevel', 5099)).toBe(
      workshopHealthRegenNextMarginalCoins(5099),
    )
  })

  it('Defense Absolute uses workshop wiki ladder (5000 levels)', () => {
    expect(workshopDefenseMaxLevel('defenseAbsoluteLevel')).toBe(WORKSHOP_DEFENSE_ABSOLUTE_MAX_LEVEL)
    expect(workshopDefenseAbsoluteStatValue(0)).toBe(0)
    expect(workshopDefenseAbsoluteStatValue(1)).toBe(1)
    expect(workshopDefenseAbsoluteStatValue(100)).toBe(1020)
    expect(workshopDefenseNextMarginalCoins('defenseAbsoluteLevel', 0)).toBe(50)
    expect(workshopDefenseNextMarginalCoins('defenseAbsoluteLevel', 99)).toBe(77_240)
    expect(workshopDefenseNextMarginalCoins('defenseAbsoluteLevel', 4999)).toBe(797.45e6)
    expect(workshopDefenseNextMarginalCoins('defenseAbsoluteLevel', 4999)).toBe(
      workshopDefenseAbsoluteNextMarginalCoins(4999),
    )
  })

  it('Defense % uses workshop wiki ladder (99 levels)', () => {
    expect(workshopDefenseMaxLevel('defensePercentLevel')).toBe(WORKSHOP_DEFENSE_PERCENT_MAX_LEVEL)
    expect(workshopDefenseNextMarginalCoins('defensePercentLevel', 0)).toBe(50)
    expect(workshopDefenseNextMarginalCoins('defensePercentLevel', 1)).toBe(76)
    expect(workshopDefenseNextMarginalCoins('defensePercentLevel', 75)).toBe(50_260)
    expect(workshopDefenseNextMarginalCoins('defensePercentLevel', 98)).toBe(90_730)
    expect(workshopDefenseNextMarginalCoins('defensePercentLevel', 98)).toBe(
      workshopDefensePercentNextMarginalCoins(98),
    )
    expect(workshopDefenseStatDisplay('defensePercentLevel', 0)).toBe('+0.00%')
    expect(workshopDefenseStatDisplay('defensePercentLevel', 1)).toBe('+0.50%')
    expect(workshopDefenseStatDisplay('defensePercentLevel', 99)).toBe('+49.50%')
  })

  it('Thorn Damage uses workshop wiki ladder (99 levels)', () => {
    expect(workshopDefenseMaxLevel('thornDamageLevel')).toBe(WORKSHOP_THORN_DAMAGE_MAX_LEVEL)
    expect(workshopDefenseNextMarginalCoins('thornDamageLevel', 0)).toBe(60)
    expect(workshopDefenseNextMarginalCoins('thornDamageLevel', 98)).toBe(75_550)
    expect(workshopDefenseNextMarginalCoins('thornDamageLevel', 98)).toBe(
      workshopThornDamageNextMarginalCoins(98),
    )
    expect(workshopDefenseStatDisplay('thornDamageLevel', 0)).toBe('+0.00%')
    expect(workshopDefenseStatDisplay('thornDamageLevel', 99)).toBe('+99.00%')
  })

  it('Lifesteal uses workshop wiki ladder (80 levels)', () => {
    expect(workshopDefenseMaxLevel('lifestealLevel')).toBe(WORKSHOP_LIFESTEAL_MAX_LEVEL)
    expect(workshopDefenseNextMarginalCoins('lifestealLevel', 0)).toBe(60)
    expect(workshopDefenseNextMarginalCoins('lifestealLevel', 79)).toBe(61_320)
    expect(workshopDefenseNextMarginalCoins('lifestealLevel', 79)).toBe(
      workshopLifestealNextMarginalCoins(79),
    )
    expect(workshopDefenseStatDisplay('lifestealLevel', 0)).toBe('+0.00%')
    expect(workshopDefenseStatDisplay('lifestealLevel', 80)).toBe('+4.46%')
  })

  it('Knockback Chance uses workshop wiki ladder (80 levels)', () => {
    expect(workshopDefenseMaxLevel('knockbackChanceLevel')).toBe(WORKSHOP_KNOCKBACK_CHANCE_MAX_LEVEL)
    expect(workshopDefenseNextMarginalCoins('knockbackChanceLevel', 0)).toBe(80)
    expect(workshopDefenseNextMarginalCoins('knockbackChanceLevel', 79)).toBe(66_330)
    expect(workshopDefenseNextMarginalCoins('knockbackChanceLevel', 79)).toBe(
      workshopKnockbackChanceNextMarginalCoins(79),
    )
    expect(workshopDefenseStatDisplay('knockbackChanceLevel', 0)).toBe('+0.00%')
    expect(workshopDefenseStatDisplay('knockbackChanceLevel', 80)).toBe('+80.00%')
  })

  it('Knockback Force uses workshop wiki ladder (40 levels)', () => {
    expect(workshopDefenseMaxLevel('knockbackForceLevel')).toBe(WORKSHOP_KNOCKBACK_FORCE_MAX_LEVEL)
    expect(workshopDefenseNextMarginalCoins('knockbackForceLevel', 0)).toBe(80)
    expect(workshopDefenseNextMarginalCoins('knockbackForceLevel', 39)).toBe(14_010)
    expect(workshopDefenseNextMarginalCoins('knockbackForceLevel', 39)).toBe(
      workshopKnockbackForceNextMarginalCoins(39),
    )
    expect(workshopDefenseStatDisplay('knockbackForceLevel', 0)).toBe('0.00')
    expect(workshopDefenseStatDisplay('knockbackForceLevel', 1)).toBe('0.55')
    expect(workshopDefenseStatDisplay('knockbackForceLevel', 40)).toBe('6.08')
  })

  it('returns undefined when maxed', () => {
    expect(workshopDefenseNextMarginalCoins('healthLevel', WORKSHOP_HEALTH_MAX_LEVEL)).toBeUndefined()
    expect(
      workshopDefenseNextMarginalCoins('healthRegenLevel', WORKSHOP_HEALTH_REGEN_MAX_LEVEL),
    ).toBeUndefined()
    expect(
      workshopDefenseNextMarginalCoins('defenseAbsoluteLevel', WORKSHOP_DEFENSE_ABSOLUTE_MAX_LEVEL),
    ).toBeUndefined()
    expect(
      workshopDefenseNextMarginalCoins('defensePercentLevel', WORKSHOP_DEFENSE_PERCENT_MAX_LEVEL),
    ).toBeUndefined()
    expect(
      workshopDefenseNextMarginalCoins('thornDamageLevel', WORKSHOP_THORN_DAMAGE_MAX_LEVEL),
    ).toBeUndefined()
    expect(
      workshopDefenseNextMarginalCoins('lifestealLevel', WORKSHOP_LIFESTEAL_MAX_LEVEL),
    ).toBeUndefined()
    expect(
      workshopDefenseNextMarginalCoins('knockbackChanceLevel', WORKSHOP_KNOCKBACK_CHANCE_MAX_LEVEL),
    ).toBeUndefined()
    expect(
      workshopDefenseNextMarginalCoins('knockbackForceLevel', WORKSHOP_KNOCKBACK_FORCE_MAX_LEVEL),
    ).toBeUndefined()
  })
})

describe('workshopDefenseStatDisplay', () => {
  it('applies Defense Health lab multiplier to workshop HP display', () => {
    const level = 3500
    const mult = 4
    expect(
      workshopDefenseStatDisplay('healthLevel', level, { healthLabMultiplier: mult }),
    ).toBe(formatCoinAbbrev(Math.round(workshopHealthStatValue(level) * mult)))
  })

  it('adds Garlic Thorns lab % to workshop Thorn Damage display', () => {
    expect(
      workshopDefenseStatDisplay('thornDamageLevel', 99, { thornDamageLabPercentPoints: 5 }),
    ).toBe('+104.00%')
  })

  it('adds Defense % lab to workshop Defense % display', () => {
    expect(
      workshopDefenseStatDisplay('defensePercentLevel', 99, { defensePercentLabPercentPoints: 0.4 }),
    ).toBe('+49.90%')
  })

  it('shows Health Regen lab multiplier when wiki Value is still 0', () => {
    expect(
      workshopDefenseStatDisplay('healthRegenLevel', 0, { healthRegenLabMultiplier: 1.03 }),
    ).toBe('0.00 ×1.03')
    expect(
      workshopDefenseStatDisplay('healthRegenLevel', 1, { healthRegenLabMultiplier: 1.03 }),
    ).toBe('0.00 ×1.03')
  })

  it('shows Health lab multiplier when wiki HP is still 0', () => {
    expect(workshopDefenseStatDisplay('healthLevel', 0, { healthLabMultiplier: 1.03 })).toBe(
      '0.00 ×1.03',
    )
  })
})
