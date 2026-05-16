import {
  escapeCsvCell,
  parseCsvLine,
  sortOverrideKeys,
} from './labLevelOverridesCsv'
import {
  WORKSHOP_ULTIMATE_ACTIVE_ORDER,
  WORKSHOP_ULTIMATE_UPGRADE_ORDER,
} from './data/workshopUltimate'
import { sanitizeWorkshopPersisted, type WorkshopPersistedV1 } from './labPresetsStorage'

/** First line of a combined lab + workshop backup CSV. */
export const TOWER_UNIFIED_CSV_MAGIC = 'tower_csv_v1'

const HEADER = 'type,key,value'

const LAB_KEY_RE = /^\d+-\d+$/

const WS_BOOL_FIELDS = new Set<keyof WorkshopPersistedV1>([
  'hideMaxed',
  ...WORKSHOP_ULTIMATE_ACTIVE_ORDER,
])

const WS_FIELDS: readonly (keyof WorkshopPersistedV1)[] = [
  'hideMaxed',
  'mainTab',
  'category',
  'multiplier',
  'damageLevel',
  'attackSpeedLevel',
  'critChanceLevel',
  'critFactorLevel',
  'attackRangeLevel',
  'damagePerMeterLevel',
  'multishotChanceLevel',
  'multishotTargetsLevel',
  'rapidFireChanceLevel',
  'rapidFireDurationLevel',
  'bounceShotChanceLevel',
  'bounceShotTargetsLevel',
  'bounceShotRangeLevel',
  'superCritChanceLevel',
  'superCritMultLevel',
  'rendArmorChanceLevel',
  'rendArmorMultLevel',
  'healthLevel',
  'healthRegenLevel',
  'defensePercentLevel',
  'defenseAbsoluteLevel',
  'thornDamageLevel',
  'lifestealLevel',
  'knockbackChanceLevel',
  'knockbackForceLevel',
  'orbSpeedLevel',
  'orbsLevel',
  'shockwaveSizeLevel',
  'shockwaveFrequencyLevel',
  'landMineChanceLevel',
  'landMineDamageLevel',
  'landMineRadiusLevel',
  'deathDefyLevel',
  'wallHealthLevel',
  'wallRebuildLevel',
  'cashBonusLevel',
  'cashPerWaveLevel',
  'coinsKillBonusLevel',
  'coinsWaveLevel',
  'freeAttackUpgradeLevel',
  'freeDefenseUpgradeLevel',
  'freeUtilityUpgradeLevel',
  'interestPerWaveLevel',
  'recoveryAmountLevel',
  'maxRecoveryLevel',
  'packageChanceLevel',
  'enemyAttackLevelSkipLevel',
  'enemyHealthLevelSkipLevel',
  'enhanceDamageLevel',
  'enhanceRendArmorLevel',
  'enhanceCritFactorLevel',
  'enhanceDamagePerMeterLevel',
  'enhanceSuperCritMultLevel',
  'enhanceAttackSpeedLevel',
  'enhanceHealthLevel',
  'enhanceHealthRegenLevel',
  'enhanceDefenseAbsoluteLevel',
  'enhanceLandMineDamageLevel',
  'enhanceWallHealthLevel',
  'enhanceOrbSizeLevel',
  'enhanceCashBonusLevel',
  'enhanceCoinBonusLevel',
  'enhanceCellsKillBonusLevel',
  'enhanceFreeUpgradesLevel',
  'enhanceRecoveryPackageLevel',
  'enhanceEnemyLevelSkipLevel',
  'simDamageCardStars',
  'simAttackSpeedCardStars',
  'simAttackSpeedModuleSubEffect',
  'simBerserkerCardStars',
  'simBerserkerDamageTaken',
  'simRelicsBonusFraction',
  'simPerkDamageQuantity',
  'simAssistModuleSlot',
  ...WORKSHOP_ULTIMATE_UPGRADE_ORDER,
  ...WORKSHOP_ULTIMATE_ACTIVE_ORDER,
]

export type ParseTowerUnifiedCsv =
  | { tag: 'none' }
  | { tag: 'invalid' }
  | { tag: 'ok'; overrides: Record<string, number>; workshop: WorkshopPersistedV1 }

function sortLabKeys(keys: string[]): string[] {
  return sortOverrideKeys(keys)
}

function serializeWsValue(v: WorkshopPersistedV1, k: keyof WorkshopPersistedV1): string {
  const x = v[k]
  if (typeof x === 'boolean') return x ? 'true' : 'false'
  return String(x)
}

