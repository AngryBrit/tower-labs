import { PowerStoneGlyph } from './PowerStoneGlyph'
import { useI18n } from '../i18n'
import type { StringId } from '../i18n/dictionary'
import {
  workshopUltimateMaxLevel,
  workshopUltimateNextMarginalStones,
  workshopUltimateStatDisplay,
  WORKSHOP_ULTIMATE_WEAPON_STATS,
  type WorkshopUltimateUpgradeKey,
  type WorkshopUltimateWeaponId,
} from '../data/workshopUltimate'
import { formatPowerStoneAmount } from '../labCosts'

const ULTIMATE_WEAPON_TITLE: Record<WorkshopUltimateWeaponId, StringId> = {
  chainLightning: 'ws_uw_chainLightning',
  smartMissiles: 'ws_uw_smartMissiles',
  deathWave: 'ws_uw_deathWave',
  chronoField: 'ws_uw_chronoField',
  innerLandMines: 'ws_uw_innerLandMines',
  goldenTower: 'ws_uw_goldenTower',
  poisonSwamp: 'ws_uw_poisonSwamp',
  blackHole: 'ws_uw_blackHole',
  spotlight: 'ws_uw_spotlight',
}

const ULTIMATE_STAT_LABEL: Record<string, StringId> = {
  damage: 'ws_uw_stat_damage',
  quantity: 'ws_uw_stat_quantity',
  chance: 'ws_uw_stat_chance',
  cooldown: 'ws_uw_stat_cooldown',
  duration: 'ws_uw_stat_duration',
  slow: 'ws_uw_stat_slow',
  bonus: 'ws_uw_stat_bonus',
  size: 'ws_uw_stat_size',
  angle: 'ws_uw_stat_angle',
}

const ULTIMATE_WEAPON_ICON_SRC: Record<WorkshopUltimateWeaponId, string> = {
  goldenTower: '/Golden_Tower.webp',
  blackHole: '/Black_Hole.webp',
  spotlight: '/Spotlight.webp',
  deathWave: '/Death_Wave.webp',
  chainLightning: '/Chain_Lightning.webp',
  smartMissiles: '/Smart_Missiles.webp',
  innerLandMines: '/Inner_Land_Mines.webp',
  poisonSwamp: '/Poison_Swamp.webp',
  chronoField: '/Chrono_Field.webp',
}

function UltimateWeaponIcon({ weaponId }: { weaponId: WorkshopUltimateWeaponId }) {
  const src = ULTIMATE_WEAPON_ICON_SRC[weaponId]
  if (!src) return null
  return (
    <img
      src={src}
      alt=""
      width={48}
      height={48}
      className="workshop__uw-icon-svg"
      aria-hidden
    />
  )
}

export type WorkshopUltimateWeaponCardProps = {
  weaponId: WorkshopUltimateWeaponId
  active: boolean
  levels: Record<WorkshopUltimateUpgradeKey, number>
  onBump: (key: WorkshopUltimateUpgradeKey, direction: -1 | 1) => void
  onToggleActive: (weaponId: WorkshopUltimateWeaponId) => void
}

export function WorkshopUltimateWeaponCard({
  weaponId,
  active,
  levels,
  onBump,
  onToggleActive,
}: WorkshopUltimateWeaponCardProps) {
  const { t } = useI18n()
  const stats = WORKSHOP_ULTIMATE_WEAPON_STATS[weaponId]
  const title = t(ULTIMATE_WEAPON_TITLE[weaponId])

  return (
    <li className={active ? 'workshop__uw-card' : 'workshop__uw-card workshop__uw-card--inactive'}>
      <div className="workshop__uw-head">
        <span className="workshop__uw-title">{title}</span>
        <button
          type="button"
          className={
            active
              ? 'workshop__uw-active-toggle workshop__uw-active-toggle--on'
              : 'workshop__uw-active-toggle'
          }
          aria-pressed={active}
          aria-label={
            active
              ? `${title} — ${t('ws_uw_deactivate')}`
              : `${title} — ${t('ws_uw_activate')}`
          }
          onClick={() => onToggleActive(weaponId)}
        >
          {active ? t('ws_uw_deactivate') : t('ws_uw_activate')}
        </button>
      </div>
      <div className="workshop__uw-body">
        <div className="workshop__uw-icon-wrap">
          <UltimateWeaponIcon weaponId={weaponId} />
        </div>
        <div className="workshop__uw-stats" role="group">
          {stats.map(({ key, stat }) => {
            const level = levels[key] ?? 0
            const max = workshopUltimateMaxLevel(key)
            const maxed = level >= max
            const nextStones = workshopUltimateNextMarginalStones(key, level)
            const labelId = ULTIMATE_STAT_LABEL[stat]
            const statName = labelId ? t(labelId) : stat

            return (
              <div key={key} className={maxed ? 'workshop__uw-col workshop__uw-col--max' : 'workshop__uw-col'}>
                <div className="workshop__uw-col-top">
                  <span className="workshop__uw-stat-label">{statName}</span>
                  <span className="workshop__uw-stat-value">{workshopUltimateStatDisplay(key, level)}</span>
                </div>
                <div className="workshop__uw-col-foot">
                  <button
                    type="button"
                    className="workshop__uw-level-step"
                    aria-label={`${statName} — ${t('ws_defense_level_down_aria')}`}
                    disabled={!active || level <= 0}
                    onClick={() => onBump(key, -1)}
                  >
                    −
                  </button>
                  <div
                    className={
                      maxed
                        ? 'workshop__uw-col-cost workshop__card-cost--max'
                        : 'workshop__uw-col-cost'
                    }
                    title={
                      maxed ? t('ws_max') : t('researchCard_cost_stones_title')
                    }
                  >
                    {maxed ? (
                      <>
                        <span>{t('ws_max')}</span>
                        <PowerStoneGlyph className="workshop__uw-stone" />
                      </>
                    ) : (
                      <>
                        <span>{formatPowerStoneAmount(nextStones ?? 0)}</span>
                        <PowerStoneGlyph className="workshop__uw-stone" />
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    className="workshop__uw-level-step"
                    aria-label={`${statName} — ${t('ws_defense_level_up_aria')}`}
                    disabled={!active || maxed}
                    onClick={() => onBump(key, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </li>
  )
}
