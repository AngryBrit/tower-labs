/**
 * Rasterize public/app-icon.svg to PNG with rounded corners (resvg-safe).
 */
import { readFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'

const CORNER_RADIUS = 454
const VIEW_SIZE = 2138
/** W3C maskable safe zone: important content inside a circle of 40% radius (80% diameter). */
const MASKABLE_SAFE_SCALE = 0.8
const ICON_BG = '#0B1220'

export function renderAppIconPng(size, svgPath, options = {}) {
  const { maskable = false } = options
  const artwork = readFileSync(svgPath, 'utf8')
  const flat = new Resvg(artwork, {
    fitTo: { mode: 'width', value: size },
    background: 'transparent',
  }).render().asPng()
  const b64 = flat.toString('base64')

  let wrapper
  if (maskable) {
    const inner = size * MASKABLE_SAFE_SCALE
    const offset = (size - inner) / 2
    wrapper = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${ICON_BG}"/>
  <image href="data:image/png;base64,${b64}" x="${offset}" y="${offset}" width="${inner}" height="${inner}"/>
</svg>`
  } else {
    const r = Math.round((CORNER_RADIUS / VIEW_SIZE) * size)
    wrapper = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <mask id="round">
      <path fill="#fff" d="M${r},0 H${size - r} Q${size},0 ${size},${r} V${size - r} Q${size},${size} ${size - r},${size} H${r} Q0,${size} 0,${size - r} V${r} Q0,0 ${r},0 Z"/>
    </mask>
  </defs>
  <g mask="url(#round)">
    <image href="data:image/png;base64,${b64}" width="${size}" height="${size}"/>
  </g>
</svg>`
  }

  return new Resvg(wrapper, {
    fitTo: { mode: 'width', value: size },
    background: 'transparent',
  }).render().asPng()
}
