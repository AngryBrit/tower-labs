/**
 * Generates src/data/workshopUltimateData.ts from embedded wiki milestone tables.
 * Run: node scripts/gen-workshop-ultimate-data.mjs
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @param {readonly (readonly [number, number])[]} rows value + marginal stones to reach this level */
function track(kind, rows) {
  return { valueKind: kind, milestones: rows.map(([value, marginalStones], i) => ({ value, marginalStones: i === 0 ? 0 : marginalStones })) }
}

const WEAPONS = {
  chainLightning: {
    damage: track('mult', [
      [2, 0], [3, 5], [5, 11], [9, 17], [14, 23], [22, 29], [32, 35], [46, 41], [63, 47], [85, 53],
      [113, 61], [148, 71], [191, 84], [244, 100], [309, 120], [387, 144], [482, 174], [596, 210],
      [733, 252], [898, 302], [1094, 362], [1328, 434], [1607, 525], [1937, 636], [2329, 767],
      [2794, 923], [3342, 1109], [3390, 1295], [4755, 1521], [5655, 1787], [6715, 2103], [7961, 2469],
    ]),
    quantity: track('count', [[0, 0], [1, 30], [2, 75], [3, 150], [4, 400], [5, 400]]),
    chance: track('percent', [
      [5, 0], [6.5, 8], [8, 26], [9.5, 44], [11, 62], [12.5, 80], [14, 98], [15.5, 116], [17, 134],
      [18.5, 152], [20, 170], [21.5, 188], [23, 206], [24.5, 224], [26, 242], [27.5, 260],
    ]),
  },
  smartMissiles: {
    damage: track('mult', [
      [10, 0], [11, 5], [13, 11], [16, 17], [20, 23], [26, 29], [34, 35], [43, 41], [55, 47], [69, 53],
      [87, 61], [108, 71], [134, 84], [164, 100], [200, 120], [243, 144], [293, 174], [352, 210],
      [421, 252], [502, 302], [597, 362], [708, 432], [838, 528], [989, 654], [1165, 810], [1370, 996],
      [1608, 1222], [1886, 1488], [2209, 1804], [2585, 2180], [3021, 2636],
    ]),
    quantity: track('count', [
      [5, 0], [6, 4], [7, 12], [8, 35], [9, 70], [10, 120], [11, 180], [12, 275], [13, 350], [14, 420],
      [15, 500], [16, 600], [17, 750], [18, 950], [19, 1200], [20, 1500],
    ]), // wiki starts at 5#
    cooldown: track('seconds', [
      [180, 0], [170, 8], [160, 24], [150, 40], [140, 56], [130, 72], [120, 88], [110, 104], [100, 120],
      [90, 136], [80, 152], [70, 168], [60, 184], [50, 200], [40, 216], [30, 232], [20, 750],
    ]),
  },
  deathWave: {
    damage: track('mult', [
      [2, 0], [3, 5], [5, 11], [9, 17], [14, 23], [22, 29], [32, 35], [46, 41], [63, 47], [85, 53],
      [113, 61], [148, 71], [191, 84], [244, 100], [309, 120], [387, 144], [482, 174], [596, 210],
      [723, 254], [877, 308], [1064, 374], [1290, 452], [1569, 558], [1916, 694], [2356, 880],
      [2919, 1126], [3637, 1432], [4544, 1813], [5678, 2269], [7078, 2800], [9119, 4081],
    ]),
    quantity: track('count', [[1, 0], [2, 200], [3, 500], [4, 850], [5, 1400]]),
    cooldown: track('seconds', [
      [300, 0], [290, 8], [280, 24], [270, 40], [260, 56], [250, 72], [240, 88], [230, 104], [220, 120],
      [210, 136], [200, 152], [190, 168], [180, 184], [170, 200], [160, 216], [150, 232], [140, 248],
      [130, 264], [120, 280], [110, 346], [100, 512],
    ]),
  },
  chronoField: {
    duration: track('seconds', [
      [5, 0], [6, 5], [7, 14], [8, 23], [9, 32], [10, 41], [11, 50], [12, 59], [13, 68], [14, 77],
      [15, 86], [16, 95], [17, 104], [18, 113], [19, 122], [20, 131], [21, 140], [22, 149], [23, 158],
      [24, 167], [25, 176], [26, 185], [27, 194], [28, 203], [29, 212], [30, 221], [31, 230], [32, 239],
      [33, 248], [34, 257], [35, 266], [36, 275], [37, 284], [38, 293], [39, 302], [40, 311],
    ]),
    slow: track('percent', [
      [20, 0], [25, 15], [30, 25], [35, 40], [40, 60], [45, 120], [50, 150], [55, 200], [60, 300],
      [65, 450], [70, 650], [75, 900],
    ]),
    cooldown: track('seconds', [
      [180, 0], [170, 10], [160, 31], [150, 52], [140, 73], [130, 94], [120, 115], [110, 136],
      [100, 157], [90, 178], [80, 199], [70, 220], [60, 241],
    ]),
  },
  innerLandMines: {
    damage: track('mult', [
      [20, 0], [23, 5], [26, 11], [30, 17], [34, 23], [38, 29], [42, 35], [47, 41], [52, 47], [57, 53],
      [63, 61], [70, 71], [77, 84], [84, 100], [93, 120], [101, 144], [111, 174], [121, 210], [132, 254],
      [144, 308], [157, 374], [171, 454], [186, 540], [203, 632], [220, 730], [239, 834], [260, 944],
      [282, 1060], [306, 1182], [332, 1312], [360, 1448],
    ]),
    quantity: track('count', [[3, 0], [4, 50], [5, 125], [6, 250]]),
    cooldown: track('seconds', [
      [200, 0], [190, 8], [180, 24], [170, 40], [160, 56], [150, 72], [140, 88], [130, 104], [120, 120],
      [110, 136], [100, 152], [90, 168], [80, 184], [70, 200], [60, 216], [50, 232],
    ]),
  },
  goldenTower: {
    bonus: track('mult', [
      [5, 0], [5.8, 5], [6.6, 13], [7.4, 22], [8.2, 32], [9, 43], [9.8, 55], [10.6, 68], [11.4, 82],
      [12.2, 98], [13, 116], [13.8, 138], [14.6, 162], [15.4, 250], [16.2, 350], [17, 500], [17.8, 700],
      [18.6, 950], [19.4, 1250], [20.2, 1600], [21, 2000],
    ]),
    duration: track('seconds', [
      [15, 0], [16, 5], [17, 14], [18, 23], [19, 32], [20, 41], [21, 50], [22, 59], [23, 68], [24, 77],
      [25, 87], [26, 98], [27, 110], [28, 123], [29, 137], [30, 152], [31, 168], [32, 185], [33, 203],
      [34, 222], [35, 242], [36, 263], [37, 285], [38, 308], [39, 332], [40, 356], [41, 380], [42, 404],
      [43, 428], [44, 452], [45, 476], [46, 530], [47, 614], [48, 728], [49, 872], [50, 1046], [51, 1250],
      [52, 1484], [53, 1748],
    ]),
    cooldown: track('seconds', [
      [300, 0], [290, 10], [280, 28], [270, 46], [260, 64], [250, 82], [240, 100], [230, 118], [220, 136],
      [210, 154], [200, 172], [190, 190], [180, 208], [170, 226], [160, 244], [150, 262], [140, 300],
      [130, 368], [120, 476], [110, 644], [100, 872],
    ]),
  },
  poisonSwamp: {
    damage: track('mult', [
      [2, 0], [2.5, 5], [3, 11], [3.5, 17], [4, 23], [5, 29], [6, 35], [7, 41], [8, 47], [9, 53],
      [11, 61], [12, 71], [14, 84], [16, 100], [19, 120], [22, 144], [25, 174], [28, 210], [32, 252],
      [37, 302], [42, 362], [48, 434], [54, 525], [62, 636], [70, 772], [79, 938], [90, 1134], [102, 1360],
      [115, 1616], [131, 1902], [148, 2228],
    ]),
    duration: track('seconds', [
      [2, 0], [3, 10], [4, 20], [5, 35], [6, 55], [7, 100], [8, 120], [9, 150], [10, 200], [11, 260],
      [12, 330], [13, 410], [14, 500], [15, 600],
    ]),
    chance: track('percent', [
      [10, 0], [13, 8], [16, 26], [19, 44], [22, 62], [25, 80], [28, 98], [31, 116], [34, 134], [37, 152],
      [40, 170], [43, 188], [46, 206], [49, 224], [52, 242], [55, 260],
    ]),
  },
  blackHole: {
    size: track('meters', [
      [30, 0], [32, 5], [34, 12], [36, 19], [38, 26], [40, 34], [42, 43], [44, 53], [46, 64], [48, 76],
      [50, 89], [52, 103], [54, 118], [56, 134], [58, 151], [60, 169], [62, 189], [64, 211], [66, 236],
      [68, 264], [70, 295],
    ]),
    duration: track('seconds', [
      [15, 0], [16, 5], [17, 14], [18, 23], [19, 32], [20, 41], [21, 50], [22, 59], [23, 68], [24, 77],
      [25, 86], [26, 95], [27, 104], [28, 113], [29, 122], [30, 131], [31, 165], [32, 224], [33, 308],
      [34, 417], [35, 551], [36, 710], [37, 894], [38, 1103],
    ]),
    cooldown: track('seconds', [
      [200, 0], [190, 10], [180, 28], [170, 46], [160, 64], [150, 82], [140, 100], [130, 118], [120, 136],
      [110, 154], [100, 172], [90, 190], [80, 208], [70, 226], [60, 244], [50, 262],
    ]),
  },
  spotlight: {
    bonus: track('mult', [
      [8, 0], [9.4, 5], [10.8, 13], [12.2, 21], [13.6, 30], [15, 40], [16.4, 52], [17.8, 65], [19.2, 80],
      [20.6, 95], [22, 112], [23.4, 133], [24.8, 150], [26.2, 180], [27.6, 220], [29, 280], [30.4, 320],
      [31.8, 360], [33.2, 420], [34.6, 500], [36, 600], [37.4, 720], [38.8, 850], [40.2, 1000], [41.6, 1175],
      [43, 1400],
    ]),
    angle: track('angle', [
      [30, 0], [31, 5], [32, 16], [33, 27], [34, 38], [35, 49], [36, 60], [37, 71], [38, 82], [39, 93],
      [40, 104], [41, 115], [42, 126], [43, 137], [44, 148], [45, 159], [46, 170], [47, 181], [48, 192],
      [49, 203], [50, 214], [51, 225], [52, 236], [53, 247], [54, 258], [55, 269], [56, 280], [57, 291],
      [58, 302], [59, 313], [60, 324], [61, 337], [62, 352], [63, 369], [64, 388], [65, 409], [66, 432],
      [67, 457], [68, 484], [69, 513], [70, 544], [71, 577], [72, 612], [73, 649], [74, 688], [75, 729],
    ]),
    quantity: track('count', [[1, 0], [2, 375], [3, 850], [4, 2500]]),
  },
}

