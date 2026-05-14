import { WORKSHOP_ATTACK_RANGE_MAX_LEVEL } from './data/workshopAttackRange'
import { WORKSHOP_ATTACK_SPEED_MAX_LEVEL } from './data/workshopAttackSpeed'
import { WORKSHOP_CRITICAL_CHANCE_MAX_LEVEL } from './data/workshopCriticalChance'
import { WORKSHOP_CRITICAL_FACTOR_MAX_LEVEL } from './data/workshopCriticalFactor'
import { WORKSHOP_DAMAGE_PER_METER_MAX_LEVEL } from './data/workshopDamagePerMeter'
import { WORKSHOP_DAMAGE_MAX_LEVEL } from './data/workshopDamage'
import { WORKSHOP_MULTISHOT_CHANCE_MAX_LEVEL } from './data/workshopMultishotChance'
import { WORKSHOP_MULTISHOT_TARGETS_MAX_LEVEL } from './data/workshopMultishotTargets'
import {
  WORKSHOP_RAPID_FIRE_CHANCE_MAX_LEVEL,
  WORKSHOP_RAPID_FIRE_DURATION_MAX_LEVEL,
} from './data/workshopRapidFire'
import { WORKSHOP_BOUNCE_SHOT_CHANCE_MAX_LEVEL } from './data/workshopBounceShotChance'
import { WORKSHOP_BOUNCE_SHOT_RANGE_MAX_LEVEL } from './data/workshopBounceShotRange'
import { WORKSHOP_BOUNCE_SHOT_TARGETS_MAX_LEVEL } from './data/workshopBounceShotTargets'
import { WORKSHOP_SUPER_CRIT_CHANCE_MAX_LEVEL } from './data/workshopSuperCritChance'
import { WORKSHOP_SUPER_CRIT_MULT_MAX_LEVEL } from './data/workshopSuperCritMult'
import {
  WORKSHOP_REND_ARMOR_CHANCE_MAX_LEVEL,
  WORKSHOP_REND_ARMOR_MULT_MAX_LEVEL,
} from './data/workshopRendArmor'
import { workshopDefenseClampLevel } from './data/workshopDefense'
import { workshopUtilityClampLevel } from './data/workshopUtility'

export type WorkshopCategoryPersisted = 'attack' | 'defense' | 'utility' | 'ultimate'

export type WorkshopPersistedV1 = {
  hideMaxed: boolean
  mainTab: 'upgrade' | 'enhance'
  category: WorkshopCategoryPersisted
  multiplier: 1 | 5 | 10 | 100
  damageLevel: number
  attackSpeedLevel: number
  critChanceLevel: number
  critFactorLevel: number
  attackRangeLevel: number
  damagePerMeterLevel: number
  multishotChanceLevel: number
  multishotTargetsLevel: number
  rapidFireChanceLevel: number
  rapidFireDurationLevel: number
  bounceShotChanceLevel: number
  bounceShotTargetsLevel: number
  bounceShotRangeLevel: number
  superCritChanceLevel: number
  superCritMultLevel: number
  rendArmorChanceLevel: number
  rendArmorMultLevel: number
  healthLevel: number
  healthRegenLevel: number
  defensePercentLevel: number
  defenseAbsoluteLevel: number
  thornDamageLevel: number
  lifestealLevel: number
  knockbackChanceLevel: number
  knockbackForceLevel: number
  orbSpeedLevel: number
  orbsLevel: number
  shockwaveSizeLevel: number
  shockwaveFrequencyLevel: number
  landMineChanceLevel: number
  landMineDamageLevel: number
  landMineRadiusLevel: number
  deathDefyLevel: number
  wallHealthLevel: number
  wallRebuildLevel: number
  cashBonusLevel: number
  cashPerWaveLevel: number
  coinsKillBonusLevel: number
  coinsWaveLevel: number
  freeAttackUpgradeLevel: number
  freeDefenseUpgradeLevel: number
  freeUtilityUpgradeLevel: number
  interestPerWaveLevel: number
  recoveryAmountLevel: number
  maxRecoveryLevel: number
  packageChanceLevel: number
  enemyAttackLevelSkipLevel: number
  enemyHealthLevelSkipLevel: number
}

const WORKSHOP_MULTIPLIERS = new Set<number>([1, 5, 10, 100])

