import { useCallback, type CSSProperties } from 'react'
import {
  ASSIST_CHASSIS_MODULE_RARITY_KEY,
  ASSIST_CHASSIS_UNLOCKED_KEY,
  assistStoneEfficiencyPatch,
  workshopAssistChassisModuleSelection,
} from '../data/workshopAssistChassisModule'
import {
  ASSIST_SLOT_UNLOCK_STONE_COST,
  assistStoneEfficiencyMarginalCost,
  assistUniqueRarityUpgradeCost,
  stepAssistUniqueRarity,
} from '../data/workshopAssistModuleCatalog'
import {
  MODULE_FRAME_SHAPE,
  MODULE_HUB_SLOT_ART,
} from '../data/workshopModuleArt'
import {
  WORKSHOP_ASSIST_MODULE_SLOTS,
  type WorkshopAssistModuleSlot,
} from '../data/workshopSimModules'
import {
  WORKSHOP_CHASSIS_MODULE_RARITY_CLASS,
  type WorkshopChassisModuleRarity,
} from '../data/workshopChassisModuleShared'
import { formatPowerStoneAmount } from '../labCosts'
import type { WorkshopPersistedV1 } from '../labPresetsStorage'
import { patchWorkshopModules } from '../data/workshopModulePresets'
import { useI18n } from '../i18n'
import type { StringId } from '../i18n/dictionary'
import { PowerStoneGlyph } from './PowerStoneGlyph'

const SLOT_LABEL: Record<WorkshopAssistModuleSlot, StringId> = {
  cannon: 'ws_sim_module_cannon',
  armor: 'ws_sim_module_armor',
  generator: 'ws_sim_module_generator',
  core: 'ws_sim_module_core',
}

const RARITY_LABEL: Record<WorkshopChassisModuleRarity, StringId> = {
  epic: 'ws_modules_col_epic',
  legendary: 'ws_modules_col_legendary',
  mythic: 'ws_modules_col_mythic',
  ancestral: 'ws_modules_col_ancestral',
}

function AssistSlotIcon({ slot }: { slot: WorkshopAssistModuleSlot }) {
  const art = MODULE_HUB_SLOT_ART[slot]
  const frameDef = MODULE_FRAME_SHAPE[art.shape]
  return (
    <svg
      className="workshop__uw-assist-icon"
      viewBox="0 0 100 100"
      style={{ '--assist-glow-rgb': art.glowRgb } as CSSProperties}
      aria-hidden
    >
      {frameDef.type === 'circle' ? (
        <circle className="workshop__uw-assist-icon-shape" cx="50" cy="50" r={frameDef.r} />
      ) : (
        <polygon className="workshop__uw-assist-icon-shape" points={frameDef.points} />
      )}
    </svg>
  )
}

type AssistUnlockColProps = {
  label: string
  value: string
  valueClass?: string
  nextCost: number | null
  maxed: boolean
  active: boolean
  onDecrease: () => void
  onIncrease: () => void
  decreaseDisabled?: boolean
  increaseDisabled?: boolean
}

function AssistUnlockCol({
  label,
  value,
  valueClass,
  nextCost,
  maxed,
  active,
  onDecrease,
  onIncrease,
  decreaseDisabled,
  increaseDisabled,
}: AssistUnlockColProps) {
  const { t } = useI18n()

  return (
    <div className={maxed ? 'workshop__uw-col workshop__uw-col--max' : 'workshop__uw-col'}>
      <div className="workshop__uw-col-top">
        <span className="workshop__uw-stat-label">{label}</span>
        <span
          className={['workshop__uw-stat-value', valueClass ?? ''].filter(Boolean).join(' ')}
        >
          {value}
        </span>
      </div>
      <div className="workshop__uw-col-foot">
        <button
          type="button"
          className="workshop__uw-level-step"
          aria-label={`${label} — ${t('ws_defense_level_down_aria')}`}
          disabled={!active || decreaseDisabled}
          onClick={onDecrease}
        >
          −
        </button>
        <div
          className={
            maxed ? 'workshop__uw-col-cost workshop__card-cost--max' : 'workshop__uw-col-cost'
          }
          title={maxed ? t('ws_max') : t('researchCard_cost_stones_title')}
        >
          {maxed ? (
            <>
              <span>{t('ws_max')}</span>
              <PowerStoneGlyph className="workshop__uw-stone" />
            </>
          ) : (
            <>
              <span>{formatPowerStoneAmount(nextCost ?? 0)}</span>
              <PowerStoneGlyph className="workshop__uw-stone" />
            </>
          )}
        </div>
        <button
          type="button"
          className="workshop__uw-level-step"
          aria-label={`${label} — ${t('ws_defense_level_up_aria')}`}
          disabled={!active || increaseDisabled}
          onClick={onIncrease}
        >
          +
        </button>
      </div>
    </div>
  )
}

type AssistUnlockCardProps = {
  slot: WorkshopAssistModuleSlot
  workshop: WorkshopPersistedV1
  onPatch: (partial: Partial<WorkshopPersistedV1>) => void
}

