/**
 * Workshop **ultimate weapon** upgrades (power stones, wiki Basic Upgrades tables).
 */

import {
  WORKSHOP_ULTIMATE_TRACKS,
  WORKSHOP_ULTIMATE_UPGRADE_ORDER,
  WORKSHOP_ULTIMATE_WEAPON_ORDER,
  WORKSHOP_ULTIMATE_WEAPON_STATS,
  type WorkshopUltimateUpgradeKey,
  type WorkshopUltimateWeaponId,
} from './workshopUltimateData'
import {
  workshopUltimateTrackClampLevel,
  workshopUltimateTrackMaxLevel,
  workshopUltimateTrackNextMarginalStones,
  workshopUltimateTrackStatDisplay,
  workshopUltimateTrackTotalStonesToMax,
} from './workshopUltimateTable'

export {
  WORKSHOP_ULTIMATE_TRACKS,
  WORKSHOP_ULTIMATE_UPGRADE_ORDER,
  WORKSHOP_ULTIMATE_WEAPON_ORDER,
  WORKSHOP_ULTIMATE_WEAPON_STATS,
  type WorkshopUltimateUpgradeKey,
  type WorkshopUltimateWeaponId,
}

export function workshopUltimateMaxLevel(key: WorkshopUltimateUpgradeKey): number {
  return workshopUltimateTrackMaxLevel(WORKSHOP_ULTIMATE_TRACKS[key])
}

export function workshopUltimateClampLevel(
  key: WorkshopUltimateUpgradeKey,
  level: number,
): number {
  return workshopUltimateTrackClampLevel(WORKSHOP_ULTIMATE_TRACKS[key], level)
}

export function workshopUltimateNextMarginalStones(
  key: WorkshopUltimateUpgradeKey,
  completedLevels: number,
): number | undefined {
  return workshopUltimateTrackNextMarginalStones(
    WORKSHOP_ULTIMATE_TRACKS[key],
    completedLevels,
  )
}

export function workshopUltimateStatDisplay(
  key: WorkshopUltimateUpgradeKey,
  completedLevels: number,
): string {
  return workshopUltimateTrackStatDisplay(WORKSHOP_ULTIMATE_TRACKS[key], completedLevels)
}

export function workshopUltimateTotalStonesToMaxFrom(
  key: WorkshopUltimateUpgradeKey,
  fromLevel: number,
): number {
  return workshopUltimateTrackTotalStonesToMax(
    WORKSHOP_ULTIMATE_TRACKS[key],
    fromLevel,
  )
}

export function workshopUltimateWeaponUpgradeKeys(
  weaponId: WorkshopUltimateWeaponId,
): readonly WorkshopUltimateUpgradeKey[] {
  return WORKSHOP_ULTIMATE_WEAPON_STATS[weaponId].map((s) => s.key)
}

export function workshopUltimateWeaponAllMaxed(
  levels: Record<WorkshopUltimateUpgradeKey, number>,
  weaponId: WorkshopUltimateWeaponId,
): boolean {
  return workshopUltimateWeaponUpgradeKeys(weaponId).every(
    (key) => levels[key] >= workshopUltimateMaxLevel(key),
  )
}

export type WorkshopUltimateActiveKey = `${WorkshopUltimateWeaponId}Active`

export const WORKSHOP_ULTIMATE_ACTIVE_ORDER = WORKSHOP_ULTIMATE_WEAPON_ORDER.map(
  (id) => `${id}Active` as WorkshopUltimateActiveKey,
)

export function workshopUltimateActiveKey(
  weaponId: WorkshopUltimateWeaponId,
): WorkshopUltimateActiveKey {
  return `${weaponId}Active`
}

/** Whether this ultimate weapon is toggled on for a run (defaults to inactive). */
export function workshopUltimateIsActive(
  ws: Partial<Record<WorkshopUltimateActiveKey, boolean>>,
  weaponId: WorkshopUltimateWeaponId,
): boolean {
  return ws[workshopUltimateActiveKey(weaponId)] === true
}
