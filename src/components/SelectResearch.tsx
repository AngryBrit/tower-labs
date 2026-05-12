import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ResearchData } from '../types/research'
import {
  getLevelBounds,
  levelOverrideKey,
  resolveLabsCoinDiscountPercent,
} from '../types/research'
import { ResearchSection } from './ResearchSection'

interface SelectResearchProps {
  data: ResearchData
}

const LEVEL_OVERRIDES_STORAGE_KEY = 'tower-export-level-overrides-v1'

function sanitizeLevelOverrides(
  data: ResearchData,
  raw: Record<string, unknown>,
): Record<string, number> {
  const out: Record<string, number> = {}
  for (const [key, val] of Object.entries(raw)) {
    const parts = key.split('-')
    if (parts.length !== 2) continue
    const si = Number(parts[0])
    const ii = Number(parts[1])
    if (!Number.isInteger(si) || !Number.isInteger(ii)) continue
    const item = data.sections[si]?.items[ii]
    if (!item) continue
    const bounds = getLevelBounds(item)
    const n = typeof val === 'number' ? val : Number(val)
    if (!Number.isFinite(n)) continue
    const rounded = Math.round(n)
    const capped =
      bounds.max > 0
        ? Math.max(0, Math.min(bounds.max, rounded))
        : Math.max(0, rounded)
    out[key] = capped
  }
  return out
}

