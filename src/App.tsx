import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { APP_VERSION, CHANGELOG_URL } from './appVersion'
import type { SelectResearchHandle } from './components/SelectResearch'
import { SelectResearch } from './components/SelectResearch'
import { SettingsPage } from './components/SettingsPage'
import { ToolsPage } from './components/ToolsPage'
import { WorkshopPage } from './components/WorkshopPage'
import { useI18n } from './i18n'
import { loadResearchData } from './loadResearchData'
import type { ResearchData } from './types/research'
import './App.css'

type MainPanel = 'research' | 'workshop' | 'tools' | 'settings'

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
                    onClick={() => setMainPanel('workshop')}
                  >
                    {t('app_nav_workshop')}
                  </button>
                  <button
                    id="inpanel-tab-tools"
                    type="button"
                    role="tab"
                    aria-selected={mainPanel === 'tools'}
                    aria-controls="inpanel-panel-tools"
                    className={
                      mainPanel === 'tools'
                        ? 'select-research__inpanel-tab select-research__inpanel-tab--on'
                        : 'select-research__inpanel-tab'
                    }
                    onClick={() => setMainPanel('tools')}
                  >
                    {t('app_nav_tools')}
                  </button>
                  <button
                    id="inpanel-tab-settings"
                    type="button"
                    role="tab"
                    aria-selected={mainPanel === 'settings'}
                    aria-controls="inpanel-panel-settings"
                    className={
                      mainPanel === 'settings'
                        ? 'select-research__inpanel-tab select-research__inpanel-tab--on'
                        : 'select-research__inpanel-tab'
                    }
                    onClick={() => setMainPanel('settings')}
                  >
                    {t('app_nav_settings')}
                  </button>
                </nav>

                <div
                  ref={setInpanelPresetsMount}
                  className="select-research__inpanel-presets-slot"
                  hidden={
                    mainPanel !== 'research' && mainPanel !== 'workshop'
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
                  />
                </div>
                <div
                  id="inpanel-panel-tools"
                  role="tabpanel"
                  aria-labelledby="inpanel-tab-tools"
                  hidden={mainPanel !== 'tools'}
                >
                  <ToolsPage labToolsRef={labToolsRef} />
                </div>
                <div
                  id="inpanel-panel-settings"
                  role="tabpanel"
                  aria-labelledby="inpanel-tab-settings"
                  hidden={mainPanel !== 'settings'}
                >
                  <SettingsPage />
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
