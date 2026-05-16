import { useCallback, useMemo } from 'react'
import {
  WORKSHOP_ASSIST_MODULE_SLOTS,
  workshopAssistModuleLabPercentPoints,
  workshopCannonModulePercentFromLabs,
  type WorkshopAssistModuleSlot,
} from '../data/workshopSimModules'
import type { WorkshopPersistedV1 } from '../labPresetsStorage'
import { useI18n } from '../i18n'
import type { StringId } from '../i18n/dictionary'
import type { ResearchData } from '../types/research'

const SLOT_LABEL: Record<WorkshopAssistModuleSlot, StringId> = {
  cannon: 'ws_sim_module_cannon',
  armor: 'ws_sim_module_armor',
  generator: 'ws_sim_module_generator',
  core: 'ws_sim_module_core',
}

type WorkshopModulesPanelProps = {
  workshopPersisted: WorkshopPersistedV1
  onWorkshopPersistedChange: (next: WorkshopPersistedV1) => void
  researchData: ResearchData | null
  labLevelOverrides: Record<string, number>
}

export function WorkshopModulesPanel({
  workshopPersisted,
  onWorkshopPersistedChange,
  researchData,
  labLevelOverrides,
}: WorkshopModulesPanelProps) {
  const { t } = useI18n()
  const slot = workshopPersisted.simAssistModuleSlot

  const labPercents = useMemo(() => {
    if (researchData == null) {
      return { substatsPercent: 0, bonusPercent: 0, totalPercent: 0 }
    }
    return workshopAssistModuleLabPercentPoints(researchData, labLevelOverrides, slot)
  }, [researchData, labLevelOverrides, slot])

  const cannonDecimal = useMemo(() => {
    if (researchData == null) return 0
    return workshopCannonModulePercentFromLabs(researchData, labLevelOverrides, slot)
  }, [researchData, labLevelOverrides, slot])

  const selectSlot = useCallback(
    (next: WorkshopAssistModuleSlot) => {
      onWorkshopPersistedChange({ ...workshopPersisted, simAssistModuleSlot: next })
    },
    [onWorkshopPersistedChange, workshopPersisted],
  )

  return (
    <>
      <div
        className="workshop__categories workshop__categories--modules"
        role="toolbar"
        aria-label={t('ws_section_modules')}
      >
        {WORKSHOP_ASSIST_MODULE_SLOTS.map((key) => (
          <button
            key={key}
            type="button"
            className={
              slot === key
                ? `workshop__cat workshop__cat--${key} workshop__cat--module-on`
                : `workshop__cat workshop__cat--idle workshop__cat--${key} workshop__cat--module`
            }
            onClick={() => selectSlot(key)}
            aria-pressed={slot === key}
          >
            {t(SLOT_LABEL[key])}
          </button>
        ))}
      </div>
      <ul className="workshop__grid workshop__grid--sim">
        <li className="workshop__card workshop__card--active workshop__card--sim workshop__card--sim-wide">
          <div className="workshop__card-damage-head">
            <span className="workshop__card-name">{t('ws_sim_module_lab_substats')}</span>
            <span className="workshop__card-value">+{labPercents.substatsPercent}%</span>
          </div>
          <p className="workshop__sim-foot">{t('ws_sim_module_substats_hint')}</p>
        </li>
        <li className="workshop__card workshop__card--active workshop__card--sim workshop__card--sim-wide">
          <div className="workshop__card-damage-head">
            <span className="workshop__card-name">{t('ws_sim_module_lab_bonus')}</span>
            <span className="workshop__card-value">+{labPercents.bonusPercent}%</span>
          </div>
          <p className="workshop__sim-foot">{t('ws_sim_module_bonus_hint')}</p>
        </li>
        <li className="workshop__card workshop__card--active workshop__card--sim workshop__card--sim-wide">
          <div className="workshop__card-damage-head">
            <span className="workshop__card-name">{t('ws_sim_module_cannon_damage')}</span>
            <span className="workshop__card-value">
              {slot === 'cannon'
                ? `+${(cannonDecimal * 100).toFixed(0)}%`
                : t('ws_sim_module_not_cannon')}
            </span>
          </div>
          <p className="workshop__sim-foot">{t('ws_sim_module_cannon_hint')}</p>
        </li>
      </ul>
    </>
  )
}
