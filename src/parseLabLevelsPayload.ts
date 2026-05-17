import {
  decodeLabsShareQueryValue,
  isLabsShareFile,
  LABS_SHARE_SEARCH_PARAM_LEGACY,
  TOWER_SHARE_SEARCH_PARAM,
  type LabsShareFile,
} from './labsShareCodec'
import { parseLabLevelOverridesCsv } from './labLevelOverridesCsv'
import { sanitizeLevelOverrides } from './labLevelOverridesSanitize'
import {
  sanitizeWorkshopPersisted,
  type WorkshopPersistedV1,
} from './labPresetsStorage'
import type { ResearchData } from './types/research'
import {
  sanitizeThemeOwnedIds,
  sanitizeThemeSelection,
  type TowerThemesSnapshot,
} from './towerDataThemes'
import { parseTowerUnifiedCsv, towerUnifiedPrimaryBuild } from './towerUnifiedCsv'

export type ParseLabLevelsError =
  | 'empty'
  | 'share_decode_failed'
  | 'invalid_csv'
  | 'invalid_payload'

export type ParseLabLevelsResult =
  | {
      ok: true
      overrides: Record<string, number>
      workshop?: WorkshopPersistedV1
      themes?: TowerThemesSnapshot
    }
  | { ok: false; error: ParseLabLevelsError }

/** Extract `tower` (or legacy `labs`) query value from a pasted URL (percent-decoded). */
export function extractLabsShareEncodedFromText(text: string): string | null {
  const t = text.trim()
  for (const param of [TOWER_SHARE_SEARCH_PARAM, LABS_SHARE_SEARCH_PARAM_LEGACY]) {
    const escaped = param.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const m =
      t.match(new RegExp(`[?&]${escaped}=([^&\\s#]+)`, 'i')) ??
      t.match(new RegExp(`^${escaped}=([^&\\s#]+)`, 'i'))
    const raw = m?.[1]?.trim()
    if (!raw) continue
    try {
      return decodeURIComponent(raw)
    } catch {
      return raw
    }
  }
  return null
}

function packShareParse(
  data: ResearchData,
  dec: LabsShareFile,
): Extract<ParseLabLevelsResult, { ok: true }> {
  const overrides = sanitizeLevelOverrides(data, dec.o as Record<string, unknown>)
  const workshop =
    (dec.v === 2 || dec.v === 3 || dec.v === 4) && dec.w !== undefined
      ? sanitizeWorkshopPersisted(dec.w)
      : undefined
  const themes =
    dec.v === 4 && dec.t
      ? {
          selection: sanitizeThemeSelection(dec.t.sel),
          ownedIds: sanitizeThemeOwnedIds(dec.t.owned),
        }
      : undefined
  return {
    ok: true,
    overrides,
    ...(workshop !== undefined ? { workshop } : {}),
    ...(themes !== undefined ? { themes } : {}),
  }
}

/**
 * Parse a page URL with `?tower=…` (or legacy `?labs=…`), a raw `u…` / `z…` share payload, inline JSON `{ "v":1|2|3, "o":…, "w"? , "n"? }`,
 * combined **tower CSV** (`tower_csv_v1` first line), or legacy lab-only CSV (`key,level` rows).
 */
export async function parseLabLevelsPayload(
  raw: string,
  data: ResearchData,
): Promise<ParseLabLevelsResult> {
  const text = raw.trim()
  if (!text) return { ok: false, error: 'empty' }

  const tower = parseTowerUnifiedCsv(text)
  if (tower.tag === 'invalid') return { ok: false, error: 'invalid_csv' }
  if (tower.tag === 'ok') {
    const primary = towerUnifiedPrimaryBuild(tower)
    return {
      ok: true,
      overrides: sanitizeLevelOverrides(
        data,
        primary.overrides as Record<string, unknown>,
      ),
      workshop: primary.workshop,
      ...(tower.themes ? { themes: tower.themes } : {}),
    }
  }

  if (text[0] === '{') {
    try {
      const j: unknown = JSON.parse(text)
      if (isLabsShareFile(j)) {
        return packShareParse(data, j)
      }
    } catch {
      /* fall through */
    }
  }

  const fromUrl = extractLabsShareEncodedFromText(text)
  if (fromUrl) {
    const dec = await decodeLabsShareQueryValue(fromUrl)
    if (!dec?.o) return { ok: false, error: 'share_decode_failed' }
    return packShareParse(data, dec)
  }

  if ((text[0] === 'u' || text[0] === 'z') && text.length >= 2) {
    const dec = await decodeLabsShareQueryValue(text)
    if (dec?.o) {
      return packShareParse(data, dec)
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
