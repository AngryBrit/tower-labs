import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import {
  THEME_CATEGORIES,
  themeUnlockLabel,
  themesForCategory,
  backgroundThemesByGroup,
  towerThemesByGroup,
  type GameThemeEntry,
  type ThemeCategory,
} from '../data/gameThemes'
import { useI18n } from '../i18n'
import type { StringId } from '../i18n/dictionary'
import {
  THEME_COIN_BONUS_CATEGORIES,
  THEME_COIN_BONUS_PERCENT,
  computeThemeCoinBonusMultiplier,
  countOwnedThemesForCoinBonus,
  formatThemeCoinBonusMultiplier,
  formatThemeCoinBonusPercentAboveBase,
  type ThemeCoinBonusCategory,
} from '../themeCoinBonus'
import { useBudgetPanelsVisible } from '../budgetPanelsVisibility'
import { resetAllThemes } from '../resetThemes'
import { isThemeOwned, useThemeOwned } from '../themeOwnedStorage'
import { useThemeSelection } from '../themeSelectionStorage'
import { ThemeIcon } from './ThemeIcon'

const THEMES_COIN_BONUS_COLLAPSED_STORAGE_KEY = 'tower-export-themes-coin-bonus-collapsed-v1'

type ThemesPageProps = {
  embeddedInPanel?: boolean
  toolbarMount?: HTMLDivElement | null
}

function themesOverlayPortal(node: ReactNode) {
  return createPortal(node, document.body)
}

function ThemesToolbarQuick({ onResetThemes }: { onResetThemes: () => void }) {
  const { t } = useI18n()
  return (
    <div className="select-research__toolbar-quick select-research__toolbar-quick--themes-only">
      <button
        type="button"
        className="glow-btn glow-btn--danger glow-btn--block"
        onClick={onResetThemes}
        aria-label={t('themes_reset_aria')}
      >
        {t('themes_reset')}
      </button>
    </div>
  )
}

const TAB_LABEL_IDS: Record<ThemeCategory, StringId> = {
  tower: 'themes_tab_tower',
  background: 'themes_tab_background',
  music: 'themes_tab_music',
  menus: 'themes_tab_menus',
  banners: 'themes_tab_banners',
  guardian: 'themes_tab_guardian',
}

const COIN_TAB_LABEL_IDS: Record<ThemeCoinBonusCategory, StringId> = {
  tower: 'themes_tab_tower',
  background: 'themes_tab_background',
  music: 'themes_tab_music',
  menus: 'themes_tab_menus',
  banners: 'themes_tab_banners',
  guardian: 'themes_tab_guardian',
}

function withParams(
  template: string,
  params: Record<string, string | number>,
): string {
  let out = template
  for (const [key, value] of Object.entries(params)) {
    out = out.split(`{{${key}}}`).join(String(value))
  }
  return out
}

function themeCardAriaLabel(
  t: (id: StringId) => string,
  theme: GameThemeEntry,
): string {
  const name = t(theme.nameId)
  if (theme.milestoneTier != null) {
    const unlock = themeUnlockLabel(t, theme) ?? ''
    return withParams(t('themes_card_aria_milestone'), {
      name,
      tier: theme.milestoneTier,
      unlock,
    })
  }
  if (theme.eventNameId != null) {
    return withParams(t('themes_card_aria_event'), {
      name,
      event: t(theme.eventNameId),
    })
  }
  if (theme.guildSeason != null) {
    return withParams(t('themes_card_aria_guild'), {
      name,
      season: theme.guildSeason,
    })
  }
  return name
}

function themeCardMeta(
  t: (id: StringId) => string,
  theme: GameThemeEntry,
): ReactNode {
  if (theme.milestoneTier != null) {
    return (
      <span className="themes-page__card-meta">
        {withParams(t('themes_milestone_tier'), { tier: theme.milestoneTier })}
        {themeUnlockLabel(t, theme) ? (
          <>
            {' · '}
            <span className="themes-page__card-unlock">{themeUnlockLabel(t, theme)}</span>
          </>
        ) : null}
      </span>
    )
  }
  if (theme.eventNameId != null) {
    return <span className="themes-page__card-meta">{t(theme.eventNameId)}</span>
  }
  if (theme.guildSeason != null) {
    return (
      <span className="themes-page__card-meta">
        {withParams(t('themes_guild_season'), { season: theme.guildSeason })}
      </span>
    )
  }
  return null
}

