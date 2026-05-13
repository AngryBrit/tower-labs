import { describe, expect, it } from 'vitest'
import {
  LAB_LEVEL_OVERRIDES_CSV_HEADER,
  parseLabLevelOverridesCsv,
  serializeLabLevelOverridesCsv,
} from './labLevelOverridesCsv'

describe('labLevelOverridesCsv', () => {
  it('serializes with header and stable key order', () => {
    const csv = serializeLabLevelOverridesCsv({ '1-0': 2, '0-1': 5 })
    expect(csv.startsWith(`${LAB_LEVEL_OVERRIDES_CSV_HEADER}\r\n`)).toBe(true)
    expect(csv).toContain('0-1,5')
    expect(csv).toContain('1-0,2')
    const idx0 = csv.indexOf('0-1')
    const idx1 = csv.indexOf('1-0')
    expect(idx0).toBeLessThan(idx1)
  })

  it('round-trips through parse', () => {
    const orig = { '0-0': 0, '2-4': 99 }
    const parsed = parseLabLevelOverridesCsv(serializeLabLevelOverridesCsv(orig))
    expect(parsed).toEqual(orig)
  })

  it('parses header and strips BOM', () => {
    const raw = `\uFEFF${LAB_LEVEL_OVERRIDES_CSV_HEADER}\n0-2,7\n`
    expect(parseLabLevelOverridesCsv(raw)).toEqual({ '0-2': 7 })
  })

  it('returns null for bad key', () => {
    expect(parseLabLevelOverridesCsv('key,level\nfoo,1\n')).toBeNull()
  })

  it('returns null for non-numeric level', () => {
    expect(
      parseLabLevelOverridesCsv(`${LAB_LEVEL_OVERRIDES_CSV_HEADER}\n0-1,x\n`),
    ).toBeNull()
  })

  it('parses quoted cells', () => {
    const raw = `${LAB_LEVEL_OVERRIDES_CSV_HEADER}\n"0-1",3\n`
    expect(parseLabLevelOverridesCsv(raw)).toEqual({ '0-1': 3 })
  })
})
