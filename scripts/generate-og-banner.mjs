/**
 * Build public/og-banner.png (1200×630) from brand layout + public/app-icon.svg.
 * Run: npm run og-banner
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'
import { renderAppIconPng } from './render-app-icon-png.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const iconSvgPath = join(root, 'public', 'app-icon.svg')
const iconB64 = renderAppIconPng(512, iconSvgPath).toString('base64')

// Left UI panel: y=72, h=486 → vertical center 315
const brandCenterX = 920
const iconSize = 272
const iconX = brandCenterX - iconSize / 2
const iconY = 106
const titleY = 438
const subtitleY = 482
const taglineY = 516

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#132042"/>
      <stop offset="55%" stop-color="#0b1220"/>
    </linearGradient>
    <radialGradient id="glow" cx="77%" cy="36%" r="34%">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/>
    </radialGradient>
    <filter id="iconGlow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="18" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="panelShadow">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000" flood-opacity="0.45"/>
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <g opacity="0.07" stroke="#22d3ee" stroke-width="1">
    <path d="M80 40h1040v550H80z" fill="none"/>
    <path d="M200 40v550M400 40v550M600 40v550M800 40v550M1000 40v550"/>
    <path d="M80 140h1040M80 280h1040M80 420h1040"/>
  </g>

  <g filter="url(#panelShadow)">
    <rect x="56" y="72" width="548" height="486" rx="20" fill="#0f172a" stroke="rgba(34,211,238,0.35)" stroke-width="2"/>
    <rect x="56" y="72" width="548" height="56" rx="20" fill="#111a2e"/>
    <rect x="56" y="104" width="548" height="24" fill="#111a2e"/>

    <g font-family="system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-weight="700" font-size="13" letter-spacing="0.06em">
      <text x="88" y="108" fill="#22d3ee">WORKSHOP</text>
      <text x="198" y="108" fill="#94a3b8">CARDS</text>
      <text x="278" y="108" fill="#94a3b8">LAB</text>
      <text x="328" y="108" fill="#94a3b8">THEMES</text>
      <rect x="80" y="114" width="72" height="3" rx="1.5" fill="#22d3ee"/>
    </g>

    <g font-family="system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="11" fill="#94a3b8">
      <text x="88" y="148">UPGRADE</text>
      <text x="168" y="148" fill="#64748b">ENHANCE</text>
    </g>

    <g font-family="ui-monospace, Consolas, monospace" font-size="10" fill="#64748b">
      <text x="420" y="148">DISPLAYED DMG</text>
      <text x="420" y="162" fill="#4ade80">1.84B</text>
    </g>

    <g>
      <rect x="80" y="178" width="228" height="88" rx="12" fill="#111a2e" stroke="rgba(34,211,238,0.25)" stroke-width="1"/>
      <text x="96" y="204" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">DAMAGE</text>
      <text x="96" y="224" font-family="ui-monospace, monospace" font-size="11" fill="#94a3b8">Lv 142</text>
      <rect x="96" y="236" width="140" height="6" rx="3" fill="#1e293b"/>
      <rect x="96" y="236" width="98" height="6" rx="3" fill="#22d3ee"/>

      <rect x="324" y="178" width="228" height="88" rx="12" fill="#111a2e" stroke="rgba(34,211,238,0.25)" stroke-width="1"/>
      <text x="340" y="204" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">ATTACK SPEED</text>
      <text x="340" y="224" font-family="ui-monospace, monospace" font-size="11" fill="#94a3b8">Lv 98</text>
      <rect x="340" y="236" width="140" height="6" rx="3" fill="#1e293b"/>
      <rect x="340" y="236" width="72" height="6" rx="3" fill="#22d3ee"/>

      <rect x="80" y="282" width="228" height="88" rx="12" fill="#111a2e" stroke="rgba(250,204,21,0.35)" stroke-width="1"/>
      <text x="96" y="308" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#facc15">CARD LOADOUT</text>
      <text x="96" y="328" font-family="ui-monospace, monospace" font-size="11" fill="#94a3b8">Preset 2 · 12/16 slots</text>
      <rect x="96" y="340" width="140" height="6" rx="3" fill="#1e293b"/>
      <rect x="96" y="340" width="110" height="6" rx="3" fill="#facc15"/>

      <rect x="324" y="282" width="228" height="88" rx="12" fill="#111a2e" stroke="rgba(34,211,238,0.25)" stroke-width="1"/>
      <text x="340" y="308" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#f8fafc">LAB RESEARCH</text>
      <text x="340" y="328" font-family="ui-monospace, monospace" font-size="11" fill="#94a3b8">Compare · Budget</text>
      <rect x="340" y="340" width="140" height="6" rx="3" fill="#1e293b"/>
      <rect x="340" y="340" width="85" height="6" rx="3" fill="#22d3ee"/>
    </g>

    <g font-family="system-ui, sans-serif" font-size="11" fill="#94a3b8">
      <text x="88" y="410">31 cards · 5 presets · Card Mastery</text>
      <text x="88" y="430">Unified CSV backup · Shareable lab builds</text>
    </g>
    <rect x="80" y="448" width="472" height="8" rx="4" fill="#1e293b"/>
    <rect x="80" y="448" width="312" height="8" rx="4" fill="#22d3ee"/>
    <text x="88" y="478" font-family="ui-monospace, monospace" font-size="10" fill="#64748b">WORKSHOP + LAB PROGRESS</text>
    <text x="520" y="478" text-anchor="end" font-family="ui-monospace, monospace" font-size="10" fill="#22d3ee">66%</text>
  </g>

  <g filter="url(#iconGlow)">
    <image href="data:image/png;base64,${iconB64}" x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" preserveAspectRatio="xMidYMid meet"/>
  </g>

  <text x="${brandCenterX}" y="${titleY}" text-anchor="middle" font-family="'Agency FB', sans-serif" font-size="52" font-weight="bold" fill="#f8fafc" letter-spacing="0.04em">TowerSmith</text>
  <text x="${brandCenterX}" y="${subtitleY}" text-anchor="middle" font-family="system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="22" fill="#94a3b8">Workshop · Cards · Lab · Themes</text>
  <text x="${brandCenterX}" y="${taglineY}" text-anchor="middle" font-family="system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="18" fill="#64748b">Plan builds, compare upgrades, share configurations</text>
</svg>
`

writeFileSync(join(root, 'public', 'og-banner.svg'), svg)

const png = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  background: '#0b1220',
}).render().asPng()

writeFileSync(join(root, 'public', 'og-banner.png'), png)
console.log('wrote public/og-banner.svg and public/og-banner.png (1200×630)')
