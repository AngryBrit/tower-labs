import type { StringId } from '../i18n/dictionary'

type BannerGuildRow = {
  id: string
  nameId: StringId
  icon: string
  guildSeason: number
}

/** Guild profile / main-menu banners (one per guild season). */
export const BANNER_GUILD_ROWS: readonly BannerGuildRow[] = [
  {
    id: 'banner-dark-being',
    nameId: 'theme_banner_dark_being',
    icon: 'menu-dark-being',
    guildSeason: 1,
  },
  {
    id: 'banner-mech',
    nameId: 'theme_banner_mech',
    icon: 'menu-mech',
    guildSeason: 2,
  },
  {
    id: 'banner-party',
    nameId: 'theme_banner_party',
    icon: 'menu-party',
    guildSeason: 3,
  },
  {
    id: 'banner-pixel',
    nameId: 'theme_banner_pixel',
    icon: 'menu-pixel',
    guildSeason: 4,
  },
  {
    id: 'banner-horror',
    nameId: 'theme_banner_horror',
    icon: 'menu-horror',
    guildSeason: 5,
  },
  {
    id: 'banner-cosmos',
    nameId: 'theme_banner_cosmos',
    icon: 'menu-cosmos',
    guildSeason: 6,
  },
  {
    id: 'banner-supernova',
    nameId: 'theme_banner_supernova',
    icon: 'menu-supernova',
    guildSeason: 7,
  },
  {
    id: 'banner-claw',
    nameId: 'theme_banner_claw',
    icon: 'menu-claw',
    guildSeason: 8,
  },
] as const
