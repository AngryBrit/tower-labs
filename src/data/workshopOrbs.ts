/**
 * Workshop **Orbs**: wiki **Level** 1…4 (**Value** = orb count, marginal **Cost** per row).
 * `completedLevels` = finished purchases (0…4). Next purchase cost is the wiki **Cost** for workshop level `completedLevels + 1`.
 */

export const WORKSHOP_ORBS_MAX_LEVEL = 4 as const

/** Marginal coin cost for purchase `k` → `k+1` completed levels (`k` = 0…3); wiki **Cost** at Level `k + 1`. */
const MARGINAL_COST_TO_NEXT_LEVEL: readonly number[] = [3_000, 20_000, 120_000, 350_000]

/** Extra orb count after `completedLevels` workshop purchases. */
export function workshopOrbsStatCount(completedLevels: number): number {
  const L = Math.min(Math.max(0, completedLevels), WORKSHOP_ORBS_MAX_LEVEL)
  return L
}

export function workshopOrbsStatDisplay(completedLevels: number): string {
  return String(workshopOrbsStatCount(completedLevels))
}

export function workshopOrbsNextMarginalCoins(completedLevels: number): number | undefined {
  if (completedLevels < 0 || completedLevels >= WORKSHOP_ORBS_MAX_LEVEL) return undefined
  return MARGINAL_COST_TO_NEXT_LEVEL[completedLevels]!
}
