import { describe, expect, it } from 'vitest'
import {
  ASSIST_MODULE_LEVEL_KEY,
  clampWorkshopAssistModuleLevel,
  workshopAssistModuleLevel,
} from './workshopSimModules'

describe('workshopAssistModuleLevel', () => {
  it('reads per-slot levels from persisted workshop', () => {
    const ws = {
      simCannonModuleLevel: 101,
      simArmorModuleLevel: 60,
      simGeneratorModuleLevel: 100,
      simCoreModuleLevel: 42,
    }
    expect(workshopAssistModuleLevel(ws, 'cannon')).toBe(101)
    expect(workshopAssistModuleLevel(ws, 'armor')).toBe(60)
    expect(ASSIST_MODULE_LEVEL_KEY.core).toBe('simCoreModuleLevel')
  })

  it('clamps module levels to 0–999', () => {
    expect(clampWorkshopAssistModuleLevel(-5)).toBe(0)
    expect(clampWorkshopAssistModuleLevel(1000)).toBe(999)
    expect(clampWorkshopAssistModuleLevel(12.9)).toBe(12)
  })
})
