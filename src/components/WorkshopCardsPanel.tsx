import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  WORKSHOP_ATTACK_SPEED_CARD_MAX_STARS,
  WORKSHOP_BERSERKER_CARD_MAX_STARS,
  WORKSHOP_DAMAGE_CARD_MAX_STARS,
  workshopAttackSpeedCardMultiplier,
  workshopBerserkerCardPercent,
  workshopDamageCardMultiplier,
} from '../data/workshopSimCards'
import { formatCoinAbbrev } from '../labCosts'
import type { WorkshopPersistedV1 } from '../labPresetsStorage'
import { useI18n } from '../i18n'
import type { StringId } from '../i18n/dictionary'

type WorkshopCardsPanelProps = {
  workshopPersisted: WorkshopPersistedV1
  onWorkshopPersistedChange: (next: WorkshopPersistedV1) => void
}

function clampStars(n: number, max: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(max, Math.trunc(n)))
}

function WorkshopSimStarsCard({
  labelId,
  stars,
  maxStars,
  valueHint,
  onBump,
  onCommit,
}: {
  labelId: StringId
  stars: number
  maxStars: number
  valueHint: string
  onBump: (dir: -1 | 1) => void
  onCommit: (parsed: number) => void
}) {
  const { t } = useI18n()
  const [draft, setDraft] = useState(String(stars))

  useEffect(() => {
    setDraft(String(stars))
  }, [stars])

  const commit = () => {
    const raw = draft.trim().replace(/,/g, '')
    if (raw === '') {
      setDraft(String(stars))
      return
    }
    const n = Number(raw)
    if (!Number.isFinite(n)) {
      setDraft(String(stars))
      return
    }
    onCommit(clampStars(n, maxStars))
  }

  return (
    <li className="workshop__card workshop__card--active workshop__card--sim">
      <div className="workshop__card-damage-head">
        <span className="workshop__card-name">{t(labelId)}</span>
        <span className="workshop__card-value">{valueHint}</span>
      </div>
      <div className="workshop__card-level-row">
        <button
          type="button"
          className="workshop__level-step"
          aria-label={t('ws_sim_stars_down_aria')}
          disabled={stars <= 0}
          onClick={() => onBump(-1)}
        >
          −
        </button>
        <div className="workshop__level-field">
          <input
            className="workshop__level-input"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            aria-label={t('ws_sim_stars_input_aria')}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                commit()
                ;(e.target as HTMLInputElement).blur()
              }
            }}
          />
        </div>
        <button
          type="button"
          className="workshop__level-step"
          aria-label={t('ws_sim_stars_up_aria')}
          disabled={stars >= maxStars}
          onClick={() => onBump(1)}
        >
          +
        </button>
      </div>
      <p className="workshop__sim-foot">
        {t('ws_sim_stars_max')} {maxStars}
      </p>
    </li>
  )
}

function WorkshopSimNumberCard({
  labelId,
  value,
  hintId,
  formatValue,
  onCommit,
}: {
  labelId: StringId
  value: number
  hintId: StringId
  formatValue: (n: number) => string
  onCommit: (n: number) => void
}) {
  const { t } = useI18n()
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
    onCommit(Math.max(0, n))
  }

  return (
    <li className="workshop__card workshop__card--active workshop__card--sim">
      <div className="workshop__card-damage-head">
        <span className="workshop__card-name">{t(labelId)}</span>
        <span className="workshop__card-value">{formatValue(value)}</span>
      </div>
      <div className="workshop__card-level-row workshop__card-level-row--solo">
        <div className="workshop__level-field workshop__level-field--wide">
          <input
            className="workshop__level-input"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            aria-label={t('ws_sim_number_input_aria')}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                commit()
                ;(e.target as HTMLInputElement).blur()
              }
            }}
          />
        </div>
      </div>
      <p className="workshop__sim-foot">{t(hintId)}</p>
    </li>
  )
}

