import {
  formatCoinAbbrev,
  parseAbbreviatedCoinsToNumber,
  toolkitMarginalCoinCost,
  toolkitUpgradeDurationSeconds,
} from '../labCosts'

export type ResearchState = 'default' | 'max' | 'researching'

export interface ResearchItem {
  name: string
  level: string
  benefit: string
  time: string
  cost: string
  state: ResearchState
  /** From Lab Calculator CSV; optional on legacy JSON */
  currentLevel?: number
  maxLevel?: number
  /** Raw total coins to max from export (Lab Calculator “Max Level → Coins”); optional metadata. */
  coinsToMaxRaw?: number
  /** Lab Calculator “Next level +1” abbreviated coins (CSV col 14); optional */
  costPlusOne?: string
}

function applyLabsCoinDiscountToCoins(
  rawCoins: number,
  labsCoinDiscountPercent: number,
): number {
  if (!Number.isFinite(rawCoins) || rawCoins < 0) return rawCoins
  const mult = 1 - labsCoinDiscountPercent / 100
  if (!Number.isFinite(mult)) return rawCoins
  return Math.max(0, rawCoins * mult)
}

function applyLabsCoinDiscountToCoinLabel(
  label: string,
  labsCoinDiscountPercent: number,
): string {
  if (labsCoinDiscountPercent <= 0) return label
  const parsed = parseAbbreviatedCoinsToNumber(label)
  if (parsed == null) return label
  return formatCoinAbbrev(
    applyLabsCoinDiscountToCoins(parsed, labsCoinDiscountPercent),
  )
}

/**
 * Marginal coin cost for the **next** upgrade at the simulated `effectiveLevel`.
 * Primary source: bundled `tower-labs.json` (per-lab per-level `COST`).
 * Fallback when the lab is not in that table: CSV snapshot `cost` / `costPlusOne` from import.
 *
 * `labsCoinDiscountPercent` is total Labs Coin Discount % from the simulated Labs Coin Discount lab level (list price × (1 − pct/100)).
 */
export function marginalCostForNextUpgrade(
  item: ResearchItem,
  effectiveLevel: number,
  maxLevelCap: number,
  labsCoinDiscountPercent = 0,
): string {
  if (maxLevelCap > 0 && effectiveLevel >= maxLevelCap) return 'Max'

  const fromToolkit = toolkitMarginalCoinCost(item.name, effectiveLevel)
  if (fromToolkit != null) {
    const discounted = applyLabsCoinDiscountToCoins(
      fromToolkit,
      labsCoinDiscountPercent,
    )
    return formatCoinAbbrev(discounted)
  }

  const baseLevel = item.currentLevel ?? 0
  const delta = effectiveLevel - baseLevel

  if (delta <= 0 || item.cost === 'Max') {
    if (item.cost === 'Max') return 'Max'
    return applyLabsCoinDiscountToCoinLabel(item.cost, labsCoinDiscountPercent)
  }

  if (delta === 1 && item.costPlusOne && item.costPlusOne !== '—') {
    return applyLabsCoinDiscountToCoinLabel(
      item.costPlusOne,
      labsCoinDiscountPercent,
    )
  }

  return '—'
}

/** Numeric bounds for +/- controls (falls back when optional fields missing). */
export function getLevelBounds(item: ResearchItem): {
  current: number
  max: number
} {
  if (
    typeof item.currentLevel === 'number' &&
    typeof item.maxLevel === 'number' &&
    item.maxLevel >= 0
  ) {
    const max = item.maxLevel
    const current = Math.min(Math.max(0, item.currentLevel), max)
    return { current, max }
  }

  const numeric = /^Lv\.(\d+)$/.exec(item.level.trim())
  if (numeric) {
    const c = parseInt(numeric[1], 10)
    const max =
      typeof item.maxLevel === 'number' ? item.maxLevel : Math.max(c, 0)
    return { current: Math.min(c, max), max }
  }

  if (/Max/i.test(item.level)) {
    const mx = typeof item.maxLevel === 'number' ? item.maxLevel : 1
    return { current: mx, max: mx }
  }

  return {
    current: 0,
    max: typeof item.maxLevel === 'number' ? item.maxLevel : 0,
  }
}

