import { useCallback, useEffect, useState } from 'react'

export const SUBMODULES_CATALOG_VISIBLE_STORAGE_KEY =
  'tower-export-submodules-catalog-visible-v1'

const CHANGE_EVENT = 'tower-export-submodules-catalog-visible-change'

export function readSubmodulesCatalogVisible(): boolean {
  try {
    return localStorage.getItem(SUBMODULES_CATALOG_VISIBLE_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function writeSubmodulesCatalogVisible(visible: boolean): void {
  try {
    localStorage.setItem(SUBMODULES_CATALOG_VISIBLE_STORAGE_KEY, visible ? '1' : '0')
  } catch {
    /* ignore quota / private mode */
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
}

export function useSubmodulesCatalogVisible(): [boolean, (visible: boolean) => void] {
  const [visible, setVisible] = useState(readSubmodulesCatalogVisible)

  useEffect(() => {
    const sync = () => setVisible(readSubmodulesCatalogVisible())
    window.addEventListener(CHANGE_EVENT, sync)
    const onStorage = (e: StorageEvent) => {
      if (e.key === SUBMODULES_CATALOG_VISIBLE_STORAGE_KEY || e.key === null) sync()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const setSubmodulesCatalogVisible = useCallback((next: boolean) => {
    writeSubmodulesCatalogVisible(next)
    setVisible(next)
  }, [])

  return [visible, setSubmodulesCatalogVisible]
}
