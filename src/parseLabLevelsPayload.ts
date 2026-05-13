import { decodeLabsShareQueryValue, LABS_SHARE_SEARCH_PARAM } from './labsShareCodec'
import { parseLabLevelOverridesCsv } from './labLevelOverridesCsv'
import { sanitizeLevelOverrides } from './labLevelOverridesSanitize'
import type { ResearchData } from './types/research'

export type ParseLabLevelsError =
  | 'empty'
  | 'share_decode_failed'
  | 'invalid_csv'
  | 'invalid_payload'

export type ParseLabLevelsResult =
  | { ok: true; overrides: Record<string, number> }
  | { ok: false; error: ParseLabLevelsError }

/** Extract `labs` query value from a pasted URL or `labs=…` fragment (percent-decoded). */
export function extractLabsShareEncodedFromText(text: string): string | null {
  const t = text.trim()
  const param = LABS_SHARE_SEARCH_PARAM.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const m =
    t.match(new RegExp(`[?&]${param}=([^&\\s#]+)`, 'i')) ??
    t.match(new RegExp(`^${param}=([^&\\s#]+)`, 'i'))
  const raw = m?.[1]?.trim()
  if (!raw) return null
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

/**
 * Parse a page URL with `?labs=…`, a raw `u…` / `z…` share payload, or lab level CSV
 * (same format as file export: `key,level` rows).
 */
export async function parseLabLevelsPayload(
  raw: string,
  data: ResearchData,
): Promise<ParseLabLevelsResult> {
  const text = raw.trim()
  if (!text) return { ok: false, error: 'empty' }

  const fromUrl = extractLabsShareEncodedFromText(text)
  if (fromUrl) {
    const dec = await decodeLabsShareQueryValue(fromUrl)
    if (!dec?.o) return { ok: false, error: 'share_decode_failed' }
    return {
      ok: true,
      overrides: sanitizeLevelOverrides(data, dec.o as Record<string, unknown>),
    }
  }

  if ((text[0] === 'u' || text[0] === 'z') && text.length >= 2) {
    const dec = await decodeLabsShareQueryValue(text)
    if (dec?.o) {
      return {
        ok: true,
        overrides: sanitizeLevelOverrides(data, dec.o as Record<string, unknown>),
      }
    }
    return { ok: false, error: 'share_decode_failed' }
  }

  const csvLo = parseLabLevelOverridesCsv(text)
  if (csvLo !== null) {
    const hasData = Object.keys(csvLo).length > 0
    if (hasData || text.includes(',')) {
      return {
        ok: true,
        overrides: sanitizeLevelOverrides(data, csvLo),
      }
    }
  } else if (text.includes(',')) {
    return { ok: false, error: 'invalid_csv' }
  }

  return { ok: false, error: 'invalid_payload' }
}