export function formatLevelLabel(level: number, max: number): string {
  if (max > 0 && level >= max) return 'Lv. Max'
  return `Lv.${level}`
}

/**
 * Game Speed multiplier shown on the card — aligns with Tower Lab Calculator rows:
 * Lv.0 → x1.0, then Lv.1→2.0 … Lv.7→5.0 in steps of 0.5 (same “Value” column as the sheet).
 */
export function gameSpeedMultiplierLabel(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  if (maxLevelCap <= 0) return '—'
  const clamped = Math.min(Math.max(0, effectiveLevel), maxLevelCap)
  if (clamped === 0) return 'x1.0'
  const mult = 2 + (clamped - 1) * 0.5
  return `x${mult.toFixed(1)}`
}

/**
 * Labs Speed — **Value** column formula: **0.6 + floor((L − 28) / 5) × 0.1** at lab level `L`, shown with **`x`**
 * like Game Speed (e.g. L1→`x0.0`, L28→`x0.6`, L99→`x2.0`).
 */
export function labsSpeedValueDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const raw = 0.6 + Math.floor((capped - 28) / 5) * 0.1
  const v = Math.round(raw * 10) / 10
  return `x${v.toFixed(1)}`
}

/** Single-level unlock labs: Lv.0 shows prompt; purchased → **Unlocked**. */
export const UNLOCK_LAB_LV0_LABELS: Record<string, string> = {
  'More Round Stats': 'Unlock Round Stats',
  'Card Presets': 'Unlock Card Presets',
  'Package After Boss': 'Unlock Package After Boss',
  'Workshop Respec': 'Unlock Workshop Respec',
  'Reroll Daily Mission': 'Unlock Reroll Daily Mission',
  'Workshop Enhancements': 'Unlock Workshop Enhancements',
  'Light Speed Shots': 'Unlock Light Speed Shots',
}

function isUnlockLabItem(name: string): boolean {
  return Object.prototype.hasOwnProperty.call(UNLOCK_LAB_LV0_LABELS, name)
}

function benefitLineShowsCurrentBenefitOnly(itemName: string): boolean {
  return isUnlockLabItem(itemName) || itemName === 'Target Priority'
}

/** Lv.0 → mapped prompt; Lv.≥1 → `Unlocked`; unknown lab → `null`. */
export function unlockLabBenefitDisplay(
  itemName: string,
  effectiveLevel: number,
  maxLevelCap: number,
): string | null {
  const lv0 = UNLOCK_LAB_LV0_LABELS[itemName]
  if (lv0 === undefined) return null
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  if (capped <= 0) return lv0
  return 'Unlocked'
}

/**
 * Target Priority — three-stage lab (max **2**): **Unlock** → **Better** → **Unlocked**.
 */
export function targetPriorityBenefitDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  if (capped <= 0) return 'Unlock Target Priority'
  if (capped === 1) return 'Better Target Priority'
  return 'Unlocked'
}

/** Calculator Value = tier **1…max**; Lv.0 → **x1**. Used by Buy Multiplier only here. */
export function buyMultiplierValueDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const v = capped <= 0 ? 1 : capped
  return `x${v}`
}

/** Battle Condition Reduction Value column: 1.00 ... 10.00 by level (Lv.0 => x0.00). */
export function battleConditionReductionValueDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  return `x${capped.toFixed(2)}`
}

/**
 * Damage-style labs (+0.02/level multiplier): Damage, Attack Speed, Range, Damage / Meter,
 * **Super Crit Multi**, **Cash Bonus**, **Cash / Wave**, **Coins / Kill Bonus**, **Coins / Wave**,
 * **Interest** (Lv.1→x1.02 … Lv.99→x2.98; Damage Lv.100→x3.00; Super Crit Multi max 40→x1.80).
 */
export function damageValueDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const mult = 1 + 0.02 * capped
  return `x${mult.toFixed(2)}`
}

