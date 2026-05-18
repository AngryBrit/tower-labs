import { describe, expect, it } from 'vitest'
import { defaultWorkshopPersisted } from '../labPresetsStorage'
import {
  mergeLabAndCardMult,
  workshopCardAddPercentPoints,
  workshopCardMultProduct,
} from './workshopCardWorkshopDisplay'
import { workshopCardMirrorsPatch, type WorkshopGameCardId } from './workshopGameCards'

describe('workshopCardWorkshopDisplay', () => {
  it('mergeLabAndCardMult combines lab and equipped card', () => {
    expect(mergeLabAndCardMult(2, 1.5)).toBe(3)
    expect(mergeLabAndCardMult(undefined, 2)).toBe(2)
  })

  it('applies equipped damage card to workshop mult', () => {
    const base = defaultWorkshopPersisted()
    const cardStars = { ...base.cardStars, damage: 7 }
    const cardPresetLoadouts = base.cardPresetLoadouts.map((row, i) =>
      i === 0 ? (['damage'] as WorkshopGameCardId[]) : [...row],
    )
    const ws = {
      ...base,
      cardStars,
      cardPresetLoadouts,
      ...workshopCardMirrorsPatch(base, { cardStars, cardPresetLoadouts }),
    }
    expect(workshopCardMultProduct(ws, null, {}, 'damage')).toBe(4)
    expect(workshopCardAddPercentPoints(ws, null, {}, 'criticalChance')).toBe(0)
  })
})
