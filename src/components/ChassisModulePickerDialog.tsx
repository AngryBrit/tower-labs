import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  formatWorkshopChassisModuleHeroStat,
  type WorkshopChassisModuleHeroStatContext,
} from '../data/workshopChassisModuleHeroStat'
import {
  clampWorkshopChassisModuleLevel,
  formatWorkshopChassisModuleAbility,
  WORKSHOP_CHASSIS_MODULE_RARITIES,
  WORKSHOP_CHASSIS_MODULE_RARITY_CLASS,
  workshopChassisModuleMaxLevel,
  type WorkshopChassisModuleRarity,
} from '../data/workshopChassisModuleShared'
import {
  CHASSIS_MODULE_ORDERS,
  workshopChassisModuleDefForSlot,
} from '../data/workshopChassisModuleSelection'
import type { WorkshopAssistModuleSlot } from '../data/workshopSimModules'
import {
  workshopChassisModuleDedicatedImageUrl,
  workshopChassisModuleHasDedicatedArt,
} from '../data/workshopModuleImages'
import {
  WORKSHOP_SUBMODULE_SECTIONS,
  WORKSHOP_SUBMODULE_SLOT_COUNT,
  WORKSHOP_SUBMODULE_SLOT_UNLOCK_LEVEL,
  formatSubmoduleCellDisplay,
  submoduleEffectId,
  submoduleEffectPickerSlotText,
} from '../data/workshopSubmoduleCatalog'
import type { WorkshopSubmoduleSelectionMap } from '../data/workshopSubmoduleSelection'
import {
  WORKSHOP_SUBMODULE_RARITIES,
  WORKSHOP_SUBMODULE_RARITY_CLASS,
  type WorkshopSubmoduleRarity,
} from '../data/workshopSubmoduleEffects'
import { useI18n } from '../i18n'
import type { StringId } from '../i18n/dictionary'

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

const SUB_RARITY_LABEL: Record<WorkshopSubmoduleRarity, StringId> = {
  common: 'ws_submodules_col_common',
  rare: 'ws_submodules_col_rare',
  epic: 'ws_submodules_col_epic',
  legendary: 'ws_submodules_col_legendary',
  mythic: 'ws_submodules_col_mythic',
  ancestral: 'ws_submodules_col_ancestral',
}

type ChassisModulePickerDialogProps = {
  slot: WorkshopAssistModuleSlot
  pickerRole?: 'main' | 'assist'
  excludeModuleIds?: readonly string[]
  selectedModuleId: string | null
  selectedRarity: WorkshopChassisModuleRarity
  moduleLevel: number
  onModuleLevelCommit: (level: number) => void
  heroStatContext: WorkshopChassisModuleHeroStatContext
  submoduleSelections: WorkshopSubmoduleSelectionMap
  onSelect: (moduleId: string, rarity: WorkshopChassisModuleRarity) => void
  onClear: (rarity: WorkshopChassisModuleRarity) => void
  onSelectEffect: (
    effectId: string,
    rarity: WorkshopSubmoduleRarity,
    cellValue: string | null,
  ) => void
  onClose: () => void
}

const ABILITY_VALUE_HIGHLIGHT =
  /^(\d+(?:\.\d+)?(?:s|%|x|m)|×\d+(?:\.\d+)?|\+\d+(?:\.\d+)?m)$/i

function PickerModuleLevelInput({
  slot,
  rarity,
  value,
  onCommit,
}: {
  slot: WorkshopAssistModuleSlot
  rarity: WorkshopChassisModuleRarity
  value: number
  onCommit: (level: number) => void
}) {
  const { t } = useI18n()
  const maxLevel = workshopChassisModuleMaxLevel(rarity)
  const [draft, setDraft] = useState(String(value))

  useEffect(() => {
    setDraft(String(value))
  }, [value])

  const commit = () => {
    const raw = draft.trim().replace(/,/g, '')
    if (raw === '') {
      setDraft(String(value))
      return
    }
    const n = Number(raw)
    if (!Number.isFinite(n)) {
      setDraft(String(value))
      return
    }
    onCommit(clampWorkshopChassisModuleLevel(n, rarity))
  }

  return (
    <label className="modules-picker__hero-level">
      <span className="modules-picker__hero-level-prefix">{t('ws_modules_level_prefix')}</span>
      <input
        className="modules-picker__hero-level-input"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        aria-label={`${t('ws_modules_level_input_aria')} ${t(SLOT_LABEL[slot])}`}
        value={draft}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          e.stopPropagation()
          if (e.key === 'Enter') {
            e.preventDefault()
            commit()
            ;(e.target as HTMLInputElement).blur()
          }
        }}
      />
      <span className="modules-picker__hero-level-suffix">/ {maxLevel}</span>
    </label>
  )
}

