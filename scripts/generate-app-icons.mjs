/**
 * Rasterize public/app-icon.svg into favicon / PWA PNG sizes.
 * Run: npm run icons
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderAppIconPng } from './render-app-icon-png.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const iconSvgPath = join(root, 'public', 'app-icon.svg')

const outputs = [
  { file: 'favicon-16x16.png', size: 16 },
  { file: 'favicon-32x32.png', size: 32 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'icon-maskable-512.png', size: 512, maskable: true },
]

for (const { file, size, maskable = false } of outputs) {
  writeFileSync(
    join(root, 'public', file),
    renderAppIconPng(size, iconSvgPath, { maskable }),
  )
  const kind = maskable ? 'maskable safe-zone' : 'app-icon.svg'
  console.log(`wrote ${file} (${size}×${size}) from ${kind}`)
}
