import { describe, expect, it } from 'vitest'
import {
  parseTowerUnifiedCsv,
  serializeTowerUnifiedCsv,
  TOWER_UNIFIED_CSV_MAGIC,
} from './towerUnifiedCsv'
import { defaultWorkshopPersisted } from './labPresetsStorage'

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
      expect(parsed.overrides).toEqual(overrides)
      expect(parsed.workshop.damageLevel).toBe(9)
      expect(parsed.workshop.category).toBe('utility')
      expect(parsed.workshop.multiplier).toBe(5)
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
