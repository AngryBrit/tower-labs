/**
 * Wiki decade rows for **Recovery Package +** (Packages): **300** max, +0.01×/level → **×4.00**.
 * **Coins** ladder matches tier-400 through L300.
 */

import { WORKSHOP_ENHANCE_TIER_400_WIKI_DECADES } from './workshopEnhanceTier400WikiDecades'

export const WORKSHOP_ENHANCE_RECOVERY_PACKAGE_WIKI_DECADES = WORKSHOP_ENHANCE_TIER_400_WIKI_DECADES.filter(
  (row) => row.level <= 300,
)