function tabPassivePercent(category: ThemeCategory): number | undefined {
  if (category in THEME_COIN_BONUS_PERCENT) {
    return THEME_COIN_BONUS_PERCENT[category as ThemeCoinBonusCategory]
  }
  return undefined
}

export function ThemesPage({
  embeddedInPanel = false,
  toolbarMount = null,
}: ThemesPageProps) {
  const { t } = useI18n()
  const [budgetPanelsVisible] = useBudgetPanelsVisible()
  const coinBonusBodyId = useId().replace(/:/g, '')
  const [resetThemesConfirmOpen, setResetThemesConfirmOpen] = useState(false)
  const [coinBonusCollapsed, setCoinBonusCollapsed] = useState(() => {
    try {
      return localStorage.getItem(THEMES_COIN_BONUS_COLLAPSED_STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })
  const [activeCategory, setActiveCategory] = useState<ThemeCategory>('tower')
  const [selection, selectTheme] = useThemeSelection()
  const [ownedIds, setThemeOwned] = useThemeOwned()
  const items = themesForCategory(activeCategory)
  const towerGroups = useMemo(() => towerThemesByGroup(), [])
  const backgroundGroups = useMemo(() => backgroundThemesByGroup(), [])
  const selectedId = selection[activeCategory]
  const tabPassive = tabPassivePercent(activeCategory)

  const renderThemeCard = (theme: GameThemeEntry) => {
    const selected = theme.id === selectedId
    const owned = isThemeOwned(theme, ownedIds)
    return (
      <div
        key={theme.id}
        className={
          selected
            ? 'themes-page__card themes-page__card--selected'
            : 'themes-page__card'
        }
      >
        <button
          type="button"
          className="themes-page__card-main"
          aria-pressed={selected}
          aria-label={themeCardAriaLabel(t, theme)}
          onClick={() => selectTheme(activeCategory, theme.id)}
        >
          <span className="themes-page__card-label">{t(theme.nameId)}</span>
          {themeCardMeta(t, theme)}
          <span
            className={
              theme.image
                ? 'themes-page__card-art themes-page__card-art--img'
                : 'themes-page__card-art'
            }
            data-theme-icon={theme.icon}
          >
            {theme.image ? (
              <img className="themes-page__card-img" src={theme.image} alt="" />
            ) : (
              <ThemeIcon icon={theme.icon} />
            )}
          </span>
        </button>
        <button
          type="button"
          className={
            owned ? 'themes-page__owned themes-page__owned--on' : 'themes-page__owned'
          }
          aria-pressed={owned}
          aria-label={
            owned
              ? withParams(t('themes_owned_toggle_off'), { name: t(theme.nameId) })
              : withParams(t('themes_owned_toggle_on'), { name: t(theme.nameId) })
          }
          onClick={(e) => {
            e.stopPropagation()
            setThemeOwned(theme.id, !owned)
          }}
        >
          {owned ? t('themes_owned_true') : t('themes_owned_false')}
        </button>
      </div>
    )
  }

  const ownedCountInCategory = useMemo(
    () => items.filter((entry) => isThemeOwned(entry, ownedIds)).length,
    [items, ownedIds],
  )

  const coinQuantities = useMemo(
    () => countOwnedThemesForCoinBonus(ownedIds),
    [ownedIds],
  )

  const coinMultiplier = useMemo(
    () => computeThemeCoinBonusMultiplier(coinQuantities),
    [coinQuantities],
  )

  const openResetThemesConfirm = useCallback(() => {
    setResetThemesConfirmOpen(true)
  }, [])

  const performResetThemes = useCallback(() => {
    setResetThemesConfirmOpen(false)
    resetAllThemes()
  }, [])

  useEffect(() => {
    if (!resetThemesConfirmOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setResetThemesConfirmOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [resetThemesConfirmOpen])

  useEffect(() => {
    try {
      localStorage.setItem(
        THEMES_COIN_BONUS_COLLAPSED_STORAGE_KEY,
        coinBonusCollapsed ? '1' : '0',
      )
    } catch {
      /* ignore quota / private mode */
    }
  }, [coinBonusCollapsed])

  return (
    <div className="themes-page" role="region" aria-label={t('app_nav_themes')}>
      {embeddedInPanel && toolbarMount
        ? createPortal(
            <ThemesToolbarQuick onResetThemes={openResetThemesConfirm} />,
            toolbarMount,
          )
        : null}
      {budgetPanelsVisible ? (
      <div
        className={
          coinBonusCollapsed
            ? 'select-research__budget select-research__budget--collapsed themes-page__coin-bonus'
            : 'select-research__budget themes-page__coin-bonus'
        }
        role="region"
        aria-labelledby="themes-coin-bonus-title"
      >
        <div className="select-research__budget-head">
          <div className="themes-page__coin-bonus-head-stack">
            <h2 id="themes-coin-bonus-title" className="select-research__budget-title">
              {t('themes_coin_bonus_title')}
            </h2>
            {coinBonusCollapsed ? (
              <p className="themes-page__coin-bonus-head-summary">
                <span className="themes-page__coin-bonus-multiplier themes-page__coin-bonus-multiplier--compact">
                  {formatThemeCoinBonusMultiplier(coinMultiplier)}
                </span>{' '}
                <span className="themes-page__coin-bonus-pct themes-page__coin-bonus-pct--compact">
                  {formatThemeCoinBonusPercentAboveBase(coinMultiplier)}
                </span>
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="select-research__budget-toggle"
            aria-expanded={!coinBonusCollapsed}
            aria-controls={coinBonusBodyId}
            aria-label={
              coinBonusCollapsed
                ? t('themes_coin_bonus_toggle_expand')
                : t('themes_coin_bonus_toggle_collapse')
            }
            onClick={() => setCoinBonusCollapsed((c) => !c)}
          >
            <span className="select-research__budget-chevron" aria-hidden>
              ▼
            </span>
          </button>
        </div>
        <div
          id={coinBonusBodyId}
          className="select-research__budget-body themes-page__coin-bonus-body"
          hidden={coinBonusCollapsed}
        >
          <p className="themes-page__coin-bonus-total">
            <span className="themes-page__coin-bonus-multiplier">
              {formatThemeCoinBonusMultiplier(coinMultiplier)}
            </span>
            <span className="themes-page__coin-bonus-pct">
              {formatThemeCoinBonusPercentAboveBase(coinMultiplier)}
            </span>
          </p>
          <p className="themes-page__coin-bonus-formula">{t('themes_coin_bonus_formula')}</p>
          <ul className="themes-page__coin-bonus-breakdown">
            {THEME_COIN_BONUS_CATEGORIES.map((category) => (
              <li key={category}>
                {withParams(t('themes_coin_bonus_line'), {
                  category: t(COIN_TAB_LABEL_IDS[category]),
                  percent: THEME_COIN_BONUS_PERCENT[category],
                  count: coinQuantities[category],
                })}
              </li>
            ))}
          </ul>
        </div>
      </div>
      ) : null}

      <div className="themes-page__tabs" role="tablist" aria-label={t('themes_tabs_aria')}>
        {THEME_CATEGORIES.map((category) => {
          const percent = tabPassivePercent(category)
          return (
            <button
              key={category}
              type="button"
              role="tab"
              id={`themes-tab-${category}`}
              aria-selected={activeCategory === category}
              aria-controls={`themes-panel-${category}`}
              className={
                activeCategory === category
                  ? 'themes-page__tab themes-page__tab--on'
                  : 'themes-page__tab'
              }
              onClick={() => setActiveCategory(category)}
            >
              <span className="themes-page__tab-label">{t(TAB_LABEL_IDS[category])}</span>
              {percent != null ? (
                <span className="themes-page__tab-bonus">+{percent}%</span>
              ) : null}
            </button>
          )
        })}
      </div>

      {tabPassive != null ? (
        <p className="themes-page__passive" role="note">
          {withParams(t('themes_passive_bonus'), {
            category: t(TAB_LABEL_IDS[activeCategory]),
            percent: tabPassive,
            owned: ownedCountInCategory,
            total: items.length,
          })}
        </p>
      ) : null}

      <div
        id={`themes-panel-${activeCategory}`}
        role="tabpanel"
        aria-labelledby={`themes-tab-${activeCategory}`}
        className={
          activeCategory === 'tower' || activeCategory === 'background'
            ? 'themes-page__tower-panels'
            : 'themes-page__grid'
        }
      >
        {activeCategory === 'background' ? (
          <>
            <section
              className="themes-page__section"
              aria-labelledby="themes-bg-event-title"
            >
              <h3 id="themes-bg-event-title" className="themes-page__section-title">
                {t('themes_tower_group_event')}
              </h3>
              <div className="themes-page__grid">
                {backgroundGroups.event.map(renderThemeCard)}
              </div>
            </section>
            <section
              className="themes-page__section"
              aria-labelledby="themes-bg-guild-title"
            >
              <h3 id="themes-bg-guild-title" className="themes-page__section-title">
                {t('themes_tower_group_guild')}
              </h3>
              <div className="themes-page__grid">
                {backgroundGroups.guild.map(renderThemeCard)}
              </div>
            </section>
          </>
        ) : activeCategory === 'tower' ? (
          <>
            <section
              className="themes-page__section"
              aria-labelledby="themes-tower-milestone-title"
            >
              <h3 id="themes-tower-milestone-title" className="themes-page__section-title">
                {t('themes_tower_group_milestone')}
              </h3>
              <div className="themes-page__grid">
                {towerGroups.milestone.map(renderThemeCard)}
              </div>
            </section>
            <section
              className="themes-page__section"
              aria-labelledby="themes-tower-event-title"
            >
              <h3 id="themes-tower-event-title" className="themes-page__section-title">
                {t('themes_tower_group_event')}
              </h3>
              <div className="themes-page__grid">
                {towerGroups.event.map(renderThemeCard)}
              </div>
            </section>
            <section
              className="themes-page__section"
              aria-labelledby="themes-tower-guild-title"
            >
              <h3 id="themes-tower-guild-title" className="themes-page__section-title">
                {t('themes_tower_group_guild')}
              </h3>
              <div className="themes-page__grid">
                {towerGroups.guild.map(renderThemeCard)}
              </div>
            </section>
          </>
        ) : (
          items.map(renderThemeCard)
        )}
      </div>

      {resetThemesConfirmOpen
        ? themesOverlayPortal(
            <div
              className="select-research__reset-confirm-backdrop"
              role="presentation"
              onClick={() => setResetThemesConfirmOpen(false)}
            >
              <div
                className="select-research__reset-confirm-dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="reset-themes-confirm-title"
                aria-describedby="reset-themes-confirm-desc"
                onClick={(e) => e.stopPropagation()}
              >
                <h2
                  id="reset-themes-confirm-title"
                  className="select-research__reset-confirm-title"
                >
                  {t('themes_reset_confirm_title')}
                </h2>
                <p
                  id="reset-themes-confirm-desc"
                  className="select-research__reset-confirm-desc"
                >
                  {t('themes_reset_confirm_body')}
                </p>
                <div className="select-research__reset-confirm-actions">
                  <button
                    type="button"
                    className="glow-btn glow-btn--block"
                    onClick={() => setResetThemesConfirmOpen(false)}
                  >
                    {t('sr_cancel')}
                  </button>
                  <button
                    type="button"
                    className="glow-btn glow-btn--danger glow-btn--block"
                    onClick={performResetThemes}
                  >
                    {t('themes_reset')}
                  </button>
                </div>
              </div>
            </div>,
          )
        : null}
    </div>
  )
}



