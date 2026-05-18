import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { encodeLabsShareQueryValue } from './labsShareCodec'
import { compareLabLevelOverrides, formatSignedCoinDelta } from './labCompare'
import { defaultWorkshopPersisted } from './labPresetsStorage'
import {
  extractLabsShareEncodedFromText,
  parseLabLevelsPayload,
} from './parseLabLevelsPayload'
import {
  parseResearchManifest,
  parseResearchSection,
  type ResearchData,
} from './types/research'
import { serializeTowerUnifiedCsv, TOWER_UNIFIED_CSV_MAGIC } from './towerUnifiedCsv'

const srcDir = dirname(fileURLToPath(import.meta.url))

function loadResearchDataSync(): ResearchData {
  const manifestRaw: unknown = JSON.parse(
    readFileSync(join(srcDir, '../public/research/manifest.json'), 'utf-8'),
  )
  const { sectionFiles } = parseResearchManifest(manifestRaw)
  const sections = sectionFiles.map((rel: string) => {
    const raw: unknown = JSON.parse(
      readFileSync(join(srcDir, '../public', rel.replace(/^\//, '')), 'utf-8'),
    )
    const slug = rel.split('/').pop()!.replace(/\.json$/i, '')
    return parseResearchSection(raw, slug)
  })
  return { sections }
}

describe('extractLabsShareEncodedFromText', () => {
  it('reads tower param from full URL', () => {
    expect(
      extractLabsShareEncodedFromText(
        'https://example.com/app/?utm=1&tower=ueyJ2IjoxLCJvIjp7fX0',
      ),
    ).toBe('ueyJ2IjoxLCJvIjp7fX0')
  })

  it('ignores old labs query param', () => {
    expect(
      extractLabsShareEncodedFromText(
        'https://example.com/app/?utm=1&labs=ueyJ2IjoxLCJvIjp7fX0',
      ),
    ).toBeNull()
  })

  it('percent-decodes payload', () => {
    expect(
      extractLabsShareEncodedFromText('https://x.test/t?tower=u%2Bfoo'),
    ).toBe('u+foo')
  })
})

describe('parseLabLevelsPayload', () => {
  const data = loadResearchDataSync()

  it('parses URL with tower param', async () => {
    const enc = await encodeLabsShareQueryValue({ '0-0': 4 })
    const url = `https://host.example/path/page?tower=${enc}`
    const r = await parseLabLevelsPayload(url, data)
    expect(r.ok && r.overrides['0-0']).toBe(4)
  })

  it('roundtrips encoded share string', async () => {
    const enc = await encodeLabsShareQueryValue({ '0-0': 3, '0-1': 5 })
    const r = await parseLabLevelsPayload(enc, data)
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.overrides['0-0']).toBe(3)
      expect(r.overrides['0-1']).toBe(5)
    }
  })

  it('rejects lab-only key,level CSV', async () => {
    expect(await parseLabLevelsPayload('key,level\n0-0,2\n', data)).toEqual({
      ok: false,
      error: 'invalid_csv',
    })
  })

  it('rejects empty', async () => {
    expect(await parseLabLevelsPayload('   ', data)).toEqual({
      ok: false,
      error: 'empty',
    })
  })

  it('parses tower unified CSV via parseLabLevelsPayload', async () => {
    const ws = { ...defaultWorkshopPersisted(), damageLevel: 4 }
    const csv = serializeTowerUnifiedCsv({ '0-0': 1 }, ws)
    const r = await parseLabLevelsPayload(csv, data)
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.overrides['0-0']).toBe(1)
      expect(r.workshop?.damageLevel).toBe(4)
    }
  })

  it('rejects malformed tower CSV as invalid_csv', async () => {
    const bad = `${TOWER_UNIFIED_CSV_MAGIC}\ntype,key,value\nlab,bad-key,1\n`
    expect(await parseLabLevelsPayload(bad, data)).toEqual({
      ok: false,
      error: 'invalid_csv',
    })
  })

  it('accepts inline v4 JSON with empty overrides', async () => {
    expect(await parseLabLevelsPayload('{"v":4,"o":{}}', data)).toEqual({
      ok: true,
      overrides: {},
    })
  })

  it('parses inline v4 JSON with workshop snapshot', async () => {
    const w = {
      hideMaxed: true,
      mainTab: 'upgrade' as const,
      category: 'defense' as const,
      multiplier: 5 as const,
      damageLevel: 3,
      attackSpeedLevel: 0,
      critChanceLevel: 0,
      critFactorLevel: 0,
    }
    const raw = JSON.stringify({ v: 4, o: { '0-0': 2 }, w })
    const r = await parseLabLevelsPayload(raw, data)
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.overrides['0-0']).toBe(2)
      expect(r.workshop).toBeDefined()
      expect(r.workshop?.damageLevel).toBe(3)
      expect(r.workshop?.hideMaxed).toBe(true)
    }
  })

  it('rejects pre-v4 inline JSON', async () => {
    expect(await parseLabLevelsPayload('{"v":1,"o":{}}', data)).toEqual({
      ok: false,
      error: 'invalid_payload',
    })
  })

  it('rejects non-CSV text without comma as invalid_payload', async () => {
    expect(await parseLabLevelsPayload('hello', data)).toEqual({
      ok: false,
      error: 'invalid_payload',
    })
  })
})

describe('compareLabLevelOverrides', () => {
  const data = loadResearchDataSync()

  it('reports differing labs and coin delta when levels differ', () => {
    const a: Record<string, number> = {}
    const b = { '0-0': 3 }
    const r = compareLabLevelOverrides(data, a, b)
    expect(r.differingCount).toBeGreaterThanOrEqual(1)
    const gameSpeed = r.diffRows.find((row) => row.name === 'Game Speed')
    expect(gameSpeed).toBeDefined()
    expect(gameSpeed!.levelA).toBe(0)
    expect(gameSpeed!.levelB).toBe(3)
    expect(r.coinDeltaBMinusA).toBe(r.spentB - r.spentA)
    expect(r.spentB).toBeGreaterThanOrEqual(r.spentA)
  })

  it('matches when both empty', () => {
    const r = compareLabLevelOverrides(data, {}, {})
    expect(r.differingCount).toBe(0)
    expect(r.coinDeltaBMinusA).toBe(0)
  })
})

describe('formatSignedCoinDelta', () => {
  it('formats positive with plus', () => {
    expect(formatSignedCoinDelta(1500)).toMatch(/^\+/)
  })

  it('formats negative with unicode minus', () => {
    expect(formatSignedCoinDelta(-200)).toMatch(/^−/)
  })

  it('formats zero', () => {
    expect(formatSignedCoinDelta(0)).toBe('0')
  })
})
