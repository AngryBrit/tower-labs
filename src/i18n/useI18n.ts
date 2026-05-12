import { useContext } from 'react'
import { I18nReactContext, type I18nContextValue } from './I18nContext'

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nReactContext)
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return ctx
}
