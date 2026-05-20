import { describe, expect, it } from 'vitest'
import {
  WORKSHOP_BOT_ORDER,
  WORKSHOP_BOT_SPECIAL_UNLOCK_STONES,
  WORKSHOP_BOT_UNLOCK_MEDAL_TOTAL,
  workshopAllBotsOwnedForPlus,
  workshopBotIsOwned,
  workshopBotOwnedKey,
  workshopBotSpecialIsUnlocked,
  workshopBotSpecialLevel,
  workshopBotSpecialStonePurchased,
  workshopBotSpecialMaxLevel,
  workshopBotSpecialNextMarginalMedals,
  workshopBotSpecialUnlockStones,
  workshopBotUnlockCostForBot,
} from './workshopBots'

describe('workshopBots unlock', () => {
  it('unlock costs follow event shop order (3100 total for 5 bots)', () => {
    const empty = {}
    expect(workshopBotUnlockCostForBot(empty, 'flame')).toBe(100)
    expect(workshopBotUnlockCostForBot(empty, 'thunder')).toBe(100)

    const oneOwned = { flameOwned: true }
    expect(workshopBotIsOwned(oneOwned, 'flame')).toBe(true)
    expect(workshopBotUnlockCostForBot(oneOwned, 'thunder')).toBe(300)
    expect(workshopBotUnlockCostForBot(oneOwned, 'flame')).toBeNull()

    const fourOwned = {
      flameOwned: true,
      thunderOwned: true,
      goldenOwned: true,
      amplifyOwned: true,
    }
    expect(workshopBotUnlockCostForBot(fourOwned, 'botBot')).toBe(1200)

    const allOwned = Object.fromEntries(
      WORKSHOP_BOT_ORDER.map((id) => [workshopBotOwnedKey(id), true]),
    )
    expect(workshopBotUnlockCostForBot(allOwned, 'botBot')).toBeNull()
    expect(WORKSHOP_BOT_UNLOCK_MEDAL_TOTAL).toBe(3100)
  })

  it('treats legacy upgrade levels as owned', () => {
    expect(workshopBotIsOwned({ flameBotDamageLevel: 1 }, 'flame')).toBe(true)
  })
})

describe('workshopBots Bot+', () => {
  it('requires all five base bots before Bot+ unlocks', () => {
    const fourOwned = {
      flameOwned: true,
      thunderOwned: true,
      goldenOwned: true,
      amplifyOwned: true,
    }
    expect(workshopAllBotsOwnedForPlus(fourOwned)).toBe(false)

    const allOwned = Object.fromEntries(
      WORKSHOP_BOT_ORDER.map((id) => [workshopBotOwnedKey(id), true]),
    )
    expect(workshopAllBotsOwnedForPlus(allOwned)).toBe(true)
  })

  it('Bot+ unlock costs 1250 power stones each', () => {
    expect(WORKSHOP_BOT_SPECIAL_UNLOCK_STONES).toBe(1250)
    expect(workshopBotSpecialUnlockStones()).toBe(1250)
  })

  it('stone purchase flag gates Bot+ UI; level alone does not', () => {
    expect(
      workshopBotSpecialStonePurchased({ flameBotBurningGroundUnlocked: true }, 'flame'),
    ).toBe(true)
    expect(workshopBotSpecialLevel({ flameBotBurningGroundUnlocked: true }, 'flame')).toBe(0)
    expect(workshopBotSpecialIsUnlocked({ flameBotBurningGroundLevel: 0 }, 'flame')).toBe(false)
    expect(workshopBotSpecialLevel({ flameBotBurningGroundLevel: 0 }, 'flame')).toBe(-1)
  })

  it('Bot+ medal upgrades follow wiki Events table', () => {
    expect(workshopBotSpecialNextMarginalMedals('flame', 0)).toBe(100)
    expect(workshopBotSpecialNextMarginalMedals('flame', 20)).toBeUndefined()
    expect(workshopBotSpecialMaxLevel('flame')).toBe(20)
    expect(workshopBotSpecialNextMarginalMedals('golden', 0)).toBe(100)
    expect(workshopBotSpecialMaxLevel('golden')).toBe(25)
    expect(workshopBotSpecialNextMarginalMedals('amplify', 0)).toBe(100)
    expect(workshopBotSpecialNextMarginalMedals('amplify', 3)).toBe(700)
    expect(workshopBotSpecialMaxLevel('amplify')).toBe(9)
  })
})
