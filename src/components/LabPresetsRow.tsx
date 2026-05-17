import { useEffect, useState, type ChangeEvent } from 'react'
import type { LabPreset } from '../labPresetsStorage'
import { useI18n } from '../i18n'

export type LabPresetsRowProps = {
  hydrated: boolean
  presets: LabPreset[]
  activePresetId: string | null
  onPresetSelect: (e: ChangeEvent<HTMLSelectElement>) => void
  onSaveAs: () => void
  /** Resolves true when the share URL was copied to the clipboard. */
  onCopyShareLink: () => Promise<boolean>
  onDeleteBuild: () => void
}

export function LabPresetsRow({
  hydrated,
  presets,
  activePresetId,
  onPresetSelect,
  onSaveAs,
  onCopyShareLink,
  onDeleteBuild,
}: LabPresetsRowProps) {
  const { t } = useI18n()
  const [copyNotice, setCopyNotice] = useState<string | null>(null)

  useEffect(() => {
    if (!copyNotice) return
    const timer = window.setTimeout(() => setCopyNotice(null), 5000)
    return () => window.clearTimeout(timer)
  }, [copyNotice])

  const handleCopyShareLink = () => {
    void (async () => {
      const ok = await onCopyShareLink()
      setCopyNotice(t(ok ? 'sr_notice_copy_build_ok' : 'sr_notice_copy_build_fail'))
    })()
  }

  return (
    <div className="select-research__presets-wrap">
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
          className="glow-btn glow-btn--block select-research__presets-btn"
          disabled={!hydrated}
          onClick={handleCopyShareLink}
          aria-label={t('sr_preset_share_link_aria')}
          aria-describedby={copyNotice ? 'preset-copy-notice' : undefined}
        >
          {t('sr_preset_share_link')}
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
      {copyNotice ? (
        <p
          id="preset-copy-notice"
          className="select-research__presets-notice"
          role="status"
          aria-live="polite"
        >
          {copyNotice}
        </p>
      ) : null}
    </div>
  )
}
