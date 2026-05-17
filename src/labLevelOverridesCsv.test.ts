import { describe, expect, it } from 'vitest'
import { escapeCsvCell, parseCsvLine, sortOverrideKeys } from './labLevelOverridesCsv'

describe('labLevelOverridesCsv', () => {
  it('parseCsvLine handles quoted commas and escaped quotes', () => {
    expect(parseCsvLine('a,"b,c","d""e"')).toEqual(['a', 'b,c', 'd"e'])
  })

  it('escapeCsvCell quotes cells with commas or quotes', () => {
    expect(escapeCsvCell('plain')).toBe('plain')
    expect(escapeCsvCell('a,b')).toBe('"a,b"')
    expect(escapeCsvCell('say "hi"')).toBe('"say ""hi"""')
  })

  it('sortOverrideKeys orders section-item keys', () => {
    expect(sortOverrideKeys(['1-0', '0-2', '0-10', '0-1'])).toEqual([
      '0-1',
      '0-2',
      '0-10',
      '1-0',
    ])
  })
})
