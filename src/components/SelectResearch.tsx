import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { APP_VERSION } from '../appVersion'
import {
  decodeLabsShareQueryValue,
  encodeLabsShareQueryValue,
  LABS_SHARE_SEARCH_PARAM,
} from '../labsShareCodec'
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
const SECTION_COLLAPSED_STORAGE_KEY = 'tower-export-section-collapsed-v1'

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

function sanitizeSectionCollapsed(
  sectionCount: number,
  raw: Record<string, unknown>,
): Record<number, boolean> {
  const out: Record<number, boolean> = {}
  for (const [key, val] of Object.entries(raw)) {
    const si = Number(key)
    if (!Number.isInteger(si) || si < 0 || si >= sectionCount) continue
    if (val === true) out[si] = true
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
  const [importNotice, setImportNotice] = useState<string | null>(null)
  const importFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!importNotice) return
    const t = window.setTimeout(() => setImportNotice(null), 5000)
    return () => window.clearTimeout(t)
  }, [importNotice])

  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      const applySectionCollapsedFromStorage = () => {
        try {
          const rawJson = localStorage.getItem(SECTION_COLLAPSED_STORAGE_KEY)
          if (!rawJson || cancelled) return
          const parsed: unknown = JSON.parse(rawJson)
          if (
            !parsed ||
            typeof parsed !== 'object' ||
            !('collapsed' in parsed)
          ) {
            return
          }
          const c = (parsed as { collapsed?: unknown }).collapsed
          if (!c || typeof c !== 'object' || Array.isArray(c)) return
          if (!cancelled) {
            setCollapsed(
              sanitizeSectionCollapsed(
                data.sections.length,
                c as Record<string, unknown>,
              ),
            )
          }
        } catch {
          /* ignore corrupt storage */
        }
      }

      try {
        const params = new URLSearchParams(window.location.search)
        const share = params.get(LABS_SHARE_SEARCH_PARAM)
        if (share) {
          const payload = await decodeLabsShareQueryValue(share)
          if (payload?.o && !cancelled) {
            const sanitized = sanitizeLevelOverrides(
              data,
              payload.o as Record<string, unknown>,
            )
            setLevelOverrides(sanitized)
            applySectionCollapsedFromStorage()
            const url = new URL(window.location.href)
            url.searchParams.delete(LABS_SHARE_SEARCH_PARAM)
            window.history.replaceState(null, '', url.pathname + url.search + url.hash)
            const n = Object.keys(sanitized).length
            setImportNotice(
              n === 0
                ? 'Share link opened: lab levels cleared to defaults.'
                : `Share link opened: loaded ${n} custom lab level${n === 1 ? '' : 's'}.`,
            )
            setHydrated(true)
            return
          }
        }
      } catch {
        /* ignore corrupt share payload */
      }

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
              if (!cancelled) {
                setLevelOverrides(
                  sanitizeLevelOverrides(data, lo as Record<string, unknown>),
                )
              }
            }
          }
        }
      } catch {
        /* ignore corrupt storage */
      }

      applySectionCollapsedFromStorage()

      if (!cancelled) setHydrated(true)
    }

    void hydrate()
    return () => {
      cancelled = true
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

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(
        SECTION_COLLAPSED_STORAGE_KEY,
        JSON.stringify({ v: 1, collapsed }),
      )
    } catch {
      /* quota / private mode */
    }
  }, [collapsed, hydrated])

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
    setCollapsed((prev) => {
      if (prev[index]) {
        const { [index]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [index]: true }
    })
  }, [])

  const handleResetLevels = useCallback(() => {
    setLevelOverrides({})
  }, [])

  const handleExportLevels = useCallback(() => {
    const payload = { v: 1 as const, levelOverrides }
    const json = JSON.stringify(payload, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const date = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = `tower-lab-levels-${date}.json`
    a.rel = 'noopener'
    a.click()
    URL.revokeObjectURL(url)
  }, [levelOverrides])

  const handleCopyShareLink = useCallback(async () => {
    try {
      const encoded = await encodeLabsShareQueryValue(levelOverrides)
      const shareUrl = new URL(window.location.href)
      shareUrl.searchParams.set(LABS_SHARE_SEARCH_PARAM, encoded)
      const text = shareUrl.toString()
      await navigator.clipboard.writeText(text)
      setImportNotice('Share link copied to clipboard.')
    } catch {
      setImportNotice('Could not copy link (clipboard blocked or unavailable).')
    }
  }, [levelOverrides])

  const handleImportLevelsClick = useCallback(() => {
    importFileInputRef.current?.click()
  }, [])

  const handleImportFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target
      const file = input.files?.[0]
      input.value = ''
      if (!file) return
      try {
        const text = await file.text()
        const parsed: unknown = JSON.parse(text)
        if (
          !parsed ||
          typeof parsed !== 'object' ||
          !('levelOverrides' in parsed)
        ) {
          setImportNotice(
            'Invalid file: expected JSON with a levelOverrides object.',
          )
          return
        }
        const lo = (parsed as { levelOverrides?: unknown }).levelOverrides
        if (
          !lo ||
          typeof lo !== 'object' ||
          Array.isArray(lo)
        ) {
          setImportNotice(
            'Invalid file: levelOverrides must be a JSON object (not an array).',
          )
          return
        }
        const sanitized = sanitizeLevelOverrides(
          data,
          lo as Record<string, unknown>,
        )
        setLevelOverrides(sanitized)
        const n = Object.keys(sanitized).length
        setImportNotice(
          n === 0
            ? 'Imported file: all custom levels cleared.'
            : `Imported ${n} lab level${n === 1 ? '' : 's'}.`,
        )
      } catch {
        setImportNotice('Could not read file. Use a valid JSON export.')
      }
    },
    [data],
  )

  const searchFieldId = 'select-research-search'

  return (
    <div
      className="select-research"
      role="region"
      aria-labelledby="select-research-title"
    >
      <header className="select-research__header">
        <div className="select-research__brand">
          <img
            className="select-research__logo"
            src="/tower-site-logo.png"
            alt="The Tower"
            width={500}
            height={439}
            decoding="async"
          />
          <h1 className="select-research__title" id="select-research-title">
            SELECT RESEARCH
          </h1>
        </div>
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
        <div className="select-research__filter-actions">
          <input
            ref={importFileInputRef}
            className="visually-hidden"
            type="file"
            accept=".json,application/json"
            aria-hidden
            tabIndex={-1}
            onChange={handleImportFileChange}
          />
          <button
            type="button"
            className="glow-btn glow-btn--block"
            onClick={handleImportLevelsClick}
            disabled={!hydrated}
          >
            Import lab levels from file
          </button>
          <button
            type="button"
            className="glow-btn glow-btn--block"
            onClick={handleExportLevels}
            disabled={!hydrated}
          >
            Export lab levels to file
          </button>
          <button
            type="button"
            className="glow-btn glow-btn--block select-research__filter-actions-share"
            onClick={handleCopyShareLink}
            disabled={!hydrated}
          >
            Copy link to share labs
          </button>
        </div>
        {importNotice ? (
          <p className="select-research__import-notice" role="status">
            {importNotice}
          </p>
        ) : null}
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

      <p
        className="select-research__version"
        aria-label={`Tower Labs version ${APP_VERSION}`}
      >
        v{APP_VERSION}
      </p>
    </div>
  )
}
