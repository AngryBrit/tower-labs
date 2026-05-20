import { CellsGlyph } from './CellsGlyph'
import { useI18n } from '../i18n'
import type { StringId } from '../i18n/dictionary'
import { WORKSHOP_BOT_SPECIAL_UNLOCK_CELLS, type WorkshopBotId } from '../data/workshopBots'
import { formatPowerStoneAmount } from '../labCosts'

const SPECIAL_TITLE: Record<WorkshopBotId, StringId> = {
  flame: 'ws_bot_special_burningGround',
  thunder: 'ws_bot_special_titanShock',
  golden: 'ws_bot_special_bonusCells',
  amplify: 'ws_bot_special_echoingShot',
  botBot: 'ws_bot_special_maximumPower',
}

export type WorkshopBotSpecialCardProps = {
  botId: WorkshopBotId
  unlocked: boolean
  active: boolean
  onUnlock: (botId: WorkshopBotId) => void
}

export function WorkshopBotSpecialCard({
  botId,
  unlocked,
  active,
  onUnlock,
}: WorkshopBotSpecialCardProps) {
  const { t } = useI18n()
  const title = t(SPECIAL_TITLE[botId])
  const cells = WORKSHOP_BOT_SPECIAL_UNLOCK_CELLS

  if (unlocked) {
    return (
      <div className="workshop__uw-plus-bar workshop__uw-plus-bar--unlocked">
        <span className="workshop__uw-plus-name">{title}</span>
        <p className="workshop__uw-plus-meta">
          <span className="workshop__uw-plus-effect workshop__uw-plus-effect--unlocked">
            {t('ws_bot_special_unlocked')}
          </span>
        </p>
      </div>
    )
  }

  const barClass = 'workshop__uw-plus-bar workshop__uw-plus-bar--pending'

  const handleUnlock = () => {
    if (!active) return
    onUnlock(botId)
  }

  return (
    <div className={barClass}>
      <span className="workshop__uw-plus-name">{title}</span>
      <button
        type="button"
        className="workshop__uw-plus-unlock"
        disabled={!active}
        aria-label={`${title} — ${t('ws_bot_special_unlock_btn')}`}
        onClick={handleUnlock}
      >
        {t('ws_bot_special_unlock_btn')}
      </button>
      <button
        type="button"
        className="workshop__uw-plus-cost"
        disabled={!active}
        aria-label={`${title} — ${t('ws_bot_special_unlock_btn')} ${formatPowerStoneAmount(cells)}`}
        title={t('ws_bot_special_unlock_cost_title')}
        onClick={handleUnlock}
      >
        <span>{formatPowerStoneAmount(cells)}</span>
        <CellsGlyph className="workshop__uw-cells" />
      </button>
    </div>
  )
}