export function defaultWorkshopPersisted(): WorkshopPersistedV1 {
  return {
    hideMaxed: false,
    mainTab: 'upgrade',
    category: 'attack',
    multiplier: 10,
    damageLevel: 0,
    attackSpeedLevel: 0,
    critChanceLevel: 0,
    critFactorLevel: 0,
    attackRangeLevel: 0,
    damagePerMeterLevel: 0,
    multishotChanceLevel: 0,
    multishotTargetsLevel: 0,
    rapidFireChanceLevel: 0,
    rapidFireDurationLevel: 0,
    bounceShotChanceLevel: 0,
    bounceShotTargetsLevel: 0,
    bounceShotRangeLevel: 0,
    superCritChanceLevel: 0,
    superCritMultLevel: 0,
    rendArmorChanceLevel: 0,
    rendArmorMultLevel: 0,
    healthLevel: 0,
    healthRegenLevel: 0,
    defensePercentLevel: 0,
    defenseAbsoluteLevel: 0,
    thornDamageLevel: 0,
    lifestealLevel: 0,
    knockbackChanceLevel: 0,
    knockbackForceLevel: 0,
    orbSpeedLevel: 0,
    orbsLevel: 0,
    shockwaveSizeLevel: 0,
    shockwaveFrequencyLevel: 0,
    landMineChanceLevel: 0,
    landMineDamageLevel: 0,
    landMineRadiusLevel: 0,
    deathDefyLevel: 0,
    wallHealthLevel: 0,
    wallRebuildLevel: 0,
    cashBonusLevel: 0,
    cashPerWaveLevel: 0,
    coinsKillBonusLevel: 0,
    coinsWaveLevel: 0,
    freeAttackUpgradeLevel: 0,
    freeDefenseUpgradeLevel: 0,
    freeUtilityUpgradeLevel: 0,
    interestPerWaveLevel: 0,
    recoveryAmountLevel: 0,
    maxRecoveryLevel: 0,
    packageChanceLevel: 0,
    enemyAttackLevelSkipLevel: 0,
    enemyHealthLevelSkipLevel: 0,
  }
}

function clampInt(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min
  return Math.max(min, Math.min(max, Math.trunc(n)))
}

