/** Query param name for encoded lab level overrides (`?labs=…`). */
export const LABS_SHARE_SEARCH_PARAM = 'labs'

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

type LabsShareFile = { v: 1; o: Record<string, number> }

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

function isLabsShareFile(x: unknown): x is LabsShareFile {
  if (!x || typeof x !== 'object') return false
  const o = (x as { v?: unknown; o?: unknown }).v
  const payload = (x as { o?: unknown }).o
  return o === 1 && payload !== null && typeof payload === 'object' && !Array.isArray(payload)
}

/**
 * Encodes lab overrides for use in `?labs=`. Uses raw DEFLATE when supported,
 * otherwise base64url JSON with an `u` prefix.
 */
export async function encodeLabsShareQueryValue(
  levelOverrides: Record<string, number>,
): Promise<string> {
  const file: LabsShareFile = { v: 1, o: levelOverrides }
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
    return parsed
  } catch {
    return null
  }
}
