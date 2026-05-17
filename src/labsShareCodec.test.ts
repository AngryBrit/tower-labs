import { describe, expect, it } from 'vitest'
import {
  buildLabsShareUrls,
  decodeLabsShareQueryValue,
  encodeLabsShareQueryValue,
  LABS_SHARE_SEARCH_PARAM_LEGACY,
  TOWER_SHARE_SEARCH_PARAM,
} from './labsShareCodec'
import { defaultWorkshopPersisted } from './labPresetsStorage'

describe('labsShareCodec', () => {
  it('roundtrips empty overrides', async () => {
    const enc = await encodeLabsShareQueryValue({})
    const dec = await decodeLabsShareQueryValue(enc)
    expect(dec).toEqual({ v: 1, o: {} })
  })

  it('roundtrips many keys', async () => {
    const o: Record<string, number> = {}
    for (let i = 0; i < 50; i++) o[`${i}-${i}`] = i % 10
    const enc = await encodeLabsShareQueryValue(o)
    const dec = await decodeLabsShareQueryValue(enc)
    expect(dec).toEqual({ v: 1, o })
  })

  it('roundtrips v4 with workshop when provided', async () => {
    const ws = { ...defaultWorkshopPersisted(), damageLevel: 4, category: 'utility' as const }
    const enc = await encodeLabsShareQueryValue({ '0-0': 1 }, ws)
    const dec = await decodeLabsShareQueryValue(enc)
    expect(dec?.v).toBe(4)
    if (dec && dec.v === 4) {
      expect(dec.o['0-0']).toBe(1)
      expect(dec.w).toEqual(ws)
    }
  })

  it('roundtrips v4 with optional build name', async () => {
    const enc = await encodeLabsShareQueryValue({ '1-1': 2 }, undefined, 'Raid DPS')
    const dec = await decodeLabsShareQueryValue(enc)
    expect(dec).toEqual({ v: 4, o: { '1-1': 2 }, n: 'Raid DPS' })
  })

  it('roundtrips v4 with themes', async () => {
    const themes = {
      selection: {
        tower: 'tower-shuriken',
        background: 'bg-interstellar',
        music: 'music-default',
        menus: 'menu-default',
        banners: 'banner-default',
        guardian: 'guardian-default',
      },
      ownedIds: ['tower-shuriken', 'bg-custom'],
    }
    const enc = await encodeLabsShareQueryValue({ '0-0': 1 }, undefined, undefined, themes)
    const dec = await decodeLabsShareQueryValue(enc)
    expect(dec?.v).toBe(4)
    if (dec && dec.v === 4) {
      expect(dec.t).toEqual({ sel: themes.selection, owned: themes.ownedIds })
    }
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
    expect(full).not.toContain(`${LABS_SHARE_SEARCH_PARAM_LEGACY}=`)
    expect(full).toContain('utm=1')
    expect(full).toContain('#section')
  })
})
