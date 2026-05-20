/**
 * Generates src/data/workshopBotsData.ts from wiki bot upgrade tables.
 * Run: node scripts/gen-workshop-bots-data.mjs
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @param {readonly number[]} values stat at levels 0 … n */
function medalTrack(kind, values) {
  return {
    valueKind: kind,
    milestones: values.map((value, i) => ({
      value,
      marginalStones: i === 0 ? 0 : 100 + (i - 1) * 40,
    })),
  }
}

function lin(start, step, count) {
  return Array.from({ length: count }, (_, i) => start + i * step)
}

const thunderDuration = lin(5, 0.5, 21)
const thunderCooldown = lin(120, -3, 16)
const thunderLinger = lin(20, 3, 21)
const thunderRange = [26, ...lin(28, 3, 15)]

const goldenDuration = lin(20, 0.5, 31)
const goldenCooldown = lin(120, -3, 16)
const goldenBonus = lin(2, 0.2, 21)
const goldenRange = lin(20, 2, 31)

const amplifyDuration = lin(20, 0.5, 31)
const amplifyCooldown = lin(120, -3, 16)
const amplifyBonus = lin(3.5, 0.4, 21)
const amplifyRange = lin(25, 2, 31)

const botBotDuration = lin(20, 0.5, 31)
const botBotCooldown = lin(120, -3, 16)
const botBotBonus = lin(1.05, 0.05, 31)
const botBotRange = lin(25, 2, 19)

const flameDamageReduction = lin(20, 3, 26)
const flameCooldown = lin(75, -3, 16)
const flameDamage = lin(50, 8, 31)
const flameRange = [30, ...lin(34, 4, 15)]

const BOTS = {
  flame: {
    damageReduction: medalTrack('percent', flameDamageReduction),
    cooldown: medalTrack('seconds', flameCooldown),
    damage: medalTrack('mult', flameDamage),
    range: medalTrack('meters', flameRange),
  },
  thunder: {
    duration: medalTrack('seconds', thunderDuration),
    cooldown: medalTrack('seconds', thunderCooldown),
    linger: medalTrack('percent', thunderLinger),
    range: medalTrack('meters', thunderRange),
  },
  golden: {
    duration: medalTrack('seconds', goldenDuration),
    cooldown: medalTrack('seconds', goldenCooldown),
    bonus: medalTrack('mult', goldenBonus),
    range: medalTrack('meters', goldenRange),
  },
  amplify: {
    duration: medalTrack('seconds', amplifyDuration),
    cooldown: medalTrack('seconds', amplifyCooldown),
    bonus: medalTrack('mult', amplifyBonus),
    range: medalTrack('meters', amplifyRange),
  },
  botBot: {
    duration: medalTrack('seconds', botBotDuration),
    cooldown: medalTrack('seconds', botBotCooldown),
    bonus: medalTrack('mult', botBotBonus),
    range: medalTrack('meters', botBotRange),
  },
}

const BOT_ORDER = ['flame', 'thunder', 'golden', 'amplify', 'botBot']

const BOT_STATS = {
  flame: [
    { key: 'flameBotDamageReductionLevel', stat: 'damageReduction' },
    { key: 'flameBotCooldownLevel', stat: 'cooldown' },
    { key: 'flameBotDamageLevel', stat: 'damage' },
    { key: 'flameBotRangeLevel', stat: 'range' },
  ],
  thunder: [
    { key: 'thunderBotDurationLevel', stat: 'duration' },
    { key: 'thunderBotCooldownLevel', stat: 'cooldown' },
    { key: 'thunderBotLingerLevel', stat: 'linger' },
    { key: 'thunderBotRangeLevel', stat: 'range' },
  ],
  golden: [
    { key: 'goldenBotDurationLevel', stat: 'duration' },
    { key: 'goldenBotCooldownLevel', stat: 'cooldown' },
    { key: 'goldenBotBonusLevel', stat: 'bonus' },
    { key: 'goldenBotRangeLevel', stat: 'range' },
  ],
  amplify: [
    { key: 'amplifyBotDurationLevel', stat: 'duration' },
    { key: 'amplifyBotCooldownLevel', stat: 'cooldown' },
    { key: 'amplifyBotBonusLevel', stat: 'bonus' },
    { key: 'amplifyBotRangeLevel', stat: 'range' },
  ],
  botBot: [
    { key: 'botBotDurationLevel', stat: 'duration' },
    { key: 'botBotCooldownLevel', stat: 'cooldown' },
    { key: 'botBotBonusLevel', stat: 'bonus' },
    { key: 'botBotRangeLevel', stat: 'range' },
  ],
}