const STAT_KEYS = {
  chainLightning: ['damage', 'quantity', 'chance'],
  smartMissiles: ['damage', 'quantity', 'cooldown'],
  deathWave: ['damage', 'quantity', 'cooldown'],
  chronoField: ['duration', 'slow', 'cooldown'],
  innerLandMines: ['damage', 'quantity', 'cooldown'],
  goldenTower: ['bonus', 'duration', 'cooldown'],
  poisonSwamp: ['damage', 'duration', 'chance'],
  blackHole: ['size', 'duration', 'cooldown'],
  spotlight: ['bonus', 'angle', 'quantity'],
}

const PERSIST_PREFIX = {
  chainLightning: 'chainLightning',
  smartMissiles: 'smartMissiles',
  deathWave: 'deathWave',
  chronoField: 'chronoField',
  innerLandMines: 'innerLandMines',
  goldenTower: 'goldenTower',
  poisonSwamp: 'poisonSwamp',
  blackHole: 'blackHole',
  spotlight: 'spotlight',
}

const STAT_SUFFIX = {
  damage: 'DamageLevel',
  quantity: 'QuantityLevel',
  chance: 'ChanceLevel',
  cooldown: 'CooldownLevel',
  duration: 'DurationLevel',
  slow: 'SlowLevel',
  bonus: 'BonusLevel',
  size: 'SizeLevel',
  angle: 'AngleLevel',
}

