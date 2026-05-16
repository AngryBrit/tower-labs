import { WorkshopCardsPanel } from './WorkshopCardsPanel'
import type { WorkshopPersistedV1 } from '../labPresetsStorage'
import { useI18n } from '../i18n'

type CardsPageProps = {
  embeddedInPanel?: boolean
  workshopPersisted: WorkshopPersistedV1
  onWorkshopPersistedChange: (next: WorkshopPersistedV1) => void
}

export function CardsPage({
  embeddedInPanel = false,
  workshopPersisted,
  onWorkshopPersistedChange,
}: CardsPageProps) {
  const { t } = useI18n()

  return (
    <div
      className={embeddedInPanel ? 'workshop workshop--embedded' : 'workshop'}
      aria-label={t('ws_section_cards')}
    >
      <div className="workshop__section-head">
        <h2 className="workshop__section-title">{t('ws_section_cards')}</h2>
      </div>
      <WorkshopCardsPanel
        workshopPersisted={workshopPersisted}
        onWorkshopPersistedChange={onWorkshopPersistedChange}
      />
    </div>
  )
}
