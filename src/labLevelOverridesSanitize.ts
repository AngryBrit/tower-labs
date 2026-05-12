import type { ResearchData } from './types/research'
import { getLevelBounds } from './types/research'

/** Normalize imported / shared level maps to valid section-item keys and bounded levels. */
export function sanitizeLevelOverrides(
  data: ResearchData,
  raw: Record<string, unknown>,
): Record<string, number> {
  const out: Record<string, number> = {}
  for (const [key, val] of Object.entries(raw)) {
    const parts = key.split('-')
    if (parts.length !== 2) continue
    const si = Number(parts[0])
    const ii = Number(parts[1])
    if (!Number.isInteger(si) || !Number.isInteger(ii)) continue
    const item = data.sections[si]?.items[ii]
    if (!item) continue
    const bounds = getLevelBounds(item)
    const n = typeof val === 'number' ? val : Number(val)
    if (!Number.isFinite(n)) continue
    const rounded = Math.round(n)
    const capped =
      bounds.max > 0
        ? Math.max(0, Math.min(bounds.max, rounded))
        : Math.max(0, rounded)
    out[key] = capped
  }
  return out
}