function ModuleAbilityUniqueText({ text }: { text: string }) {
  const parts = text.split(/(\d+(?:\.\d+)?(?:s|%|x|m)|×\d+(?:\.\d+)?|\+\d+(?:\.\d+)?m)/gi)
  return (
    <>
      {parts.map((part, index) => {
        if (part === '') return null
        if (ABILITY_VALUE_HIGHLIGHT.test(part)) {
          return (
            <span key={index} className="modules-picker__unique-highlight">
              {part}
            </span>
          )
        }
        return <span key={index}>{part}</span>
      })}
    </>
  )
}

function selectedSubmoduleEntries(
  slot: WorkshopAssistModuleSlot,
  selections: WorkshopSubmoduleSelectionMap,
) {
  const section = WORKSHOP_SUBMODULE_SECTIONS[slot]
  return Object.entries(selections)
    .map(([effectId, rarity]) => {
      if (rarity == null) return null
      const row = section.rows.find((r) => submoduleEffectId(r.label) === effectId)
      if (row == null) return null
      const cell = row.cells[rarity]
      if (cell == null) return null
      return {
        effectId,
        rarity,
        label: row.label,
        pickerText: submoduleEffectPickerSlotText(cell, row.label),
      }
    })
    .filter((e): e is NonNullable<typeof e> => e != null)
}

