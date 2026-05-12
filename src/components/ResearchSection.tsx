import { useMemo, type ReactNode } from 'react'
import type { ResearchSection as ResearchSectionType } from '../types/research'
import {
  getEffectiveLevel,
  getLevelBounds,
} from '../types/research'
import { ResearchCard } from './ResearchCard'
import { useI18n } from '../i18n'

interface ResearchSectionProps {
  /** Parallel to `section.items` — stable `id`s for deep links */
  labDomIds: readonly string[]
  section: ResearchSectionType
  sectionIndex: number
  collapsed: boolean
  onToggle: () => void
  searchQuery: string
  hideCompleted: boolean
  levelOverrides: Record<string, number>
  /** Total Labs Coin Discount % from simulated Labs Coin Discount level (applied to list coin costs). */
  labsCoinDiscountPercent: number
  onLevelDelta: (itemIndex: number, delta: number) => void
  onLevelSet: (itemIndex: number, level: number) => void
  /** Shown on the right side of the section header row (e.g. global “collapse all” on the first section). */
  sectionHeadEnd?: ReactNode
}

export function ResearchSection({
  labDomIds,
  section,
  sectionIndex,
  collapsed,
  onToggle,
  searchQuery,
  hideCompleted,
  levelOverrides,
  labsCoinDiscountPercent,
  onLevelDelta,
  onLevelSet,
  sectionHeadEnd,
}: ResearchSectionProps) {
  const { t, researchLabel } = useI18n()
  const q = searchQuery.trim().toLowerCase()

  const visibility = useMemo(() => {
    return section.items.map((item, i) => {
      const label = researchLabel(section.sectionSlug, i, item.name, 'item')
      const matchesSearch =
        q.length === 0 ||
        item.name.toLowerCase().includes(q) ||
        label.toLowerCase().includes(q)
      const bounds = getLevelBounds(item)
      const eff = getEffectiveLevel(sectionIndex, i, item, levelOverrides)
      const effectivelyMaxed = bounds.max > 0 && eff >= bounds.max
      const passesCompleted = !hideCompleted || !effectivelyMaxed
      return matchesSearch && passesCompleted
    })
  }, [
    section.items,
    section.sectionSlug,
    sectionIndex,
    q,
    hideCompleted,
    levelOverrides,
    researchLabel,
  ])

  const anyVisible = visibility.some(Boolean)

  return (
    <section
      className={`research-section${collapsed ? ' research-section--collapsed' : ''}`}
      aria-labelledby={`section-title-${sectionIndex}`}
    >
      <div className="research-section__headRow">
        <button
          type="button"
          className="research-section__head"
          id={`section-title-${sectionIndex}`}
          onClick={onToggle}
          aria-expanded={!collapsed}
        >
          <span
            className="research-section__chevron"
            aria-hidden
          >
            ▼
          </span>
          <span className="research-section__headTitle">
            {researchLabel(section.sectionSlug, undefined, section.title, 'section')}
          </span>
        </button>
        {sectionHeadEnd ? (
          <div className="research-section__headEnd">{sectionHeadEnd}</div>
        ) : null}
      </div>
      {!anyVisible && !collapsed ? (
        <p className="research-section__empty">{t('research_empty_filter')}</p>
      ) : null}
      <div className="research-section__grid" role="list">
        {section.items.map((item, i) => {
          const bounds = getLevelBounds(item)
          const effectiveLevel = getEffectiveLevel(
            sectionIndex,
            i,
            item,
            levelOverrides,
          )
          return (
            <ResearchCard
              key={`${section.sectionSlug}-${item.name}-${i}`}
              sectionSlug={section.sectionSlug}
              itemIndex={i}
              domId={labDomIds[i]}
              item={item}
              hidden={collapsed || !visibility[i]}
              effectiveLevel={effectiveLevel}
              maxLevelCap={bounds.max}
              labsCoinDiscountPercent={labsCoinDiscountPercent}
              onLevelDelta={(d) => onLevelDelta(i, d)}
              onLevelSet={(lvl) => onLevelSet(i, lvl)}
            />
          )
        })}
      </div>
    </section>
  )
}
