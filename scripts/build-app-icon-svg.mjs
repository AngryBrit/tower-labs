/**
 * Legacy: build public/app-icon.svg from public/app-icon-maskable.svg.
 * Canonical icon source is now public/app-icon.svg — edit that file directly.
 * Run only if you need to re-import from a refreshed maskable export.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const maskablePath = join(root, 'public', 'app-icon-maskable.svg')
const outPath = join(root, 'public', 'app-icon.svg')

const raw = readFileSync(maskablePath, 'utf8')
const pathBlocks = [...raw.matchAll(/<path[\s\S]*?\/>/g)].map((m) => m[0])
const bgRect = raw.match(/<rect[^>]*fill="#0B1220"[^>]*\/>/i)?.[0] ?? ''

const artwork = pathBlocks

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2138 2138" width="512" height="512" role="img" aria-label="The Armoury">
  <defs>
    <mask id="icon-round-mask">
      <rect width="2138" height="2138" rx="454" ry="454" fill="#fff"/>
    </mask>
  </defs>
  <g mask="url(#icon-round-mask)">
    ${bgRect.replace(/\s+/g, ' ').trim()}
${artwork.map((p) => `    ${p.replace(/\s+/g, ' ').trim()}`).join('\n')}
  </g>
</svg>
`

writeFileSync(outPath, svg)
console.log(`wrote ${outPath} (${artwork.length} paths from maskable)`)