/** Lab levels + workshop snapshot as one CSV (UTF-8 with CRLF; BOM added by caller if desired). */
export function serializeTowerUnifiedCsv(
  levelOverrides: Record<string, number>,
  workshop: WorkshopPersistedV1,
): string {
  const lines: string[] = [TOWER_UNIFIED_CSV_MAGIC, HEADER]
  for (const k of sortLabKeys(Object.keys(levelOverrides))) {
    lines.push(`lab,${escapeCsvCell(k)},${levelOverrides[k] ?? 0}`)
  }
  for (const k of WS_FIELDS) {
    lines.push(`ws,${k},${serializeWsValue(workshop, k)}`)
  }
  return `${lines.join('\r\n')}\r\n`
}

function parseBoolCell(s: string): boolean | null {
  const t = s.trim().toLowerCase()
  if (t === 'true' || t === '1' || t === 'yes') return true
  if (t === 'false' || t === '0' || t === 'no' || t === '') return false
  return null
}

/**
 * Parse combined tower CSV. `none` if the file is not this format (e.g. legacy `key,level` only).
 */
export function parseTowerUnifiedCsv(text: string): ParseTowerUnifiedCsv {
  const content = text.replace(/^\uFEFF/, '')
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.replace(/\s+$/, ''))
    .filter((l) => l.length > 0)
  if (lines.length === 0) return { tag: 'none' }
  if (lines[0]!.trim() !== TOWER_UNIFIED_CSV_MAGIC) return { tag: 'none' }

  let start = 1
  if (lines.length >= 2) {
    const h = parseCsvLine(lines[1]!)
    const h0 = String(h[0] ?? '')
      .trim()
      .toLowerCase()
    const h1 = String(h[1] ?? '')
      .trim()
      .toLowerCase()
    const h2 = String(h[2] ?? '')
      .trim()
      .toLowerCase()
    if (h0 === 'type' && h1 === 'key' && h2 === 'value') start = 2
  }

  const overrides: Record<string, number> = {}
  const wsRaw: Record<string, unknown> = {}

  for (let i = start; i < lines.length; i += 1) {
    const r = parseCsvLine(lines[i]!)
    if (r.length < 3) return { tag: 'invalid' }
    const kind = String(r[0] ?? '')
      .trim()
      .toLowerCase()
    const key = String(r[1] ?? '').trim()
    const valCell = String(r[2] ?? '').trim()
    if (!kind || !key) return { tag: 'invalid' }

    if (kind === 'lab') {
      if (!LAB_KEY_RE.test(key)) return { tag: 'invalid' }
      const n = valCell === '' ? 0 : Number(valCell)
      if (!Number.isFinite(n)) return { tag: 'invalid' }
      overrides[key] = n
      continue
    }
    if (kind === 'ws') {
      const allowed = new Set<keyof WorkshopPersistedV1>(WS_FIELDS)
      if (!allowed.has(key as keyof WorkshopPersistedV1)) return { tag: 'invalid' }
      const wsKey = key as keyof WorkshopPersistedV1
      if (WS_BOOL_FIELDS.has(wsKey)) {
        const b = parseBoolCell(valCell)
        if (b === null) return { tag: 'invalid' }
        wsRaw[wsKey] = b
      } else if (wsKey === 'mainTab') {
        const t = valCell.toLowerCase()
        if (t !== 'upgrade' && t !== 'enhance' && t !== 'modules' && t !== 'cards') {
          return { tag: 'invalid' }
        }
        wsRaw[wsKey] = t
      } else if (wsKey === 'simAssistModuleSlot') {
        const t = valCell.toLowerCase()
        if (t !== 'cannon' && t !== 'armor' && t !== 'generator' && t !== 'core') {
          return { tag: 'invalid' }
        }
        wsRaw[wsKey] = t
      } else if (
        wsKey === 'simRelicsBonusFraction' ||
        wsKey === 'simBerserkerDamageTaken'
      ) {
        const n = valCell === '' ? 0 : Number(valCell)
        if (!Number.isFinite(n) || n < 0) return { tag: 'invalid' }
        wsRaw[wsKey] = n
      } else if (wsKey === 'category') {
        const t = valCell.toLowerCase()
        if (!['attack', 'defense', 'utility', 'ultimate'].includes(t)) return { tag: 'invalid' }
        wsRaw[wsKey] = t
      } else if (wsKey === 'multiplier') {
        const n = Number(valCell)
        if (![1, 5, 10, 100].includes(n)) return { tag: 'invalid' }
        wsRaw[wsKey] = n
      } else {
        const n = valCell === '' ? 0 : Number(valCell)
        if (!Number.isFinite(n) || !Number.isInteger(n)) return { tag: 'invalid' }
        wsRaw[wsKey] = n
      }
      continue
    }
    return { tag: 'invalid' }
  }

  const workshop = sanitizeWorkshopPersisted(wsRaw)
  return { tag: 'ok', overrides, workshop }
}
