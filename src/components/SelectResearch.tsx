import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { APP_VERSION, CHANGELOG_URL } from '../appVersion'
import { buildLabDomIdTables, getLabSlugFromUrl } from '../labSlug'
import {
  buildLabsShareUrls,
  decodeLabsShareQueryValue,
  encodeLabsShareQueryValue,
  LABS_SHARE_SEARCH_PARAM,
} from '../labsShareCodec'
import {
  computeSimulatorCoinAggregates,
  formatSimulatorCoinAggregates,
} from '../labBudgetAggregates'
import { sanitizeLevelOverrides } from '../labLevelOverridesSanitize'
import {
  buildLabPresetsPayload,
  newPresetId,
  parseLabPresetsFile,
  type LabPreset,
} from '../labPresetsStorage'
import type { ResearchData } from '../types/research'
import {
  getLevelBounds,
  levelOverrideKey,
  resolveLabsCoinDiscountPercent,
} from '../types/research'
import { LabCompareDialog } from './LabCompareDialog'
import { ResearchSection } from './ResearchSection'
import { useI18n, type AppLocale } from '../i18n'

/** Survives React Strict Mode remount so initial `?lab=` / `#` runs once per full load. */
let initialLabUrlNavigationConsumed = false

interface SelectResearchProps {
  data: ResearchData
}