const SPECIAL_UNLOCK = {
  flame: 'flameBotBurningGroundUnlocked',
  thunder: 'thunderBotTitanShockUnlocked',
  golden: 'goldenBotBonusCellsUnlocked',
  amplify: 'amplifyBotEchoingShotUnlocked',
  botBot: 'botBotMaximumPowerUnlocked',
}

/** Wiki Events → Bot+ Ability Costs (May 2026). */
const SPECIAL_LEVEL = {
  flame: 'flameBotBurningGroundLevel',
  thunder: 'thunderBotTitanShockLevel',
  golden: 'goldenBotBonusCellsLevel',
  amplify: 'amplifyBotEchoingShotLevel',
  botBot: 'botBotMaximumPowerLevel',
}

const SPECIAL_TRACK_ROWS = {
  flame: {
    kind: 'mult',
    rows: [
      [1.5, 0], [1.6, 100], [1.7, 150], [1.8, 200], [1.9, 250], [2.0, 300], [2.1, 350], [2.2, 400],
      [2.3, 450], [2.4, 500], [2.5, 550], [2.6, 600], [2.7, 650], [2.8, 700], [2.9, 750], [3.0, 800],
      [3.1, 850], [3.2, 900], [3.3, 950], [3.4, 1000], [3.5, 1050],
    ],
  },
  thunder: {
    kind: 'percent',
    rows: [
      [5, 0], [6, 100], [7, 150], [8, 200], [9, 250], [10, 300], [11, 350], [12, 400], [13, 450],
      [14, 500], [15, 550], [16, 600], [17, 650], [18, 700], [19, 750], [20, 800], [21, 850],
      [22, 900], [23, 950], [24, 1000], [25, 1050],
    ],
  },
  golden: {
    kind: 'mult',
    rows: [
      [1.25, 0], [1.3, 100], [1.35, 150], [1.4, 200], [1.45, 250], [1.5, 300], [1.55, 350], [1.6, 400],
      [1.65, 450], [1.7, 500], [1.75, 550], [1.8, 600], [1.85, 650], [1.9, 700], [1.95, 750], [2.0, 800],
      [2.05, 850], [2.1, 900], [2.15, 950], [2.2, 1000], [2.25, 1050], [2.3, 1100], [2.35, 1150],
      [2.4, 1200], [2.45, 1250], [2.5, 1300],
    ],
  },
  amplify: {
    kind: 'count',
    rows: [
      [3, 0], [4, 100], [5, 300], [6, 500], [7, 700], [8, 900], [9, 1100], [10, 1300], [11, 1500], [12, 1700],
    ],
  },
  botBot: {
    kind: 'mult',
    rows: [
      [1.25, 0], [1.3, 100], [1.35, 150], [1.4, 200], [1.45, 250], [1.5, 300], [1.55, 350], [1.6, 400],
      [1.65, 450], [1.7, 500], [1.75, 550], [1.8, 600], [1.85, 650], [1.9, 700], [1.95, 750], [2.0, 800],
      [2.05, 850], [2.1, 900], [2.15, 950], [2.2, 1000], [2.25, 1050],
    ],
  },
}

const UPGRADE_ORDER = BOT_ORDER.flatMap((id) => BOT_STATS[id].map((s) => s.key))

