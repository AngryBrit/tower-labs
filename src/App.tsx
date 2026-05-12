import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SelectResearch } from './components/SelectResearch'
import { useI18n } from './i18n'
import { loadResearchData } from './loadResearchData'
import type { ResearchData } from './types/research'
import './App.css'

export default function App() {
  const { t, fmt } = useI18n()
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
        {data ? <SelectResearch data={data} /> : null}
      </main>
    </div>
  )
}