/** Legacy single-map storage; read once to migrate when `LAB_PRESETS_STORAGE_KEY` is absent. */
const LEVEL_OVERRIDES_STORAGE_KEY = 'tower-export-level-overrides-v1'
const LAB_PRESETS_STORAGE_KEY = 'tower-export-lab-presets-v1'
const SECTION_COLLAPSED_STORAGE_KEY = 'tower-export-section-collapsed-v1'
const BULK_SECTIONS_TOGGLE_ID = 'tower-bulk-sections-collapsed-toggle'

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
  const { t, fmt, locale, setLocale } = useI18n()
  const [search, setSearch] = useState('')
  const [hideCompleted, setHideCompleted] = useState(false)
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({})
  const [levelOverrides, setLevelOverrides] = useState<
    Record<string, number>
  >({})
  const [presets, setPresets] = useState<LabPreset[]>([])
  const [activePresetId, setActivePresetId] = useState<string | null>(null)
  const [scratchSnapshot, setScratchSnapshot] = useState<
    Record<string, number>
  >({})
  const [hydrated, setHydrated] = useState(false)
  const [importNotice, setImportNotice] = useState<string | null>(null)
  const [shareQr, setShareQr] = useState<{
    dataUrl: string
    url: string
  } | null>(null)
  const [resetLevelsConfirmOpen, setResetLevelsConfirmOpen] = useState(false)
  const [labDataPanelOpen, setLabDataPanelOpen] = useState(false)
  const [labCompareOpen, setLabCompareOpen] = useState(false)
  const [presetSaveDialogOpen, setPresetSaveDialogOpen] = useState(false)
  const [presetSaveDraft, setPresetSaveDraft] = useState('')
  const importFileInputRef = useRef<HTMLInputElement>(null)
  const presetSaveNameInputRef = useRef<HTMLInputElement>(null)
  const bulkAllSectionsToggleRef = useRef<HTMLInputElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const pendingLabScrollSlug = useRef<string | null>(null)
  const [scrollLayoutGen, setScrollLayoutGen] = useState(0)

  const levelOverridesRef = useRef(levelOverrides)
  const scratchSnapshotRef = useRef(scratchSnapshot)
  const activePresetIdRef = useRef(activePresetId)
  useLayoutEffect(() => {
    levelOverridesRef.current = levelOverrides
    scratchSnapshotRef.current = scratchSnapshot
    activePresetIdRef.current = activePresetId
  }, [levelOverrides, scratchSnapshot, activePresetId])

  useEffect(() => {
    if (!importNotice) return
    const t = window.setTimeout(() => setImportNotice(null), 5000)
    return () => window.clearTimeout(t)
  }, [importNotice])

  useEffect(() => {
    const onDocKeyDown = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return
      if (e.repeat) return
      if (e.target === searchInputRef.current) return
      const t = e.target
      if (t instanceof HTMLElement && t.isContentEditable) return
      if (
        t instanceof HTMLInputElement ||
        t instanceof HTMLTextAreaElement ||
        t instanceof HTMLSelectElement
      ) {
        return
      }
      e.preventDefault()
      const el = searchInputRef.current
      if (!el) return
      el.focus()
      el.select()
    }
    document.addEventListener('keydown', onDocKeyDown)
    return () => document.removeEventListener('keydown', onDocKeyDown)
  }, [])

  useEffect(() => {
    const blocking =
      shareQr !== null ||
      resetLevelsConfirmOpen ||
      labDataPanelOpen ||
      labCompareOpen ||
      presetSaveDialogOpen
    if (!blocking) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setShareQr(null)
      setResetLevelsConfirmOpen(false)
      setLabDataPanelOpen(false)
      setLabCompareOpen(false)
      setPresetSaveDialogOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [
    shareQr,
    resetLevelsConfirmOpen,
    labDataPanelOpen,
    labCompareOpen,
    presetSaveDialogOpen,
  ])

  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      const loadPersistedLabState = (): {
        presets: LabPreset[]
        activePresetId: string | null
        scratchSnapshot: Record<string, number>
        levelOverrides: Record<string, number>
      } => {
        const empty = {
          presets: [] as LabPreset[],
          activePresetId: null as string | null,
          scratchSnapshot: {} as Record<string, number>,
          levelOverrides: {} as Record<string, number>,
        }
        try {
          const rawNew = localStorage.getItem(LAB_PRESETS_STORAGE_KEY)
          if (rawNew) {
            const parsed = parseLabPresetsFile(JSON.parse(rawNew))
            if (parsed) {
              const presets = parsed.presets.map((p) => ({
                ...p,
                levelOverrides: sanitizeLevelOverrides(
                  data,
                  p.levelOverrides as Record<string, unknown>,
                ),
              }))
              let activePresetId = parsed.activePresetId
              if (
                activePresetId &&
                !presets.some((p) => p.id === activePresetId)
              ) {
                activePresetId = null
              }
              const scratchSnapshot = sanitizeLevelOverrides(
                data,
                parsed.scratchOverrides as Record<string, unknown>,
              )
              const activePreset = activePresetId
                ? presets.find((p) => p.id === activePresetId)
                : undefined
              const levelOverrides = activePreset
                ? { ...activePreset.levelOverrides }
                : { ...scratchSnapshot }
              return {
                presets,
                activePresetId,
                scratchSnapshot,
                levelOverrides,
              }
            }
          }
        } catch {
          /* ignore corrupt storage */
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
              if (lo && typeof lo === 'object' && !Array.isArray(lo)) {
                const levelOverrides = sanitizeLevelOverrides(
                  data,
                  lo as Record<string, unknown>,
                )
                return {
                  presets: [],
                  activePresetId: null,
                  scratchSnapshot: { ...levelOverrides },
                  levelOverrides,
                }
              }
            }
          }
        } catch {
          /* ignore corrupt storage */
        }
        return empty
      }

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

      const persistedLabs = loadPersistedLabState()

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
            setPresets(persistedLabs.presets)
            setActivePresetId(null)
            setScratchSnapshot(sanitized)
            setLevelOverrides(sanitized)
            applySectionCollapsedFromStorage()
            const url = new URL(window.location.href)
            url.searchParams.delete(LABS_SHARE_SEARCH_PARAM)
            window.history.replaceState(null, '', url.pathname + url.search + url.hash)
            const n = Object.keys(sanitized).length
            setImportNotice(fmt.shareOpenedLevels(n))
            setHydrated(true)
            return
          }
        }
      } catch {
        /* ignore corrupt share payload */
      }

      if (!cancelled) {
        setPresets(persistedLabs.presets)
        setActivePresetId(persistedLabs.activePresetId)
        setScratchSnapshot(persistedLabs.scratchSnapshot)
        setLevelOverrides(persistedLabs.levelOverrides)
      }

      applySectionCollapsedFromStorage()

      if (!cancelled) setHydrated(true)
    }

    void hydrate()
    return () => {
      cancelled = true
    }
  }, [data, fmt])

  useEffect(() => {
    if (!hydrated) return
    try {
      const payload = buildLabPresetsPayload(
        activePresetId,
        presets,
        levelOverrides,
        scratchSnapshot,
      )
      localStorage.setItem(
        LAB_PRESETS_STORAGE_KEY,
        JSON.stringify(payload),
      )
    } catch {
      /* quota / private mode */
    }
  }, [
    hydrated,
    activePresetId,
    presets,
    levelOverrides,
    scratchSnapshot,
  ])

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

  const { labDomIdsBySection, labSlugToPosition } = useMemo(
    () => buildLabDomIdTables(data),
    [data],
  )

  const simulatorCoinAggregates = useMemo(
    () =>
      computeSimulatorCoinAggregates(
        data,
        levelOverrides,
        labsCoinDiscountPercent,
        search,
        hideCompleted,
        collapsed,
      ),
    [
      data,
      levelOverrides,
      labsCoinDiscountPercent,
      search,
      hideCompleted,
      collapsed,
    ],
  )

  const simulatorCoinLabels = useMemo(
    () => formatSimulatorCoinAggregates(simulatorCoinAggregates),
    [simulatorCoinAggregates],
  )

  const requestLabScroll = useCallback(
    (slug: string) => {
      if (!labSlugToPosition.has(slug)) return
      const { si } = labSlugToPosition.get(slug)!
      pendingLabScrollSlug.current = slug
      setCollapsed((prev) => {
        if (!prev[si]) return prev
        const next = { ...prev }
        delete next[si]
        return next
      })
      setSearch('')
      setHideCompleted(false)
      setScrollLayoutGen((g) => g + 1)
    },
    [labSlugToPosition],
  )

  useLayoutEffect(() => {
    const slug = pendingLabScrollSlug.current
    if (!slug) return
    const el = document.getElementById(slug)
    if (!el) {
      pendingLabScrollSlug.current = null
      return
    }
    if (el.classList.contains('research-card--hidden')) {
      return
    }
    pendingLabScrollSlug.current = null
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [collapsed, search, hideCompleted, scrollLayoutGen])

  useEffect(() => {
    if (!hydrated) return
    if (initialLabUrlNavigationConsumed) return
    initialLabUrlNavigationConsumed = true
    const slug = getLabSlugFromUrl()
    if (!slug) return
    queueMicrotask(() => {
      requestLabScroll(slug)
    })
  }, [hydrated, requestLabScroll])

  useEffect(() => {
    const onHashChange = () => {
      const slug = getLabSlugFromUrl()
      if (slug) requestLabScroll(slug)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [requestLabScroll])

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
        const next = { ...prev }
        delete next[index]
        return next
      }
      return { ...prev, [index]: true }
    })
  }, [])

  const expandAllSections = useCallback(() => {
    setCollapsed({})
  }, [])

  const collapseAllSections = useCallback(() => {
    const n = data.sections.length
    if (n === 0) return
    const next: Record<number, boolean> = {}
    for (let i = 0; i < n; i += 1) next[i] = true
    setCollapsed(next)
  }, [data.sections.length])

  const sectionCount = data.sections.length
  const { allSectionsCollapsed, bulkSectionsToggleMixed } = useMemo(() => {
    let collapsedCount = 0
    for (let i = 0; i < sectionCount; i += 1) {
      if (collapsed[i]) collapsedCount += 1
    }
    return {
      allSectionsCollapsed:
        sectionCount > 0 && collapsedCount === sectionCount,
      bulkSectionsToggleMixed:
        collapsedCount > 0 && collapsedCount < sectionCount,
    }
  }, [collapsed, sectionCount])

  useLayoutEffect(() => {
    const el = bulkAllSectionsToggleRef.current
    if (!el) return
    el.indeterminate = bulkSectionsToggleMixed
  }, [bulkSectionsToggleMixed])

  const handleBulkSectionsToggleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        collapseAllSections()
      } else {
        expandAllSections()
      }
    },
    [collapseAllSections, expandAllSections],
  )

  const performResetLevels = useCallback(() => {
    setResetLevelsConfirmOpen(false)
    setLevelOverrides({})
    setScratchSnapshot({})
    setActivePresetId(null)
    setPresets((prev) =>
      prev.map((p) => ({ ...p, levelOverrides: {} })),
    )
    setImportNotice(t('sr_notice_reset_all'))
  }, [t])

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

  const handleCopyCleanShareLink = useCallback(async () => {
    try {
      const encoded = await encodeLabsShareQueryValue(levelOverrides)
      const { clean } = buildLabsShareUrls(encoded, window.location.href)
      await navigator.clipboard.writeText(clean)
      setImportNotice(t('sr_notice_copy_short_ok'))
    } catch {
      setImportNotice(t('sr_notice_copy_short_fail'))
    }
  }, [levelOverrides, t])

  const handleCopyFullShareLink = useCallback(async () => {
    try {
      const encoded = await encodeLabsShareQueryValue(levelOverrides)
      const { full } = buildLabsShareUrls(encoded, window.location.href)
      await navigator.clipboard.writeText(full)
      setImportNotice(t('sr_notice_copy_full_ok'))
    } catch {
      setImportNotice(t('sr_notice_copy_full_fail'))
    }
  }, [levelOverrides, t])

  const handleShowShareQr = useCallback(async () => {
    try {
      const encoded = await encodeLabsShareQueryValue(levelOverrides)
      const { clean } = buildLabsShareUrls(encoded, window.location.href)
      const QRCode = (await import('qrcode')).default
      const dataUrl = await QRCode.toDataURL(clean, {
        width: 220,
        margin: 2,
        color: { dark: '#0f172a', light: '#e0f2fe' },
      })
      setShareQr({ dataUrl, url: clean })
    } catch {
      setImportNotice(t('sr_notice_qr_fail'))
    }
  }, [levelOverrides, t])

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
          setImportNotice(t('sr_notice_import_invalid_struct'))
          return
        }
        const lo = (parsed as { levelOverrides?: unknown }).levelOverrides
        if (
          !lo ||
          typeof lo !== 'object' ||
          Array.isArray(lo)
        ) {
          setImportNotice(t('sr_notice_import_invalid_lo'))
          return
        }
        const sanitized = sanitizeLevelOverrides(
          data,
          lo as Record<string, unknown>,
        )
        setActivePresetId(null)
        setScratchSnapshot(sanitized)
        setLevelOverrides(sanitized)
        const n = Object.keys(sanitized).length
        setImportNotice(fmt.importedLevels(n))
      } catch {
        setImportNotice(t('sr_notice_import_read_fail'))
      }
    },
    [data, fmt, t],
  )

  const handlePresetSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const nextId = e.target.value === '' ? null : e.target.value
      const prevActive = activePresetIdRef.current
      const currentLevels = levelOverridesRef.current
      const scratch = scratchSnapshotRef.current

      if (nextId === null) {
        if (prevActive !== null) {
          setLevelOverrides({ ...scratch })
        }
        setActivePresetId(null)
        return
      }

      if (prevActive === null) {
        setScratchSnapshot({ ...currentLevels })
      }

      const target = presets.find((p) => p.id === nextId)
      if (!target) return
      setLevelOverrides({ ...target.levelOverrides })
      setActivePresetId(nextId)
    },
    [presets],
  )

  const openPresetSaveDialog = useCallback(() => {
    setPresetSaveDraft('')
    setPresetSaveDialogOpen(true)
  }, [])

  const closePresetSaveDialog = useCallback(() => {
    setPresetSaveDialogOpen(false)
  }, [])

  const commitSavePresetFromDialog = useCallback(() => {
    const trimmed = presetSaveDraft.trim()
    if (!trimmed) {
      setImportNotice(t('sr_notice_preset_empty_name'))
      return
    }
    const id = newPresetId()
    const levels = { ...levelOverridesRef.current }
    const wasScratch = activePresetIdRef.current === null
    setPresets((prev) => [...prev, { id, name: trimmed, levelOverrides: levels }])
    if (wasScratch) {
      setScratchSnapshot({ ...levels })
    }
    setLevelOverrides(levels)
    setActivePresetId(id)
    setImportNotice(fmt.savedPreset(trimmed))
    setPresetSaveDialogOpen(false)
    setPresetSaveDraft('')
  }, [fmt, presetSaveDraft, t])

  useLayoutEffect(() => {
    if (!presetSaveDialogOpen) return
    const el = presetSaveNameInputRef.current
    if (!el) return
    queueMicrotask(() => {
      el.focus()
      el.select()
    })
  }, [presetSaveDialogOpen])

  const handleDeleteActivePreset = useCallback(() => {
    const id = activePresetIdRef.current
    if (!id) return
    const preset = presets.find((p) => p.id === id)
    if (
      !window.confirm(fmt.deleteBuildConfirm(preset?.name ?? id))
    ) {
      return
    }
    setPresets((prev) => prev.filter((p) => p.id !== id))
    setActivePresetId(null)
    setLevelOverrides({ ...scratchSnapshotRef.current })
    setImportNotice(t('sr_notice_preset_deleted'))
  }, [fmt, presets, t])

  const searchFieldId = 'select-research-search'
  const searchSlashHintId = 'select-research-search-slash-hint'

  return (
    <section
      className="select-research"
      aria-labelledby="select-research-title"
    >
      <header className="select-research__header">
        <div className="select-research__brand">
          <img
            className="select-research__logo"
            src="/tower-site-logo.webp"
            alt="The Tower"
            width={500}
            height={439}
            decoding="async"
          />
          <h1 className="select-research__title" id="select-research-title">
            {t('sr_title')}
          </h1>
        </div>
        <div className="select-research__header-locale">
          <label htmlFor="locale-select-field" className="visually-hidden">
            {t('sr_locale_aria')}
          </label>
          <select
            id="locale-select-field"
            className="select-research__header-locale-select"
            value={locale}
            onChange={(e) => setLocale(e.target.value as AppLocale)}
            aria-label={t('sr_locale_aria')}
          >
            <option value="en">{t('sr_locale_option_en')}</option>
            <option value="es">{t('sr_locale_option_es')}</option>
          </select>
        </div>
      </header>

      <nav className="select-research__toolbar" aria-label={t('sr_toolbar_aria')}>
        <label className="visually-hidden" htmlFor={searchFieldId}>
          {t('sr_search_label_hidden')}
        </label>
        <input
          ref={searchInputRef}
          id={searchFieldId}
          className="select-research__search glow-input"
          type="search"
          placeholder={t('sr_search_placeholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
          aria-describedby={searchSlashHintId}
        />
        <p id={searchSlashHintId} className="visually-hidden">
          {t('sr_search_slash_hint')}
        </p>

        <div className="select-research__filters">
          <div className="select-research__presets-row">
            <label
              className="select-research__presets-label"
              htmlFor="preset-select-field"
            >
              {t('sr_presets_build_label')}
            </label>
            <select
              id="preset-select-field"
              className="select-research__presets-select glow-input"
              value={activePresetId ?? ''}
              onChange={handlePresetSelect}
              disabled={!hydrated}
              aria-label={t('sr_preset_select_aria')}
            >
              <option value="">{t('sr_preset_scratch_option')}</option>
              {presets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="glow-btn glow-btn--block select-research__presets-btn"
              disabled={!hydrated}
              onClick={openPresetSaveDialog}
            >
              {t('sr_preset_save_as')}
            </button>
            <button
              type="button"
              className="glow-btn glow-btn--danger glow-btn--block select-research__presets-btn"
              disabled={!hydrated || !activePresetId}
              onClick={handleDeleteActivePreset}
              aria-label={t('sr_preset_delete_aria')}
            >
              {t('sr_preset_delete_build')}
            </button>
          </div>
        <label className="glow-btn glow-btn--toggle">
          <input
            type="checkbox"
            checked={hideCompleted}
            onChange={(e) => setHideCompleted(e.target.checked)}
          />
          {t('sr_hide_completed')}
        </label>
        <button
          type="button"
          className="glow-btn glow-btn--danger glow-btn--block"
          onClick={() => {
            setShareQr(null)
            setLabDataPanelOpen(false)
            setLabCompareOpen(false)
            setResetLevelsConfirmOpen(true)
          }}
        >
          {t('sr_reset_lab_levels')}
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
            className="glow-btn glow-btn--block select-research__filter-actions-launcher"
            onClick={() => {
              setShareQr(null)
              setLabCompareOpen(false)
              setLabDataPanelOpen(true)
            }}
            disabled={!hydrated}
            aria-haspopup="dialog"
            aria-expanded={labDataPanelOpen}
            aria-controls="lab-data-panel"
          >
            {t('sr_import_export_launcher')}
          </button>
          <button
            type="button"
            className="glow-btn glow-btn--block select-research__filter-actions-launcher"
            onClick={() => {
              setShareQr(null)
              setLabDataPanelOpen(false)
              setLabCompareOpen(true)
            }}
            disabled={!hydrated}
            aria-haspopup="dialog"
            aria-expanded={labCompareOpen}
            aria-controls="lab-compare-dialog"
          >
            {t('sr_compare_launcher')}
          </button>
        </div>
        {importNotice ? (
          <p className="select-research__import-notice" role="status">
            {importNotice}
          </p>
        ) : null}
      </div>
      </nav>

      <div
        className="select-research__budget"
        role="region"
        aria-labelledby="simulator-budget-title"
      >
        <h2 id="simulator-budget-title" className="select-research__budget-title">
          {t('sr_budget_title')}
        </h2>
        <p className="visually-hidden" aria-live="polite" aria-atomic="true">
          {fmt.simulatorBudgetAria(
            simulatorCoinLabels.spentLabel,
            simulatorCoinLabels.toMaxLabel,
            simulatorCoinLabels.nextVisibleLabel,
          )}
        </p>
        <dl className="select-research__budget-stats">
          <div className="select-research__budget-row">
            <dt>{t('sr_budget_spent_dt')}</dt>
            <dd>{simulatorCoinLabels.spentLabel}</dd>
          </div>
          <div className="select-research__budget-row">
            <dt>{t('sr_budget_to_max_dt')}</dt>
            <dd>{simulatorCoinLabels.toMaxLabel}</dd>
          </div>
          <div className="select-research__budget-row">
            <dt>{t('sr_budget_next_dt')}</dt>
            <dd>{simulatorCoinLabels.nextVisibleLabel}</dd>
          </div>
        </dl>
        <p className="select-research__budget-footnote">
          {t('sr_budget_footnote')}
        </p>
      </div>

      {labDataPanelOpen ? (
        <div
          className="select-research__lab-data-backdrop"
          role="presentation"
          onClick={() => setLabDataPanelOpen(false)}
        >
          <div
            id="lab-data-panel"
            className="select-research__lab-data-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lab-data-panel-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="lab-data-panel-title" className="select-research__lab-data-title">
              {t('sr_lab_data_title')}
            </h2>
            <p className="select-research__lab-data-intro">
              {t('sr_lab_data_intro')}
            </p>
            <p className="select-research__lab-data-section-label">{t('sr_lab_data_files')}</p>
            <div className="select-research__lab-data-actions">
              <button
                type="button"
                className="glow-btn glow-btn--block"
                onClick={() => {
                  setLabDataPanelOpen(false)
                  queueMicrotask(() => importFileInputRef.current?.click())
                }}
              >
                {t('sr_lab_import_file')}
              </button>
              <button
                type="button"
                className="glow-btn glow-btn--block"
                onClick={() => {
                  handleExportLevels()
                  setLabDataPanelOpen(false)
                }}
              >
                {t('sr_lab_export_file')}
              </button>
            </div>
            <p className="select-research__lab-data-section-label">{t('sr_lab_data_share')}</p>
            <div className="select-research__lab-data-actions">
              <button
                type="button"
                className="glow-btn glow-btn--block"
                onClick={async () => {
                  await handleCopyCleanShareLink()
                  setLabDataPanelOpen(false)
                }}
              >
                {t('sr_copy_short_link')}
              </button>
              <button
                type="button"
                className="glow-btn glow-btn--block"
                onClick={async () => {
                  await handleCopyFullShareLink()
                  setLabDataPanelOpen(false)
                }}
              >
                {t('sr_copy_full_url')}
              </button>
              <button
                type="button"
                className="glow-btn glow-btn--block"
                onClick={() => {
                  setLabDataPanelOpen(false)
                  void handleShowShareQr()
                }}
              >
                {t('sr_qr_share')}
              </button>
            </div>
            <button
              type="button"
              className="glow-btn glow-btn--block select-research__lab-data-close"
              onClick={() => setLabDataPanelOpen(false)}
            >
              {t('sr_close')}
            </button>
          </div>
        </div>
      ) : null}

      <LabCompareDialog
        data={data}
        open={labCompareOpen}
        onClose={() => setLabCompareOpen(false)}
        currentOverrides={levelOverrides}
        t={t}
        fmt={fmt}
      />

      {presetSaveDialogOpen ? (
        <div
          className="select-research__preset-save-backdrop"
          role="presentation"
          onClick={closePresetSaveDialog}
        >
          <div
            className="select-research__preset-save-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="preset-save-dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="preset-save-dialog-title"
              className="select-research__preset-save-title"
            >
              {t('sr_preset_prompt_title')}
            </h2>
            <form
              className="select-research__preset-save-form"
              onSubmit={(e) => {
                e.preventDefault()
                commitSavePresetFromDialog()
              }}
            >
              <label
                className="select-research__preset-save-label"
                htmlFor="preset-save-name-field"
              >
                {t('sr_preset_name_label')}
              </label>
              <input
                ref={presetSaveNameInputRef}
                id="preset-save-name-field"
                className="select-research__preset-save-input glow-input"
                type="text"
                value={presetSaveDraft}
                onChange={(e) => setPresetSaveDraft(e.target.value)}
                autoComplete="off"
                maxLength={120}
              />
              <div className="select-research__preset-save-actions">
                <button
                  type="button"
                  className="glow-btn glow-btn--block"
                  onClick={closePresetSaveDialog}
                >
                  {t('sr_cancel')}
                </button>
                <button type="submit" className="glow-btn glow-btn--block">
                  {t('sr_preset_dialog_save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <div
        className="select-research__sections"
        role="region"
        aria-label={t('sr_sections_aria')}
      >
        {data.sections.map((section, index) => (
          <ResearchSection
            key={`${section.sectionSlug}-${index}`}
            labDomIds={labDomIdsBySection[index] ?? []}
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
            sectionHeadEnd={
              index === 0 && sectionCount > 0 ? (
                <label
                  className="glow-btn glow-btn--toggle research-section__bulk-toggle"
                  htmlFor={BULK_SECTIONS_TOGGLE_ID}
                >
                  <input
                    id={BULK_SECTIONS_TOGGLE_ID}
                    ref={bulkAllSectionsToggleRef}
                    type="checkbox"
                    checked={allSectionsCollapsed}
                    onChange={handleBulkSectionsToggleChange}
                    aria-label={t('sr_bulk_collapse_aria')}
                  />
                  {t('sr_collapse_all')}
                </label>
              ) : undefined
            }
          />
        ))}
      </div>

      {shareQr ? (
        <div
          className="select-research__qr-backdrop"
          role="presentation"
          onClick={() => setShareQr(null)}
        >
          <div
            className="select-research__qr-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-qr-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="share-qr-title" className="select-research__qr-title">
              {t('sr_qr_dialog_title')}
            </h2>
            <img
              className="select-research__qr-img"
              src={shareQr.dataUrl}
              width={220}
              height={220}
              alt={t('sr_qr_image_alt')}
              decoding="async"
            />
            <p className="select-research__qr-hint">
              {t('sr_qr_hint')}
            </p>
            <div className="select-research__qr-actions">
              <button
                type="button"
                className="glow-btn glow-btn--block"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(shareQr.url)
                    setImportNotice(t('sr_notice_qr_link_copied'))
                  } catch {
                    setImportNotice(t('sr_notice_copy_fail_short'))
                  }
                }}
              >
                {t('sr_qr_copy_link')}
              </button>
              <button
                type="button"
                className="glow-btn glow-btn--block"
                onClick={() => setShareQr(null)}
              >
                {t('sr_close')}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {resetLevelsConfirmOpen ? (
        <div
          className="select-research__reset-confirm-backdrop"
          role="presentation"
          onClick={() => setResetLevelsConfirmOpen(false)}
        >
          <div
            className="select-research__reset-confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="reset-levels-confirm-title"
            aria-describedby="reset-levels-confirm-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="reset-levels-confirm-title" className="select-research__reset-confirm-title">
              {t('sr_reset_confirm_title')}
            </h2>
            <p id="reset-levels-confirm-desc" className="select-research__reset-confirm-desc">
              {t('sr_reset_confirm_body')}
            </p>
            <div className="select-research__reset-confirm-actions">
              <button
                type="button"
                className="glow-btn glow-btn--block"
                onClick={() => setResetLevelsConfirmOpen(false)}
              >
                {t('sr_cancel')}
              </button>
              <button
                type="button"
                className="glow-btn glow-btn--danger glow-btn--block"
                onClick={performResetLevels}
              >
                {t('sr_reset_all')}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <footer className="select-research__site-footer">
        <nav
          className="select-research__version-badge"
          aria-label={t('sr_footer_nav_aria')}
        >
          <span
            className="select-research__version-label"
            aria-label={fmt.versionAria(APP_VERSION)}
          >
            v{APP_VERSION}
          </span>
          <a
            className="select-research__changelog-link"
            href={CHANGELOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            title={t('sr_changelog_title')}
          >
            {t('sr_changelog')}
          </a>
        </nav>
      </footer>
    </section>
  )
}
