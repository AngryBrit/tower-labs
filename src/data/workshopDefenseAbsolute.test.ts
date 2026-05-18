import { describe, expect, it } from 'vitest'
import {
  WORKSHOP_DEFENSE_ABSOLUTE_MAX_LEVEL,
  workshopDefenseAbsoluteNextMarginalCoins,
  workshopDefenseAbsoluteStatValue,
} from './workshopDefenseAbsolute'

describe('workshopDefenseAbsolute', () => {
  it('matches wiki milestones for Value and marginal Cost', () => {
    expect(workshopDefenseAbsoluteStatValue(5000)).toBe(80.21e6)
    expect(workshopDefenseAbsoluteNextMarginalCoins(4999)).toBe(797.45e6)
    expect(workshopDefenseAbsoluteNextMarginalCoins(0)).toBe(50)
    expect(workshopDefenseAbsoluteNextMarginalCoins(WORKSHOP_DEFENSE_ABSOLUTE_MAX_LEVEL)).toBeUndefined()
  })
})
