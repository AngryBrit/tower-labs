import { createContext } from 'react'
import type { I18nFormatters, StringId } from './dictionary'
import type { AppLocale, ResearchLabelKind } from './types'

export type I18nContextValue = {
  locale: AppLocale
  setLocale: (locale: AppLocale) => void
  t: (id: StringId) => string
  fmt: I18nFormatters
  /** Spanish overlays for research section titles and card names (English fallback). */
  researchLabel: (
    sectionSlug: string,
    itemIndex: number | undefined,
    english: string,
    kind: ResearchLabelKind,
  ) => string
  /** Localize dynamic research benefit lines (unlock prompts, wave counts, etc.). */
  researchBenefitLine: (line: string) => string
}

export const I18nReactContext = createContext<I18nContextValue | null>(null)
