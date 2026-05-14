import { describe, expect, it } from 'vitest'
import {
  buildLabPresetsPayload,
  defaultWorkshopPersisted,
  parseLabPresetsFile,
} from './labPresetsStorage'

describe('parseLabPresetsFile', () => {
  it('accepts a valid v1 file', () => {
    const raw = {
      v: 1,
      activePresetId: 'a',
      presets: [{ id: 'a', name: 'A', levelOverrides: { '0-0': 1 } }],
      scratchOverrides: { '0-1': 2 },
    }
    expect(parseLabPresetsFile(raw)).toEqual(raw)
  })

  it('rejects invalid preset entries', () => {
    expect(
      parseLabPresetsFile({
        v: 1,
        presets: [{ id: 1, name: 'x', levelOverrides: {} }],
        scratchOverrides: {},
      }),
    ).toBeNull()
  })
})

describe('buildLabPresetsPayload', () => {
  const def = defaultWorkshopPersisted()

  it('merges active preset levels into presets array', () => {
    const p = buildLabPresetsPayload(
      'a',
      [{ id: 'a', name: 'A', levelOverrides: { '0-0': 0 } }],
      { '0-0': 5 },
      {},
      def,
      def,
    )
    expect(p.presets[0].levelOverrides).toEqual({ '0-0': 5 })
    expect(p.presets[0].workshop).toEqual(def)
    expect(p.scratchOverrides).toEqual({})
    expect(p.scratchWorkshop).toEqual(def)
  })

  it('writes scratch when no active preset', () => {
    const p = buildLabPresetsPayload(null, [], { '1-1': 3 }, {}, def, def)
    expect(p.scratchOverrides).toEqual({ '1-1': 3 })
    expect(p.scratchWorkshop).toEqual(def)
  })
})
