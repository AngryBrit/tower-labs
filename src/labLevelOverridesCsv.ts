/** Lab level backup CSV: header `key,level` then rows like `0-3,12` (section-item, level). */

export const LAB_LEVEL_OVERRIDES_CSV_HEADER = 'key,level'

export function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i]
    if (c === '"') {
      inQuotes = !inQuotes
    } else if (c === ',' && !inQuotes) {
      result.push(cur)
      cur = ''
    } else {
      cur += c
    }
  }
  result.push(cur)
  return result
}

export function escapeCsvCell(s: string): string {
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export function sortOverrideKeys(keys: string[]): string[] {
  return [...keys].sort((a, b) => {
    const pa = a.split('-')
    const pb = b.split('-')
    const as = Number(pa[0])
    const ai = Number(pa[1])
    const bs = Number(pb[0])
    const bi = Number(pb[1])
    if (as !== bs) return as - bs
    return ai - bi
  })
}

export function serializeLabLevelOverridesCsv(
  levelOverrides: Record<string, number>,
): string {
  const keys = sortOverrideKeys(Object.keys(levelOverrides))
  const lines = [
    LAB_LEVEL_OVERRIDES_CSV_HEADER,
    ...keys.map(
      (k) => `${escapeCsvCell(k)},${levelOverrides[k] ?? 0}`,
    ),
  ]
  return `${lines.join('\r\n')}\r\n`
}

const KEY_RE = /^\d+-\d+$/

/**
 * Returns a raw map for `sanitizeLevelOverrides`, or `null` if the CSV is not usable.
 */
export function parseLabLevelOverridesCsv(
  text: string,
): Record<string, unknown> | null {
  const content = text.replace(/^\uFEFF/, '')
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.replace(/\s+$/, ''))
    .filter((l) => l.length > 0)
  if (lines.length === 0) return {}

  const rows = lines.map(parseCsvLine)
  let start = 0
  if (rows[0].length >= 2) {
    const h0 = String(rows[0][0] ?? '')
      .trim()
      .toLowerCase()
    const h1 = String(rows[0][1] ?? '')
      .trim()
      .toLowerCase()
    if (h0 === 'key' && h1 === 'level') start = 1
  }

  const out: Record<string, unknown> = {}
  for (let i = start; i < rows.length; i += 1) {
    const r = rows[i]
    if (r.length < 2) continue
    const key = String(r[0] ?? '').trim()
    const levelCell = String(r[1] ?? '').trim()
    if (!key) continue
    if (!KEY_RE.test(key)) return null
    const n = levelCell === '' ? 0 : Number(levelCell)
    if (!Number.isFinite(n)) return null
    out[key] = n
  }
  return out
}
