/**
 * Generates src/i18n/dictionary.de.ts from tmp-strings-en.json.
 * Run: node scripts/generate-dictionary-de.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const en = JSON.parse(
  fs.readFileSync(path.join(root, 'tmp-strings-en.json'), 'utf8'),
)
const kept = new Set(
  JSON.parse(fs.readFileSync(path.join(root, 'tmp-kept-en-keys.json'), 'utf8')),
)

/** Per-key German overrides (highest priority). */
const BY_KEY = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'dictionary-de-by-key.json'), 'utf8'),
)

function escapeTs(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

const de = {}
for (const key of Object.keys(en)) {
  if (key in BY_KEY) {
    de[key] = BY_KEY[key]
  } else if (kept.has(key)) {
    de[key] = en[key]
  } else {
    de[key] = en[key]
  }
}

const lines = [
  "import type { StringId } from './dictionary'",
  '',
  'export const STRINGS_DE = {',
]
for (const key of Object.keys(en)) {
  const val = de[key] ?? en[key]
  if (val.includes('\n')) {
    lines.push(`  ${key}:`, `    '${escapeTs(val)}',`)
  } else {
    lines.push(`  ${key}: '${escapeTs(val)}',`)
  }
}
lines.push('} satisfies Record<StringId, string>', '')

const outPath = path.join(root, 'src/i18n/dictionary.de.ts')
fs.writeFileSync(outPath, lines.join('\n'), 'utf8')
console.log('Wrote', outPath, Object.keys(de).length, 'keys')
