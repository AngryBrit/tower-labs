import type { AppLocale } from './types'

export const LOCALE_STORAGE_KEY = 'tower-export-locale-v1'

export const SUPPORTED_LOCALES: readonly AppLocale[] = ['en', 'es'] as const

export function readStoredLocale(): AppLocale {
  try {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (raw === 'en' || raw === 'es') return raw
  } catch {
    /* private mode */
  }
  return 'en'
}
