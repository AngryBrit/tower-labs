import { describe, expect, it } from 'vitest'
import {
  WORKSHOP_BOT_ORDER,
  WORKSHOP_BOT_UNLOCK_MEDAL_TOTAL,
  workshopBotIsOwned,
  workshopBotOwnedKey,
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
