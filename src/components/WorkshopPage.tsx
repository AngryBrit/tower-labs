import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useI18n } from '../i18n'
import type { StringId } from '../i18n/dictionary'

type WorkshopCategory = 'attack' | 'defense' | 'utility' | 'ultimate'

const SECTION_TITLE: Record<WorkshopCategory, StringId> = {
  attack: 'ws_section_attack',
  defense: 'ws_section_defense',
  utility: 'ws_section_utility',
  ultimate: 'ws_section_ultimate',
}

const CATEGORY_ARIA: Record<WorkshopCategory, StringId> = {
  attack: 'ws_cat_attack_aria',
  defense: 'ws_cat_defense_aria',
  utility: 'ws_cat_utility_aria',
  ultimate: 'ws_cat_ultimate_aria',
}

const BULK_MULTIPLIERS = [10, 5, 1] as const
type WorkshopMultiplier = (typeof BULK_MULTIPLIERS)[number]

const DEMO_ROWS: readonly {
  labelId: StringId
  value: string
  cost: string | null
  maxed: boolean
}[] = [
  { labelId: 'ws_stat_damage', value: '10.07B', cost: '2.84T', maxed: false },
  { labelId: 'ws_stat_attackSpeed', value: '38.11', cost: '1.12T', maxed: false },
  { labelId: 'ws_stat_critChance', value: '92.5%', cost: '890B', maxed: false },
  { labelId: 'ws_stat_critFactor', value: '24.2', cost: '5.01T', maxed: true },
  { labelId: 'ws_stat_attackRange', value: '156.0', cost: '12.4B', maxed: false },
  {
    labelId: 'ws_stat_damagePerMeter',
    value: '3.40M',
    cost: '4.20T',
    maxed: false,
  },
  { labelId: 'ws_stat_multishotChance', value: '18.0%', cost: null, maxed: true },
  { labelId: 'ws_stat_multishotTargets', value: '6', cost: '220B', maxed: false },
  {
    labelId: 'ws_stat_rapidFireChance',
    value: '12.5%',
    cost: '1.90T',
    maxed: false,
  },
  {
    labelId: 'ws_stat_rapidFireDuration',
    value: '4.2s',
    cost: '780B',
    maxed: false,
  },
  {
    labelId: 'ws_stat_bounceChance',
    value: '8.0%',
    cost: '3.10T',
    maxed: false,
  },
  {
    labelId: 'ws_stat_bounceTargets',
    value: '4',
    cost: '450B',
    maxed: false,
  },
]

function WorkshopDemoToolbar({
  hideMaxed,
  setHideMaxed,
  onResetDemo,
}: {
  hideMaxed: boolean
  setHideMaxed: (v: boolean) => void
  onResetDemo: () => void
}) {
  const { t } = useI18n()
  return (
    <div className="select-research__toolbar-quick">
      <label className="glow-btn glow-btn--toggle">
        <input
          type="checkbox"
          checked={hideMaxed}
          onChange={(e) => setHideMaxed(e.target.checked)}
        />
        {t('sr_hide_completed')}
      </label>
      <button
        type="button"
        className="glow-btn glow-btn--danger glow-btn--block"
        onClick={onResetDemo}
      >
        {t('ws_reset_demo')}
      </button>
    </div>
  )
}

function CoinGlyph({ className }: { className?: string }) {
  return (
    <span className={className} aria-hidden>
      <svg viewBox="0 0 20 20" width="16" height="16" className="workshop-coin-svg">
        <circle cx="10" cy="10" r="8.5" fill="#ca8a04" stroke="#facc15" strokeWidth="1.2" />
        <text
          x="10"
          y="13.5"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill="#422006"
        >
          C
        </text>
      </svg>
    </span>
  )
}

type WorkshopPageProps = {
  embeddedInPanel?: boolean
  /** In-panel: mount node between app tabs and workshop panel (shared chrome). */
  toolbarMount?: HTMLElement | null
}