export function sanitizeWorkshopPersisted(raw: unknown): WorkshopPersistedV1 {
  const d = defaultWorkshopPersisted()
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return d
  const o = raw as Record<string, unknown>

  const hideMaxed = o.hideMaxed === true
  const mainTab = o.mainTab === 'enhance' ? 'enhance' : 'upgrade'
  const cat = o.category
  const category: WorkshopCategoryPersisted =
    cat === 'defense' || cat === 'utility' || cat === 'ultimate' ? cat : 'attack'

  const m = o.multiplier
  const multiplier = WORKSHOP_MULTIPLIERS.has(Number(m))
    ? (Number(m) as WorkshopPersistedV1['multiplier'])
    : d.multiplier

  return {
    hideMaxed,
    mainTab,
    category,
    multiplier,
    damageLevel: clampInt(Number(o.damageLevel), 0, WORKSHOP_DAMAGE_MAX_LEVEL),
    attackSpeedLevel: clampInt(Number(o.attackSpeedLevel), 0, WORKSHOP_ATTACK_SPEED_MAX_LEVEL),
    critChanceLevel: clampInt(Number(o.critChanceLevel), 0, WORKSHOP_CRITICAL_CHANCE_MAX_LEVEL),
    critFactorLevel: clampInt(Number(o.critFactorLevel), 0, WORKSHOP_CRITICAL_FACTOR_MAX_LEVEL),
    attackRangeLevel: clampInt(Number(o.attackRangeLevel), 0, WORKSHOP_ATTACK_RANGE_MAX_LEVEL),
    damagePerMeterLevel: clampInt(
      Number(o.damagePerMeterLevel),
      0,
      WORKSHOP_DAMAGE_PER_METER_MAX_LEVEL,
    ),
    multishotChanceLevel: clampInt(
      Number(o.multishotChanceLevel),
      0,
      WORKSHOP_MULTISHOT_CHANCE_MAX_LEVEL,
    ),
    multishotTargetsLevel: clampInt(
      Number(o.multishotTargetsLevel),
      0,
      WORKSHOP_MULTISHOT_TARGETS_MAX_LEVEL,
    ),
    rapidFireChanceLevel: clampInt(
      Number(o.rapidFireChanceLevel),
      0,
      WORKSHOP_RAPID_FIRE_CHANCE_MAX_LEVEL,
    ),
    rapidFireDurationLevel: clampInt(
      Number(o.rapidFireDurationLevel),
      0,
      WORKSHOP_RAPID_FIRE_DURATION_MAX_LEVEL,
    ),
    bounceShotChanceLevel: clampInt(
      Number(o.bounceShotChanceLevel),
      0,
      WORKSHOP_BOUNCE_SHOT_CHANCE_MAX_LEVEL,
    ),
    bounceShotTargetsLevel: clampInt(
      Number(o.bounceShotTargetsLevel),
      0,
      WORKSHOP_BOUNCE_SHOT_TARGETS_MAX_LEVEL,
    ),
    bounceShotRangeLevel: clampInt(
      Number(o.bounceShotRangeLevel),
      0,
      WORKSHOP_BOUNCE_SHOT_RANGE_MAX_LEVEL,
    ),
    superCritChanceLevel: clampInt(
      Number(o.superCritChanceLevel),
      0,
      WORKSHOP_SUPER_CRIT_CHANCE_MAX_LEVEL,
    ),
    superCritMultLevel: clampInt(Number(o.superCritMultLevel), 0, WORKSHOP_SUPER_CRIT_MULT_MAX_LEVEL),
    rendArmorChanceLevel: clampInt(
      Number(o.rendArmorChanceLevel),
      0,
      WORKSHOP_REND_ARMOR_CHANCE_MAX_LEVEL,
    ),
    rendArmorMultLevel: clampInt(
      Number(o.rendArmorMultLevel),
      0,
      WORKSHOP_REND_ARMOR_MULT_MAX_LEVEL,
    ),
    healthLevel: workshopDefenseClampLevel('healthLevel', Number(o.healthLevel)),
    healthRegenLevel: workshopDefenseClampLevel('healthRegenLevel', Number(o.healthRegenLevel)),
    defensePercentLevel: workshopDefenseClampLevel(
      'defensePercentLevel',
      Number(o.defensePercentLevel),
    ),
    defenseAbsoluteLevel: workshopDefenseClampLevel(
      'defenseAbsoluteLevel',
      Number(o.defenseAbsoluteLevel),
    ),
    thornDamageLevel: workshopDefenseClampLevel('thornDamageLevel', Number(o.thornDamageLevel)),
    lifestealLevel: workshopDefenseClampLevel('lifestealLevel', Number(o.lifestealLevel)),
    knockbackChanceLevel: workshopDefenseClampLevel(
      'knockbackChanceLevel',
      Number(o.knockbackChanceLevel),
    ),
    knockbackForceLevel: workshopDefenseClampLevel(
      'knockbackForceLevel',
      Number(o.knockbackForceLevel),
    ),
    orbSpeedLevel: workshopDefenseClampLevel('orbSpeedLevel', Number(o.orbSpeedLevel)),
    orbsLevel: workshopDefenseClampLevel('orbsLevel', Number(o.orbsLevel)),
    shockwaveSizeLevel: workshopDefenseClampLevel(
      'shockwaveSizeLevel',
      Number(o.shockwaveSizeLevel),
    ),
    shockwaveFrequencyLevel: workshopDefenseClampLevel(
      'shockwaveFrequencyLevel',
      Number(o.shockwaveFrequencyLevel),
    ),
    landMineChanceLevel: workshopDefenseClampLevel(
      'landMineChanceLevel',
      Number(o.landMineChanceLevel),
    ),
    landMineDamageLevel: workshopDefenseClampLevel(
      'landMineDamageLevel',
      Number(o.landMineDamageLevel),
    ),
    landMineRadiusLevel: workshopDefenseClampLevel(
      'landMineRadiusLevel',
      Number(o.landMineRadiusLevel),
    ),
    deathDefyLevel: workshopDefenseClampLevel('deathDefyLevel', Number(o.deathDefyLevel)),
    wallHealthLevel: workshopDefenseClampLevel('wallHealthLevel', Number(o.wallHealthLevel)),
    wallRebuildLevel: workshopDefenseClampLevel('wallRebuildLevel', Number(o.wallRebuildLevel)),
    cashBonusLevel: workshopUtilityClampLevel('cashBonusLevel', Number(o.cashBonusLevel)),
    cashPerWaveLevel: workshopUtilityClampLevel('cashPerWaveLevel', Number(o.cashPerWaveLevel)),
    coinsKillBonusLevel: workshopUtilityClampLevel(
      'coinsKillBonusLevel',
      Number(o.coinsKillBonusLevel),
    ),
    coinsWaveLevel: workshopUtilityClampLevel('coinsWaveLevel', Number(o.coinsWaveLevel)),
    freeAttackUpgradeLevel: workshopUtilityClampLevel(
      'freeAttackUpgradeLevel',
      Number(o.freeAttackUpgradeLevel),
    ),
    freeDefenseUpgradeLevel: workshopUtilityClampLevel(
      'freeDefenseUpgradeLevel',
      Number(o.freeDefenseUpgradeLevel),
    ),
    freeUtilityUpgradeLevel: workshopUtilityClampLevel(
      'freeUtilityUpgradeLevel',
      Number(o.freeUtilityUpgradeLevel),
    ),
    interestPerWaveLevel: workshopUtilityClampLevel(
      'interestPerWaveLevel',
      Number(o.interestPerWaveLevel),
    ),
    recoveryAmountLevel: workshopUtilityClampLevel(
      'recoveryAmountLevel',
      Number(o.recoveryAmountLevel),
    ),
    maxRecoveryLevel: workshopUtilityClampLevel('maxRecoveryLevel', Number(o.maxRecoveryLevel)),
    packageChanceLevel: workshopUtilityClampLevel(
      'packageChanceLevel',
      Number(o.packageChanceLevel),
    ),
    enemyAttackLevelSkipLevel: workshopUtilityClampLevel(
      'enemyAttackLevelSkipLevel',
      Number(o.enemyAttackLevelSkipLevel),
    ),
    enemyHealthLevelSkipLevel: workshopUtilityClampLevel(
      'enemyHealthLevelSkipLevel',
      Number(o.enemyHealthLevelSkipLevel),
    ),
  }
}

