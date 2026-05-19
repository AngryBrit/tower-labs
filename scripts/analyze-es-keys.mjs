import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const en = JSON.parse(fs.readFileSync(path.join(root, 'tmp-strings-en.json'), 'utf8'))
const dict = fs.readFileSync(path.join(root, 'src/i18n/dictionary.es.ts'), 'utf8')
const esMatch = dict.match(
  /export const STRINGS_ES = \{([\s\S]*?)\} satisfies Record<StringId, string>/,
)
if (!esMatch) throw new Error('no ES')
const esBody = esMatch[1]
const es = {}
for (const m of esBody.matchAll(
  /^\s+([a-zA-Z0-9_]+):\s*(?:'((?:\\'|[^'])*)'|"((?:\\"|[^"])*)")/gm,
)) {
  const k = m[1]
  let v = m[2] ?? m[3] ?? ''
  v = v.replace(/\\'/g, "'").replace(/\\n/g, '\n')
  es[k] = v
}
const keys = Object.keys(en)
const kept = []
const changed = []
for (const k of keys) {
  if (es[k] === en[k]) kept.push(k)
  else changed.push(k)
}
console.log('en', keys.length, 'es parsed', Object.keys(es).length)
console.log('kept english', kept.length, 'changed', changed.length)
fs.writeFileSync(path.join(root, 'tmp-kept-en-keys.json'), JSON.stringify(kept, null, 2))
