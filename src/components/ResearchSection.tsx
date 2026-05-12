import { useMemo } from 'react'
import type { ResearchSection as ResearchSectionType } from '../types/research'
import {
  getEffectiveLevel,
  getLevelBounds,
} from '../types/research'
import { ResearchCard } from './ResearchCard'

interface ResearchSectionProps {
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
}

export function ResearchSection({
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
}: ResearchSectionProps) {
  const q = searchQuery.trim().toLowerCase()

  const visibility = useMemo(() => {
    return section.items.map((item, i) => {
      const matchesSearch =
        q.length === 0 || item.name.toLowerCase().includes(q)
      const bounds = getLevelBounds(item)
      const eff = getEffectiveLevel(sectionIndex, i, item, levelOverrides)
      const effectivelyMaxed = bounds.max > 0 && eff >= bounds.max
      const passesCompleted = !hideCompleted || !effectivelyMaxed
      return matchesSearch && passesCompleted
    })
  }, [section.items, sectionIndex, q, hideCompleted, levelOverrides])

  const anyVisible = visibility.some(Boolean)

  return (
    <section
      className={`research-section${collapsed ? ' research-section--collapsed' : ''}`}
      aria-labelledby={`section-title-${sectionIndex}`}
    >
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
        <span>{section.title}</span>
      </button>
      {!anyVisible && !collapsed ? (
        <p className="research-section__empty">No research matches filters.</p>
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
              key={`${section.title}-${item.name}-${i}`}
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