/**
 * Critical Factor / **Health-style** labs — Tower Lab Calculator **Value**: **x1.00** at Lv.0,
 * **+0.03** per level (Lv.1→x1.03 … Lv.100→x4.00).
 */
export function criticalFactorValueDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const mult = 1 + 0.03 * capped
  return `x${mult.toFixed(2)}`
}

/**
 * Super Crit Chance — **+0.10% × lab level** with Include **%**.
 */
export function superCritChancePercentDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const pct = 0.1 * capped
  return `+${pct.toFixed(2)}%`
}

/**
 * Orbs Speed — same **0.10 × lab level** stepping as the calculator **Value** column; display **`+`** only (no **`%`**).
 */
export function orbsSpeedPlusValueDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const v = 0.1 * capped
  return `+${v.toFixed(2)}`
}

/**
 * Shockwave Size — calculator **Value**: **+0.05 × lab level**; **`+`** only (no **`%`**).
 * Lv.0→**+0.00**; higher levels trim redundant **`.0`** (e.g. **+0.1**, **+1**).
 */
export function shockwaveSizePlusDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  if (capped <= 0) return '+0.00'
  const hundredths = Math.round(capped * 5)
  const v = hundredths / 100
  const s = parseFloat(v.toFixed(2)).toString()
  return `+${s}`
}

/**
 * Defense % / **Orb Boss Hit** — Tower Lab Calculator **Value** with Include **%**: **+0.20% × lab level**.
 */
export function defensePercentValueDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const pct = 0.2 * capped
  return `+${pct.toFixed(2)}%`
}

/**
 * Recovery Package Amount / **Max** / **Chance** — Tower Lab Calculator **Value** with Include **%**:
 * **+0.40% × lab level** (Lv.1→+0.40% … Lv.20→+8.00%).
 */
export function recoveryPackagePercentValueDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const pct = 0.4 * capped
  return `+${pct.toFixed(2)}%`
}

/**
 * Wall Health — Tower Lab Calculator **Value** with Include **%**: **+2.00% × lab level**
 * (Lv.1→+2.00% … Lv.50→+100.00%).
 */
export function wallHealthPercentValueDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const pct = 2 * capped
  return `+${pct.toFixed(2)}%`
}

/**
 * Wall Regen — Tower Lab Calculator **Value** with Include **%**: **+10.00% × lab level**
 * (Lv.1→+10.00% … Lv.30→+300.00%).
 */
export function wallRegenPercentValueDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const pct = 10 * capped
  return `+${pct.toFixed(2)}%`
}

/**
 * Wall Thorns — Tower Lab Calculator **Value** with Include **%**: **+1.00% × lab level**
 * (Lv.1→+1.00% … Lv.20→+20.00%).
 */
export function wallThornsPercentValueDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const pct = capped
  return `+${pct.toFixed(2)}%`
}

/**
 * Wall Fortification — Tower Lab Calculator **Value** with Include **%**: **+20.00% × lab level**
 * (Lv.1→+20.00% … Lv.60→+1200.00%).
 */
export function wallFortificationPercentValueDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const pct = 20 * capped
  return `+${pct.toFixed(2)}%`
}

/**
 * Garlic Thorns — calculator **Value** with Include **%**: **+0.5% × lab level**, **one** decimal (Lv.1→+0.5% … Lv.10→+5.0%).
 */
export function garlicThornsPercentValueDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const pct = 0.5 * capped
  return `+${pct.toFixed(1)}%`
}

/**
 * Land Mine Damage — Tower Lab Calculator **Value** with Include **%**: **+10% × lab level**
 * (whole-number display: **+0%** … **+200%**).
 */
export function landMineDamagePercentDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const pct = 10 * capped
  return `+${Math.round(pct)}%`
}

/**
 * Land Mine Decay — Tower Lab Calculator **Value**: **+0.50s × lab level** (seconds), shown as **`+`…`s`**.
 * (Lv.1→+0.50s … Lv.35→+17.50s).
 */
export function landMineDecaySecondsDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const sec = 0.5 * capped
  return `+${sec.toFixed(2)}s`
}

