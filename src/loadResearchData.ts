import {
  parseResearchManifest,
  parseResearchSection,
  type ResearchData,
} from './types/research'
import type { I18nFormatters } from './i18n/dictionary'

export async function loadResearchData(
  baseUrl: string,
  fmt: I18nFormatters,
): Promise<ResearchData> {
  const manifestUrl = `${baseUrl}research/manifest.json`
  const manifestRes = await fetch(manifestUrl, { cache: 'no-store' })
  if (!manifestRes.ok) {
    throw new Error(fmt.manifestLoadError(manifestRes.status))
  }
  const manifestRaw: unknown = await manifestRes.json()
  const { sectionFiles } = parseResearchManifest(manifestRaw)

  const sections = await Promise.all(
    sectionFiles.map(async (rel) => {
      const url = `${baseUrl}${rel.replace(/^\//, '')}`
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) {
        throw new Error(fmt.sectionLoadError(rel, res.status))
      }
      const json: unknown = await res.json()
      const slug = rel.replace(/^\//, '').split('/').pop()!.replace(/\.json$/i, '')
      return parseResearchSection(json, slug)
    }),
  )

  return { sections }
}
