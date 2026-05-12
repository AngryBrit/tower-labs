import { useEffect, useState } from 'react'
import { SelectResearch } from './components/SelectResearch'
import {
  parseResearchManifest,
  parseResearchSection,
  type ResearchData,
} from './types/research'
import './App.css'

async function loadResearch(): Promise<ResearchData> {
  const base = import.meta.env.BASE_URL
  const manifestUrl = `${base}research/manifest.json`
  const manifestRes = await fetch(manifestUrl, { cache: 'no-store' })
  if (!manifestRes.ok) {
    throw new Error(
      `Could not load research manifest (${manifestRes.status})`,
    )
  }
  const manifestRaw: unknown = await manifestRes.json()
  const { sectionFiles } = parseResearchManifest(manifestRaw)

  const sections = await Promise.all(
    sectionFiles.map(async (rel) => {
      const url = `${base}${rel.replace(/^\//, '')}`
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) {
        throw new Error(`Could not load ${rel} (${res.status})`)
      }
      const json: unknown = await res.json()
      return parseResearchSection(json)
    }),
  )

  return { sections }
}

export default function App() {
  const [data, setData] = useState<ResearchData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    loadResearch()
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
      {loading ? <p className="app-status">Loading research…</p> : null}
      {error ? (
        <p className="app-status app-status--error" role="alert">
          {error}
        </p>
      ) : null}
      {data ? <SelectResearch data={data} /> : null}
      <p className="app-hint">
        Edit <code>public/research/</code> (manifest + section JSON) and{' '}
        <code>src/data/tower-labs.json</code> for lab costs/times, then refresh.
      </p>
    </div>
  )
}