/**
 * Wall Invincibility — Tower Lab Calculator **Value**: **+1.0s × lab level** (one decimal; Lv.1→+1.0s … Lv.10→+10.0s).
 */
export function wallInvincibilitySecondsDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  return `+${capped.toFixed(1)}s`
}

/**
 * Wall Rebuild — Tower Lab Calculator **Value** (seconds): **−10s × lab level**, shown with **one** decimal (e.g. **−50.0s**).
 */
export function wallRebuildSecondsDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const mag = (10 * capped).toFixed(1)
  return `-${mag}s`
}

/**
 * Max Rend Armor Multiplier — raw calculator **Value** is **800 + 25 × lab level**; display as
 * **`x` + (that ÷ 100)** with **three decimals** (Lv.0→**x8.000** … Lv.30→**x15.500**).
 */
export function maxRendArmorMultiplierValueDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const raw = 800 + 25 * capped
  const mult = raw / 100
  return `x${mult.toFixed(3)}`
}

/**
 * Total Labs Coin Discount % at the given lab level (1.20% at L4 → 0.30%/level).
 * Tower Data does not ship per-level benefit text.
 */
const LAB_COIN_DISCOUNT_PCT_PER_LEVEL = 0.3

/** Total Labs Coin Discount % at a given lab level (same formula as the benefit line). */
export function labsCoinDiscountTotalPercent(
  effectiveLevel: number,
  maxLevelCap: number,
): number {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  return capped * LAB_COIN_DISCOUNT_PCT_PER_LEVEL
}

function formatResearchDurationSeconds(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '—'
  const totalMin = Math.floor(seconds / 60)
  const d = Math.floor(totalMin / (60 * 24))
  const h = Math.floor((totalMin % (60 * 24)) / 60)
  const m = totalMin % 60
  return `${d}d ${h}h ${m}m`
}

/**
 * Starting Cash — Tower Lab Calculator “Value” column: **5 × lab level** (Lv.1→5 … Lv.99→495).
 */
export function startingCashValueDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  return `+$${5 * capped}`
}

/** Tower Lab calculator **Value** (Include %): **$** amounts per level (Lv.0→$50 … Lv.15→$15000). */
const MAX_INTEREST_VALUE_USD_BY_LEVEL = [
  50, 100, 200, 300, 500, 700, 1000, 1500, 2000, 2500, 3500, 5000, 7500, 10000,
  12500, 15000,
] as const

export function maxInterestDollarValueDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const idx = Math.min(
    capped,
    MAX_INTEREST_VALUE_USD_BY_LEVEL.length - 1,
  )
  const v = MAX_INTEREST_VALUE_USD_BY_LEVEL[idx]
  return `$${v}`
}

/** Labs whose calculator “Value” column is **0.50 × lab level** (with Include %). */
const WORKSHOP_DISCOUNT_VALUE_LABS = new Set([
  'Workshop Attack Discount',
  'Workshop Defense Discount',
  'Workshop Utility Discount',
])

/**
 * Workshop Attack/Defense/Utility discount — Tower Lab Calculator **Value** column (e.g. Lv.1→0.50%, +0.50% per level).
 */
export function workshopDiscountValuePercentDisplay(
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const v = 0.5 * capped
  return `${v.toFixed(2)}%`
}

const TIER_BENEFIT_RE = /^T(\d+)\s+(\d+)$/

/** Parsed `T{n} {m}` from the CSV snapshot benefit string (value at `item.currentLevel`). */
export function parseTierBenefitSnapshot(benefitStr: string): {
  tier: number
  value: number
} | null {
  const m = TIER_BENEFIT_RE.exec(benefitStr.trim())
  if (!m) return null
  const tier = parseInt(m[1], 10)
  const value = parseInt(m[2], 10)
  if (!Number.isFinite(tier) || !Number.isFinite(value)) return null
  return { tier, value }
}

function tierStyleBenefitDisplay(
  item: ResearchItem,
  effectiveLevel: number,
  maxLevelCap: number,
): string | null {
  const parsed = parseTierBenefitSnapshot(item.benefit)
  if (!parsed) return null
  const baseLv = item.currentLevel ?? 0
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const n = parsed.value + (capped - baseLv)
  return `T${parsed.tier} ${n}`
}

