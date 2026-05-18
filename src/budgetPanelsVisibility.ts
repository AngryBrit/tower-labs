import { useCallback, useEffect, useState } from 'react'

export const BUDGET_PANELS_VISIBLE_STORAGE_KEY = 'tower-export-budget-panels-visible-v1'

const CHANGE_EVENT = 'tower-export-budget-panels-visible-change'

export function readBudgetPanelsVisible(): boolean {
  try {
    const raw = localStorage.getItem(BUDGET_PANELS_VISIBLE_STORAGE_KEY)
    if (raw === '0') return false
    return true
  } catch {
    return true
  }
}

export function writeBudgetPanelsVisible(visible: boolean): void {
  try {
    localStorage.setItem(BUDGET_PANELS_VISIBLE_STORAGE_KEY, visible ? '1' : '0')
  } catch {
    /* ignore quota / private mode */
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
}

export function useBudgetPanelsVisible(): [boolean, (visible: boolean) => void] {
  const [visible, setVisible] = useState(readBudgetPanelsVisible)

  useEffect(() => {
    const sync = () => setVisible(readBudgetPanelsVisible())
    window.addEventListener(CHANGE_EVENT, sync)
    const onStorage = (e: StorageEvent) => {
      if (e.key === BUDGET_PANELS_VISIBLE_STORAGE_KEY || e.key === null) sync()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const setBudgetPanelsVisible = useCallback((next: boolean) => {
    writeBudgetPanelsVisible(next)
    setVisible(next)
  }, [])

  return [visible, setBudgetPanelsVisible]
}
