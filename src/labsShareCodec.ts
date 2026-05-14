import { defaultWorkshopPersisted, type WorkshopPersistedV1 } from './labPresetsStorage'

/** Query param name for encoded lab level overrides (`?labs=…`). */
export const LABS_SHARE_SEARCH_PARAM = 'labs'

export type LabsShareFileV1 = { v: 1; o: Record<string, number> }
export type LabsShareFileV2 = { v: 2; o: Record<string, number>; w?: unknown }
export type LabsShareFile = LabsShareFileV1 | LabsShareFileV2

/**
 * Builds share URLs for the current `labs` payload.
 * - **clean**: `origin` + `pathname` + `?labs=…` only (drops hash and other query params).
 * - **full**: current `href` with `labs` set (keeps other params and hash).
 */
export function buildLabsShareUrls(
  encoded: string,
  pageHref: string,
): { clean: string; full: string } {
  const full = new URL(pageHref)
  full.searchParams.set(LABS_SHARE_SEARCH_PARAM, encoded)
  const clean = new URL(full.origin + full.pathname)
  clean.searchParams.set(LABS_SHARE_SEARCH_PARAM, encoded)
  return { clean: clean.toString(), full: full.toString() }
}

export function isLabsShareFile(x: unknown): x is LabsShareFile {
  if (!x || typeof x !== 'object') return false
  const v = (x as { v?: unknown }).v
  const o = (x as { o?: unknown }).o
  if (v !== 1 && v !== 2) return false
  if (o === null || typeof o !== 'object' || Array.isArray(o)) return false
  if (v === 2 && 'w' in x) {
    const w = (x as { w?: unknown }).w
    if (w !== undefined && (w === null || typeof w !== 'object' || Array.isArray(w))) {
      return false
    }
  }
  return true
}

/** Satisfies `Blob` constructor typing for `Uint8Array` views on shared buffers. */
function uint8ToBlobPart(u8: Uint8Array): BlobPart {
  return u8.buffer.slice(
    u8.byteOffset,
    u8.byteOffset + u8.byteLength,
  ) as ArrayBuffer
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromBase64Url(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4))
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + pad
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

/**
 * Encodes lab overrides for use in `?labs=`. Uses raw DEFLATE when supported,
 * otherwise base64url JSON with an `u` prefix.
 * When `workshop` differs from defaults, uses **v:2** and embeds `w` so links restore workshop too.
 */
export async function encodeLabsShareQueryValue(
  levelOverrides: Record<string, number>,
  workshop?: WorkshopPersistedV1,
): Promise<string> {
  const def = defaultWorkshopPersisted()
  const includeWorkshop =
    workshop != null && JSON.stringify(workshop) !== JSON.stringify(def)
  const file: LabsShareFile = includeWorkshop
    ? { v: 2, o: levelOverrides, w: workshop }
    : { v: 1, o: levelOverrides }
  const json = JSON.stringify(file)
  const bytes = new TextEncoder().encode(json)

  if (typeof CompressionStream === 'undefined') {
    return `u${toBase64Url(bytes)}`
  }

  const stream = new Blob([uint8ToBlobPart(bytes)])
    .stream()
    .pipeThrough(new CompressionStream('deflate'))
  const compressed = new Uint8Array(await new Response(stream).arrayBuffer())
  const zBody = `z${toBase64Url(compressed)}`
  const uBody = `u${toBase64Url(bytes)}`
  return zBody.length < uBody.length ? zBody : uBody
}

export async function decodeLabsShareQueryValue(
  encoded: string,
): Promise<LabsShareFile | null> {
  const trimmed = encoded.trim()
  if (!trimmed) return null
  const mode = trimmed[0]
  const body = trimmed.slice(1)
  if (!body || (mode !== 'u' && mode !== 'z')) return null

  try {
    const rawBytes = fromBase64Url(body)
    let json: string
    if (mode === 'u') {
      json = new TextDecoder().decode(rawBytes)
    } else {
      if (typeof DecompressionStream === 'undefined') return null
      const stream = new Blob([uint8ToBlobPart(rawBytes)])
        .stream()
        .pipeThrough(new DecompressionStream('deflate'))
      json = await new Response(stream).text()
    }
    const parsed: unknown = JSON.parse(json)
    if (!isLabsShareFile(parsed)) return null
    return parsed as LabsShareFile
  } catch {
    return null
  }
}