export type LabPreset = {
  id: string
  name: string
  levelOverrides: Record<string, number>
  /** Workshop snapshot saved with this build (optional for legacy presets). */
  workshop?: WorkshopPersistedV1
}

export type LabPresetsFileV1 = {
  v: 1
  activePresetId: string | null
  presets: LabPreset[]
  /** Last scratch workspace when a named preset is active; current levels when scratch is active. */
  scratchOverrides: Record<string, number>
  /**
   * Workshop snapshot for the scratch build while a named preset is active;
   * when scratch is active, mirrors the persisted workshop row (same as lab scratch pattern).
   */
  scratchWorkshop?: WorkshopPersistedV1
}

export function newPresetId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function isLabPreset(x: unknown): x is LabPreset {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  if (typeof o.id !== 'string' || typeof o.name !== 'string') return false
  const lo = o.levelOverrides
  if (!lo || typeof lo !== 'object' || Array.isArray(lo)) return false
  return true
}

export function parseLabPresetsFile(raw: unknown): LabPresetsFileV1 | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (o.v !== 1) return null
  if (!Array.isArray(o.presets) || !o.presets.every(isLabPreset)) return null
  const scratch = o.scratchOverrides
  if (
    scratch !== undefined &&
    (typeof scratch !== 'object' || scratch === null || Array.isArray(scratch))
  ) {
    return null
  }
  const active = o.activePresetId
  if (active !== null && active !== undefined && typeof active !== 'string') {
    return null
  }
  const sw = o.scratchWorkshop
  const scratchWorkshop =
    sw !== undefined && sw !== null ? sanitizeWorkshopPersisted(sw) : undefined

  const presets = (o.presets as LabPreset[]).map((p) => {
    const base: LabPreset = {
      id: p.id,
      name: p.name,
      levelOverrides: p.levelOverrides,
    }
    if (p.workshop !== undefined && p.workshop !== null) {
      return { ...base, workshop: sanitizeWorkshopPersisted(p.workshop) }
    }
    return base
  })

  return {
    v: 1,
    activePresetId: typeof active === 'string' ? active : null,
    presets,
    scratchOverrides:
      scratch && typeof scratch === 'object' && !Array.isArray(scratch)
        ? (scratch as Record<string, number>)
        : {},
    ...(scratchWorkshop !== undefined ? { scratchWorkshop } : {}),
  }
}

/** Build the object to persist; merges current `levelOverrides` into the active preset entry. */
export function buildLabPresetsPayload(
  activePresetId: string | null,
  presets: readonly LabPreset[],
  levelOverrides: Record<string, number>,
  scratchSnapshot: Record<string, number>,
  workshopPersisted: WorkshopPersistedV1,
  scratchWorkshopPersisted: WorkshopPersistedV1,
): LabPresetsFileV1 {
  const mergedPresets = activePresetId
    ? presets.map((p) =>
        p.id === activePresetId
          ? {
              ...p,
              levelOverrides: { ...levelOverrides },
              workshop: { ...workshopPersisted },
            }
          : p,
      )
    : [...presets]

  return {
    v: 1,
    activePresetId,
    presets: mergedPresets,
    scratchOverrides: activePresetId ? { ...scratchSnapshot } : { ...levelOverrides },
    scratchWorkshop:
      activePresetId != null
        ? { ...scratchWorkshopPersisted }
        : { ...workshopPersisted },
  }
}
