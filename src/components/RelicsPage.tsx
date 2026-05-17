import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import { createPortal } from 'react-dom'
import { WorkshopRelicsPanel } from './WorkshopRelicsPanel'
import {
  resetWorkshopRelics,
  type WorkshopPersistedV1,
} from '../labPresetsStorage'
import { useI18n } from '../i18n'

type RelicsPageProps = {
  embeddedInPanel?: boolean
  toolbarMount?: HTMLDivElement | null
  workshopPersisted: WorkshopPersistedV1
  onWorkshopPersistedChange: (next: WorkshopPersistedV1) => void
  onScratchWorkshopPersistedChange?: Dispatch<SetStateAction<WorkshopPersistedV1>>
}

function relicsOverlayPortal(node: ReactNode) {
  return createPortal(node, document.body)
}

function RelicsToolbarQuick({ onResetRelics }: { onResetRelics: () => void }) {
  const { t } = useI18n()
  return (
    <div className="select-research__toolbar-quick select-research__toolbar-quick--relics-only">
      <button
        type="button"
        className="glow-btn glow-btn--danger glow-btn--block"
        onClick={onResetRelics}
        aria-label={t('sr_reset_relics_aria')}
      >
        {t('sr_reset_relics')}
      </button>
    </div>
  )
}

export function RelicsPage({
  embeddedInPanel = false,
  toolbarMount = null,
  workshopPersisted,
  onWorkshopPersistedChange,
  onScratchWorkshopPersistedChange,
}: RelicsPageProps) {
  const { t } = useI18n()
  const [resetRelicsConfirmOpen, setResetRelicsConfirmOpen] = useState(false)
  const workshopPersistedRef = useRef(workshopPersisted)

  useEffect(() => {
    workshopPersistedRef.current = workshopPersisted
  }, [workshopPersisted])

  const openResetRelicsConfirm = useCallback(() => {
    setResetRelicsConfirmOpen(true)
  }, [])

  const performResetRelics = useCallback(() => {
    setResetRelicsConfirmOpen(false)
    onWorkshopPersistedChange(resetWorkshopRelics(workshopPersistedRef.current))
    onScratchWorkshopPersistedChange?.((prev) => resetWorkshopRelics(prev))
  }, [onScratchWorkshopPersistedChange, onWorkshopPersistedChange])

  useEffect(() => {
    if (!resetRelicsConfirmOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setResetRelicsConfirmOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [resetRelicsConfirmOpen])

  return (
    <div
      className={embeddedInPanel ? 'workshop workshop--embedded' : 'workshop'}
      aria-label={t('ws_section_relics')}
    >
      {embeddedInPanel && toolbarMount
        ? createPortal(
            <RelicsToolbarQuick onResetRelics={openResetRelicsConfirm} />,
            toolbarMount,
          )
        : null}

      <WorkshopRelicsPanel
        workshopPersisted={workshopPersisted}
        onWorkshopPersistedChange={onWorkshopPersistedChange}
      />

      {resetRelicsConfirmOpen
        ? relicsOverlayPortal(
            <div
              className="select-research__reset-confirm-backdrop"
              role="presentation"
              onClick={() => setResetRelicsConfirmOpen(false)}
            >
              <div
                className="select-research__reset-confirm-dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="reset-relics-confirm-title"
                aria-describedby="reset-relics-confirm-desc"
                onClick={(e) => e.stopPropagation()}
              >
                <h2
                  id="reset-relics-confirm-title"
                  className="select-research__reset-confirm-title"
                >
                  {t('sr_reset_relics_confirm_title')}
                </h2>
                <p
                  id="reset-relics-confirm-desc"
                  className="select-research__reset-confirm-desc"
                >
                  {t('sr_reset_relics_confirm_body')}
                </p>
                <div className="select-research__reset-confirm-actions">
                  <button
                    type="button"
                    className="glow-btn glow-btn--block"
                    onClick={() => setResetRelicsConfirmOpen(false)}
                  >
                    {t('sr_cancel')}
                  </button>
                  <button
                    type="button"
                    className="glow-btn glow-btn--danger glow-btn--block"
                    onClick={performResetRelics}
                  >
                    {t('sr_reset_relics')}
                  </button>
                </div>
              </div>
            </div>,
          )
        : null}
    </div>
  )
}
