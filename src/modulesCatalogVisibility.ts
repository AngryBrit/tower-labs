import { useCallback, useEffect, useState } from 'react'

export const MODULES_CATALOG_VISIBLE_STORAGE_KEY = 'tower-export-modules-catalog-visible-v1'

const CHANGE_EVENT = 'tower-export-modules-catalog-visible-change'

export function readModulesCatalogVisible(): boolean {
  try {
    return localStorage.getItem(MODULES_CATALOG_VISIBLE_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function writeModulesCatalogVisible(visible: boolean): void {
  try {
    localStorage.setItem(MODULES_CATALOG_VISIBLE_STORAGE_KEY, visible ? '1' : '0')
  } catch {
    /* ignore quota / private mode */
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
}

export function useModulesCatalogVisible(): [boolean, (visible: boolean) => void] {
  const [visible, setVisible] = useState(readModulesCatalogVisible)

  useEffect(() => {
    const sync = () => setVisible(readModulesCatalogVisible())
    window.addEventListener(CHANGE_EVENT, sync)
    const onStorage = (e: StorageEvent) => {
      if (e.key === MODULES_CATALOG_VISIBLE_STORAGE_KEY || e.key === null) sync()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const setModulesCatalogVisible = useCallback((next: boolean) => {
    writeModulesCatalogVisible(next)
    setVisible(next)
  }, [])

  return [visible, setModulesCatalogVisible]
}
