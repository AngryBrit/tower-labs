/** CSV helpers shared by tower unified export (`tower_csv_v1`). */

export function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i]
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
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