export function WorkshopCardsPanel({
  workshopPersisted,
  onWorkshopPersistedChange,
}: WorkshopCardsPanelProps) {
  const patch = useCallback(
    (partial: Partial<WorkshopPersistedV1>) => {
      onWorkshopPersistedChange({ ...workshopPersisted, ...partial })
    },
    [onWorkshopPersistedChange, workshopPersisted],
  )

  const damageMult = useMemo(
    () => workshopDamageCardMultiplier(workshopPersisted.simDamageCardStars),
    [workshopPersisted.simDamageCardStars],
  )
  const attackSpeedMult = useMemo(
    () => workshopAttackSpeedCardMultiplier(workshopPersisted.simAttackSpeedCardStars),
    [workshopPersisted.simAttackSpeedCardStars],
  )
  const berserkerPct = useMemo(
    () => workshopBerserkerCardPercent(workshopPersisted.simBerserkerCardStars),
    [workshopPersisted.simBerserkerCardStars],
  )

  return (
    <ul className="workshop__grid workshop__grid--sim">
      <WorkshopSimStarsCard
        labelId="ws_sim_damage_card"
        stars={workshopPersisted.simDamageCardStars}
        maxStars={WORKSHOP_DAMAGE_CARD_MAX_STARS}
        valueHint={`×${damageMult.toFixed(2)}`}
        onBump={(dir) =>
          patch({
            simDamageCardStars: clampStars(
              workshopPersisted.simDamageCardStars + dir,
              WORKSHOP_DAMAGE_CARD_MAX_STARS,
            ),
          })
        }
        onCommit={(n) => patch({ simDamageCardStars: n })}
      />
      <WorkshopSimStarsCard
        labelId="ws_sim_attack_speed_card"
        stars={workshopPersisted.simAttackSpeedCardStars}
        maxStars={WORKSHOP_ATTACK_SPEED_CARD_MAX_STARS}
        valueHint={`×${attackSpeedMult.toFixed(2)}`}
        onBump={(dir) =>
          patch({
            simAttackSpeedCardStars: clampStars(
              workshopPersisted.simAttackSpeedCardStars + dir,
              WORKSHOP_ATTACK_SPEED_CARD_MAX_STARS,
            ),
          })
        }
        onCommit={(n) => patch({ simAttackSpeedCardStars: n })}
      />
      <WorkshopSimNumberCard
        labelId="ws_sim_attack_speed_sub_effect"
        value={workshopPersisted.simAttackSpeedModuleSubEffect}
        hintId="ws_sim_attack_speed_sub_hint"
        formatValue={(n) => `+${n.toFixed(2)}`}
        onCommit={(n) => patch({ simAttackSpeedModuleSubEffect: Math.max(0, n) })}
      />
      <WorkshopSimStarsCard
        labelId="ws_sim_berserker_card"
        stars={workshopPersisted.simBerserkerCardStars}
        maxStars={WORKSHOP_BERSERKER_CARD_MAX_STARS}
        valueHint={`${(berserkerPct * 100).toFixed(1)}%`}
        onBump={(dir) =>
          patch({
            simBerserkerCardStars: clampStars(
              workshopPersisted.simBerserkerCardStars + dir,
              WORKSHOP_BERSERKER_CARD_MAX_STARS,
            ),
          })
        }
        onCommit={(n) => patch({ simBerserkerCardStars: n })}
      />
      <WorkshopSimNumberCard
        labelId="ws_sim_relics_bonus"
        value={workshopPersisted.simRelicsBonusFraction * 100}
        hintId="ws_sim_relics_hint"
        formatValue={(n) => `+${n.toFixed(1)}%`}
        onCommit={(n) => patch({ simRelicsBonusFraction: n / 100 })}
      />
      <WorkshopSimNumberCard
        labelId="ws_sim_perk_damage_quantity"
        value={workshopPersisted.simPerkDamageQuantity}
        hintId="ws_sim_perk_quantity_hint"
        formatValue={(n) => String(Math.trunc(n))}
        onCommit={(n) => patch({ simPerkDamageQuantity: Math.trunc(n) })}
      />
      <WorkshopSimNumberCard
        labelId="ws_sim_berserker_damage_taken"
        value={workshopPersisted.simBerserkerDamageTaken}
        hintId="ws_sim_berserker_taken_hint"
        formatValue={(n) => formatCoinAbbrev(n)}
        onCommit={(n) => patch({ simBerserkerDamageTaken: n })}
      />
    </ul>
  )
}
