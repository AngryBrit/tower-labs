/**
 * Wiki **Basic Upgrades** milestone tables for Ultimate Weapon workshop rows.
 * Each milestone is the stat **after** `level` purchases (level 0 = first row).
 */

export type WorkshopUltimateMilestone = {
  readonly value: number
  /** Power stones to purchase this level (0 for level 0). */
  readonly marginalStones: number
}

export type WorkshopUltimateValueKind =
  | 'mult'
  | 'percent'
  | 'seconds'
  | 'meters'
  | 'count'
  | 'angle'

function logLerp(a: number, b: number, t: number): number {
  const u = Math.min(1, Math.max(0, t))
  if (a <= 0 || b <= 0) return a + u * (b - a)
  return Math.exp(Math.log(a) + u * (Math.log(b) - Math.log(a)))
}

/** Duration/cooldown always as seconds (e.g. `75s`, `20.5s`, `200s`). */
export function formatWorkshopUltimateCooldown(seconds: number): string {
  const rounded = Math.round(seconds * 10) / 10
  if (Number.isInteger(rounded)) return `${rounded}s`
  return `${rounded.toFixed(1)}s`
}

export function formatWorkshopUltimateValue(
  kind: WorkshopUltimateValueKind,
  value: number,
): string {
  switch (kind) {
    case 'mult':
      return `x${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}`
    case 'percent':
      return `${value.toFixed(2)}%`
    case 'seconds':
      return formatWorkshopUltimateCooldown(value)
    case 'meters':
      return `${value.toFixed(2)}m`
    case 'count':
      return String(Math.round(value))
    case 'angle':
      return `${Math.round(value)}°`
    default:
      return String(value)
  }
}

export type WorkshopUltimateTrack = {
  readonly milestones: readonly WorkshopUltimateMilestone[]
  readonly valueKind: WorkshopUltimateValueKind
}

export function workshopUltimateTrackMaxLevel(track: WorkshopUltimateTrack): number {
  return Math.max(0, track.milestones.length - 1)
}

export function workshopUltimateTrackClampLevel(
  track: WorkshopUltimateTrack,
  level: number,
): number {
  if (!Number.isFinite(level)) return 0
  return Math.max(0, Math.min(workshopUltimateTrackMaxLevel(track), Math.trunc(level)))
}

export function workshopUltimateTrackStatValue(
  track: WorkshopUltimateTrack,
  completedLevels: number,
): number {
  const L = workshopUltimateTrackClampLevel(track, completedLevels)
  return track.milestones[L]!.value
}

export function workshopUltimateTrackStatDisplay(
  track: WorkshopUltimateTrack,
  completedLevels: number,
): string {
  return formatWorkshopUltimateValue(
    track.valueKind,
    workshopUltimateTrackStatValue(track, completedLevels),
  )
}

/** Stones for the purchase that ends at `targetLevel` (1 … max). */
function marginalStonesPurchaseEndingAt(
  track: WorkshopUltimateTrack,
  targetLevel: number,
): number | undefined {
  if (targetLevel < 1 || targetLevel > workshopUltimateTrackMaxLevel(track)) return undefined
  const m = track.milestones[targetLevel]!
  if (m.marginalStones > 0) return m.marginalStones

  const maxL = workshopUltimateTrackMaxLevel(track)
  let prev = targetLevel - 1
  while (prev >= 0 && track.milestones[prev]!.marginalStones <= 0) prev -= 1
  let next = targetLevel + 1
  while (next <= maxL && track.milestones[next]!.marginalStones <= 0) next += 1
  if (prev < 0 || next > maxL) return undefined
  const L0 = prev
  const L1 = next
  const v0 = track.milestones[L0]!.marginalStones
  const v1 = track.milestones[L1]!.marginalStones
  if (L1 <= L0) return v0
  const t = (targetLevel - L0) / (L1 - L0)
  return Math.round(logLerp(v0, v1, t))
}

export function workshopUltimateTrackNextMarginalStones(
  track: WorkshopUltimateTrack,
  completedLevels: number,
): number | undefined {
  const L = workshopUltimateTrackClampLevel(track, completedLevels)
  if (L >= workshopUltimateTrackMaxLevel(track)) return undefined
  return marginalStonesPurchaseEndingAt(track, L + 1)
}

export function workshopUltimateTrackTotalStonesToMax(
  track: WorkshopUltimateTrack,
  fromLevel: number,
): number {
  const start = workshopUltimateTrackClampLevel(track, fromLevel)
  const max = workshopUltimateTrackMaxLevel(track)
  let sum = 0
  for (let L = start + 1; L <= max; L++) {
    sum += marginalStonesPurchaseEndingAt(track, L) ?? 0
  }
  return sum
}