function persistKey(weapon, stat) {
  const p = PERSIST_PREFIX[weapon]
  const cap = stat.charAt(0).toUpperCase() + stat.slice(1)
  return `${p}${cap}Level`
}

const weaponOrder = [
  'goldenTower',
  'blackHole',
  'spotlight',
  'deathWave',
  'chainLightning',
  'smartMissiles',
  'innerLandMines',
  'poisonSwamp',
  'chronoField',
]

let out = `/** Wiki Basic Upgrades — generated by scripts/gen-workshop-ultimate-data.mjs */\n\n`
out += `import type { WorkshopUltimateTrack } from './workshopUltimateTable'\n\n`
out += `export type WorkshopUltimateWeaponId =\n`
out += weaponOrder.map((w) => `  | '${w}'`).join('\n') + '\n\n'

const upgradeKeys = []
for (const w of weaponOrder) {
  for (const s of STAT_KEYS[w]) {
    upgradeKeys.push(persistKey(w, s))
  }
}

out += `export type WorkshopUltimateUpgradeKey =\n`
out += upgradeKeys.map((k) => `  | '${k}'`).join('\n') + '\n\n'

out += `export const WORKSHOP_ULTIMATE_WEAPON_ORDER: readonly WorkshopUltimateWeaponId[] = [\n`
out += weaponOrder.map((w) => `  '${w}',`).join('\n') + '\n]\n\n'

