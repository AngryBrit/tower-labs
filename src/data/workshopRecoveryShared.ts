/**
 * Shared wiki milestone **Cost** (marginal) ladder for **Recovery Amount** (max 300) and **Max Recovery** (max 500).
 */

export const WORKSHOP_RECOVERY_UNLOCK_COINS = 1_500_000 as const

const ANCHOR_LEVELS: readonly number[] = [
  1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230,
  240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450,
  460, 470, 480, 490, 500,
]

const ANCHOR_MARGINAL_COINS: readonly number[] = [
  1000, 20_900, 334_630, 1.66e6, 5.12e6, 12.18e6, 25.4e6, 46.05e6, 80.87e6, 127.2e6, 190.64e6, 296.78e6, 414.28e6,
  630.48e6, 837.31e6, 1.09e9, 1.62e9, 2.04e9, 3.07e9, 3.78e9, 4.6e9, 5.54e9, 6.61e9, 7.84e9, 9.22e9, 10.77e9, 12.51e9,
  14.45e9, 16.59e9, 18.97e9, 21.59e9, 24.46e9, 27.61e9, 31.05e9, 34.79e9, 38.85e9, 43.25e9, 48.01e9, 53.15e9, 58.68e9,
  64.62e9, 70.99e9, 77.82e9, 85.12e9, 92.9e9, 101.21e9, 110.04e9, 119.43e9, 129.4e9, 139.97e9, 151.17e9,
]

function logLerp(a: number, b: number, t: number): number {
  const u = Math.min(1, Math.max(0, t))
  if (a <= 0 || b <= 0) return a + u * (b - a)
  return Math.exp(Math.log(a) + u * (Math.log(b) - Math.log(a)))
}

function segmentIndex(level: number): number {
  if (level <= ANCHOR_LEVELS[0]!) return 0
  let i = 0
  while (i < ANCHOR_LEVELS.length - 1 && ANCHOR_LEVELS[i + 1]! < level) i += 1
  return i
}

/** Marginal coin cost for workshop level `targetLevel` (1…500) on the shared recovery ladder. */
export function workshopRecoverySharedMarginalCoins(targetLevel: number): number | undefined {
  if (targetLevel < 1 || targetLevel > 500) return undefined
  if (targetLevel === 1) return ANCHOR_MARGINAL_COINS[0]

  const i = segmentIndex(targetLevel)
  const L0 = ANCHOR_LEVELS[i]!
  const L1 = ANCHOR_LEVELS[i + 1]!
  const v0 = ANCHOR_MARGINAL_COINS[i]!
  const v1 = ANCHOR_MARGINAL_COINS[i + 1]!
  if (targetLevel === L0) return v0
  if (targetLevel === L1) return v1
  if (L1 <= L0) return v0
  const t = (targetLevel - L0) / (L1 - L0)
  return logLerp(v0, v1, t)
}
