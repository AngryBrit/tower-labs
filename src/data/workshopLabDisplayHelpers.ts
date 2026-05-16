import { formatCoinAbbrev } from '../labCosts'

/** Multiply workshop value by a Health-style lab; show `×m` when base is still 0. */
export function formatWithHealthStyleLabMultiplier(
  base: number,
  labMult: number,
  formatBase: (n: number) => string = formatCoinAbbrev,
): string {
  if (!Number.isFinite(labMult) || labMult <= 0) return formatBase(base)
  const rounded = Math.round(base * labMult)
  const main = formatBase(rounded)
  if (base === 0 && labMult > 1 + 1e-9) {
    return `${main} ×${labMult.toFixed(2)}`
  }
  return main
}

/** Multiply workshop multiplier stat by a Damage-style lab. */
export function formatWithDamageStyleLabMultiplier(
  base: number,
  labMult: number,
  formatBase: (n: number) => string,
): string {
  if (!Number.isFinite(labMult) || labMult <= 1 + 1e-9) return formatBase(base)
  return formatBase(base * labMult)
}

export function formatAdditivePercentPoints(workshopPct: number, labPct: number): string {
  return `+${(workshopPct + labPct).toFixed(2)}%`
}

export function formatAdditivePlusValue(
  workshop: number,
  labAdd: number,
  decimals = 2,
): string {
  const v = workshop + labAdd
  return `+${v.toFixed(decimals)}`
}

export function formatAdditiveNumeric(workshop: number, labAdd: number, decimals = 2): string {
  return (workshop + labAdd).toFixed(decimals)
}

export function formatAdditiveCount(workshop: number, labAdd: number): string {
  return String(workshop + labAdd)
}

export function formatSecondsAfterLabReduction(
  workshopSeconds: number,
  labReductionSeconds: number,
): string {
  const sec = Math.max(0, workshopSeconds - labReductionSeconds)
  return `${sec}s`
}
