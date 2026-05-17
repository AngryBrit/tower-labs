import { describe, expect, it } from 'vitest'
import {
  parseTowerUnifiedCsv,
  serializeTowerUnifiedCsv,
  serializeTowerUnifiedCsvBuilds,
  towerUnifiedPrimaryBuild,
  TOWER_UNIFIED_CSV_MAGIC,
} from './towerUnifiedCsv'
import { DEFAULT_THEME_SELECTION } from './data/gameThemes'
import { defaultWorkshopPersisted } from './labPresetsStorage'
import type { TowerThemesSnapshot } from './towerDataThemes'

describe('towerUnifiedCsv', () => {
  it('roundtrips lab levels and workshop', () => {
    const ws = {
      ...defaultWorkshopPersisted(),
      damageLevel: 9,
      category: 'utility' as const,
      multiplier: 5 as const,
    }
    const overrides = { '0-0': 2, '1-1': 7 }
    const csv = serializeTowerUnifiedCsv(overrides, ws)
    expect(csv.startsWith(`${TOWER_UNIFIED_CSV_MAGIC}\r\n`)).toBe(true)
    const parsed = parseTowerUnifiedCsv(csv)
    expect(parsed.tag).toBe('ok')
    if (parsed.tag === 'ok') {
      const primary = towerUnifiedPrimaryBuild(parsed)
      expect(primary.overrides).toEqual(overrides)
      expect(primary.workshop.damageLevel).toBe(9)
      expect(primary.workshop.category).toBe('utility')
      expect(primary.workshop.multiplier).toBe(5)
    }
  })

  it('roundtrips build name and multiple builds', () => {
    const wsA = { ...defaultWorkshopPersisted(), damageLevel: 1 }
    const wsB = { ...defaultWorkshopPersisted(), damageLevel: 2 }
    const csv = serializeTowerUnifiedCsvBuilds([
      { name: 'Raid', levelOverrides: { '0-0': 1 }, workshop: wsA },
      { name: 'Farm', levelOverrides: { '1-1': 3 }, workshop: wsB },
    ])
    expect(csv).toContain('build,name,Raid')
    expect(csv).toContain('build,name,Farm')
    const parsed = parseTowerUnifiedCsv(csv)
    expect(parsed.tag).toBe('ok')
    if (parsed.tag === 'ok') {
      expect(parsed.builds).toHaveLength(2)
      expect(parsed.builds[0]?.name).toBe('Raid')
      expect(parsed.builds[0]?.overrides['0-0']).toBe(1)
      expect(parsed.builds[1]?.name).toBe('Farm')
      expect(parsed.builds[1]?.workshop.damageLevel).toBe(2)
    }
  })

  it('serializes optional build name on single export', () => {
    const csv = serializeTowerUnifiedCsv({}, defaultWorkshopPersisted(), 'My build')
    expect(csv).toContain('build,name,My build')
    const parsed = parseTowerUnifiedCsv(csv)
    if (parsed.tag === 'ok') {
      expect(towerUnifiedPrimaryBuild(parsed).name).toBe('My build')
    }
  })

  it('roundtrips cards, modules sim, and themes', () => {
    const ws = {
      ...defaultWorkshopPersisted(),
      simAssistModuleSlot: 'armor' as const,
      simAttackSpeedModuleSubEffect: 0.12,
      cardStars: { ...defaultWorkshopPersisted().cardStars, damage: 5 },
    }
    const themes: TowerThemesSnapshot = {
      selection: { ...DEFAULT_THEME_SELECTION, tower: 'tower-plasma' },
      ownedIds: ['tower-plasma', 'bg-interstellar'],
    }
    const csv = serializeTowerUnifiedCsv({ '2-2': 4 }, ws, undefined, themes)
    const parsed = parseTowerUnifiedCsv(csv)
    expect(parsed.tag).toBe('ok')
    if (parsed.tag === 'ok') {
      const b = towerUnifiedPrimaryBuild(parsed)
      expect(b.overrides['2-2']).toBe(4)
      expect(b.workshop.simAssistModuleSlot).toBe('armor')
      expect(b.workshop.cardStars.damage).toBe(5)
      expect(parsed.themes?.selection.tower).toBe('tower-plasma')
      expect(parsed.themes?.ownedIds).toContain('tower-plasma')
    }
  })

  it('returns none for legacy lab-only CSV', () => {
    const r = parseTowerUnifiedCsv('key,level\n0-0,1\n')
    expect(r.tag).toBe('none')
  })

  it('returns invalid for bad ws multiplier', () => {
    const lines = [
      TOWER_UNIFIED_CSV_MAGIC,
      'type,key,value',
      'ws,multiplier,3',
    ]
    expect(parseTowerUnifiedCsv(lines.join('\n')).tag).toBe('invalid')
  })
})
