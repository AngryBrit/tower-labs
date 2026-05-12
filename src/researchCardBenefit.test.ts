import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  UNLOCK_LAB_LV0_LABELS,
  benefitDisplayForCard,
  benefitLineWithNextUpgrade,
  getLevelBounds,
  parseResearchManifest,
  parseResearchSection,
  type ResearchItem,
} from './types/research'

const srcDir = dirname(fileURLToPath(import.meta.url))

function loadAllSections() {
  const manifestRaw: unknown = JSON.parse(
    readFileSync(join(srcDir, '../public/research/manifest.json'), 'utf-8'),
  )
  const { sectionFiles } = parseResearchManifest(manifestRaw)
  return sectionFiles.map((rel: string) => {
    const raw: unknown = JSON.parse(
      readFileSync(join(srcDir, '../public', rel.replace(/^\//, '')), 'utf-8'),
    )
    return parseResearchSection(raw)
  })
}

function expectedBenefitLineAtLv0(item: ResearchItem, max: number): string {
  if (
    Object.prototype.hasOwnProperty.call(UNLOCK_LAB_LV0_LABELS, item.name) ||
    item.name === 'Target Priority'
  ) {
    return benefitDisplayForCard(item, 0, max)
  }
  if (max <= 0) {
    return `${benefitDisplayForCard(item, 0, max)} » —`
  }
  const left = benefitDisplayForCard(item, 0, max)
  let right: string
  if (item.name === 'Labs Speed' || item.name === 'Buy Multiplier') {
    right = left
    for (let L = 1; L <= max; L++) {
      const cand = benefitDisplayForCard(item, L, max)
      if (cand !== left) {
        right = cand
        break
      }
    }
  } else {
    right = benefitDisplayForCard(item, 1, max)
  }
  if (left === right) {
    return `${left} » —`
  }
  return `${left} » ${right}`
}

describe('benefitLineWithNextUpgrade (research-card__benefit)', () => {
  describe('Lv.0 for every item in public/research manifest', () => {
    for (const section of loadAllSections()) {
      describe(section.title, () => {
        for (const item of section.items) {
          it(item.name, () => {
            const { max } = getLevelBounds(item)
            expect(benefitLineWithNextUpgrade(item, 0, max)).toBe(
              expectedBenefitLineAtLv0(item, max),
            )
          })
        }
      })
    }
  })

  describe('MAIN RESEARCH spot checks', () => {
    const main = loadAllSections().find((s) => s.title === 'MAIN RESEARCH')
    if (!main) throw new Error('fixture missing MAIN RESEARCH')

    const gameSpeed = main.items.find((i) => i.name === 'Game Speed')
    const labsCoin = main.items.find((i) => i.name === 'Labs Coin Discount')
    const startingCash = main.items.find((i) => i.name === 'Starting Cash')

    it('Starting Cash mid / max', () => {
      expect(startingCash).toBeDefined()
      const max = startingCash!.maxLevel ?? 99
      expect(benefitLineWithNextUpgrade(startingCash!, 4, max)).toBe(
        '+$20 » +$25',
      )
      expect(benefitLineWithNextUpgrade(startingCash!, max, max)).toBe('+$495')
    })

    it('Game Speed mid / max', () => {
      expect(gameSpeed).toBeDefined()
      const max = gameSpeed!.maxLevel ?? 7
      expect(benefitLineWithNextUpgrade(gameSpeed!, 4, max)).toBe(
        'x3.5 » x4.0',
      )
      expect(benefitLineWithNextUpgrade(gameSpeed!, max, max)).toBe('x5.0')
    })

    it('Labs Coin Discount at Lv.4', () => {
      expect(labsCoin).toBeDefined()
      expect(
        benefitLineWithNextUpgrade(labsCoin!, 4, labsCoin!.maxLevel ?? 99),
      ).toBe('1.20% » 1.50%')
    })

    it('Workshop Respec shows unlock copy (single line, no »)', () => {
      const wr = main.items.find((i) => i.name === 'Workshop Respec')
      expect(wr).toBeDefined()
      const max = wr!.maxLevel ?? 1
      expect(benefitDisplayForCard(wr!, 0, max)).toBe('Unlock Workshop Respec')
      expect(benefitDisplayForCard(wr!, 1, max)).toBe('Unlocked')
      expect(benefitLineWithNextUpgrade(wr!, 0, max)).toBe('Unlock Workshop Respec')
      expect(benefitLineWithNextUpgrade(wr!, max, max)).toBe('Unlocked')
    })

    it('Reroll Daily Mission shows unlock copy (single line, no »)', () => {
      const rdm = main.items.find((i) => i.name === 'Reroll Daily Mission')
      expect(rdm).toBeDefined()
      const max = rdm!.maxLevel ?? 1
      expect(benefitDisplayForCard(rdm!, 0, max)).toBe(
        'Unlock Reroll Daily Mission',
      )
      expect(benefitDisplayForCard(rdm!, 1, max)).toBe('Unlocked')
      expect(benefitLineWithNextUpgrade(rdm!, 0, max)).toBe(
        'Unlock Reroll Daily Mission',
      )
      expect(benefitLineWithNextUpgrade(rdm!, max, max)).toBe('Unlocked')
    })

    it('Workshop Enhancements shows unlock copy (single line, no »)', () => {
      const we = main.items.find((i) => i.name === 'Workshop Enhancements')
      expect(we).toBeDefined()
      const max = we!.maxLevel ?? 1
      expect(benefitDisplayForCard(we!, 0, max)).toBe(
        'Unlock Workshop Enhancements',
      )
      expect(benefitDisplayForCard(we!, 1, max)).toBe('Unlocked')
      expect(benefitLineWithNextUpgrade(we!, 0, max)).toBe(
        'Unlock Workshop Enhancements',
      )
      expect(benefitLineWithNextUpgrade(we!, max, max)).toBe('Unlocked')
    })

    it('Card Presets shows unlock copy (single line, no »)', () => {
      const cp = main.items.find((i) => i.name === 'Card Presets')
      expect(cp).toBeDefined()
      const max = cp!.maxLevel ?? 1
      expect(benefitDisplayForCard(cp!, 0, max)).toBe('Unlock Card Presets')
      expect(benefitDisplayForCard(cp!, 1, max)).toBe('Unlocked')
      expect(benefitLineWithNextUpgrade(cp!, 0, max)).toBe('Unlock Card Presets')
      expect(benefitLineWithNextUpgrade(cp!, max, max)).toBe('Unlocked')
    })

    it('More Round Stats shows unlock copy (Lv.0 vs Lv.1)', () => {
      const mrs = main.items.find((i) => i.name === 'More Round Stats')
      expect(mrs).toBeDefined()
      const max = mrs!.maxLevel ?? 1
      expect(benefitDisplayForCard(mrs!, 0, max)).toBe('Unlock Round Stats')
      expect(benefitDisplayForCard(mrs!, 1, max)).toBe('Unlocked')
      expect(benefitLineWithNextUpgrade(mrs!, 0, max)).toBe('Unlock Round Stats')
      expect(benefitLineWithNextUpgrade(mrs!, max, max)).toBe('Unlocked')
    })

    it('Target Priority shows three-stage copy (single line per level, no »)', () => {
      const tp = main.items.find((i) => i.name === 'Target Priority')
      expect(tp).toBeDefined()
      const max = tp!.maxLevel ?? 2
      expect(benefitDisplayForCard(tp!, 0, max)).toBe('Unlock Target Priority')
      expect(benefitDisplayForCard(tp!, 1, max)).toBe('Better Target Priority')
      expect(benefitDisplayForCard(tp!, 2, max)).toBe('Unlocked')
      expect(benefitLineWithNextUpgrade(tp!, 0, max)).toBe('Unlock Target Priority')
      expect(benefitLineWithNextUpgrade(tp!, 1, max)).toBe('Better Target Priority')
      expect(benefitLineWithNextUpgrade(tp!, max, max)).toBe('Unlocked')
    })

    it('Buy Multiplier matches calculator Value (x1…x4)', () => {
      const buyMul = main.items.find((i) => i.name === 'Buy Multiplier')
      expect(buyMul).toBeDefined()
      const max = buyMul!.maxLevel ?? 4
      expect(benefitDisplayForCard(buyMul!, 0, max)).toBe('x1')
      expect(benefitDisplayForCard(buyMul!, 1, max)).toBe('x1')
      expect(benefitDisplayForCard(buyMul!, 4, max)).toBe('x4')
      expect(benefitLineWithNextUpgrade(buyMul!, 0, max)).toBe('x1 » x2')
      expect(benefitLineWithNextUpgrade(buyMul!, 3, max)).toBe('x3 » x4')
      expect(benefitLineWithNextUpgrade(buyMul!, max, max)).toBe('x4')
    })

    it('Labs Speed uses calculator Value column (tier steps from L28)', () => {
      const labsSpeed = main.items.find((i) => i.name === 'Labs Speed')
      expect(labsSpeed).toBeDefined()
      const max = labsSpeed!.maxLevel ?? 99
      expect(benefitDisplayForCard(labsSpeed!, 0, max)).toBe('x0.0')
      expect(benefitDisplayForCard(labsSpeed!, 1, max)).toBe('x0.0')
      expect(benefitDisplayForCard(labsSpeed!, 27, max)).toBe('x0.5')
      expect(benefitDisplayForCard(labsSpeed!, 28, max)).toBe('x0.6')
      expect(benefitDisplayForCard(labsSpeed!, 33, max)).toBe('x0.7')
      expect(benefitDisplayForCard(labsSpeed!, 99, max)).toBe('x2.0')
      expect(benefitLineWithNextUpgrade(labsSpeed!, 0, max)).toBe('x0.0 » x0.1')
      expect(benefitLineWithNextUpgrade(labsSpeed!, 26, max)).toBe(
        'x0.5 » x0.6',
      )
      expect(benefitLineWithNextUpgrade(labsSpeed!, 27, max)).toBe(
        'x0.5 » x0.6',
      )
      expect(benefitLineWithNextUpgrade(labsSpeed!, max, max)).toBe('x2.0')
    })

    it('Workshop Attack Discount uses calculator Value (0.50% per level)', () => {
      const workshop = main.items.find(
        (i) => i.name === 'Workshop Attack Discount',
      )
      expect(workshop).toBeDefined()
      const max = workshop!.maxLevel ?? 99
      expect(benefitLineWithNextUpgrade(workshop!, 0, max)).toBe(
        '0.00% » 0.50%',
      )
      expect(benefitLineWithNextUpgrade(workshop!, 4, max)).toBe(
        '2.00% » 2.50%',
      )
      expect(benefitLineWithNextUpgrade(workshop!, 28, max)).toBe(
        '14.00% » 14.50%',
      )
    })
  })

  describe('BATTLE CONDITION spot checks', () => {
    const battle = loadAllSections().find((s) => s.title === 'BATTLE CONDITION')
    if (!battle) throw new Error('fixture missing BATTLE CONDITION')

    it('Battle Condition Reduction uses calculator Value (x0.00..x10.00)', () => {
      const bcr = battle.items.find((i) => i.name === 'Battle Condition Reduction')
      expect(bcr).toBeDefined()
      const max = bcr!.maxLevel ?? 10
      expect(benefitDisplayForCard(bcr!, 0, max)).toBe('x0.00')
      expect(benefitDisplayForCard(bcr!, 1, max)).toBe('x1.00')
      expect(benefitDisplayForCard(bcr!, 10, max)).toBe('x10.00')
      expect(benefitLineWithNextUpgrade(bcr!, 0, max)).toBe('x0.00 » x1.00')
      expect(benefitLineWithNextUpgrade(bcr!, 9, max)).toBe('x9.00 » x10.00')
      expect(benefitLineWithNextUpgrade(bcr!, max, max)).toBe('x10.00')
    })
  })

  describe('ATTACK RESEARCH spot checks', () => {
    const attack = loadAllSections().find((s) => s.title === 'ATTACK RESEARCH')
    if (!attack) throw new Error('fixture missing ATTACK RESEARCH')

    it('Damage uses calculator Value (x1.00..x3.00)', () => {
      const dmg = attack.items.find((i) => i.name === 'Damage')
      expect(dmg).toBeDefined()
      const max = dmg!.maxLevel ?? 100
      expect(benefitDisplayForCard(dmg!, 0, max)).toBe('x1.00')
      expect(benefitDisplayForCard(dmg!, 1, max)).toBe('x1.02')
      expect(benefitDisplayForCard(dmg!, 50, max)).toBe('x2.00')
      expect(benefitDisplayForCard(dmg!, 100, max)).toBe('x3.00')
      expect(benefitLineWithNextUpgrade(dmg!, 0, max)).toBe('x1.00 » x1.02')
      expect(benefitLineWithNextUpgrade(dmg!, 99, max)).toBe('x2.98 » x3.00')
      expect(benefitLineWithNextUpgrade(dmg!, max, max)).toBe('x3.00')
    })

    it('Attack Speed uses same calculator Value as Damage (max 99 → x2.98)', () => {
      const as = attack.items.find((i) => i.name === 'Attack Speed')
      expect(as).toBeDefined()
      const max = as!.maxLevel ?? 99
      expect(benefitDisplayForCard(as!, 0, max)).toBe('x1.00')
      expect(benefitDisplayForCard(as!, 1, max)).toBe('x1.02')
      expect(benefitDisplayForCard(as!, 99, max)).toBe('x2.98')
      expect(benefitLineWithNextUpgrade(as!, 0, max)).toBe('x1.00 » x1.02')
      expect(benefitLineWithNextUpgrade(as!, 98, max)).toBe('x2.96 » x2.98')
      expect(benefitLineWithNextUpgrade(as!, max, max)).toBe('x2.98')
    })

    it('Critical Factor uses calculator Value (+0.03 per level → x3.97 at max)', () => {
      const cf = attack.items.find((i) => i.name === 'Critical Factor')
      expect(cf).toBeDefined()
      const max = cf!.maxLevel ?? 99
      expect(benefitDisplayForCard(cf!, 0, max)).toBe('x1.00')
      expect(benefitDisplayForCard(cf!, 1, max)).toBe('x1.03')
      expect(benefitDisplayForCard(cf!, 29, max)).toBe('x1.87')
      expect(benefitDisplayForCard(cf!, 99, max)).toBe('x3.97')
      expect(benefitLineWithNextUpgrade(cf!, 0, max)).toBe('x1.00 » x1.03')
      expect(benefitLineWithNextUpgrade(cf!, 98, max)).toBe('x3.94 » x3.97')
      expect(benefitLineWithNextUpgrade(cf!, max, max)).toBe('x3.97')
    })

    it('Range uses same calculator Value as Damage (max 80 → x2.60)', () => {
      const range = attack.items.find((i) => i.name === 'Range')
      expect(range).toBeDefined()
      const max = range!.maxLevel ?? 80
      expect(benefitDisplayForCard(range!, 0, max)).toBe('x1.00')
      expect(benefitDisplayForCard(range!, 1, max)).toBe('x1.02')
      expect(benefitDisplayForCard(range!, 80, max)).toBe('x2.60')
      expect(benefitLineWithNextUpgrade(range!, 0, max)).toBe('x1.00 » x1.02')
      expect(benefitLineWithNextUpgrade(range!, 79, max)).toBe('x2.58 » x2.60')
      expect(benefitLineWithNextUpgrade(range!, max, max)).toBe('x2.60')
    })

    it('Damage / Meter uses same calculator Value as Damage (max 99 → x2.98)', () => {
      const dm = attack.items.find((i) => i.name === 'Damage / Meter')
      expect(dm).toBeDefined()
      const max = dm!.maxLevel ?? 99
      expect(benefitDisplayForCard(dm!, 0, max)).toBe('x1.00')
      expect(benefitDisplayForCard(dm!, 1, max)).toBe('x1.02')
      expect(benefitDisplayForCard(dm!, 99, max)).toBe('x2.98')
      expect(benefitLineWithNextUpgrade(dm!, 0, max)).toBe('x1.00 » x1.02')
      expect(benefitLineWithNextUpgrade(dm!, 98, max)).toBe('x2.96 » x2.98')
      expect(benefitLineWithNextUpgrade(dm!, max, max)).toBe('x2.98')
    })

    it('Super Crit Chance uses calculator Value (+0.10% per level, Include %)', () => {
      const scc = attack.items.find((i) => i.name === 'Super Crit Chance')
      expect(scc).toBeDefined()
      const max = scc!.maxLevel ?? 50
      expect(benefitDisplayForCard(scc!, 0, max)).toBe('+0.00%')
      expect(benefitDisplayForCard(scc!, 1, max)).toBe('+0.10%')
      expect(benefitDisplayForCard(scc!, 10, max)).toBe('+1.00%')
      expect(benefitDisplayForCard(scc!, 29, max)).toBe('+2.90%')
      expect(benefitDisplayForCard(scc!, 50, max)).toBe('+5.00%')
      expect(benefitLineWithNextUpgrade(scc!, 0, max)).toBe('+0.00% » +0.10%')
      expect(benefitLineWithNextUpgrade(scc!, 49, max)).toBe('+4.90% » +5.00%')
      expect(benefitLineWithNextUpgrade(scc!, max, max)).toBe('+5.00%')
    })

    it('Super Crit Multi uses calculator Value (+0.02/level multiplier, same curve as Damage)', () => {
      const scm = attack.items.find((i) => i.name === 'Super Crit Multi')
      expect(scm).toBeDefined()
      const max = scm!.maxLevel ?? 40
      expect(benefitDisplayForCard(scm!, 0, max)).toBe('x1.00')
      expect(benefitDisplayForCard(scm!, 1, max)).toBe('x1.02')
      expect(benefitDisplayForCard(scm!, 29, max)).toBe('x1.58')
      expect(benefitDisplayForCard(scm!, 40, max)).toBe('x1.80')
      expect(benefitLineWithNextUpgrade(scm!, 0, max)).toBe('x1.00 » x1.02')
      expect(benefitLineWithNextUpgrade(scm!, 39, max)).toBe('x1.78 » x1.80')
      expect(benefitLineWithNextUpgrade(scm!, max, max)).toBe('x1.80')
    })

    it('Max Rend Armor Multiplier uses calculator Value ((800 + 25 × level) ÷ 100, x + 3 decimals)', () => {
      const mram = attack.items.find((i) => i.name === 'Max Rend Armor Multiplier')
      expect(mram).toBeDefined()
      const max = mram!.maxLevel ?? 30
      expect(benefitDisplayForCard(mram!, 0, max)).toBe('x8.000')
      expect(benefitDisplayForCard(mram!, 1, max)).toBe('x8.250')
      expect(benefitDisplayForCard(mram!, 10, max)).toBe('x10.500')
      expect(benefitDisplayForCard(mram!, 30, max)).toBe('x15.500')
      expect(benefitLineWithNextUpgrade(mram!, 0, max)).toBe('x8.000 » x8.250')
      expect(benefitLineWithNextUpgrade(mram!, 29, max)).toBe('x15.250 » x15.500')
      expect(benefitLineWithNextUpgrade(mram!, max, max)).toBe('x15.500')
    })

    it('Light Speed Shots is an unlock lab (single line, no »)', () => {
      const lss = attack.items.find((i) => i.name === 'Light Speed Shots')
      expect(lss).toBeDefined()
      const max = lss!.maxLevel ?? 1
      expect(benefitDisplayForCard(lss!, 0, max)).toBe('Unlock Light Speed Shots')
      expect(benefitDisplayForCard(lss!, 1, max)).toBe('Unlocked')
      expect(benefitLineWithNextUpgrade(lss!, 0, max)).toBe('Unlock Light Speed Shots')
      expect(benefitLineWithNextUpgrade(lss!, max, max)).toBe('Unlocked')
    })
  })

  describe('UTILITY RESEARCH spot checks', () => {
    const utility = loadAllSections().find((s) => s.title === 'UTILITY RESEARCH')
    if (!utility) throw new Error('fixture missing UTILITY RESEARCH')

    it('Cash Bonus uses calculator Value (x1 + 0.02 per level, same as Damage)', () => {
      const cb = utility.items.find((i) => i.name === 'Cash Bonus')
      expect(cb).toBeDefined()
      const max = cb!.maxLevel ?? 99
      expect(benefitDisplayForCard(cb!, 0, max)).toBe('x1.00')
      expect(benefitDisplayForCard(cb!, 1, max)).toBe('x1.02')
      expect(benefitDisplayForCard(cb!, 29, max)).toBe('x1.58')
      expect(benefitDisplayForCard(cb!, 99, max)).toBe('x2.98')
      expect(benefitLineWithNextUpgrade(cb!, 0, max)).toBe('x1.00 » x1.02')
      expect(benefitLineWithNextUpgrade(cb!, 98, max)).toBe('x2.96 » x2.98')
      expect(benefitLineWithNextUpgrade(cb!, max, max)).toBe('x2.98')
    })

    it('Cash / Wave uses same calculator Value as Cash Bonus (x1 + 0.02 per level)', () => {
      const cw = utility.items.find((i) => i.name === 'Cash / Wave')
      expect(cw).toBeDefined()
      const max = cw!.maxLevel ?? 99
      expect(benefitDisplayForCard(cw!, 0, max)).toBe('x1.00')
      expect(benefitDisplayForCard(cw!, 1, max)).toBe('x1.02')
      expect(benefitDisplayForCard(cw!, 29, max)).toBe('x1.58')
      expect(benefitDisplayForCard(cw!, 99, max)).toBe('x2.98')
      expect(benefitLineWithNextUpgrade(cw!, 0, max)).toBe('x1.00 » x1.02')
      expect(benefitLineWithNextUpgrade(cw!, max, max)).toBe('x2.98')
    })

    it('Coins / Kill Bonus uses same x1 + 0.02/level Value as Cash Bonus', () => {
      const item = utility.items.find((i) => i.name === 'Coins / Kill Bonus')
      expect(item).toBeDefined()
      const max = item!.maxLevel ?? 99
      expect(benefitDisplayForCard(item!, 0, max)).toBe('x1.00')
      expect(benefitDisplayForCard(item!, 1, max)).toBe('x1.02')
      expect(benefitDisplayForCard(item!, 99, max)).toBe('x2.98')
      expect(benefitLineWithNextUpgrade(item!, 0, max)).toBe('x1.00 » x1.02')
      expect(benefitLineWithNextUpgrade(item!, max, max)).toBe('x2.98')
    })

    it('Coins / Wave uses same x1 + 0.02/level Value as Cash Bonus', () => {
      const item = utility.items.find((i) => i.name === 'Coins / Wave')
      expect(item).toBeDefined()
      const max = item!.maxLevel ?? 99
      expect(benefitDisplayForCard(item!, 0, max)).toBe('x1.00')
      expect(benefitDisplayForCard(item!, 1, max)).toBe('x1.02')
      expect(benefitDisplayForCard(item!, 99, max)).toBe('x2.98')
      expect(benefitLineWithNextUpgrade(item!, 0, max)).toBe('x1.00 » x1.02')
      expect(benefitLineWithNextUpgrade(item!, max, max)).toBe('x2.98')
    })

    it('Interest uses same x1 + 0.02/level Value as Cash Bonus', () => {
      const item = utility.items.find((i) => i.name === 'Interest')
      expect(item).toBeDefined()
      const max = item!.maxLevel ?? 99
      expect(benefitDisplayForCard(item!, 0, max)).toBe('x1.00')
      expect(benefitDisplayForCard(item!, 1, max)).toBe('x1.02')
      expect(benefitDisplayForCard(item!, 29, max)).toBe('x1.58')
      expect(benefitDisplayForCard(item!, 99, max)).toBe('x2.98')
      expect(benefitLineWithNextUpgrade(item!, 0, max)).toBe('x1.00 » x1.02')
      expect(benefitLineWithNextUpgrade(item!, max, max)).toBe('x2.98')
    })

    it('Max Interest uses calculator Value column ($ per level, max 15)', () => {
      const item = utility.items.find((i) => i.name === 'Max Interest')
      expect(item).toBeDefined()
      const max = item!.maxLevel ?? 15
      expect(benefitDisplayForCard(item!, 0, max)).toBe('$50')
      expect(benefitDisplayForCard(item!, 1, max)).toBe('$100')
      expect(benefitDisplayForCard(item!, 4, max)).toBe('$500')
      expect(benefitDisplayForCard(item!, 10, max)).toBe('$3500')
      expect(benefitDisplayForCard(item!, 15, max)).toBe('$15000')
      expect(benefitLineWithNextUpgrade(item!, 0, max)).toBe('$50 » $100')
      expect(benefitLineWithNextUpgrade(item!, 14, max)).toBe('$12500 » $15000')
      expect(benefitLineWithNextUpgrade(item!, max, max)).toBe('$15000')
    })

    it('Package After Boss shows unlock copy (single line, no »)', () => {
      const pab = utility.items.find((i) => i.name === 'Package After Boss')
      expect(pab).toBeDefined()
      const max = pab!.maxLevel ?? 1
      expect(benefitDisplayForCard(pab!, 0, max)).toBe(
        'Unlock Package After Boss',
      )
      expect(benefitDisplayForCard(pab!, 1, max)).toBe('Unlocked')
      expect(benefitLineWithNextUpgrade(pab!, 0, max)).toBe(
        'Unlock Package After Boss',
      )
      expect(benefitLineWithNextUpgrade(pab!, max, max)).toBe('Unlocked')
    })

    it('Recovery Package labs use calculator Value (+0.40% per level, Include %)', () => {
      for (const name of [
        'Recovery Package Amount',
        'Recovery Package Max',
        'Recovery Package Chance',
      ] as const) {
        const lab = utility.items.find((i) => i.name === name)
        expect(lab).toBeDefined()
        const max = lab!.maxLevel ?? 20
        expect(benefitDisplayForCard(lab!, 0, max)).toBe('+0.00%')
        expect(benefitDisplayForCard(lab!, 1, max)).toBe('+0.40%')
        expect(benefitDisplayForCard(lab!, 20, max)).toBe('+8.00%')
        expect(benefitLineWithNextUpgrade(lab!, 0, max)).toBe(
          '+0.00% » +0.40%',
        )
        expect(benefitLineWithNextUpgrade(lab!, 19, max)).toBe(
          '+7.60% » +8.00%',
        )
        expect(benefitLineWithNextUpgrade(lab!, max, max)).toBe('+8.00%')
      }
    })
  })

  describe('DEFENSE RESEARCH spot checks', () => {
    const defense = loadAllSections().find((s) => s.title === 'DEFENSE RESEARCH')
    if (!defense) throw new Error('fixture missing DEFENSE RESEARCH')

    it('Health uses calculator Value (+0.03/level x…, same curve as Critical Factor)', () => {
      const h = defense.items.find((i) => i.name === 'Health')
      expect(h).toBeDefined()
      const max = h!.maxLevel ?? 100
      expect(benefitDisplayForCard(h!, 0, max)).toBe('x1.00')
      expect(benefitDisplayForCard(h!, 1, max)).toBe('x1.03')
      expect(benefitDisplayForCard(h!, 29, max)).toBe('x1.87')
      expect(benefitDisplayForCard(h!, 100, max)).toBe('x4.00')
      expect(benefitLineWithNextUpgrade(h!, 0, max)).toBe('x1.00 » x1.03')
      expect(benefitLineWithNextUpgrade(h!, max, max)).toBe('x4.00')
    })

    it('Health Regen and Defense Absolute match Health calculator Value', () => {
      const regen = defense.items.find((i) => i.name === 'Health Regen')
      const abs = defense.items.find((i) => i.name === 'Defense Absolute')
      expect(regen).toBeDefined()
      expect(abs).toBeDefined()
      const maxR = regen!.maxLevel ?? 100
      const maxA = abs!.maxLevel ?? 100
      expect(benefitDisplayForCard(regen!, 1, maxR)).toBe('x1.03')
      expect(benefitDisplayForCard(abs!, 100, maxA)).toBe('x4.00')
    })

    it('Defense % uses calculator Value (+0.20% per level, Include %)', () => {
      const dp = defense.items.find((i) => i.name === 'Defense %')
      expect(dp).toBeDefined()
      const max = dp!.maxLevel ?? 50
      expect(benefitDisplayForCard(dp!, 0, max)).toBe('+0.00%')
      expect(benefitDisplayForCard(dp!, 1, max)).toBe('+0.20%')
      expect(benefitDisplayForCard(dp!, 29, max)).toBe('+5.80%')
      expect(benefitDisplayForCard(dp!, 50, max)).toBe('+10.00%')
      expect(benefitLineWithNextUpgrade(dp!, 0, max)).toBe('+0.00% » +0.20%')
      expect(benefitLineWithNextUpgrade(dp!, 49, max)).toBe('+9.80% » +10.00%')
      expect(benefitLineWithNextUpgrade(dp!, max, max)).toBe('+10.00%')
    })

    it('Orb Boss Hit uses same +0.20%/level Value as Defense % (Include %)', () => {
      const obh = defense.items.find((i) => i.name === 'Orb Boss Hit')
      expect(obh).toBeDefined()
      const max = obh!.maxLevel ?? 10
      expect(benefitDisplayForCard(obh!, 0, max)).toBe('+0.00%')
      expect(benefitDisplayForCard(obh!, 1, max)).toBe('+0.20%')
      expect(benefitDisplayForCard(obh!, 10, max)).toBe('+2.00%')
      expect(benefitLineWithNextUpgrade(obh!, 0, max)).toBe('+0.00% » +0.20%')
      expect(benefitLineWithNextUpgrade(obh!, max, max)).toBe('+2.00%')
    })

    it('Wall Health uses calculator Value (+2.00% per level, Include %)', () => {
      const wh = defense.items.find((i) => i.name === 'Wall Health')
      expect(wh).toBeDefined()
      const max = wh!.maxLevel ?? 50
      expect(benefitDisplayForCard(wh!, 0, max)).toBe('+0.00%')
      expect(benefitDisplayForCard(wh!, 1, max)).toBe('+2.00%')
      expect(benefitDisplayForCard(wh!, 29, max)).toBe('+58.00%')
      expect(benefitDisplayForCard(wh!, 50, max)).toBe('+100.00%')
      expect(benefitLineWithNextUpgrade(wh!, 0, max)).toBe('+0.00% » +2.00%')
      expect(benefitLineWithNextUpgrade(wh!, max, max)).toBe('+100.00%')
    })

    it('Wall Regen uses calculator Value (+10.00% per level, Include %)', () => {
      const wrg = defense.items.find((i) => i.name === 'Wall Regen')
      expect(wrg).toBeDefined()
      const max = wrg!.maxLevel ?? 30
      expect(benefitDisplayForCard(wrg!, 0, max)).toBe('+0.00%')
      expect(benefitDisplayForCard(wrg!, 1, max)).toBe('+10.00%')
      expect(benefitDisplayForCard(wrg!, 10, max)).toBe('+100.00%')
      expect(benefitDisplayForCard(wrg!, 30, max)).toBe('+300.00%')
      expect(benefitLineWithNextUpgrade(wrg!, 0, max)).toBe('+0.00% » +10.00%')
      expect(benefitLineWithNextUpgrade(wrg!, max, max)).toBe('+300.00%')
    })

    it('Wall Thorns uses calculator Value (+1.00% per level, Include %)', () => {
      const wt = defense.items.find((i) => i.name === 'Wall Thorns')
      expect(wt).toBeDefined()
      const max = wt!.maxLevel ?? 20
      expect(benefitDisplayForCard(wt!, 0, max)).toBe('+0.00%')
      expect(benefitDisplayForCard(wt!, 1, max)).toBe('+1.00%')
      expect(benefitDisplayForCard(wt!, 10, max)).toBe('+10.00%')
      expect(benefitDisplayForCard(wt!, 20, max)).toBe('+20.00%')
      expect(benefitLineWithNextUpgrade(wt!, 0, max)).toBe('+0.00% » +1.00%')
      expect(benefitLineWithNextUpgrade(wt!, max, max)).toBe('+20.00%')
    })

    it('Wall Fortification uses calculator Value (+20.00% per level, Include %)', () => {
      const wf = defense.items.find((i) => i.name === 'Wall Fortification')
      expect(wf).toBeDefined()
      const max = wf!.maxLevel ?? 60
      expect(benefitDisplayForCard(wf!, 0, max)).toBe('+0.00%')
      expect(benefitDisplayForCard(wf!, 1, max)).toBe('+20.00%')
      expect(benefitDisplayForCard(wf!, 29, max)).toBe('+580.00%')
      expect(benefitDisplayForCard(wf!, 60, max)).toBe('+1200.00%')
      expect(benefitLineWithNextUpgrade(wf!, 0, max)).toBe('+0.00% » +20.00%')
      expect(benefitLineWithNextUpgrade(wf!, max, max)).toBe('+1200.00%')
    })

    it('Garlic Thorns uses calculator Value (+0.5% per level, one decimal, Include %)', () => {
      const gt = defense.items.find((i) => i.name === 'Garlic Thorns')
      expect(gt).toBeDefined()
      const max = gt!.maxLevel ?? 10
      expect(benefitDisplayForCard(gt!, 0, max)).toBe('+0.0%')
      expect(benefitDisplayForCard(gt!, 1, max)).toBe('+0.5%')
      expect(benefitDisplayForCard(gt!, 5, max)).toBe('+2.5%')
      expect(benefitDisplayForCard(gt!, 10, max)).toBe('+5.0%')
      expect(benefitLineWithNextUpgrade(gt!, 0, max)).toBe('+0.0% » +0.5%')
      expect(benefitLineWithNextUpgrade(gt!, max, max)).toBe('+5.0%')
    })

    it('Wall Invincibility uses calculator Value (+1.0s per level, one decimal)', () => {
      const wi = defense.items.find((i) => i.name === 'Wall Invincibility')
      expect(wi).toBeDefined()
      const max = wi!.maxLevel ?? 10
      expect(benefitDisplayForCard(wi!, 0, max)).toBe('+0.0s')
      expect(benefitDisplayForCard(wi!, 1, max)).toBe('+1.0s')
      expect(benefitDisplayForCard(wi!, 5, max)).toBe('+5.0s')
      expect(benefitDisplayForCard(wi!, 10, max)).toBe('+10.0s')
      expect(benefitLineWithNextUpgrade(wi!, 0, max)).toBe('+0.0s » +1.0s')
      expect(benefitLineWithNextUpgrade(wi!, max, max)).toBe('+10.0s')
    })

    it('Wall Rebuild uses calculator Value (−10s per level, one decimal)', () => {
      const wr = defense.items.find((i) => i.name === 'Wall Rebuild')
      expect(wr).toBeDefined()
      const max = wr!.maxLevel ?? 20
      expect(benefitDisplayForCard(wr!, 0, max)).toBe('-0.0s')
      expect(benefitDisplayForCard(wr!, 1, max)).toBe('-10.0s')
      expect(benefitDisplayForCard(wr!, 5, max)).toBe('-50.0s')
      expect(benefitDisplayForCard(wr!, 10, max)).toBe('-100.0s')
      expect(benefitDisplayForCard(wr!, 20, max)).toBe('-200.0s')
      expect(benefitLineWithNextUpgrade(wr!, 0, max)).toBe('-0.0s » -10.0s')
      expect(benefitLineWithNextUpgrade(wr!, max, max)).toBe('-200.0s')
    })

    it('Orbs Speed uses calculator stepping (+0.10 per level, no % suffix)', () => {
      const os = defense.items.find((i) => i.name === 'Orbs Speed')
      expect(os).toBeDefined()
      const max = os!.maxLevel ?? 20
      expect(benefitDisplayForCard(os!, 0, max)).toBe('+0.00')
      expect(benefitDisplayForCard(os!, 1, max)).toBe('+0.10')
      expect(benefitDisplayForCard(os!, 20, max)).toBe('+2.00')
      expect(benefitLineWithNextUpgrade(os!, 0, max)).toBe('+0.00 » +0.10')
      expect(benefitLineWithNextUpgrade(os!, max, max)).toBe('+2.00')
    })

    it('Land Mine Damage uses calculator Value (+10% per level, whole number %)', () => {
      const lmd = defense.items.find((i) => i.name === 'Land Mine Damage')
      expect(lmd).toBeDefined()
      const max = lmd!.maxLevel ?? 20
      expect(benefitDisplayForCard(lmd!, 0, max)).toBe('+0%')
      expect(benefitDisplayForCard(lmd!, 1, max)).toBe('+10%')
      expect(benefitDisplayForCard(lmd!, 20, max)).toBe('+200%')
      expect(benefitLineWithNextUpgrade(lmd!, 0, max)).toBe('+0% » +10%')
      expect(benefitLineWithNextUpgrade(lmd!, max, max)).toBe('+200%')
    })

    it('Land Mine Decay uses calculator Value (+0.50s per level, seconds)', () => {
      const decay = defense.items.find((i) => i.name === 'Land Mine Decay')
      expect(decay).toBeDefined()
      const max = decay!.maxLevel ?? 35
      expect(benefitDisplayForCard(decay!, 0, max)).toBe('+0.00s')
      expect(benefitDisplayForCard(decay!, 1, max)).toBe('+0.50s')
      expect(benefitDisplayForCard(decay!, 29, max)).toBe('+14.50s')
      expect(benefitDisplayForCard(decay!, 35, max)).toBe('+17.50s')
      expect(benefitLineWithNextUpgrade(decay!, 0, max)).toBe('+0.00s » +0.50s')
      expect(benefitLineWithNextUpgrade(decay!, max, max)).toBe('+17.50s')
    })

    it('Shockwave Size uses calculator Value (+0.05 per level, + only, trim zeros)', () => {
      const sw = defense.items.find((i) => i.name === 'Shockwave Size')
      expect(sw).toBeDefined()
      const max = sw!.maxLevel ?? 20
      expect(benefitDisplayForCard(sw!, 0, max)).toBe('+0.00')
      expect(benefitDisplayForCard(sw!, 1, max)).toBe('+0.05')
      expect(benefitDisplayForCard(sw!, 2, max)).toBe('+0.1')
      expect(benefitDisplayForCard(sw!, 20, max)).toBe('+1')
      expect(benefitLineWithNextUpgrade(sw!, 0, max)).toBe('+0.00 » +0.05')
      expect(benefitLineWithNextUpgrade(sw!, max, max)).toBe('+1')
    })
  })
})
