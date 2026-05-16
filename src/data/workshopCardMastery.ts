/**
 * Card Mastery lab rows (research section `card-mastery`) align 1:1 with {@link WORKSHOP_GAME_CARD_ORDER}.
 */

import cardMasteryTierLabels from './card-mastery-tier-labels.json'
import { getEffectiveLevel, type ResearchData } from '../types/research'
import {
  WORKSHOP_GAME_CARD_ORDER,
  type WorkshopGameCardId,
} from './workshopGameCards'

const CARD_MASTERY_TIER_LABELS = cardMasteryTierLabels as Record<string, readonly string[]>

export function cardMasterySectionIndex(data: ResearchData): number {
  return data.sections.findIndex((s) => s.sectionSlug === 'card-mastery')
}

export function workshopCardMasteryLevel(
  cardId: WorkshopGameCardId,
  data: ResearchData | null,
  overrides: Record<string, number>,
): number {
  if (!data) return 0
  const sectionIndex = cardMasterySectionIndex(data)
  if (sectionIndex < 0) return 0
  const itemIndex = WORKSHOP_GAME_CARD_ORDER.indexOf(cardId)
  if (itemIndex < 0) return 0
  const item = data.sections[sectionIndex]?.items[itemIndex]
  if (!item) return 0
  return getEffectiveLevel(sectionIndex, itemIndex, item, overrides)
}

/** True when the matching Card Mastery lab has level &gt; 0 in the simulator. */
export function workshopCardMasteryUnlocked(
  cardId: WorkshopGameCardId,
  data: ResearchData | null,
  overrides: Record<string, number>,
): boolean {
  return workshopCardMasteryLevel(cardId, data, overrides) > 0
}

export function workshopCardMasteryUnlockedSet(
  data: ResearchData | null,
  overrides: Record<string, number>,
): ReadonlySet<WorkshopGameCardId> {
  const unlocked = new Set<WorkshopGameCardId>()
  if (!data) return unlocked
  for (const id of WORKSHOP_GAME_CARD_ORDER) {
    if (workshopCardMasteryUnlocked(id, data, overrides)) {
      unlocked.add(id)
    }
  }
  return unlocked
}

function workshopCardMasteryItemName(
  cardId: WorkshopGameCardId,
  data: ResearchData,
): string | null {
  const sectionIndex = cardMasterySectionIndex(data)
  if (sectionIndex < 0) return null
  const itemIndex = WORKSHOP_GAME_CARD_ORDER.indexOf(cardId)
  if (itemIndex < 0) return null
  return data.sections[sectionIndex]?.items[itemIndex]?.name ?? null
}

export function parseCardMasteryTierMultiplier(label: string): number {
  const m = /^x([\d.]+)$/i.exec(label.trim())
  if (!m) return 1
  const n = Number(m[1])
  return Number.isFinite(n) && n > 0 ? n : 1
}

/** Wiki tier multiplier for the simulated Card Mastery level (1 when level ≤ 0). */
export function workshopCardMasteryMultiplier(
  cardId: WorkshopGameCardId,
  data: ResearchData | null,
  overrides: Record<string, number>,
): number {
  const level = workshopCardMasteryLevel(cardId, data, overrides)
  if (level <= 0 || !data) return 1
  const itemName = workshopCardMasteryItemName(cardId, data)
  if (!itemName) return 1
  const tiers = CARD_MASTERY_TIER_LABELS[itemName]
  if (!tiers?.length) return 1
  const idx = Math.min(level, tiers.length - 1)
  return parseCardMasteryTierMultiplier(tiers[idx] ?? 'x1')
}
