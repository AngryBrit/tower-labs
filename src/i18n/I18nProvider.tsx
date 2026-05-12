import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  FORMAT_EN,
  FORMAT_ES,
  STRINGS_EN,
  STRINGS_ES,
  type StringId,
} from './dictionary'
import { LOCALE_STORAGE_KEY, readStoredLocale } from './constants'
import { I18nReactContext, type I18nContextValue } from './I18nContext'
import researchOverlayEs from './research-overlay.es.json' with { type: 'json' }
import { translateResearchBenefitLine } from './researchBenefitTranslate'
import type { AppLocale, ResearchLabelKind } from './types'

type ResearchOverlayEsFile = {
  sections: Record<string, string>
  items: Record<string, string>
}

const RESEARCH_ES = researchOverlayEs as ResearchOverlayEsFile

function pickResearchLabel(
  locale: AppLocale,
  sectionSlug: string,
  itemIndex: number | undefined,
  english: string,
  kind: ResearchLabelKind,
): string {
  if (locale !== 'es') return english
  if (kind === 'section') {
    return RESEARCH_ES.sections[sectionSlug] ?? english
  }
  if (itemIndex == null) return english
  return RESEARCH_ES.items[`${sectionSlug}:${itemIndex}`] ?? english
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(readStoredLocale)

  const setLocale = useCallback((next: AppLocale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  useLayoutEffect(() => {
    document.documentElement.lang = locale === 'es' ? 'es' : 'en'
  }, [locale])

  const value = useMemo((): I18nContextValue => {
    const strings = locale === 'es' ? STRINGS_ES : STRINGS_EN
    const fmt = locale === 'es' ? FORMAT_ES : FORMAT_EN
    const fallback = STRINGS_EN

    function t(id: StringId): string {
      const s = strings[id]
      if (s !== undefined && s !== '') return s
      return fallback[id] ?? id
    }

    const researchLabel: I18nContextValue['researchLabel'] = (
      sectionSlug,
      itemIndex,
      english,
      kind,
    ) => pickResearchLabel(locale, sectionSlug, itemIndex, english, kind)

    const researchBenefitLine: I18nContextValue['researchBenefitLine'] = (
      line,
    ) => translateResearchBenefitLine(locale, line)

    return { locale, setLocale, t, fmt, researchLabel, researchBenefitLine }
  }, [locale, setLocale])

  return (
    <I18nReactContext.Provider value={value}>
      {children}
    </I18nReactContext.Provider>
  )
}
