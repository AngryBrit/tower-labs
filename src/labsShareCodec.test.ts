import { describe, expect, it } from 'vitest'
import {
  buildLabsShareUrls,
  decodeLabsShareQueryValue,
  encodeLabsShareQueryValue,
  LABS_SHARE_SEARCH_PARAM,
} from './labsShareCodec'

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
      `https://example.com/tower/?${LABS_SHARE_SEARCH_PARAM}=uTEST`,
    )
    expect(full).toContain(`${LABS_SHARE_SEARCH_PARAM}=uTEST`)
    expect(full).toContain('utm=1')
    expect(full).toContain('#section')
  })
})
