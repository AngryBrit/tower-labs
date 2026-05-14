import type { RefObject } from 'react'
import type { SelectResearchHandle } from './SelectResearch'
import { useI18n } from '../i18n'

type ToolsPageProps = {
  labToolsRef: RefObject<SelectResearchHandle | null>
}

export function ToolsPage({ labToolsRef }: ToolsPageProps) {
  const { t } = useI18n()

  return (
    <div className="tools-page" role="region" aria-label={t('app_tools_title')}>
      <p className="tools-page__intro">{t('app_tools_intro')}</p>
      <div className="tools-page__actions">
        <button
          type="button"
          className="glow-btn glow-btn--block"
          onClick={() => labToolsRef.current?.openLabDataPanel()}
        >
          {t('sr_import_export_launcher')}
        </button>
        <button
          type="button"
          className="glow-btn glow-btn--block"
          onClick={() => labToolsRef.current?.openCompareDialog()}
        >
          {t('sr_compare_launcher')}
        </button>
      </div>
      <p className="tools-page__hint">{t('app_tools_lab_hint')}</p>
    </div>
  )
}
