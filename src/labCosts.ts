/**
 * Marginal lab coin costs and upgrade durations come from the bundled
 * `src/data/tower-labs.json` table (per lab, per target level: `COST`, `DURATION`). Labs
 * not in that map fall back to CSV snapshot fields in `marginalCostForNextUpgrade`.
 */

import towerLabsJson from './data/tower-labs.json'

export type ToolkitLabLevel = {
  DURATION: number
  COST: number
}

type ToolkitLabsFile = Record<
  string,
  Record<string, ToolkitLabLevel | undefined> | undefined
>

const towerLabs = towerLabsJson as ToolkitLabsFile

/** Display-name mismatches between our research JSON and Tower Data lab keys */
const LAB_NAME_ALIASES: Record<string, string> = {
  'Labs Speed': 'Lab Speed',
}

function resolveToolkitLabKey(displayName: string): string | undefined {
  const trimmed = displayName.trim()
  if (towerLabs[trimmed]) return trimmed

  const mapped = LAB_NAME_ALIASES[trimmed]
  if (mapped && towerLabs[mapped]) return mapped

  const lc = trimmed.toLowerCase()
  for (const k of Object.keys(towerLabs)) {
    if (k.toLowerCase() === lc) return k
  }

  return undefined
}

function getToolkitLevelEntry(
  labDisplayName: string,
  targetLevel: number,
): ToolkitLabLevel | undefined {
  const key = resolveToolkitLabKey(labDisplayName)
  if (!key) return undefined

  const lab = towerLabs[key]
  if (!lab) return undefined

  return lab[String(targetLevel)]
}

/**
 * Raw coins for purchasing the upgrade from `currentLevel` → `currentLevel + 1`,
 * i.e. COST indexed by target lab level (same indexing as toolkit `labs.json`).
 */
export function toolkitMarginalCoinCost(
  labDisplayName: string,
  currentLevel: number,
): number | undefined {
  const entry = getToolkitLevelEntry(labDisplayName, currentLevel + 1)

  const cost = entry?.COST
  return typeof cost === 'number' && Number.isFinite(cost) ? cost : undefined
}

/**
 * Research time (seconds) for the upgrade `currentLevel` → `currentLevel + 1`,
 * i.e. DURATION at target lab level `currentLevel + 1`.
 */
export function toolkitUpgradeDurationSeconds(
  labDisplayName: string,
  currentLevel: number,
): number | undefined {
  const entry = getToolkitLevelEntry(labDisplayName, currentLevel + 1)
  const d = entry?.DURATION
  return typeof d === 'number' && Number.isFinite(d) ? d : undefined
}

/** Inverse of `formatCoinAbbrev` for snapshot strings like `12.91 M`, `300`, `1.1 q`. */
export function parseAbbreviatedCoinsToNumber(input: string): number | undefined {
  const t = String(input).trim().replace(/,/g, '')
  if (!t || t === '—' || /^max$/i.test(t)) return undefined

  const m = /^([\d.]+)\s*([KkMmBbTtQq])?$/.exec(t.replace(/\s+/g, ' ').trim())
  if (!m) return undefined

  const n = Number(m[1])
  if (!Number.isFinite(n)) return undefined

  const suf = (m[2] ?? '').toLowerCase()
  const mult =
    suf === 'k'
      ? 1e3
      : suf === 'm'
        ? 1e6
        : suf === 'b'
          ? 1e9
          : suf === 't'
            ? 1e12
            : suf === 'q'
              ? 1e15
              : 1

  const v = n * mult
  return Number.isFinite(v) ? v : undefined
}

/** Abbreviated coin display (K/M/B/T/q): always two decimals (e.g. `197.60 K`). */
export function formatCoinAbbrev(n: number): string {
  if (!Number.isFinite(n) || n < 0) return '—'
  if (n < 1e3) return n < 1 ? n.toFixed(2) : String(Math.round(n))
  const abs = n
  if (abs >= 1e15) return `${(n / 1e15).toFixed(2)} q`
  if (abs >= 1e12) return `${(n / 1e12).toFixed(2)} T`
  if (abs >= 1e9) return `${(n / 1e9).toFixed(2)} B`
  if (abs >= 1e6) return `${(n / 1e6).toFixed(2)} M`
  if (abs >= 1e3) return `${(n / 1e3).toFixed(2)} K`
  return String(Math.round(n))
}