out += `export const WORKSHOP_ULTIMATE_UPGRADE_ORDER: readonly WorkshopUltimateUpgradeKey[] = [\n`
out += upgradeKeys.map((k) => `  '${k}',`).join('\n') + '\n]\n\n'

out += `export const WORKSHOP_ULTIMATE_WEAPON_STATS: Record<\n`
out += `  WorkshopUltimateWeaponId,\n`
out += `  readonly { key: WorkshopUltimateUpgradeKey; stat: string }[]\n`
out += `> = {\n`
for (const w of weaponOrder) {
  out += `  ${w}: [\n`
  for (const s of STAT_KEYS[w]) {
    out += `    { key: '${persistKey(w, s)}', stat: '${s}' },\n`
  }
  out += `  ],\n`
}
out += `}\n\n`

out += `export const WORKSHOP_ULTIMATE_TRACKS: Record<WorkshopUltimateUpgradeKey, WorkshopUltimateTrack> = {\n`
for (const w of weaponOrder) {
  for (const s of STAT_KEYS[w]) {
    const k = persistKey(w, s)
    const t = WEAPONS[w][s]
    out += `  ${k}: ${JSON.stringify(t, null, 2).replace(/"([^"]+)":/g, '$1:')},\n`
  }
}
out += `}\n`

const outPath = join(__dirname, '../src/data/workshopUltimateData.ts')
writeFileSync(outPath, out)
console.log('Wrote', outPath)
