import { useEffect, useState } from 'react'
import {
  benefitLineWithNextUpgrade,
  isCardMasteryResearchItem,
  marginalCostForNextUpgrade,
  researchTimeForNextUpgrade,
  type ResearchItem,
} from '../types/research'

interface ResearchCardProps {
  item: ResearchItem
  hidden: boolean
  effectiveLevel: number
  maxLevelCap: number
  /** Total Labs Coin Discount % (simulated Labs Coin Discount lab). */
  labsCoinDiscountPercent: number
  onLevelDelta: (delta: number) => void
  onLevelSet: (level: number) => void
}

export function ResearchCard({
  item,
  hidden,
  effectiveLevel,
  maxLevelCap,
  labsCoinDiscountPercent,
  onLevelDelta,
  onLevelSet,
}: ResearchCardProps) {
  const [levelFocused, setLevelFocused] = useState(false)
  const [levelDraft, setLevelDraft] = useState(String(effectiveLevel))

  useEffect(() => {
    if (!levelFocused) {
      setLevelDraft(String(effectiveLevel))
    }
  }, [effectiveLevel, levelFocused])

  const researching = item.state === 'researching'
  const showMaxStyle = maxLevelCap > 0 && effectiveLevel >= maxLevelCap
  const canDec = effectiveLevel > 0
  const canInc = maxLevelCap > 0 && effectiveLevel < maxLevelCap

  const nextCost = marginalCostForNextUpgrade(
    item,
    effectiveLevel,
    maxLevelCap,
    labsCoinDiscountPercent,
  )
  const costIsMax = nextCost === 'Max'
  const costUnknown = nextCost === '—'

  const benefitDisplay = benefitLineWithNextUpgrade(
    item,
    effectiveLevel,
    maxLevelCap,
  )
  const timeDisplay = researchTimeForNextUpgrade(
    item,
    effectiveLevel,
    maxLevelCap,
  )

  function commitLevelDraft(raw: string) {
    const t = raw.trim()
    if (t === '') {
      setLevelDraft(String(effectiveLevel))
      return
    }
    const n = Number.parseInt(t, 10)
    if (!Number.isFinite(n)) {
      setLevelDraft(String(effectiveLevel))
      return
    }
    onLevelSet(n)
  }

  const stoneCost = isCardMasteryResearchItem(item)

  return (
    <article
      className={[
        'research-card',
        showMaxStyle ? 'research-card--max' : '',
        researching ? 'research-card--researching' : '',
        hidden ? 'research-card--hidden' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-testid="research-card"
    >
      <div className="research-card__title">{item.name}</div>
      <div className="research-card__levelRow">
        <button
          type="button"
          className="research-card__step"
          aria-label="Decrease level"
          disabled={!canDec}
          onClick={() => onLevelDelta(-1)}
        >
          −
        </button>
        <input
          type="number"
          className="research-card__level research-card__levelInput"
          aria-label={`${item.name} level`}
          title={maxLevelCap > 0 ? `Level 0–${maxLevelCap}` : undefined}
          min={0}
          max={maxLevelCap > 0 ? maxLevelCap : undefined}
          step={1}
          value={levelFocused ? levelDraft : String(effectiveLevel)}
          onFocus={() => {
            setLevelFocused(true)
            setLevelDraft(String(effectiveLevel))
          }}
          onChange={(e) => setLevelDraft(e.target.value)}
          onBlur={() => {
            setLevelFocused(false)
            commitLevelDraft(levelDraft)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur()
            }
          }}
        />
        <button
          type="button"
          className="research-card__step"
          aria-label="Increase level"
          disabled={!canInc}
          onClick={() => onLevelDelta(1)}
        >
          +
        </button>
      </div>
      <div className="research-card__benefit">{benefitDisplay}</div>
      {researching ? (
        <div className="research-card__overlay" aria-live="polite">
          Researching...
        </div>
      ) : null}
      <div className="research-card__footer">
        <span
          className={
            researching
              ? 'research-card__time research-card__time--active'
              : 'research-card__time'
          }
        >
          {timeDisplay}
        </span>
        <div className="research-card__costCol">
          {costIsMax ? (
            <span className="research-card__cost research-card__cost--text">
              Max
            </span>
          ) : costUnknown ? (
            <span
              className="research-card__cost research-card__cost--unknown"
              title="Not on this CSV row. Set Level in the Lab Calculator sheet to match, export CSV, and run import so cost reflects that level."
            >
              —
            </span>
          ) : (
            <span
              className="research-card__cost"
              title={stoneCost ? 'Stones (wiki unlock cost)' : 'Coins (next upgrade)'}
            >
              {nextCost}
              <img
                className="research-card__costIcon"
                src={stoneCost ? '/power-stone.png' : '/coin.png'}
                alt=""
                width={16}
                height={16}
                decoding="async"
                aria-hidden
              />
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
