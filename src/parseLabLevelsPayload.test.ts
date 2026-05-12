import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { encodeLabsShareQueryValue } from './labsShareCodec'
import { compareLabLevelOverrides, formatSignedCoinDelta } from './labCompare'
import {
  extractLabsShareEncodedFromText,
  parseLabLevelsPayload,
} from './parseLabLevelsPayload'
import {
  parseResearchManifest,
  parseResearchSection,
  type ResearchData,
} from './types/research'

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
  it('reads labs param from full URL', () => {
    expect(
      extractLabsShareEncodedFromText(
        'https://example.com/app/?utm=1&labs=ueyJ2IjoxLCJvIjp7fX0',
      ),
    ).toBe('ueyJ2IjoxLCJvIjp7fX0')
  })

  it('percent-decodes payload', () => {
    expect(
      extractLabsShareEncodedFromText('https://x.test/t?labs=u%2Bfoo'),
    ).toBe('u+foo')
  })
})

describe('parseLabLevelsPayload', () => {
  const data = loadResearchDataSync()

  it('parses JSON export', async () => {
    const json = JSON.stringify({ v: 1, levelOverrides: { '0-0': 2 } })
    const r = await parseLabLevelsPayload(json, data)
    expect(r.ok && r.overrides['0-0']).toBe(2)
  })

  it('parses share envelope JSON', async () => {
    const json = JSON.stringify({ v: 1, o: { '0-0': 1 } })
    const r = await parseLabLevelsPayload(json, data)
    expect(r.ok && r.overrides['0-0']).toBe(1)
  })

  it('parses URL with labs param', async () => {
    const enc = await encodeLabsShareQueryValue({ '0-0': 4 })
    const url = `https://host.example/path/page?labs=${enc}`
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

  it('rejects empty', async () => {
    expect(await parseLabLevelsPayload('   ', data)).toEqual({
      ok: false,
      error: 'empty',
    })
  })

  it('rejects JSON without level data', async () => {
    expect(await parseLabLevelsPayload('{"v":1}', data)).toEqual({
      ok: false,
      error: 'no_level_data',
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