const KMH_BENEFIT_RE = /^([\d.]+)\s*K\/h$/i

/** “Cph” style `12.34 K/h` — approximate next tiers by moving **1%/level** of the snapshot rate per simulated level step from the import row. */
function kmhStyleBenefitDisplay(
  item: ResearchItem,
  effectiveLevel: number,
  maxLevelCap: number,
): string | null {
  const m = KMH_BENEFIT_RE.exec(item.benefit.trim())
  if (!m) return null
  const v0 = parseFloat(m[1])
  if (!Number.isFinite(v0)) return null
  const baseLv = item.currentLevel ?? 0
  const capped =
    maxLevelCap > 0
      ? Math.min(Math.max(0, effectiveLevel), maxLevelCap)
      : Math.max(0, effectiveLevel)
  const steps = capped - baseLv
  const perLevel = v0 * 0.01
  const v = v0 + perLevel * steps
  return `${v.toFixed(2)} K/h`
}

/** Benefit line on the card: dynamic where we can derive it; otherwise CSV snapshot `item.benefit`. */
export function benefitDisplayForCard(
  item: ResearchItem,
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  if (item.name === 'Game Speed') {
    return gameSpeedMultiplierLabel(effectiveLevel, maxLevelCap)
  }
  if (item.name === 'Labs Speed') {
    return labsSpeedValueDisplay(effectiveLevel, maxLevelCap)
  }
  const unlock = unlockLabBenefitDisplay(
    item.name,
    effectiveLevel,
    maxLevelCap,
  )
  if (unlock !== null) return unlock
  if (item.name === 'Target Priority') {
    return targetPriorityBenefitDisplay(effectiveLevel, maxLevelCap)
  }
  if (item.name === 'Buy Multiplier') {
    return buyMultiplierValueDisplay(effectiveLevel, maxLevelCap)
  }
  if (item.name === 'Battle Condition Reduction') {
    return battleConditionReductionValueDisplay(effectiveLevel, maxLevelCap)
  }
  if (
    item.name === 'Damage' ||
    item.name === 'Attack Speed' ||
    item.name === 'Range' ||
    item.name === 'Damage / Meter' ||
    item.name === 'Super Crit Multi' ||
    item.name === 'Cash Bonus' ||
    item.name === 'Cash / Wave' ||
    item.name === 'Coins / Kill Bonus' ||
    item.name === 'Coins / Wave' ||
    item.name === 'Interest'
  ) {
    return damageValueDisplay(effectiveLevel, maxLevelCap)
  }
  if (
    item.name === 'Critical Factor' ||
    item.name === 'Health' ||
    item.name === 'Health Regen' ||
    item.name === 'Defense Absolute'
  ) {
    return criticalFactorValueDisplay(effectiveLevel, maxLevelCap)
  }
  if (item.name === 'Super Crit Chance') {
    return superCritChancePercentDisplay(effectiveLevel, maxLevelCap)
  }
  if (item.name === 'Orbs Speed') {
    return orbsSpeedPlusValueDisplay(effectiveLevel, maxLevelCap)
  }
  if (item.name === 'Shockwave Size') {
    return shockwaveSizePlusDisplay(effectiveLevel, maxLevelCap)
  }
  if (item.name === 'Defense %' || item.name === 'Orb Boss Hit') {
    return defensePercentValueDisplay(effectiveLevel, maxLevelCap)
  }
  if (item.name === 'Wall Health') {
    return wallHealthPercentValueDisplay(effectiveLevel, maxLevelCap)
  }
  if (item.name === 'Wall Regen') {
    return wallRegenPercentValueDisplay(effectiveLevel, maxLevelCap)
  }
  if (item.name === 'Wall Thorns') {
    return wallThornsPercentValueDisplay(effectiveLevel, maxLevelCap)
  }
  if (item.name === 'Wall Fortification') {
    return wallFortificationPercentValueDisplay(effectiveLevel, maxLevelCap)
  }
  if (item.name === 'Garlic Thorns') {
    return garlicThornsPercentValueDisplay(effectiveLevel, maxLevelCap)
  }
  if (item.name === 'Wall Invincibility') {
    return wallInvincibilitySecondsDisplay(effectiveLevel, maxLevelCap)
  }
  if (item.name === 'Wall Rebuild') {
    return wallRebuildSecondsDisplay(effectiveLevel, maxLevelCap)
  }
  if (item.name === 'Land Mine Damage') {
    return landMineDamagePercentDisplay(effectiveLevel, maxLevelCap)
  }
  if (item.name === 'Land Mine Decay') {
    return landMineDecaySecondsDisplay(effectiveLevel, maxLevelCap)
  }
  if (item.name === 'Max Rend Armor Multiplier') {
    return maxRendArmorMultiplierValueDisplay(effectiveLevel, maxLevelCap)
  }
  if (item.name === 'Labs Coin Discount') {
    return `${labsCoinDiscountTotalPercent(effectiveLevel, maxLevelCap).toFixed(2)}%`
  }
  if (item.name === 'Starting Cash') {
    return startingCashValueDisplay(effectiveLevel, maxLevelCap)
  }
  if (item.name === 'Max Interest') {
    return maxInterestDollarValueDisplay(effectiveLevel, maxLevelCap)
  }
  if (WORKSHOP_DISCOUNT_VALUE_LABS.has(item.name)) {
    return workshopDiscountValuePercentDisplay(effectiveLevel, maxLevelCap)
  }
  if (
    item.name === 'Recovery Package Amount' ||
    item.name === 'Recovery Package Max' ||
    item.name === 'Recovery Package Chance'
  ) {
    return recoveryPackagePercentValueDisplay(effectiveLevel, maxLevelCap)
  }

  const tier = tierStyleBenefitDisplay(item, effectiveLevel, maxLevelCap)
  if (tier != null) return tier

  const kmh = kmhStyleBenefitDisplay(item, effectiveLevel, maxLevelCap)
  if (kmh != null) return kmh

  return item.benefit
}

