import { readFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  levelOverrideKey,
  parseResearchManifest,
  parseResearchSection,
  type ResearchData,
} from '../types/research'
import {
  workshopEnhancementsLabUnlocked,
  workshopEnhancementsResearchLevel,
} from './workshopEnhanceResearch'

const srcDir = dirname(fileURLToPath(import.meta.url))

function loadResearchDataSync(): ResearchData {
  const manifestRaw: unknown = JSON.parse(
    readFileSync(join(srcDir, '../../public/research/manifest.json'), 'utf-8'),
  )
  const { sectionFiles } = parseResearchManifest(manifestRaw)
  const sections = sectionFiles.map((rel: string) => {
    const raw: unknown = JSON.parse(
      readFileSync(join(srcDir, '../../public', rel.replace(/^\//, '')), 'utf-8'),
    )
    const slug = basename(rel, '.json')
    return parseResearchSection(raw, slug)
  })
  return { sections }
}

describe('workshopEnhanceResearch', () => {
  const data = loadResearchDataSync()

  it('is locked at level 0 and unlocked at level 1', () => {
    expect(workshopEnhancementsResearchLevel(data, {})).toBe(0)
    expect(workshopEnhancementsLabUnlocked(data, {})).toBe(false)

    const sectionIndex = data.sections.findIndex((s) => s.sectionSlug === 'main-research')
    expect(sectionIndex).toBeGreaterThanOrEqual(0)
    const itemIndex = data.sections[sectionIndex]!.items.findIndex(
      (i) => i.name === 'Workshop Enhancements',
    )
    expect(itemIndex).toBeGreaterThanOrEqual(0)

    const overrides = { [levelOverrideKey(sectionIndex, itemIndex)]: 1 }
    expect(workshopEnhancementsResearchLevel(data, overrides)).toBe(1)
    expect(workshopEnhancementsLabUnlocked(data, overrides)).toBe(true)
  })
})
