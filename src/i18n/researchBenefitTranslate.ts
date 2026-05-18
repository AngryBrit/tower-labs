import type { AppLocale } from './types'
import { UNLOCK_LAB_LV0_LABELS } from '../types/research'

/** German for unlock-lab Lv.0 prompts — keys match `UNLOCK_LAB_LV0_LABELS`. */
const UNLOCK_LAB_BENEFIT_DE: Record<string, string> = {
  'More Round Stats': 'Runden-Stats freischalten',
  'Card Presets': 'Karten-Presets freischalten',
  'Package After Boss': 'Paket nach Boss freischalten',
  'Workshop Respec': 'Werkstatt-Umspezialisierung freischalten',
  'Reroll Daily Mission': 'Tägliche Mission neu würfeln freischalten',
  'Workshop Enhancements': 'Werkstatt-Verstärkungen freischalten',
  'Light Speed Shots': 'Lichtgeschwindigkeits-Schüsse freischalten',
  'Missiles Explosion': 'Raketen-Explosion freischalten',
  'Chrono Field Damage Reduction':
    'Chrono-Feld-Schadensreduktion freischalten',
  'Swamp Stun': 'Sumpf-Betäubung freischalten',
  'Chain Lightning Shock': 'Kettenblitz freischalten',
  'Missile Barrage': 'Raketen-Salve freischalten',
  'Inner Mine Stun': 'Inner-Mine-Betäubung freischalten',
  'Extra Black Hole': 'Zusätzliches Black Hole freischalten',
  'Black Hole Disable Ranged Enemies':
    'Black Hole deaktiviert Fernkampf-Gegner freischalten',
  'Extra Orb Adjuster': 'Extra-Orb-Adjuster freischalten',
  'Unlock Perks': 'Perks freischalten',
  'Auto Pick Perks': 'Perks automatisch wählen freischalten',
  'First Perk Choice': 'Erste Perk-Wahl freischalten',
  'Unmerge Module': 'Modul entflechten freischalten',
}

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

const EXTRA_PHRASE_PAIRS_ES: readonly [string, string][] = [
  ['Better Target Priority', 'Mejor prioridad de objetivo'],
  ['Unlock Spotlight Missiles', 'Desbloquear misiles del foco'],
  ['Unlock Target Priority', 'Desbloquear prioridad de objetivo'],
  ['Unlocked', 'Desbloqueado'],
]

const EXTRA_PHRASE_PAIRS_DE: readonly [string, string][] = [
  ['Better Target Priority', 'Bessere Zielpriorität'],
  ['Unlock Spotlight Missiles', 'Spotlight-Raketen freischalten'],
  ['Unlock Target Priority', 'Zielpriorität freischalten'],
  ['Unlocked', 'Freigeschaltet'],
]

function buildOrderedPhrasePairs(
  locale: 'es' | 'de',
): [string, string][] {
  const extra = locale === 'de' ? EXTRA_PHRASE_PAIRS_DE : EXTRA_PHRASE_PAIRS_ES
  const unlockMap =
    locale === 'de' ? UNLOCK_LAB_BENEFIT_DE : UNLOCK_LAB_BENEFIT_ES
  const pairs: [string, string][] = [...extra]
  for (const name of Object.keys(UNLOCK_LAB_LV0_LABELS)) {
    const en = UNLOCK_LAB_LV0_LABELS[name]
    const localized = unlockMap[name]
    if (typeof en === 'string' && typeof localized === 'string') {
      pairs.push([en, localized])
    }
  }
  pairs.sort((a, b) => b[0].length - a[0].length)
  return pairs
}

const ORDERED_PHRASE_PAIRS_ES = buildOrderedPhrasePairs('es')
const ORDERED_PHRASE_PAIRS_DE = buildOrderedPhrasePairs('de')

function translateBenefitSegment(segment: string, locale: 'es' | 'de'): string {
  const pairs =
    locale === 'de' ? ORDERED_PHRASE_PAIRS_DE : ORDERED_PHRASE_PAIRS_ES
  let s = segment
  for (const [en, localized] of pairs) {
    if (s.includes(en)) {
      s = s.split(en).join(localized)
    }
  }
  if (locale === 'de') {
    s = s.replace(/(\d+)\s+waves\b/gi, '$1 Wellen')
  } else {
    s = s.replace(/(\d+)\s+waves\b/gi, '$1 oleadas')
  }
  return s
}

/** Localize computed benefit lines (unlock prompts, waves text, etc.). */
export function translateResearchBenefitLine(
  locale: AppLocale,
  line: string,
): string {
  if (locale !== 'es' && locale !== 'de') return line
  const parts = line.split(' » ')
  return parts
    .map((p) => translateBenefitSegment(p, locale))
    .join(' » ')
}
