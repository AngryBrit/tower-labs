/**
 * Workshop **bot** upgrades (medals, wiki Basic Upgrades tables).
 */

import {
  WORKSHOP_BOT_ORDER,
  WORKSHOP_BOT_SPECIAL_BY_BOT,
  WORKSHOP_BOT_SPECIAL_UNLOCK_CELLS,
  WORKSHOP_BOT_TRACKS,
  WORKSHOP_BOT_UPGRADE_ORDER,
  WORKSHOP_BOT_WEAPON_STATS,
  type WorkshopBotId,
  type WorkshopBotSpecialKey,
  type WorkshopBotUpgradeKey,
} from './workshopBotsData'
import {
  workshopUltimateTrackClampLevel,
  workshopUltimateTrackMaxLevel,
  workshopUltimateTrackNextMarginalStones,
  workshopUltimateTrackStatDisplay,
} from './workshopUltimateTable'

export {
  WORKSHOP_BOT_ORDER,
  WORKSHOP_BOT_SPECIAL_BY_BOT,
  WORKSHOP_BOT_SPECIAL_UNLOCK_CELLS,
  WORKSHOP_BOT_TRACKS,
  WORKSHOP_BOT_UPGRADE_ORDER,
  WORKSHOP_BOT_WEAPON_STATS,
  type WorkshopBotId,
  type WorkshopBotSpecialKey,
  type WorkshopBotUpgradeKey,
}

export function workshopBotMaxLevel(key: WorkshopBotUpgradeKey): number {
  return workshopUltimateTrackMaxLevel(WORKSHOP_BOT_TRACKS[key])
}

export function workshopBotClampLevel(key: WorkshopBotUpgradeKey, level: number): number {
  return workshopUltimateTrackClampLevel(WORKSHOP_BOT_TRACKS[key], level)
}

export function workshopBotNextMarginalMedals(
  key: WorkshopBotUpgradeKey,
  completedLevels: number,
): number | undefined {
  return workshopUltimateTrackNextMarginalStones(WORKSHOP_BOT_TRACKS[key], completedLevels)
}

export function workshopBotStatDisplay(key: WorkshopBotUpgradeKey, completedLevels: number): string {
  return workshopUltimateTrackStatDisplay(WORKSHOP_BOT_TRACKS[key], completedLevels)
}

export type WorkshopBotActiveKey =
  | `${Exclude<WorkshopBotId, 'botBot'>}BotActive`
  | 'botBotActive'

export const WORKSHOP_BOT_ACTIVE_ORDER: readonly WorkshopBotActiveKey[] = WORKSHOP_BOT_ORDER.map(
  (id) => workshopBotActiveKey(id),
)

export function workshopBotActiveKey(botId: WorkshopBotId): WorkshopBotActiveKey {
  if (botId === 'botBot') return 'botBotActive'
  return `${botId}BotActive`
}

export function workshopBotIsActive(
  ws: Partial<Record<WorkshopBotActiveKey, boolean>>,
  botId: WorkshopBotId,
): boolean {
  return ws[workshopBotActiveKey(botId)] !== false
}

export function workshopBotUpgradeKeys(botId: WorkshopBotId): readonly WorkshopBotUpgradeKey[] {
  return WORKSHOP_BOT_WEAPON_STATS[botId].map((s) => s.key)
}

export function workshopBotAllMaxed(
  levels: Record<WorkshopBotUpgradeKey, number>,
  botId: WorkshopBotId,
): boolean {
  return workshopBotUpgradeKeys(botId).every((key) => levels[key] >= workshopBotMaxLevel(key))
}

export function workshopBotSpecialIsUnlocked(
  ws: Partial<Record<WorkshopBotSpecialKey, boolean>>,
  botId: WorkshopBotId,
): boolean {
  return ws[WORKSHOP_BOT_SPECIAL_BY_BOT[botId]] === true
}