export function ChassisModulePickerDialog({
  slot,
  pickerRole = 'main',
  excludeModuleIds = [],
  selectedModuleId,
  selectedRarity,
  moduleLevel,
  onModuleLevelCommit,
  heroStatContext,
  submoduleSelections,
  onSelect,
  onClear,
  onSelectEffect,
  onClose,
}: ChassisModulePickerDialogProps) {
  const { t } = useI18n()
  const titleId = `modules-picker-title-${slot}-${pickerRole}`
  const moduleOrder = CHASSIS_MODULE_ORDERS[slot].filter((id) => !excludeModuleIds.includes(id))
  const [pickerRarity, setPickerRarity] = useState<WorkshopChassisModuleRarity>(selectedRarity)
  const [pickerModuleId, setPickerModuleId] = useState<string | null>(selectedModuleId)
  const [optionsEffectId, setOptionsEffectId] = useState('')
  const [optionsRarity, setOptionsRarity] = useState<WorkshopSubmoduleRarity>('legendary')

  const section = WORKSHOP_SUBMODULE_SECTIONS[slot]
  const equipped =
    pickerModuleId != null ? workshopChassisModuleDefForSlot(slot, pickerModuleId) : null
  const iconUrl =
    pickerModuleId != null && workshopChassisModuleHasDedicatedArt(slot, pickerModuleId)
      ? workshopChassisModuleDedicatedImageUrl(slot, pickerModuleId)
      : null

  const selectedSubmodules = useMemo(
    () => selectedSubmoduleEntries(slot, submoduleSelections),
    [slot, submoduleSelections],
  )

  useEffect(() => {
    setPickerRarity(selectedRarity)
    setPickerModuleId(selectedModuleId)
  }, [selectedRarity, selectedModuleId, slot])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const applyModule = (moduleId: string | null, rarity: WorkshopChassisModuleRarity) => {
    if (moduleId == null || moduleId === '') {
      onClear(rarity)
    } else {
      onSelect(moduleId, rarity)
    }
  }

  const optionsRow = section.rows.find((r) => submoduleEffectId(r.label) === optionsEffectId)

  const assignOptionsEffect = () => {
    if (optionsRow == null) return
    const cell = optionsRow.cells[optionsRarity]
    if (cell == null) return
    onSelectEffect(optionsEffectId, optionsRarity, cell)
    setOptionsEffectId('')
  }

  return createPortal(
    <div
      className="modules-picker__backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="modules-picker__dialog modules-picker__dialog--detail"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modules-picker__close"
          onClick={onClose}
          aria-label={t('sr_cancel')}
        >
          ×
        </button>

        <div className="modules-picker__hero">
          <div className="modules-picker__hero-icon-wrap">
            {iconUrl != null ? (
              <span className="modules-picker__hero-icon" aria-hidden>
                <img src={iconUrl} alt="" decoding="async" draggable={false} />
              </span>
            ) : (
              <span className="modules-picker__hero-icon modules-picker__hero-icon--empty" aria-hidden />
            )}
            <PickerModuleLevelInput
              slot={slot}
              rarity={pickerRarity}
              value={moduleLevel}
              onCommit={onModuleLevelCommit}
            />
          </div>
          <div className="modules-picker__hero-body">
            <p
              className={[
                'modules-picker__hero-rarity',
                WORKSHOP_CHASSIS_MODULE_RARITY_CLASS[pickerRarity],
              ].join(' ')}
            >
              {t(RARITY_LABEL[pickerRarity])}
            </p>
            <h2 id={titleId} className="modules-picker__hero-name">
              {equipped?.name ?? t('ws_modules_none_selected')}
            </h2>
            {equipped != null ? (
              <p className="modules-picker__hero-stat">
                {formatWorkshopChassisModuleHeroStat(
                  slot,
                  equipped,
                  pickerRarity,
                  heroStatContext,
                )}
              </p>
            ) : null}
            <p className="modules-picker__hero-equipped">
              {t('ws_modules_picker_equipped')}:{' '}
              {pickerRole === 'assist'
                ? t('ws_modules_picker_equipped_assist')
                : t('ws_modules_picker_equipped_primary')}
            </p>
          </div>
        </div>

        <label className="modules-picker__field">
          <span className="modules-picker__field-label">{t('ws_modules_col_module')}</span>
          <select
            className="modules-picker__select glow-input"
            value={pickerModuleId ?? ''}
            aria-label={t('ws_modules_picker_module_aria')}
            onChange={(e) => {
              const id = e.target.value
              setPickerModuleId(id === '' ? null : id)
              applyModule(id === '' ? null : id, pickerRarity)
            }}
          >
            <option value="">{t('ws_modules_none_selected')}</option>
            {moduleOrder.map((id) => {
              const def = workshopChassisModuleDefForSlot(slot, id)
              return (
                <option key={id} value={id}>
                  {def.name}
                </option>
              )
            })}
          </select>
        </label>

        <label className="modules-picker__field">
          <span className="modules-picker__field-label">{t('ws_modules_picker_rarity')}</span>
          <select
            className="modules-picker__select glow-input"
            value={pickerRarity}
            aria-label={t('ws_modules_picker_rarity_aria')}
            onChange={(e) => {
              const rarity = e.target.value as WorkshopChassisModuleRarity
              setPickerRarity(rarity)
              if (moduleLevel > workshopChassisModuleMaxLevel(rarity)) {
                onModuleLevelCommit(clampWorkshopChassisModuleLevel(moduleLevel, rarity))
              }
              if (pickerModuleId != null) {
                applyModule(pickerModuleId, rarity)
              }
            }}
          >
            {WORKSHOP_CHASSIS_MODULE_RARITIES.map((rarity) => (
              <option key={rarity} value={rarity}>
                {t(RARITY_LABEL[rarity])}
              </option>
            ))}
          </select>
        </label>

        <section className="modules-picker__section" aria-labelledby={`${titleId}-effects`}>
          <div className="modules-picker__section-head">
            <h3 id={`${titleId}-effects`} className="modules-picker__section-title">
              {t('ws_modules_picker_effects')}
            </h3>
            <label className="modules-picker__options">
              <span className="visually-hidden">{t('ws_modules_picker_options_aria')}</span>
              <select
                className="modules-picker__select modules-picker__select--options glow-input"
                value={optionsEffectId}
                aria-label={t('ws_modules_picker_options_aria')}
                onChange={(e) => setOptionsEffectId(e.target.value)}
              >
                <option value="">{t('ws_modules_picker_options')}</option>
                {section.rows.map((row) => {
                  const id = submoduleEffectId(row.label)
                  return (
                    <option key={id} value={id}>
                      {row.label}
                    </option>
                  )
                })}
              </select>
            </label>
          </div>

          {optionsEffectId !== '' && optionsRow != null ? (
            <div className="modules-picker__options-panel">
              <label className="modules-picker__field modules-picker__field--inline">
                <span className="modules-picker__field-label">
                  {t('ws_modules_picker_sub_effect_rarity')}
                </span>
                <select
                  className="modules-picker__select glow-input"
                  value={optionsRarity}
                  onChange={(e) => setOptionsRarity(e.target.value as WorkshopSubmoduleRarity)}
                >
                  {WORKSHOP_SUBMODULE_RARITIES.map((rarity) => {
                    const cell = optionsRow.cells[rarity]
                    if (cell == null) return null
                    return (
                      <option key={rarity} value={rarity}>
                        {t(SUB_RARITY_LABEL[rarity])} (
                        {formatSubmoduleCellDisplay(cell, optionsRow.label)})
                      </option>
                    )
                  })}
                </select>
              </label>
              <button
                type="button"
                className="glow-btn modules-picker__options-apply"
                onClick={assignOptionsEffect}
              >
                {t('ws_modules_picker_apply_effect')}
              </button>
            </div>
          ) : null}

          <ul className="modules-picker__effect-slots">
            {Array.from({ length: WORKSHOP_SUBMODULE_SLOT_COUNT }, (_, index) => {
              const unlockAt = WORKSHOP_SUBMODULE_SLOT_UNLOCK_LEVEL[index] ?? 1
              const rarityMax = workshopChassisModuleMaxLevel(pickerRarity)
              const blockedByRarity = unlockAt > rarityMax
              const unlocked = !blockedByRarity && moduleLevel >= unlockAt
              const entry = selectedSubmodules[index]
              return (
                <li
                  key={index}
                  className={[
                    'modules-picker__effect-slot',
                    unlocked ? '' : 'modules-picker__effect-slot--locked',
                    blockedByRarity ? 'modules-picker__effect-slot--rarity-cap' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {unlocked ? (
                    entry != null && entry.rarity != null ? (
                      <>
                        <span
                          className={[
                            'modules-picker__effect-tier',
                            WORKSHOP_SUBMODULE_RARITY_CLASS[entry.rarity],
                          ].join(' ')}
                        >
                          {t(SUB_RARITY_LABEL[entry.rarity])}
                        </span>
                        <span className="modules-picker__effect-text">
                          {entry.pickerText}
                        </span>
                        <button
                          type="button"
                          className="modules-picker__effect-clear"
                          aria-label={t('ws_modules_picker_clear_effect')}
                          onClick={() => {
                            const row = section.rows.find(
                              (r) => submoduleEffectId(r.label) === entry.effectId,
                            )
                            onSelectEffect(
                              entry.effectId,
                              entry.rarity,
                              row?.cells[entry.rarity] ?? null,
                            )
                          }}
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <span className="modules-picker__effect-empty">—</span>
                    )
                  ) : blockedByRarity ? (
                    <span className="modules-picker__effect-locked">
                      {t('ws_modules_submodule_locked_rarity_max')
                        .replace('{{level}}', String(unlockAt))
                        .replace('{{max}}', String(rarityMax))}
                    </span>
                  ) : (
                    <span className="modules-picker__effect-locked">
                      {t('ws_modules_submodule_unlocks_at')} {unlockAt}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        {equipped != null ? (
          <section className="modules-picker__section" aria-labelledby={`${titleId}-unique`}>
            <h3
              id={`${titleId}-unique`}
              className="modules-picker__section-title modules-picker__section-title--center"
            >
              {t('ws_modules_picker_unique_effect')}
            </h3>
            <p className="modules-picker__unique">
              <ModuleAbilityUniqueText
                text={formatWorkshopChassisModuleAbility(equipped, pickerRarity)}
              />
            </p>
          </section>
        ) : null}

        <div className="modules-picker__footer">
          <button type="button" className="glow-btn glow-btn--block" onClick={onClose}>
            {t('ws_modules_picker_done')}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
