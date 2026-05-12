import { describe, expect, it } from 'vitest'
import {
  buildLabDomIdTables,
  labDomIdsForSectionItems,
  slugifySegment,
} from './labSlug'
import type { ResearchData } from './types/research'

describe('slugifySegment', () => {
  it('lowercases and hyphenates', () => {
    expect(slugifySegment('ATTACK RESEARCH')).toBe('attack-research')
    expect(slugifySegment('Damage')).toBe('damage')
  })

  it('strips diacritics', () => {
    expect(slugifySegment('Café')).toBe('cafe')
  })

  it('falls back for empty-ish input', () => {
    expect(slugifySegment('   !!!   ')).toBe('item')
  })
})

describe('labDomIdsForSectionItems', () => {
  it('joins section slug and item slug with double hyphen', () => {
    expect(
      labDomIdsForSectionItems('attack-research', [
        { name: 'Damage' },
        { name: 'Attack Speed' },
      ]),
    ).toEqual(['attack-research--damage', 'attack-research--attack-speed'])
  })

  it('disambiguates duplicate item names by item index', () => {
    expect(
      labDomIdsForSectionItems('foo', [
        { name: 'Bar' },
        { name: 'Baz' },
        { name: 'Bar' },
      ]),
    ).toEqual(['foo--bar', 'foo--baz', 'foo--bar-2'])
  })
})

describe('buildLabDomIdTables', () => {
  it('maps ids to positions and handles duplicate section titles', () => {
    const data: ResearchData = {
      sections: [
        {
          sectionSlug: 'main',
          title: 'MAIN',
          items: [
            {
              name: 'X',
              level: '',
              benefit: '',
              time: '',
              cost: '',
              state: 'default',
            },
          ],
        },
        {
          sectionSlug: 'main',
          title: 'MAIN',
          items: [
            {
              name: 'Y',
              level: '',
              benefit: '',
              time: '',
              cost: '',
              state: 'default',
            },
          ],
        },
      ],
    }
    const { labDomIdsBySection, labSlugToPosition } = buildLabDomIdTables(data)
    expect(labDomIdsBySection[0][0]).toBe('main--x')
    expect(labDomIdsBySection[1][0]).toMatch(/^main-1--y$/)
    expect(labSlugToPosition.get('main--x')).toEqual({ si: 0, ii: 0 })
    expect(labSlugToPosition.get(labDomIdsBySection[1][0])).toEqual({
      si: 1,
      ii: 0,
    })
  })

  it('assigns a unique DOM id for every item', () => {
    const item = {
      name: 'A',
      level: '',
      benefit: '',
      time: '',
      cost: '',
      state: 'default' as const,
    }
    const data: ResearchData = {
      sections: [
        { sectionSlug: 's1', title: 'S1', items: [item, { ...item, name: 'B' }] },
        { sectionSlug: 's2', title: 'S2', items: [{ ...item, name: 'A' }] },
      ],
    }
    const { labDomIdsBySection, labSlugToPosition } = buildLabDomIdTables(data)
    const flat = labDomIdsBySection.flat()
    expect(new Set(flat).size).toBe(flat.length)
    expect(labSlugToPosition.size).toBe(flat.length)
  })
})
