/**
 * One-shot: read Module Labs wiki from agent transcript, emit tower-labs-shaped JSON
 * for the eight module labs (keys match research card names).
 *
 * Run: node scripts/build-module-tower-labs.mjs
 * Then merge stdout object into src/data/tower-labs.json (before final "}").
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TRANSCRIPT =
  process.env.MODULE_LABS_WIKI_JSONL ??
  join(
    process.env.USERPROFILE ?? process.env.HOME ?? '',
    '.cursor',
    'projects',
    'c-Users-venar-OneDrive-Documents-Dev-tower-export',
    'agent-transcripts',
    'eaeb85cb-3d8f-43a4-ac84-298ba9a2a894',
    'eaeb85cb-3d8f-43a4-ac84-298ba9a2a894.jsonl',
  )

function extractWikiText() {
  const raw = readFileSync(TRANSCRIPT, 'utf8')
  const lines = raw.split('\n')
  for (const line of lines) {
    if (!line.includes('Module Labs') || !line.includes('Common Drop Chance')) continue
    try {
      const row = JSON.parse(line)
      const t = row?.message?.content?.[0]?.text
      if (typeof t === 'string' && t.includes('100\t9d 20h 11m')) return t
    } catch {
      /* skip */
    }
  }
  throw new Error('Could not find Module Labs wiki line in transcript')
}

/** Wiki uses `hr` in one row; normalize to `h`. */
function normalizeTime(s) {
  return String(s)
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/(\d+)\s*hr\b/gi, '$1h')
}

/**
 * Parse `Nd Nh Nm` / optional leading `Ny`.
 * Year = 365d (game-style).
 */
function parseDurationSeconds(timeRaw) {
  const s = normalizeTime(timeRaw)
  let days = 0
  let rest = s
  const yM = /^(\d+)\s*y\s*/i.exec(rest)
  if (yM) {
    days += Number.parseInt(yM[1], 10) * 365
    rest = rest.slice(yM[0].length).trim()
  }
  const dhM = /^(\d+)\s*d\s*(\d+)\s*h\s*(\d+)\s*m$/i.exec(rest)
  if (!dhM) throw new Error(`Unparsed time: "${timeRaw}" -> "${rest}"`)
  days += Number.parseInt(dhM[1], 10)
  const h = Number.parseInt(dhM[2], 10)
  const m = Number.parseInt(dhM[3], 10)
  return ((days * 24 + h) * 60 + m) * 60
}

function parseCost(c) {
  const t = String(c).replace(/,/g, '').trim()
  const q = /^([\d.]+)\s*q$/i.exec(t)
  if (q) return Number(q[1]) * 1e15
  const tr = /^([\d.]+)\s*T$/i.exec(t)
  if (tr) return Number(tr[1]) * 1e12
  const n = Number(t)
  if (!Number.isFinite(n)) throw new Error(`Bad cost: ${c}`)
  return Math.round(n)
}

function parseTableSection(text, headerLineStart) {
  const lines = text.split('\n')
  const start = lines.findIndex((l) => l.includes(headerLineStart))
  if (start < 0) throw new Error(`Missing section: ${headerLineStart}`)
  const rows = []
  for (let i = start; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue
    if (/^[A-Za-z]/.test(line) && !/^\d+\t/.test(line)) break
    const m = /^(\d+)\t([^\t]+)\t([^\t]+)/.exec(line)
    if (!m) continue
    const lvl = Number.parseInt(m[1], 10)
    const time = m[2].trim()
    const costCell = m[3].trim()
    rows.push({ lvl, time, costCell })
  }
  return rows
}

function rowsToLab(rows, timeFixes = {}) {
  const out = {}
  for (const r of rows) {
    let time = r.time
    if (timeFixes[r.lvl]) time = timeFixes[r.lvl]
    const sec = parseDurationSeconds(time)
    const cost = parseCost(r.costCell)
    out[String(r.lvl)] = { DURATION: sec, COST: cost }
  }
  return out
}

const wiki = extractWikiText()

// Wiki typo fixes (pattern continuity)
const rerollFixes = {
  13: '1d 21h 31m', // was 2d 21h 31m
  76: '6d 22h 51m', // was 7d 22h 51m (jump vs L75)
}

const common = parseTableSection(
  wiki,
  '1\t4d 4h 0m\t5,000,000\t0.10',
)
const reroll = parseTableSection(
  wiki,
  '1\t1d 9h 20m\t900,000\t1.00',
)
const daily = parseTableSection(
  wiki,
  '1\t1d 9h 19m\t1,200,000\t1.00',
)
const shardCost = parseTableSection(
  wiki,
  '1\t5d  4h  59m\t            5,000,000,000\t-1%',
)
const coinIdx = wiki.indexOf('Module Coin Cost\nLab.pngLab')
if (coinIdx < 0) throw new Error('Module Coin Cost section header not found')
const wikiCoin = wiki.slice(coinIdx)
const coinRows = parseTableSection(
  wikiCoin,
  '1\t5d  4h  59m\t            5,000,000,000\t-1%',
)

const rare = parseTableSection(wiki, '1\t8d 16h 20m\t70,000,000,000\t0.10%')
const unmerge = parseTableSection(wiki, '1\t2d 0hr 0m\t10,000,000\tUnlocked')
const shatter = parseTableSection(wiki, '1\t142d 14h 13m\t10.00T\t20%')

const fragment = {
  'Common Drop Chance': rowsToLab(common),
  'Reroll Shards': rowsToLab(reroll, rerollFixes),
  'Daily Mission Shards': rowsToLab(daily),
  'Module Shards Cost': rowsToLab(shardCost),
  'Module Coin Cost': rowsToLab(coinRows),
  'Rare Drop Chance': rowsToLab(rare),
  'Unmerge Module': rowsToLab(unmerge),
  'Shatter Shards': rowsToLab(shatter),
}

// Sanity: expected max levels
const expected = {
  'Common Drop Chance': 10,
  'Reroll Shards': 100,
  'Daily Mission Shards': 50,
  'Module Shards Cost': 30,
  'Module Coin Cost': 30,
  'Rare Drop Chance': 10,
  'Unmerge Module': 1,
  'Shatter Shards': 5,
}
for (const [k, n] of Object.entries(expected)) {
  const got = Object.keys(fragment[k]).length
  if (got !== n) throw new Error(`${k}: expected ${n} levels, got ${got}`)
}

console.log(JSON.stringify(fragment, null, 2))