function AssistUnlockCard({ slot, workshop, onPatch }: AssistUnlockCardProps) {
  const { t } = useI18n()
  const assist = workshopAssistChassisModuleSelection(workshop, slot)
  const title = t(SLOT_LABEL[slot])
  const rarityKey = ASSIST_CHASSIS_MODULE_RARITY_KEY[slot]
  const unlockedKey = ASSIST_CHASSIS_UNLOCKED_KEY[slot]

  const setRarity = useCallback(
    (delta: -1 | 1) => {
      const next = stepAssistUniqueRarity(assist.rarity, delta)
      onPatch({ [rarityKey]: next })
    },
    [assist.rarity, onPatch, rarityKey],
  )

  const setEfficiency = useCallback(
    (track: 'main' | 'sub', delta: -1 | 1) => {
      const current = track === 'main' ? assist.mainStoneEfficiency : assist.subStoneEfficiency
      onPatch(assistStoneEfficiencyPatch(slot, track, current + delta))
    },
    [assist.mainStoneEfficiency, assist.subStoneEfficiency, onPatch, slot],
  )

  const unlock = useCallback(() => {
    onPatch({ [unlockedKey]: true })
  }, [onPatch, unlockedKey])

  const rarityMaxed = assist.rarity === 'ancestral'
  const mainMaxed = assist.mainStoneEfficiency >= 70
  const subMaxed = assist.subStoneEfficiency >= 70
  const rarityCost = assistUniqueRarityUpgradeCost(assist.rarity)
  const mainNext = mainMaxed
    ? null
    : assistStoneEfficiencyMarginalCost(assist.mainStoneEfficiency + 1)
  const subNext = subMaxed
    ? null
    : assistStoneEfficiencyMarginalCost(assist.subStoneEfficiency + 1)

  return (
    <li
      className={
        assist.unlocked ? 'workshop__uw-card' : 'workshop__uw-card workshop__uw-card--inactive'
      }
    >
      <div className="workshop__uw-head">
        <span className="workshop__uw-title">{title}</span>
        {!assist.unlocked ? (
          <button
            type="button"
            className="workshop__uw-active-toggle"
            aria-label={`${title} — ${t('ws_assist_unlocks_unlock')}`}
            onClick={unlock}
          >
            {t('ws_assist_unlocks_unlock')}
          </button>
        ) : null}
      </div>
      <div className="workshop__uw-body">
        <div className="workshop__uw-icon-wrap">
          <AssistSlotIcon slot={slot} />
        </div>
        <div className="workshop__uw-stats" role="group" aria-label={title}>
          <AssistUnlockCol
            label={t('ws_assist_unlocks_unique')}
            value={assist.unlocked ? t(RARITY_LABEL[assist.rarity]) : '—'}
            valueClass={
              assist.unlocked ? WORKSHOP_CHASSIS_MODULE_RARITY_CLASS[assist.rarity] : undefined
            }
            nextCost={assist.unlocked ? rarityCost : ASSIST_SLOT_UNLOCK_STONE_COST}
            maxed={assist.unlocked && rarityMaxed}
            active={assist.unlocked}
            decreaseDisabled={assist.rarity === 'epic'}
            increaseDisabled={rarityMaxed}
            onDecrease={() => setRarity(-1)}
            onIncrease={() => (assist.unlocked ? setRarity(1) : unlock())}
          />
          <AssistUnlockCol
            label={t('ws_assist_unlocks_multiplier')}
            value={assist.unlocked ? `${assist.mainStoneEfficiency}%` : '—'}
            nextCost={assist.unlocked ? mainNext : null}
            maxed={assist.unlocked && mainMaxed}
            active={assist.unlocked}
            decreaseDisabled={assist.mainStoneEfficiency <= 1}
            increaseDisabled={mainMaxed}
            onDecrease={() => setEfficiency('main', -1)}
            onIncrease={() => setEfficiency('main', 1)}
          />
          <AssistUnlockCol
            label={t('ws_assist_unlocks_substat')}
            value={assist.unlocked ? `${assist.subStoneEfficiency}%` : '—'}
            nextCost={assist.unlocked ? subNext : null}
            maxed={assist.unlocked && subMaxed}
            active={assist.unlocked}
            decreaseDisabled={assist.subStoneEfficiency <= 1}
            increaseDisabled={subMaxed}
            onDecrease={() => setEfficiency('sub', -1)}
            onIncrease={() => setEfficiency('sub', 1)}
          />
        </div>
      </div>
    </li>
  )
}

type AssistUnlocksPanelProps = {
  workshopPersisted: WorkshopPersistedV1
  onWorkshopPersistedChange: (next: WorkshopPersistedV1) => void
}

export function AssistUnlocksPanel({
  workshopPersisted,
  onWorkshopPersistedChange,
}: AssistUnlocksPanelProps) {
  const { t } = useI18n()

  const patch = useCallback(
    (partial: Partial<WorkshopPersistedV1>) => {
      onWorkshopPersistedChange(patchWorkshopModules(workshopPersisted, partial))
    },
    [onWorkshopPersistedChange, workshopPersisted],
  )

  return (
    <section className="modules-assist-unlocks" aria-labelledby="assist-unlocks-title">
      <h3 id="assist-unlocks-title" className="modules-catalog__title">
        {t('ws_assist_unlocks_title')}
      </h3>
      <p className="modules-catalog__hint">{t('ws_assist_unlocks_hint')}</p>
      <ul className="workshop__grid workshop__grid--ultimate">
        {WORKSHOP_ASSIST_MODULE_SLOTS.map((slot) => (
          <AssistUnlockCard key={slot} slot={slot} workshop={workshopPersisted} onPatch={patch} />
        ))}
      </ul>
    </section>
  )
}
