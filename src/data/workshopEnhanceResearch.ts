/**
 * Main Research **Workshop Enhancements** unlock (wiki: single level, unlocks enhancement tab).
 */

import { getEffectiveLevel, type ResearchData } from '../types/research'

export const WORKSHOP_ENHANCEMENTS_RESEARCH_ITEM_NAME = 'Workshop Enhancements' as const
export const MAIN_RESEARCH_SECTION_SLUG = 'main-research' as const

export function mainResearchSectionIndex(data: ResearchData): number {
  return data.sections.findIndex((s) => s.sectionSlug === MAIN_RESEARCH_SECTION_SLUG)
}

export function workshopEnhancementsResearchItemIndex(data: ResearchData): number {
  const sectionIndex = mainResearchSectionIndex(data)
  if (sectionIndex < 0) return -1
  return data.sections[sectionIndex]!.items.findIndex(
    (item) => item.name === WORKSHOP_ENHANCEMENTS_RESEARCH_ITEM_NAME,
  )
}

/** Simulated Main Research level for **Workshop Enhancements** (0 when not researched). */
export function workshopEnhancementsResearchLevel(
  researchData: ResearchData | null | undefined,
  labLevelOverrides: Record<string, number> | undefined,
): number {
  if (!researchData) return 0
  const sectionIndex = mainResearchSectionIndex(researchData)
  if (sectionIndex < 0) return 0
  const itemIndex = workshopEnhancementsResearchItemIndex(researchData)
  if (itemIndex < 0) return 0
  const item = researchData.sections[sectionIndex]!.items[itemIndex]
  if (!item) return 0
  return getEffectiveLevel(sectionIndex, itemIndex, item, labLevelOverrides ?? {})
}

export function workshopEnhancementsLabUnlocked(
  researchData: ResearchData | null | undefined,
  labLevelOverrides: Record<string, number> | undefined,
): boolean {
  return workshopEnhancementsResearchLevel(researchData, labLevelOverrides) > 0
}
