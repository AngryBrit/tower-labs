/**
 * Workshop **Damage / Meter**: **200** levels, base **0%** (multiplier **0**), max **5.9%** (**0.059**).
 * Stat **0…70**: log-linear between published milestone **Value** rows; **71…200**: **+0.0002** per level
 * from the L=70 anchor (**0.033**).
 * **Cost**: milestone marginals from the wiki; log-linear between milestones (same pattern as Critical Factor).
 */

export const WORKSHOP_DAMAGE_PER_METER_MAX_LEVEL = 200 as const

/** Milestone levels for the curved part of the stat (wiki **Value**). */
const STAT_ANCHOR_LEVELS: readonly number[] = [1, 10, 20, 30, 40, 50, 60, 70]

/** Multiplier values at `STAT_ANCHOR_LEVELS` (wiki **Value** without the `x`). */
const STAT_ANCHOR_MULT: readonly number[] = [
  0.00079, 0.00742, 0.01376, 0.01913, 0.02365, 0.02741, 0.0305, 0.033,
]

const COST_ANCHOR_LEVELS: readonly number[] = [
  1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200,
]

/** Marginal **Cost** at each `COST_ANCHOR_LEVELS` row (exact wiki). */
const COST_ANCHOR_MARGINAL: readonly number[] = [
  50, 691, 2780, 6630, 12_460, 20_430, 31_590, 44_590, 63_150, 82_270, 104_250, 558_080, 3_390_000,
  27_320_000, 193_700_000, 1_360_000_000, 10_930_000_000, 75_200_000_000, 621_080_000_000,
  4_210_000_000_000, 28_360_000_000_000,
]

function logLerp(a: number, b: number, t: number): number {
  const u = Math.min(1, Math.max(0, t))
  if (a <= 0 || b <= 0) return a + u * (b - a)
  return Math.exp(Math.log(a) + u * (Math.log(b) - Math.log(a)))
}

function segmentIndexStat(level: number): number {
  if (level <= STAT_ANCHOR_LEVELS[0]) return 0
  let i = 0
  while (i < STAT_ANCHOR_LEVELS.length - 1 && STAT_ANCHOR_LEVELS[i + 1] < level) i += 1
  return i
}

function segmentIndexCost(level: number): number {
  if (level <= COST_ANCHOR_LEVELS[0]) return 0
  let i = 0
  while (i < COST_ANCHOR_LEVELS.length - 1 && COST_ANCHOR_LEVELS[i + 1] < level) i += 1
  return i
}

/** Damage/meter multiplier after `completedLevels` workshop purchases (0 … 200). */
export function workshopDamagePerMeterStatMultiplier(completedLevels: number): number {
  const L = Math.min(
    Math.max(0, completedLevels),
    WORKSHOP_DAMAGE_PER_METER_MAX_LEVEL,
  )
  if (L === 0) return 0
  if (L >= 70) {
    const v = 0.033 + (L - 70) * 0.0002
    return Math.round(v * 1_000_000) / 1_000_000
  }

  const i = segmentIndexStat(L)
  const L0 = STAT_ANCHOR_LEVELS[i]
  const L1 = STAT_ANCHOR_LEVELS[i + 1]
  const v0 = STAT_ANCHOR_MULT[i]
  const v1 = STAT_ANCHOR_MULT[i + 1]
  if (L1 <= L0) return v0
  if (L === L0) return v0
  if (L === L1) return v1
  const t = (L - L0) / (L1 - L0)
  return Math.round(logLerp(v0, v1, t) * 1_000_000) / 1_000_000
}

/** Wiki-style `x0.00079` … `x0.059` (lowercase **x**). */
export function workshopDamagePerMeterStatDisplay(completedLevels: number): string {
  const v = workshopDamagePerMeterStatMultiplier(completedLevels)
  if (v === 0) return 'x0'
  const s = v.toFixed(6).replace(/0+$/, '').replace(/\.$/, '')
  return `x${s}`
}

function marginalCoinsPurchaseEndingAt(targetLevel: number): number | undefined {
  if (targetLevel < 1 || targetLevel > WORKSHOP_DAMAGE_PER_METER_MAX_LEVEL) return undefined
  if (targetLevel === COST_ANCHOR_LEVELS[0]) return COST_ANCHOR_MARGINAL[0]

  const i = segmentIndexCost(targetLevel)
  const L0 = COST_ANCHOR_LEVELS[i]
  const L1 = COST_ANCHOR_LEVELS[i + 1]
  const v0 = COST_ANCHOR_MARGINAL[i]
  const v1 = COST_ANCHOR_MARGINAL[i + 1]
  if (targetLevel === L0) return v0
  if (targetLevel === L1) return v1
  if (L1 <= L0) return v0
  const t = (targetLevel - L0) / (L1 - L0)
  return logLerp(v0, v1, t)
}

/**
 * Coins for the next workshop damage/meter upgrade when `completedLevels` purchases are done.
 * `undefined` when maxed (200) or out of range.
 */
export function workshopDamagePerMeterNextMarginalCoins(
  completedLevels: number,
): number | undefined {
  if (completedLevels < 0 || completedLevels >= WORKSHOP_DAMAGE_PER_METER_MAX_LEVEL) return undefined
  return marginalCoinsPurchaseEndingAt(completedLevels + 1)
}
