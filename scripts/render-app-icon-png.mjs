/**
 * Rasterize public/app-icon.svg to PNG with rounded corners (resvg-safe).
 */
import { readFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'

const CORNER_RADIUS = 454
const VIEW_SIZE = 2138

export function renderAppIconPng(size, svgPath) {
  const artwork = readFileSync(svgPath, 'utf8')
  const flat = new Resvg(artwork, {
    fitTo: { mode: 'width', value: size },
    background: 'transparent',
  }).render().asPng()
  const b64 = flat.toString('base64')
  const r = Math.round((CORNER_RADIUS / VIEW_SIZE) * size)

  const wrapper = `<?xml version="1.0" encoding="UTF-8"?>
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

  return new Resvg(wrapper, {
    fitTo: { mode: 'width', value: size },
    background: 'transparent',
  }).render().asPng()
}