const LABS_SCAN_NEXT_DISTINCT_BENEFIT = new Set([
  'Labs Speed',
  'Buy Multiplier',
])

/** Next benefit after `»` — listed labs scan until Value changes on plateaus. */
function nextBenefitDisplayForUpgradeLine(
  item: ResearchItem,
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  const current = benefitDisplayForCard(item, effectiveLevel, maxLevelCap)

  if (LABS_SCAN_NEXT_DISTINCT_BENEFIT.has(item.name)) {
    for (let L = effectiveLevel + 1; L <= maxLevelCap; L++) {
      const cand = benefitDisplayForCard(item, L, maxLevelCap)
      if (cand !== current) return cand
    }
    return current
  }

  return benefitDisplayForCard(item, effectiveLevel + 1, maxLevelCap)
}

/**
 * **current » simulated benefit at level + 1** (same rules as the left side).
 * Unknown / unchanged tail → `» —`; **maxed lab → current value only** (no `» Max`).
 * **Unlock labs** and **Target Priority** omit `»` (current phrase only).
 */
export function benefitLineWithNextUpgrade(
  item: ResearchItem,
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  if (benefitLineShowsCurrentBenefitOnly(item.name)) {
    return benefitDisplayForCard(item, effectiveLevel, maxLevelCap)
  }

  const current = benefitDisplayForCard(item, effectiveLevel, maxLevelCap)

  if (maxLevelCap <= 0) {
    return `${current} » —`
  }

  if (effectiveLevel >= maxLevelCap) {
    return current
  }

  const nextStr = nextBenefitDisplayForUpgradeLine(
    item,
    effectiveLevel,
    maxLevelCap,
  )

  if (nextStr === current) {
    return `${current} » —`
  }

  return `${current} » ${nextStr}`
}

