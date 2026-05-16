import { WorkshopModulesPanel } from './WorkshopModulesPanel'
import type { WorkshopPersistedV1 } from '../labPresetsStorage'
import { useI18n } from '../i18n'
import type { ResearchData } from '../types/research'

type ModulesPageProps = {
  embeddedInPanel?: boolean
  workshopPersisted: WorkshopPersistedV1
  onWorkshopPersistedChange: (next: WorkshopPersistedV1) => void
  researchData: ResearchData | null
  labLevelOverrides: Record<string, number>
}

export function ModulesPage({
  embeddedInPanel = false,
  workshopPersisted,
  onWorkshopPersistedChange,
  researchData,
  labLevelOverrides,
}: ModulesPageProps) {
  const { t } = useI18n()

  return (
    <div
      className={embeddedInPanel ? 'workshop workshop--embedded' : 'workshop'}
      aria-label={t('ws_section_modules')}
    >
      <div className="workshop__section-head">
        <h2 className="workshop__section-title">{t('ws_section_modules')}</h2>
      </div>
      <WorkshopModulesPanel
        workshopPersisted={workshopPersisted}
        onWorkshopPersistedChange={onWorkshopPersistedChange}
        researchData={researchData}
        labLevelOverrides={labLevelOverrides}
      />
    </div>
  )
}
