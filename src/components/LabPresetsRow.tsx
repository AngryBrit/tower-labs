import type { ChangeEvent } from 'react'
import type { LabPreset } from '../labPresetsStorage'
import { useI18n } from '../i18n'

export type LabPresetsRowProps = {
  hydrated: boolean
  presets: LabPreset[]
  activePresetId: string | null
  onPresetSelect: (e: ChangeEvent<HTMLSelectElement>) => void
  onSaveAs: () => void
  onDeleteBuild: () => void
}

export function LabPresetsRow({
  hydrated,
  presets,
  activePresetId,
  onPresetSelect,
  onSaveAs,
  onDeleteBuild,
}: LabPresetsRowProps) {
  const { t } = useI18n()

  return (
    <div className="select-research__presets-row">
      <label
        className="select-research__presets-label"
        htmlFor="preset-select-field"
      >
        {t('sr_presets_build_label')}
      </label>
      <select
        id="preset-select-field"
        className="select-research__presets-select glow-input"
        value={activePresetId ?? ''}
        onChange={onPresetSelect}
        disabled={!hydrated}
        aria-label={t('sr_preset_select_aria')}
      >
        <option value="">{t('sr_preset_scratch_option')}</option>
        {presets.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="glow-btn glow-btn--block select-research__presets-btn"
        disabled={!hydrated}
        onClick={onSaveAs}
      >
        {t('sr_preset_save_as')}
      </button>
      <button
        type="button"
        className="glow-btn glow-btn--danger glow-btn--block select-research__presets-btn"
        disabled={!hydrated || !activePresetId}
        onClick={onDeleteBuild}
        aria-label={t('sr_preset_delete_aria')}
      >
        {t('sr_preset_delete_build')}
      </button>
    </div>
  )
}
