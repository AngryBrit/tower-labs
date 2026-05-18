/**
 * Equipped sub-module effect picks per chassis slot (wiki Sub-Module Effects tables).
 */

import type { WorkshopPersistedV1 } from '../labPresetsStorage'
import type { WorkshopAssistModuleSlot } from './workshopSimModules'
import {
  parseSubmoduleCellNumber,
  WORKSHOP_SUBMODULE_SECTIONS,
  submoduleEffectId,
} from './workshopSubmoduleCatalog'
import type { WorkshopSubmoduleRarity } from './workshopSubmoduleEffects'

export { submoduleEffectId } from './workshopSubmoduleCatalog'

export const CANNON_ATTACK_SPEED_EFFECT_ID = submoduleEffectId('Attack Speed')

export type WorkshopSubmoduleSelectionMap = Partial<
  Record<string, WorkshopSubmoduleRarity>
>

export type WorkshopSubmoduleSelections = Record<
  WorkshopAssistModuleSlot,
  WorkshopSubmoduleSelectionMap
>

export function defaultWorkshopSubmoduleSelections(): WorkshopSubmoduleSelections {
  return { cannon: {}, armor: {}, generator: {}, core: {} }
}

export function workshopSubmoduleSelections(
  ws: Pick<WorkshopPersistedV1, 'simSubmoduleSelections'>,
  slot: WorkshopAssistModuleSlot,
): WorkshopSubmoduleSelectionMap {
  return ws.simSubmoduleSelections[slot] ?? {}
}

function isSubmoduleRarity(raw: unknown): raw is WorkshopSubmoduleRarity {
  return (
    raw === 'common' ||
    raw === 'rare' ||
    raw === 'epic' ||
    raw === 'legendary' ||
    raw === 'mythic' ||
    raw === 'ancestral'
  )
}

export function sanitizeSubmoduleSelectionMap(
  slot: WorkshopAssistModuleSlot,
  raw: unknown,
): WorkshopSubmoduleSelectionMap {
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const section = WORKSHOP_SUBMODULE_SECTIONS[slot]
  const validIds = new Set(section.rows.map((row) => submoduleEffectId(row.label)))
  const out: WorkshopSubmoduleSelectionMap = {}
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!validIds.has(key) || !isSubmoduleRarity(value)) continue
    out[key] = value
  }
  return out
}

export function sanitizeSubmoduleSelections(raw: unknown): WorkshopSubmoduleSelections {
  const d = defaultWorkshopSubmoduleSelections()
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) return d
  const o = raw as Record<string, unknown>
  return {
    cannon: sanitizeSubmoduleSelectionMap('cannon', o.cannon),
    armor: sanitizeSubmoduleSelectionMap('armor', o.armor),
    generator: sanitizeSubmoduleSelectionMap('generator', o.generator),
    core: sanitizeSubmoduleSelectionMap('core', o.core),
  }
}

export function toggleSubmoduleSelection(
  current: WorkshopSubmoduleSelectionMap,
  effectId: string,
  rarity: WorkshopSubmoduleRarity,
  cellValue: string | null,
): WorkshopSubmoduleSelectionMap {
  if (cellValue == null) return current
  if (current[effectId] === rarity) {
    const { [effectId]: _removed, ...rest } = current
    return rest
  }
  return { ...current, [effectId]: rarity }
}

export function cannonSubmoduleAttackSpeedFromSelections(
  selections: WorkshopSubmoduleSelectionMap,
): number {
  const rarity = selections[CANNON_ATTACK_SPEED_EFFECT_ID]
  if (rarity == null) return 0
  const row = WORKSHOP_SUBMODULE_SECTIONS.cannon.rows[0]
  if (row == null || submoduleEffectId(row.label) !== CANNON_ATTACK_SPEED_EFFECT_ID) {
    return 0
  }
  return parseSubmoduleCellNumber(row.cells[rarity]) ?? 0
}

export function workshopPersistedWithSubmoduleSelections(
  ws: WorkshopPersistedV1,
  slot: WorkshopAssistModuleSlot,
  slotSelections: WorkshopSubmoduleSelectionMap,
): WorkshopPersistedV1 {
  const simSubmoduleSelections: WorkshopSubmoduleSelections = {
    ...ws.simSubmoduleSelections,
    [slot]: slotSelections,
  }
  return {
    ...ws,
    simSubmoduleSelections,
    simAttackSpeedModuleSubEffect: cannonSubmoduleAttackSpeedFromSelections(
      simSubmoduleSelections.cannon,
    ),
  }
}

export function serializeSubmoduleSelections(
  selections: WorkshopSubmoduleSelections,
): string {
  return JSON.stringify(selections)
}

export function parseSubmoduleSelectionsJson(raw: unknown): WorkshopSubmoduleSelections {
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (trimmed === '') return defaultWorkshopSubmoduleSelections()
    try {
      return sanitizeSubmoduleSelections(JSON.parse(trimmed))
    } catch {
      return defaultWorkshopSubmoduleSelections()
    }
  }
  return sanitizeSubmoduleSelections(raw)
}
