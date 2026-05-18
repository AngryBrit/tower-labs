import { useCallback, useEffect, useState } from 'react'

export const CARDS_STAT_OVERLAY_VISIBLE_STORAGE_KEY =
  'tower-export-cards-stat-overlay-visible-v1'

const CHANGE_EVENT = 'tower-export-cards-stat-overlay-visible-change'

export function readCardsStatOverlayVisible(): boolean {
  try {
    const raw = localStorage.getItem(CARDS_STAT_OVERLAY_VISIBLE_STORAGE_KEY)
    if (raw === '0') return false
    return true
  } catch {
    return true
  }
}

export function writeCardsStatOverlayVisible(visible: boolean): void {
  try {
    localStorage.setItem(CARDS_STAT_OVERLAY_VISIBLE_STORAGE_KEY, visible ? '1' : '0')
  } catch {
    /* ignore quota / private mode */
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
}

export function useCardsStatOverlayVisible(): [boolean, (visible: boolean) => void] {
  const [visible, setVisible] = useState(readCardsStatOverlayVisible)

  useEffect(() => {
    const sync = () => setVisible(readCardsStatOverlayVisible())
    window.addEventListener(CHANGE_EVENT, sync)
    const onStorage = (e: StorageEvent) => {
      if (e.key === CARDS_STAT_OVERLAY_VISIBLE_STORAGE_KEY || e.key === null) sync()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const setCardsStatOverlayVisible = useCallback((next: boolean) => {
    writeCardsStatOverlayVisible(next)
    setVisible(next)
  }, [])

  return [visible, setCardsStatOverlayVisible]
}