export function SelectResearch({ data }: SelectResearchProps) {
  const [search, setSearch] = useState('')
  const [hideCompleted, setHideCompleted] = useState(false)
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({})
  const [levelOverrides, setLevelOverrides] = useState<
    Record<string, number>
  >({})
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const rawJson = localStorage.getItem(LEVEL_OVERRIDES_STORAGE_KEY)
      if (rawJson) {
        const parsed: unknown = JSON.parse(rawJson)
        if (
          parsed &&
          typeof parsed === 'object' &&
          'levelOverrides' in parsed
        ) {
          const lo = (parsed as { levelOverrides?: unknown }).levelOverrides
          if (lo && typeof lo === 'object') {
            setLevelOverrides(
              sanitizeLevelOverrides(data, lo as Record<string, unknown>),
            )
          }
        }
      }
    } catch {
      /* ignore corrupt storage */
    } finally {
      setHydrated(true)
    }
  }, [data])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(
        LEVEL_OVERRIDES_STORAGE_KEY,
        JSON.stringify({ v: 1, levelOverrides }),
      )
    } catch {
      /* quota / private mode */
    }
  }, [levelOverrides, hydrated])

  const labsCoinDiscountPercent = useMemo(
    () => resolveLabsCoinDiscountPercent(data, levelOverrides),
    [data, levelOverrides],
  )

  const adjustLevel = useCallback(
    (sectionIndex: number, itemIndex: number, delta: number) => {
      setLevelOverrides((prev) => {
        const item = data.sections[sectionIndex]?.items[itemIndex]
        if (!item) return prev
        const bounds = getLevelBounds(item)
        const key = levelOverrideKey(sectionIndex, itemIndex)
        const prior =
          prev[key] !== undefined ? prev[key] : bounds.current
        const raw = prior + delta
        const capped =
          bounds.max > 0
            ? Math.max(0, Math.min(bounds.max, raw))
            : Math.max(0, raw)
        return { ...prev, [key]: capped }
      })
    },
    [data.sections],
  )

  const setLevel = useCallback(
    (sectionIndex: number, itemIndex: number, level: number) => {
      setLevelOverrides((prev) => {
        const item = data.sections[sectionIndex]?.items[itemIndex]
        if (!item) return prev
        const bounds = getLevelBounds(item)
        const key = levelOverrideKey(sectionIndex, itemIndex)
        const rounded = Math.round(level)
        const capped =
          bounds.max > 0
            ? Math.max(0, Math.min(bounds.max, rounded))
            : Math.max(0, rounded)
        return { ...prev, [key]: capped }
      })
    },
    [data.sections],
  )

  const toggleSection = useCallback((index: number) => {
    setCollapsed((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }, [])

  const handleResetLevels = useCallback(() => {
    setLevelOverrides({})
  }, [])

  const searchFieldId = 'select-research-search'

  return (
    <div
      className="select-research"
      role="region"
      aria-labelledby="select-research-title"
    >
      <header className="select-research__header">
        <h1 className="select-research__title" id="select-research-title">
          SELECT RESEARCH
        </h1>
        <button
          type="button"
          className="select-research__close"
          aria-label="Close (demo only)"
          disabled
        >
          ×
        </button>
      </header>

      <label className="visually-hidden" htmlFor={searchFieldId}>
        Search research
      </label>
      <input
        id={searchFieldId}
        className="select-research__search glow-input"
        type="search"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoComplete="off"
      />

      <div className="select-research__filters">
        <label className="glow-btn glow-btn--toggle">
          <input
            type="checkbox"
            checked={hideCompleted}
            onChange={(e) => setHideCompleted(e.target.checked)}
          />
          Hide Completed
        </label>
        <button
          type="button"
          className="glow-btn glow-btn--danger glow-btn--block"
          onClick={handleResetLevels}
        >
          Reset lab levels
        </button>
      </div>

      <div className="select-research__sections">
        {data.sections.map((section, index) => (
          <ResearchSection
            key={`${section.title}-${index}`}
            section={section}
            sectionIndex={index}
            collapsed={Boolean(collapsed[index])}
            onToggle={() => toggleSection(index)}
            searchQuery={search}
            hideCompleted={hideCompleted}
            levelOverrides={levelOverrides}
            labsCoinDiscountPercent={labsCoinDiscountPercent}
            onLevelDelta={(itemIndex, delta) =>
              adjustLevel(index, itemIndex, delta)
            }
            onLevelSet={(itemIndex, level) => setLevel(index, itemIndex, level)}
          />
        ))}
      </div>

      <footer className="select-research__footer">
        <p className="app-hint">
          <span className="resource-legend" aria-hidden>
            <img
              className="resource-legend__icon resource-legend__icon--coin"
              src="/coin.png"
              alt=""
              width={14}
              height={14}
              decoding="async"
            />
          </span>{' '}
          Coin costs and research times use the bundled lab table in{' '}
          <code>src/data/tower-labs.json</code>. Card Mastery cards show wiki power-stone unlock on
          the cost line (from <code>public/research/sections/card-mastery.json</code>), not abbreviated
          coin ladder totals. Section rows and benefits come from <code>public/research/</code>. All
          of that data lives in this repo only—nothing is loaded from external APIs.
        </p>
        <p className="app-hint app-hint--resource">
          <span className="resource-legend" aria-hidden>
            <img
              className="resource-legend__icon resource-legend__icon--gem"
              src="/gem.png"
              alt=""
              width={14}
              height={14}
              decoding="async"
            />
          </span>{' '}
          Shop gems and other non-coin prices are not included in these numbers.
        </p>
        <p className="app-hint app-hint--resource">
          <span className="resource-legend" aria-hidden>
            <img
              className="resource-legend__icon resource-legend__icon--stone"
              src="/power-stone.png"
              alt=""
              width={14}
              height={14}
              decoding="async"
            />
          </span>{' '}
          Other power-stone sinks besides the Card Mastery wiki unlock line are not included in these
          numbers.
        </p>
        <p className="app-hint app-hint--resource">
          <span className="resource-legend" aria-hidden>
            <img
              className="resource-legend__icon resource-legend__icon--medal"
              src="/medal.png"
              alt=""
              width={14}
              height={14}
              decoding="async"
            />
          </span>{' '}
          Medals and medal-based unlocks are not included in these numbers.
        </p>
        <p className="app-hint app-hint--resource">
          <span className="resource-legend" aria-hidden>
            <img
              className="resource-legend__icon resource-legend__icon--eliteCell"
              src="/elite-cell.png"
              alt=""
              width={14}
              height={14}
              decoding="async"
            />
          </span>{' '}
          Elite cells and cell-based economy are not included in these numbers.
        </p>
        <p className="app-hint app-hint--resource">
          <span className="resource-legend" aria-hidden>
            <img
              className="resource-legend__icon resource-legend__icon--cash"
              src="/cash.png"
              alt=""
              width={14}
              height={14}
              decoding="async"
            />
          </span>{' '}
          Run cash (in-wave $) is separate from lab coins; wave cash is not modeled here.
        </p>
      </footer>
    </div>
  )
}
