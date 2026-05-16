import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { APP_VERSION, CHANGELOG_URL } from './appVersion'
import type { SelectResearchHandle } from './components/SelectResearch'
import { SelectResearch } from './components/SelectResearch'
import { ToolsSettingsPage } from './components/ToolsSettingsPage'
import { CardsPage } from './components/CardsPage'
import { ModulesPage } from './components/ModulesPage'
import { WorkshopPage } from './components/WorkshopPage'
import { defaultWorkshopPersisted, type WorkshopPersistedV1 } from './labPresetsStorage'
import { useI18n } from './i18n'
import { loadResearchData } from './loadResearchData'
import type { ResearchData } from './types/research'
import './App.css'

type MainPanel = 'research' | 'workshop' | 'modules' | 'cards' | 'toolsSettings'

export default function App() {
  const { t, fmt } = useI18n()
  const [mainPanel, setMainPanel] = useState<MainPanel>('research')
  const [inpanelPresetsMount, setInpanelPresetsMount] =
    useState<HTMLDivElement | null>(null)
  const [inpanelWorkshopToolbarMount, setInpanelWorkshopToolbarMount] =
    useState<HTMLDivElement | null>(null)
  const labToolsRef = useRef<SelectResearchHandle | null>(null)
  const fmtRef = useRef(fmt)
  useLayoutEffect(() => {
    fmtRef.current = fmt
  }, [fmt])

  const [data, setData] = useState<ResearchData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [workshopPersisted, setWorkshopPersisted] = useState<WorkshopPersistedV1>(() =>
    defaultWorkshopPersisted(),
  )
  const [scratchWorkshopPersisted, setScratchWorkshopPersisted] = useState<WorkshopPersistedV1>(
    () => defaultWorkshopPersisted(),
  )
  const [labLevelOverrides, setLabLevelOverrides] = useState<Record<string, number>>({})

  const handleLabLevelOverridesChange = useCallback((overrides: Record<string, number>) => {
    setLabLevelOverrides(overrides)
  }, [])

  useEffect(() => {
    const tab = workshopPersisted.mainTab
    if (tab === 'modules') setMainPanel('modules')
    else if (tab === 'cards') setMainPanel('cards')
  }, [workshopPersisted.mainTab])

  useEffect(() => {
    let cancelled = false
    const base = import.meta.env.BASE_URL
    loadResearchData(base, fmtRef.current)
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e))
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="app-root">
      <a href="#main-content" className="app-skip-link">
        {t('app_skipToMain')}
      </a>
      <main
        id="main-content"
        className="app-main"
        tabIndex={-1}
        aria-busy={loading}
      >
        {loading ? (
          <p className="app-status" role="status">
            {t('app_loadingResearch')}
          </p>
        ) : null}
        {error ? (
          <p className="app-status app-status--error" role="alert">
            {error}
          </p>
        ) : null}
        {data ? (
          <div className="app-shell">
            <div className="app-shell__page">
              <section
                className="select-research"
                aria-label={t('app_inpanel_tabs_aria')}
              >
                <nav
                  className="select-research__inpanel-tabs"
                  role="tablist"
                >
                  <button
                    id="inpanel-tab-lab"
                    type="button"
                    role="tab"
                    aria-selected={mainPanel === 'research'}
                    aria-controls="inpanel-panel-lab"
                    className={
                      mainPanel === 'research'
                        ? 'select-research__inpanel-tab select-research__inpanel-tab--on'
                        : 'select-research__inpanel-tab'
                    }
                    onClick={() => setMainPanel('research')}
                  >
                    {t('app_nav_research')}
                  </button>
                  <button
                    id="inpanel-tab-workshop"
                    type="button"
                    role="tab"
                    aria-selected={mainPanel === 'workshop'}
                    aria-controls="inpanel-panel-workshop"
                    className={
                      mainPanel === 'workshop'
                        ? 'select-research__inpanel-tab select-research__inpanel-tab--on'
                        : 'select-research__inpanel-tab'
                    }
                    onClick={() => {
                      setMainPanel('workshop')
                      const tab = workshopPersisted.mainTab
                      if (tab === 'modules' || tab === 'cards') {
                        setWorkshopPersisted({ ...workshopPersisted, mainTab: 'upgrade' })
                      }
                    }}
                  >
                    {t('app_nav_workshop')}
                  </button>
                  <button
                    id="inpanel-tab-modules"
                    type="button"
                    role="tab"
                    aria-selected={mainPanel === 'modules'}
                    aria-controls="inpanel-panel-modules"
                    className={
                      mainPanel === 'modules'
                        ? 'select-research__inpanel-tab select-research__inpanel-tab--on'
                        : 'select-research__inpanel-tab'
                    }
                    onClick={() => {
                      setMainPanel('modules')
                      setWorkshopPersisted({ ...workshopPersisted, mainTab: 'modules' })
                    }}
                  >
                    {t('app_nav_modules')}
                  </button>
                  <button
                    id="inpanel-tab-cards"
                    type="button"
                    role="tab"
                    aria-selected={mainPanel === 'cards'}
                    aria-controls="inpanel-panel-cards"
                    className={
                      mainPanel === 'cards'
                        ? 'select-research__inpanel-tab select-research__inpanel-tab--on'
                        : 'select-research__inpanel-tab'
                    }
                    onClick={() => {
                      setMainPanel('cards')
                      setWorkshopPersisted({ ...workshopPersisted, mainTab: 'cards' })
                    }}
                  >
                    {t('app_nav_cards')}
                  </button>
                  <button
                    id="inpanel-tab-tools-settings"
                    type="button"
                    role="tab"
                    aria-selected={mainPanel === 'toolsSettings'}
                    aria-controls="inpanel-panel-tools-settings"
                    className={
                      mainPanel === 'toolsSettings'
                        ? 'select-research__inpanel-tab select-research__inpanel-tab--on'
                        : 'select-research__inpanel-tab'
                    }
                    onClick={() => setMainPanel('toolsSettings')}
                  >
                    {t('app_nav_tools_settings')}
                  </button>
                </nav>

                <div
                  ref={setInpanelPresetsMount}
                  className="select-research__inpanel-presets-slot"
                  hidden={
                    mainPanel !== 'research' &&
                    mainPanel !== 'workshop' &&
                    mainPanel !== 'modules' &&
                    mainPanel !== 'cards'
                  }
                />

                <div
                  ref={setInpanelWorkshopToolbarMount}
                  className="select-research__inpanel-workshop-toolbar-slot"
                  hidden={mainPanel !== 'workshop'}
                />

                <div
                  id="inpanel-panel-lab"
                  role="tabpanel"
                  aria-labelledby="inpanel-tab-lab"
                  hidden={mainPanel !== 'research'}
                >
                  <SelectResearch
                    ref={labToolsRef}
                    data={data}
                    embeddedInPanel
                    embeddedPresetsMount={inpanelPresetsMount}
                    workshopPersisted={workshopPersisted}
                    scratchWorkshopPersisted={scratchWorkshopPersisted}
                    setWorkshopPersisted={setWorkshopPersisted}
                    setScratchWorkshopPersisted={setScratchWorkshopPersisted}
                    onLabLevelOverridesChange={handleLabLevelOverridesChange}
                  />
                </div>
                <div
                  id="inpanel-panel-workshop"
                  role="tabpanel"
                  aria-labelledby="inpanel-tab-workshop"
                  hidden={mainPanel !== 'workshop'}
                >
                  <WorkshopPage
                    embeddedInPanel
                    toolbarMount={
                      mainPanel === 'workshop'
                        ? inpanelWorkshopToolbarMount
                        : null
                    }
                    workshopPersisted={workshopPersisted}
                    onWorkshopPersistedChange={setWorkshopPersisted}
                    researchData={data}
                    labLevelOverrides={labLevelOverrides}
                  />
                </div>
                <div
                  id="inpanel-panel-modules"
                  role="tabpanel"
                  aria-labelledby="inpanel-tab-modules"
                  hidden={mainPanel !== 'modules'}
                >
                  <ModulesPage
                    embeddedInPanel
                    workshopPersisted={workshopPersisted}
                    onWorkshopPersistedChange={setWorkshopPersisted}
                    researchData={data}
                    labLevelOverrides={labLevelOverrides}
                  />
                </div>
                <div
                  id="inpanel-panel-cards"
                  role="tabpanel"
                  aria-labelledby="inpanel-tab-cards"
                  hidden={mainPanel !== 'cards'}
                >
                  <CardsPage
                    embeddedInPanel
                    workshopPersisted={workshopPersisted}
                    onWorkshopPersistedChange={setWorkshopPersisted}
                  />
                </div>
                <div
                  id="inpanel-panel-tools-settings"
                  role="tabpanel"
                  aria-labelledby="inpanel-tab-tools-settings"
                  hidden={mainPanel !== 'toolsSettings'}
                >
                  <ToolsSettingsPage labToolsRef={labToolsRef} />
                </div>

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
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}
