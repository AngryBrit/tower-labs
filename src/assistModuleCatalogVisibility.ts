import { useCallback, useEffect, useState } from 'react'

export const ASSIST_MODULE_CATALOG_VISIBLE_STORAGE_KEY =
  'tower-export-assist-module-catalog-visible-v1'

const CHANGE_EVENT = 'tower-export-assist-module-catalog-visible-change'

export function readAssistModuleCatalogVisible(): boolean {
  try {
    return localStorage.getItem(ASSIST_MODULE_CATALOG_VISIBLE_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function writeAssistModuleCatalogVisible(visible: boolean): void {
  try {
    localStorage.setItem(ASSIST_MODULE_CATALOG_VISIBLE_STORAGE_KEY, visible ? '1' : '0')
  } catch {
    /* ignore quota / private mode */
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
}

export function useAssistModuleCatalogVisible(): [boolean, (visible: boolean) => void] {
  const [visible, setVisible] = useState(readAssistModuleCatalogVisible)

  useEffect(() => {
    const sync = () => setVisible(readAssistModuleCatalogVisible())
    window.addEventListener(CHANGE_EVENT, sync)
    const onStorage = (e: StorageEvent) => {
      if (e.key === ASSIST_MODULE_CATALOG_VISIBLE_STORAGE_KEY || e.key === null) sync()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const setAssistModuleCatalogVisible = useCallback((next: boolean) => {
    writeAssistModuleCatalogVisible(next)
    setVisible(next)
  }, [])

  return [visible, setAssistModuleCatalogVisible]
}