/** Time for the next upgrade at `effectiveLevel`; uses Tower Data duration when the lab is in `tower-labs.json`. */
export function researchTimeForNextUpgrade(
  item: ResearchItem,
  effectiveLevel: number,
  maxLevelCap: number,
): string {
  if (maxLevelCap > 0 && effectiveLevel >= maxLevelCap) return 'Max'

  const sec = toolkitUpgradeDurationSeconds(item.name, effectiveLevel)
  if (sec != null) {
    return formatResearchDurationSeconds(sec)
  }

  return item.time
}

export function levelOverrideKey(sectionIndex: number, itemIndex: number): string {
  return `${sectionIndex}-${itemIndex}`
}

export function getEffectiveLevel(
  sectionIndex: number,
  itemIndex: number,
  item: ResearchItem,
  overrides: Record<string, number>,
): number {
  const key = levelOverrideKey(sectionIndex, itemIndex)
  if (Object.prototype.hasOwnProperty.call(overrides, key)) {
    return overrides[key]!
  }
  return getLevelBounds(item).current
}

/** Labs Coin Discount % implied by the simulated level of that lab (0 if missing). */
export function resolveLabsCoinDiscountPercent(
  data: ResearchData,
  overrides: Record<string, number>,
): number {
  for (let si = 0; si < data.sections.length; si++) {
    const items = data.sections[si].items
    for (let ii = 0; ii < items.length; ii++) {
      const item = items[ii]
      if (item.name !== 'Labs Coin Discount') continue
      const bounds = getLevelBounds(item)
      const eff = getEffectiveLevel(si, ii, item, overrides)
      return labsCoinDiscountTotalPercent(eff, bounds.max)
    }
  }
  return 0
}

export interface ResearchSection {
  title: string
  items: ResearchItem[]
}

export interface ResearchData {
  sections: ResearchSection[]
}

export interface ResearchManifest {
  sectionFiles: string[]
}

function isResearchState(v: unknown): v is ResearchState {
  return v === 'default' || v === 'max' || v === 'researching'
}

function isResearchItem(v: unknown): v is ResearchItem {
  if (!v || typeof v !== 'object') return false
  const o = v as Record<string, unknown>
  if (
    typeof o.name !== 'string' ||
    typeof o.level !== 'string' ||
    typeof o.benefit !== 'string' ||
    typeof o.time !== 'string' ||
    typeof o.cost !== 'string' ||
    !isResearchState(o.state)
  ) {
    return false
  }
  if (o.currentLevel !== undefined && typeof o.currentLevel !== 'number') {
    return false
  }
  if (o.maxLevel !== undefined && typeof o.maxLevel !== 'number') {
    return false
  }
  if (o.coinsToMaxRaw !== undefined && typeof o.coinsToMaxRaw !== 'number') {
    return false
  }
  if (o.costPlusOne !== undefined && typeof o.costPlusOne !== 'string') {
    return false
  }
  return true
}

function isResearchSection(v: unknown): v is ResearchSection {
  if (!v || typeof v !== 'object') return false
  const o = v as Record<string, unknown>
  if (typeof o.title !== 'string' || !Array.isArray(o.items)) return false
  return o.items.every(isResearchItem)
}

export function parseResearchData(raw: unknown): ResearchData {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Research data must be a JSON object')
  }
  const o = raw as Record<string, unknown>
  if (!Array.isArray(o.sections)) {
    throw new Error('Missing "sections" array')
  }
  if (!o.sections.every(isResearchSection)) {
    throw new Error(
      'Invalid section or item shape (see public/research/sections/*.json)',
    )
  }
  return { sections: o.sections }
}

export function parseResearchManifest(raw: unknown): ResearchManifest {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Research manifest must be a JSON object')
  }
  const o = raw as Record<string, unknown>
  if (!Array.isArray(o.sectionFiles)) {
    throw new Error('Manifest missing "sectionFiles" array')
  }
  if (!o.sectionFiles.every((x) => typeof x === 'string')) {
    throw new Error('Manifest "sectionFiles" must be strings')
  }
  return { sectionFiles: o.sectionFiles as string[] }
}

export function parseResearchSection(raw: unknown): ResearchSection {
  if (!isResearchSection(raw)) {
    throw new Error('Invalid section file (need title + items[])')
  }
  return raw
}
