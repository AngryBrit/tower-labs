import { describe, expect, it } from 'vitest'
import {
  buildLabsShareUrls,
  decodeLabsShareQueryValue,
  encodeLabsShareQueryValue,
  TOWER_SHARE_SEARCH_PARAM,
} from './labsShareCodec'
import { defaultWorkshopPersisted } from './labPresetsStorage'

describe('labsShareCodec', () => {
  it('roundtrips empty overrides as v4', async () => {
    const enc = await encodeLabsShareQueryValue({})
    const dec = await decodeLabsShareQueryValue(enc)
    expect(dec).toEqual({ v: 4, o: {} })
  })

  it('roundtrips many keys', async () => {
    const o: Record<string, number> = {}
    for (let i = 0; i < 50; i++) o[`${i}-${i}`] = i % 10
    const enc = await encodeLabsShareQueryValue(o)
    const dec = await decodeLabsShareQueryValue(enc)
    expect(dec).toEqual({ v: 4, o })
  })

  it('roundtrips with workshop when provided', async () => {
    const ws = { ...defaultWorkshopPersisted(), damageLevel: 4, category: 'utility' as const }
    const enc = await encodeLabsShareQueryValue({ '0-0': 1 }, ws)
    const dec = await decodeLabsShareQueryValue(enc)
    expect(dec).toEqual({ v: 4, o: { '0-0': 1 }, w: ws })
  })

  it('roundtrips with optional build name', async () => {
    const enc = await encodeLabsShareQueryValue({ '1-1': 2 }, undefined, 'Raid DPS')
    const dec = await decodeLabsShareQueryValue(enc)
    expect(dec).toEqual({ v: 4, o: { '1-1': 2 }, n: 'Raid DPS' })
  })

  it('roundtrips owned theme catalog only', async () => {
    const themes = {
      ownedIds: ['tower-shuriken', 'bg-custom'],
    }
    const enc = await encodeLabsShareQueryValue({ '0-0': 1 }, undefined, undefined, themes)
    const dec = await decodeLabsShareQueryValue(enc)
    expect(dec).toEqual({
      v: 4,
      o: { '0-0': 1 },
      t: { owned: ['tower-shuriken', 'bg-custom'] },
    })
  })

  it('rejects pre-v4 share JSON', async () => {
    const body = btoa(JSON.stringify({ v: 1, o: {} }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
    expect(await decodeLabsShareQueryValue(`u${body}`)).toBeNull()
  })

  it('returns null for garbage', async () => {
    expect(await decodeLabsShareQueryValue('')).toBeNull()
    expect(await decodeLabsShareQueryValue('x')).toBeNull()
    expect(await decodeLabsShareQueryValue('u!!!')).toBeNull()
    expect(await decodeLabsShareQueryValue('z' + 'a'.repeat(20))).toBeNull()
  })

  it('buildLabsShareUrls: clean drops hash and extra params', () => {
    const encoded = 'uTEST'
    const { clean, full } = buildLabsShareUrls(
      encoded,
      'https://example.com/tower/?utm=1&x=y#section',
    )
    expect(clean).toBe(
      `https://example.com/tower/?${TOWER_SHARE_SEARCH_PARAM}=uTEST`,
    )
    expect(full).toContain(`${TOWER_SHARE_SEARCH_PARAM}=uTEST`)
    expect(full).toContain('utm=1')
    expect(full).toContain('#section')
  })
})
