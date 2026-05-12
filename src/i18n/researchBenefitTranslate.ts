import type { AppLocale } from './types'
import { UNLOCK_LAB_LV0_LABELS } from '../types/research'

/** Spanish for unlock-lab Lv.0 prompts — keys match `UNLOCK_LAB_LV0_LABELS`. */
const UNLOCK_LAB_BENEFIT_ES: Record<string, string> = {
  'More Round Stats': 'Desbloquear estadísticas de ronda',
  'Card Presets': 'Desbloquear ajustes predefinidos de cartas',
  'Package After Boss': 'Desbloquear paquete tras el jefe',
  'Workshop Respec': 'Desbloquear reespecificación del taller',
  'Reroll Daily Mission': 'Desbloquear nueva tirada de misión diaria',
  'Workshop Enhancements': 'Desbloquear mejoras del taller',
  'Light Speed Shots': 'Desbloquear disparos a velocidad de la luz',
  'Missiles Explosion': 'Desbloquear explosión de misiles',
  'Chrono Field Damage Reduction':
    'Desbloquear reducción de daño del campo crono',
  'Swamp Stun': 'Desbloquear aturdimiento del pantano',
  'Chain Lightning Shock': 'Desbloquear descarga en cadena',
  'Missile Barrage': 'Desbloquear descarga de misiles',
  'Inner Mine Stun': 'Desbloquear aturdimiento de mina interior',
  'Extra Black Hole': 'Desbloquear agujero negro adicional',
  'Black Hole Disable Ranged Enemies':
    'Desbloquear que el agujero negro desactive enemigos a distancia',
  'Extra Orb Adjuster': 'Desbloquear ajustador de orbes extra',
  'Unlock Perks': 'Desbloquear ventajas',
  'Auto Pick Perks': 'Desbloquear autoelección de ventajas',
  'First Perk Choice': 'Desbloquear primera elección de ventaja',
  'Unmerge Module': 'Desbloquear desfusión de módulos',
}

const EXTRA_PHRASE_PAIRS: readonly [string, string][] = [
  ['Better Target Priority', 'Mejor prioridad de objetivo'],
  ['Unlock Target Priority', 'Desbloquear prioridad de objetivo'],
  ['Unlocked', 'Desbloqueado'],
]

function buildOrderedPhrasePairs(): [string, string][] {
  const pairs: [string, string][] = [...EXTRA_PHRASE_PAIRS]
  for (const name of Object.keys(UNLOCK_LAB_LV0_LABELS)) {
    const en = UNLOCK_LAB_LV0_LABELS[name]
    const es = UNLOCK_LAB_BENEFIT_ES[name]
    if (typeof en === 'string' && typeof es === 'string') {
      pairs.push([en, es])
    }
  }
  pairs.sort((a, b) => b[0].length - a[0].length)
  return pairs
}

const ORDERED_PHRASE_PAIRS = buildOrderedPhrasePairs()

function translateBenefitSegment(segment: string): string {
  let s = segment
  for (const [en, es] of ORDERED_PHRASE_PAIRS) {
    if (s.includes(en)) {
      s = s.split(en).join(es)
    }
  }
  s = s.replace(/(\d+)\s+waves\b/gi, '$1 oleadas')
  return s
}

/** Localize computed benefit lines (unlock prompts, waves text, etc.). */
export function translateResearchBenefitLine(
  locale: AppLocale,
  line: string,
): string {
  if (locale !== 'es') return line
  const parts = line.split(' » ')
  return parts.map((p) => translateBenefitSegment(p)).join(' » ')
}
