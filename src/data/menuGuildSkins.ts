import type { StringId } from '../i18n/dictionary'

type MenuGuildRow = {
  id: string
  nameId: StringId
  icon: string
  guildSeason: number
  /** Preview art in `public/themes/menus/`. */
  image?: string
}

/** Main-menu guild themes (one per guild season). */
export const MENU_GUILD_ROWS: readonly MenuGuildRow[] = [
  {
    id: 'menu-dark-being',
    nameId: 'theme_menu_dark_being',
    icon: 'menu-dark-being',
    guildSeason: 1,
    image: '/themes/menus/dark_being.webp',
  },
  {
    id: 'menu-mech',
    nameId: 'theme_menu_mech',
    icon: 'menu-mech',
    guildSeason: 2,
    image: '/themes/menus/mech_world.webp',
  },
  {
    id: 'menu-party',
    nameId: 'theme_menu_party',
    icon: 'menu-party',
    guildSeason: 3,
    image: '/themes/menus/party.webp',
  },
  {
    id: 'menu-pixel',
    nameId: 'theme_menu_pixel',
    icon: 'menu-pixel',
    guildSeason: 4,
    image: '/themes/menus/pixel_alien_war.webp',
  },
  {
    id: 'menu-horror',
    nameId: 'theme_menu_horror',
    icon: 'menu-horror',
    guildSeason: 5,
    image: '/themes/menus/crimson_horror.webp',
  },
  {
    id: 'menu-cosmos',
    nameId: 'theme_menu_cosmos',
    icon: 'menu-cosmos',
    guildSeason: 6,
    image: '/themes/menus/cozy_cosmos.webp',
  },
  {
    id: 'menu-supernova',
    nameId: 'theme_menu_supernova',
    icon: 'menu-supernova',
    guildSeason: 7,
    image: '/themes/menus/supernova.webp',
  },
  {
    id: 'menu-claw',
    nameId: 'theme_menu_claw',
    icon: 'menu-claw',
    guildSeason: 8,
    image: '/themes/menus/claw_machine.webp',
  },
] as const