export function WorkshopPage({
  embeddedInPanel = false,
  toolbarMount = null,
}: WorkshopPageProps) {
  const { t } = useI18n()
  const headingId = useId()
  const [mainTab, setMainTab] = useState<'upgrade' | 'enhance'>('upgrade')
  const [category, setCategory] = useState<WorkshopCategory>('attack')
  const [multiplierOpen, setMultiplierOpen] = useState(false)
  const [multiplier, setMultiplier] = useState<WorkshopMultiplier>(10)
  const [hideMaxed, setHideMaxed] = useState(false)
  const multRailRef = useRef<HTMLDivElement>(null)

  const sectionTitleId = SECTION_TITLE[category]

  const visibleDemoRows = useMemo(
    () => (hideMaxed ? DEMO_ROWS.filter((r) => !r.maxed) : [...DEMO_ROWS]),
    [hideMaxed],
  )

  const resetWorkshopDemo = useCallback(() => {
    setHideMaxed(false)
    setMultiplier(10)
    setCategory('attack')
    setMainTab('upgrade')
    setMultiplierOpen(false)
  }, [])

  useEffect(() => {
    if (!multiplierOpen) return
    const onPointerDown = (e: PointerEvent) => {
      const el = multRailRef.current
      if (el && !el.contains(e.target as Node)) setMultiplierOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMultiplierOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [multiplierOpen])

  return (
    <div
      className={
        embeddedInPanel
          ? 'workshop workshop--embedded'
          : 'workshop'
      }
      aria-labelledby={embeddedInPanel ? undefined : headingId}
      aria-label={embeddedInPanel ? t('ws_title') : undefined}
    >
      {!embeddedInPanel ? (
        <header className="workshop__header">
          <div className="workshop__title-row">
            <h1 id={headingId} className="workshop__title">
              {t('ws_title').toLocaleUpperCase()}
            </h1>
          </div>
        </header>
      ) : null}

      {embeddedInPanel && toolbarMount
        ? createPortal(
            <WorkshopDemoToolbar
              hideMaxed={hideMaxed}
              setHideMaxed={setHideMaxed}
              onResetDemo={resetWorkshopDemo}
            />,
            toolbarMount,
          )
        : null}

      {!embeddedInPanel ? (
        <div className="workshop__demo-toolbar">
          <WorkshopDemoToolbar
            hideMaxed={hideMaxed}
            setHideMaxed={setHideMaxed}
            onResetDemo={resetWorkshopDemo}
          />
        </div>
      ) : null}

      <div className="workshop__tabs" role="tablist" aria-label={t('ws_title')}>
        <button
          type="button"
          role="tab"
          aria-selected={mainTab === 'upgrade'}
          className={
            mainTab === 'upgrade' ? 'workshop__tab workshop__tab--on' : 'workshop__tab'
          }
          onClick={() => setMainTab('upgrade')}
        >
          {t('ws_tab_upgrade')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mainTab === 'enhance'}
          className={
            mainTab === 'enhance' ? 'workshop__tab workshop__tab--on' : 'workshop__tab'
          }
          onClick={() => setMainTab('enhance')}
        >
          {t('ws_tab_enhance')}
        </button>
      </div>

      <div className="workshop__body">
      {mainTab === 'enhance' ? (
        <div className="workshop__enhance-placeholder">
          <p>{t('ws_enhance_empty')}</p>
          <p className="workshop__footnote">{t('ws_disclaimer')}</p>
        </div>
      ) : (
        <>
          <div className="workshop__section-head">
            <h2 className="workshop__section-title">{t(sectionTitleId)}</h2>
            <div
              ref={multRailRef}
              className={
                multiplierOpen ? 'workshop__mult workshop__mult--open' : 'workshop__mult'
              }
            >
              <div
                className="workshop__mult-rail"
                role="group"
                aria-label={t('ws_multiplier_group_aria')}
              >
                <div className="workshop__mult-track">
                  <div className="workshop__mult-opts" aria-hidden={!multiplierOpen}>
                    {BULK_MULTIPLIERS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={
                          multiplier === m
                            ? 'workshop__mult-chip workshop__mult-chip--selected'
                            : 'workshop__mult-chip'
                        }
                        tabIndex={multiplierOpen ? 0 : -1}
                        aria-pressed={multiplier === m}
                        onClick={() => {
                          setMultiplier(m)
                          setMultiplierOpen(false)
                        }}
                      >
                        ×{m}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="workshop__mult-anchor"
                    aria-expanded={multiplierOpen}
                    aria-label={
                      multiplierOpen
                        ? t('ws_multiplier_toggle_collapse')
                        : t('ws_multiplier_toggle_expand')
                    }
                    onClick={() => setMultiplierOpen((o) => !o)}
                  >
                    ×{multiplier}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ul className="workshop__grid">
            {visibleDemoRows.map((row) => (
              <li
                key={row.labelId}
                className={
                  row.maxed
                    ? 'workshop__card workshop__card--max'
                    : 'workshop__card workshop__card--active'
                }
              >
                <span className="workshop__card-name">{t(row.labelId)}</span>
                <div className="workshop__card-tr">
                  <span className="workshop__card-value">{row.value}</span>
                </div>
                <div className="workshop__card-br">
                  {row.maxed || row.cost === null ? (
                    <span className="workshop__card-cost workshop__card-cost--max">
                      <CoinGlyph className="workshop__card-coin" />
                      {t('ws_max')}
                    </span>
                  ) : (
                    <span className="workshop__card-cost">
                      <CoinGlyph className="workshop__card-coin" />
                      {row.cost}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <p className="workshop__footnote">{t('ws_disclaimer')}</p>
        </>
      )}
      </div>

      <div className="workshop__categories" role="toolbar" aria-label={t('ws_title')}>
        {(
          [
            [
              'attack',
              'M11 3h2v9l4 10h-2.2L12 14.2 9.2 22H7l4-10V3z',
            ] as const,
            [
              'defense',
              'M12 3 L19 5.5 V12 C19 16 15.5 19.2 12 21 C8.5 19.2 5 16 5 12 V5.5 Z',
            ] as const,
            [
              'utility',
              'M12 4 L14.5 10.5 L21 11 L16 15 L17.5 21.5 L12 18 L6.5 21.5 L8 15 L3 11 L9.5 10.5 Z',
            ] as const,
            [
              'ultimate',
              'M12 5.5 L18.5 18.5 H5.5 Z M12 9 v5.5 M9.25 12.25 h5.5',
            ] as const,
          ] as const
        ).map(([key, d]) => (
          <button
            key={key}
            type="button"
            className={
              category === key
                ? `workshop__cat workshop__cat--${key}`
                : `workshop__cat workshop__cat--idle workshop__cat--${key}`
            }
            onClick={() => setCategory(key)}
            aria-label={t(CATEGORY_ARIA[key])}
            aria-pressed={category === key}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
              <path
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