function emitTrack(id, track) {
  const rows = track.milestones
    .map((m) => `[${m.value}, ${m.marginalStones}]`)
    .join(', ')
  return `  ${id}: track('${track.valueKind}', [${rows}]),`
}

const tracksBody = BOT_ORDER.flatMap((botId) => {
  const stats = BOT_STATS[botId]
  return stats.map(({ key, stat }) => {
    const track = BOTS[botId][stat]
    return emitTrack(key, track)
  })
}).join('\n')

const specialTracksBody = BOT_ORDER.map((botId) => {
  const { kind, rows } = SPECIAL_TRACK_ROWS[botId]
  const key = SPECIAL_LEVEL[botId]
  const rowStr = rows.map(([v, m]) => `[${v}, ${m}]`).join(', ')
  return `  ${key}: track('${kind}', [${rowStr}]),`
}).join('\n')

const SPECIAL_LEVEL_ORDER = BOT_ORDER.map((id) => SPECIAL_LEVEL[id])

const out = `/** Wiki bot upgrade tables — generated by scripts/gen-workshop-bots-data.mjs */

import type { WorkshopUltimateTrack } from './workshopUltimateTable'

export type WorkshopBotId = ${BOT_ORDER.map((id) => `'${id}'`).join(' | ')}

export type WorkshopBotUpgradeKey =
${UPGRADE_ORDER.map((k) => `  | '${k}'`).join('\n')}

export type WorkshopBotSpecialKey =
${Object.values(SPECIAL_UNLOCK)
  .map((k) => `  | '${k}'`)
  .join('\n')}

export type WorkshopBotSpecialLevelKey =
${SPECIAL_LEVEL_ORDER.map((k) => `  | '${k}'`).join('\n')}

export const WORKSHOP_BOT_ORDER: readonly WorkshopBotId[] = ${JSON.stringify(BOT_ORDER)}

export const WORKSHOP_BOT_UPGRADE_ORDER: readonly WorkshopBotUpgradeKey[] = ${JSON.stringify(UPGRADE_ORDER)}

export const WORKSHOP_BOT_SPECIAL_LEVEL_ORDER: readonly WorkshopBotSpecialLevelKey[] = ${JSON.stringify(SPECIAL_LEVEL_ORDER)}

/** Level before stone unlock (wiki: ability not purchased). */
export const WORKSHOP_BOT_SPECIAL_LEVEL_LOCKED = -1 as const

export const WORKSHOP_BOT_SPECIAL_UNLOCK_STONES = 1250 as const

export const WORKSHOP_BOT_SPECIAL_BY_BOT: Record<WorkshopBotId, WorkshopBotSpecialKey> = ${JSON.stringify(SPECIAL_UNLOCK)}

export const WORKSHOP_BOT_SPECIAL_LEVEL_BY_BOT: Record<WorkshopBotId, WorkshopBotSpecialLevelKey> = ${JSON.stringify(SPECIAL_LEVEL)}

export const WORKSHOP_BOT_WEAPON_STATS: Record<
  WorkshopBotId,
  readonly { key: WorkshopBotUpgradeKey; stat: string }[]
> = ${JSON.stringify(BOT_STATS, null, 2).replace(/"([^"]+)":/g, '$1:')}

function track(kind: WorkshopUltimateTrack['valueKind'], rows: readonly (readonly [number, number])[]) {
  return {
    valueKind: kind,
    milestones: rows.map(([value, marginalStones], i) => ({
      value,
      marginalStones: i === 0 ? 0 : marginalStones,
    })),
  } satisfies WorkshopUltimateTrack
}

export const WORKSHOP_BOT_TRACKS: Record<WorkshopBotUpgradeKey, WorkshopUltimateTrack> = {
${tracksBody}
}

export const WORKSHOP_BOT_SPECIAL_TRACKS: Record<WorkshopBotSpecialLevelKey, WorkshopUltimateTrack> = {
${specialTracksBody}
}
`

writeFileSync(join(__dirname, '../src/data/workshopBotsData.ts'), out)
console.log('Wrote src/data/workshopBotsData.ts')
