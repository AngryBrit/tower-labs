import type { RefObject } from 'react'
import type { SelectResearchHandle } from './SelectResearch'
import { SettingsPage } from './SettingsPage'
import { ToolsPage } from './ToolsPage'
import { useI18n } from '../i18n'

type ToolsSettingsPageProps = {
  labToolsRef: RefObject<SelectResearchHandle | null>
}

export function ToolsSettingsPage({ labToolsRef }: ToolsSettingsPageProps) {
  const { t } = useI18n()

  return (
    <div
      className="tools-settings-page"
      role="region"
      aria-label={t('app_nav_tools_settings')}
    >
      <ToolsPage labToolsRef={labToolsRef} />
      <hr className="tools-settings-page__divider" aria-hidden />
      <SettingsPage />
    </div>
  )
}
