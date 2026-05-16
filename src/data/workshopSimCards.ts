/**
 * In-game **Cards** sim (wiki star tables) for workshop displayed-damage.
 */

/** Wiki **Cards/Damage** star multipliers (stars 1…7). */
export const WORKSHOP_DAMAGE_CARD_STAR_MULTIPLIERS: readonly number[] = [
  1.5, 2, 2.4, 2.8, 3.2, 3.6, 4,
] as const

/** Wiki **Cards/Berserker** % of damage taken per star (stars 1…7). */
export const WORKSHOP_BERSERKER_CARD_STAR_PERCENTS: readonly number[] = [
  0.008, 0.009, 0.01, 0.011, 0.012, 0.013, 0.014,
] as const

export const WORKSHOP_DAMAGE_CARD_MAX_STARS = 7 as const
export const WORKSHOP_ATTACK_SPEED_CARD_MAX_STARS = 7 as const
export const WORKSHOP_BERSERKER_CARD_MAX_STARS = 7 as const

/** Wiki **Cards/Attack Speed** star multipliers (stars 1…7). */
export const WORKSHOP_ATTACK_SPEED_CARD_STAR_MULTIPLIERS: readonly number[] = [
  1.25, 1.4, 1.55, 1.7, 1.85, 2, 2.15,
] as const

export function workshopAttackSpeedCardMultiplier(stars: number): number {
  const s = Math.trunc(stars)
  if (s <= 0) return 1
  if (s >= WORKSHOP_ATTACK_SPEED_CARD_STAR_MULTIPLIERS.length) {
    return WORKSHOP_ATTACK_SPEED_CARD_STAR_MULTIPLIERS[
      WORKSHOP_ATTACK_SPEED_CARD_STAR_MULTIPLIERS.length - 1
    ]!
  }
  return WORKSHOP_ATTACK_SPEED_CARD_STAR_MULTIPLIERS[s - 1]!
}

export function workshopDamageCardMultiplier(stars: number): number {
  const s = Math.trunc(stars)
  if (s <= 0) return 1
  if (s >= WORKSHOP_DAMAGE_CARD_STAR_MULTIPLIERS.length) {
    return WORKSHOP_DAMAGE_CARD_STAR_MULTIPLIERS[WORKSHOP_DAMAGE_CARD_STAR_MULTIPLIERS.length - 1]!
  }
  return WORKSHOP_DAMAGE_CARD_STAR_MULTIPLIERS[s - 1]!
}

export function workshopBerserkerCardPercent(stars: number): number {
  const s = Math.trunc(stars)
  if (s <= 0) return 0
  if (s >= WORKSHOP_BERSERKER_CARD_STAR_PERCENTS.length) {
    return WORKSHOP_BERSERKER_CARD_STAR_PERCENTS[WORKSHOP_BERSERKER_CARD_STAR_PERCENTS.length - 1]!
  }
  return WORKSHOP_BERSERKER_CARD_STAR_PERCENTS[s - 1]!
}

/** Max Berserker flat add as a multiple of pre-berserker product (+700% → **7×**). */
export const WORKSHOP_BERSERKER_MAX_ADD_MULTIPLIER = 7 as const

/**
 * Flat Berserker add for displayed damage (wiki: min(damage taken × rate, **+700%** of
 * pre-berserker product = **7×** that product).
 */
export function workshopBerserkerDisplayedDamageAdd(
  preBerserkerProduct: number,
  damageTaken: number,
  berserkerStars: number,
): number {
  if (berserkerStars <= 0 || damageTaken <= 0 || preBerserkerProduct <= 0) return 0
  const rate = workshopBerserkerCardPercent(berserkerStars)
  const fromTaken = damageTaken * rate
  const cap = preBerserkerProduct * WORKSHOP_BERSERKER_MAX_ADD_MULTIPLIER
  return Math.min(fromTaken, cap)
}
