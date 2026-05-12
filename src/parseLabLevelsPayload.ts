import { decodeLabsShareQueryValue, LABS_SHARE_SEARCH_PARAM } from './labsShareCodec'
import { sanitizeLevelOverrides } from './labLevelOverridesSanitize'
import type { ResearchData } from './types/research'

export type ParseLabLevelsError =
  | 'empty'
  | 'invalid_json'
  | 'no_level_data'
  | 'share_decode_failed'

export type ParseLabLevelsResult =
  | { ok: true; overrides: Record<string, number> }
  | { ok: false; error: ParseLabLevelsError }

function rawOverridesFromUnknown(parsed: unknown): Record<string, unknown> | null {
  if (!parsed || typeof parsed !== 'object') return null
  const o = parsed as Record<string, unknown>
  const lo = o.levelOverrides
  if (lo && typeof lo === 'object' && !Array.isArray(lo)) {
    return lo as Record<string, unknown>
  }
  if (o.v === 1 && o.o && typeof o.o === 'object' && !Array.isArray(o.o)) {
    return o.o as Record<string, unknown>
  }
  return null
}

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
 * Parse JSON export (`levelOverrides`), share envelope (`{ v:1, o }`), a page URL with `?labs=…`,
 * or a raw `u…` / `z…` share payload into bounded level overrides.
 */
export async function parseLabLevelsPayload(
  raw: string,
  data: ResearchData,
): Promise<ParseLabLevelsResult> {
  const text = raw.trim()
  if (!text) return { ok: false, error: 'empty' }

  if (text.startsWith('{')) {
    try {
      const parsed: unknown = JSON.parse(text)
      const rawLo = rawOverridesFromUnknown(parsed)
      if (!rawLo) return { ok: false, error: 'no_level_data' }
      return { ok: true, overrides: sanitizeLevelOverrides(data, rawLo) }
    } catch {
      return { ok: false, error: 'invalid_json' }
    }
  }

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

  return { ok: false, error: 'invalid_json' }
}
