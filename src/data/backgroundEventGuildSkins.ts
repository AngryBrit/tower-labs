import type { StringId } from '../i18n/dictionary'

type BackgroundEventRow = {
  id: string
  nameId: StringId
  eventNameId: StringId
  icon: string
  ownedDefault?: boolean
}

type BackgroundGuildRow = {
  id: string
  nameId: StringId
  icon: string
  guildSeason: number
  /** Preview art in `public/themes/background/`. */
  image?: string
  ownedDefault?: boolean
}

export const BACKGROUND_EVENT_ROWS: readonly BackgroundEventRow[] = [
  {
    id: 'bg-interstellar',
    nameId: 'theme_bg_interstellar',
    eventNameId: 'theme_event_interstellar',
    icon: 'interstellar',
  },
  {
    id: 'bg-volcano',
    nameId: 'theme_bg_volcano',
    eventNameId: 'theme_event_volcano',
    icon: 'volcano',
  },
  {
    id: 'bg-plasma-field',
    nameId: 'theme_bg_plasma_field',
    eventNameId: 'theme_event_plasma_returns',
    icon: 'plasma-ball',
    ownedDefault: true,
  },
  {
    id: 'bg-honeycomb',
    nameId: 'theme_bg_honeycomb',
    eventNameId: 'theme_event_honey',
    icon: 'smile',
  },
  {
    id: 'bg-aurora',
    nameId: 'theme_bg_aurora',
    eventNameId: 'theme_event_aurora',
    icon: 'aurora',
    ownedDefault: true,
  },
  {
    id: 'bg-alien-ship',
    nameId: 'theme_bg_alien_ship',
    eventNameId: 'theme_event_aliens',
    icon: 'alien',
    ownedDefault: true,
  },
  {
    id: 'bg-ocean-night',
    nameId: 'theme_bg_ocean_night',
    eventNameId: 'theme_event_ocean_night',
    icon: 'ocean-night',
    ownedDefault: true,
  },
  {
    id: 'bg-sakura',
    nameId: 'theme_bg_sakura',
    eventNameId: 'theme_event_cherry_blossom',
    icon: 'sakura',
    ownedDefault: true,
  },
  {
    id: 'bg-easter',
    nameId: 'theme_bg_easter',
    eventNameId: 'theme_event_easter',
    icon: 'sheep',
  },
  {
    id: 'bg-retrowave',
    nameId: 'theme_bg_retrowave',
    eventNameId: 'theme_event_retrowave',
    icon: 'retrowave',
    ownedDefault: true,
  },
  {
    id: 'bg-prismatic-lines',
    nameId: 'theme_bg_prismatic_lines',
    eventNameId: 'theme_event_prismatic_lines',
    icon: 'retrowave',
  },
  {
    id: 'bg-cobweb',
    nameId: 'theme_bg_cobweb',
    eventNameId: 'theme_event_cobweb',
    icon: 'haunted-house',
    ownedDefault: true,
  },
  {
    id: 'bg-matrix',
    nameId: 'theme_bg_matrix',
    eventNameId: 'theme_event_matrix',
    icon: 'matrix',
    ownedDefault: true,
  },
  {
    id: 'bg-virus-field',
    nameId: 'theme_bg_virus_field',
    eventNameId: 'theme_event_viral_outbreak',
    icon: 'matrix',
  },
  {
    id: 'bg-mountain-night',
    nameId: 'theme_bg_mountain_night',
    eventNameId: 'theme_event_full_moon',
    icon: 'rhino',
  },
  {
    id: 'bg-sandstorm',
    nameId: 'theme_bg_sandstorm',
    eventNameId: 'theme_event_sands_of_time',
    icon: 'atomic',
  },
  {
    id: 'bg-autumn-forest',
    nameId: 'theme_bg_autumn_forest',
    eventNameId: 'theme_event_autumn',
    icon: 'cactus',
    ownedDefault: true,
  },
  {
    id: 'bg-haunted-house',
    nameId: 'theme_bg_haunted_house',
    eventNameId: 'theme_event_halloween',
    icon: 'haunted-house',
  },
  {
    id: 'bg-arcade',
    nameId: 'theme_bg_arcade',
    eventNameId: 'theme_event_retro_arcade',
    icon: 'arcade',
    ownedDefault: true,
  },
  {
    id: 'bg-new-years',
    nameId: 'theme_bg_new_years',
    eventNameId: 'theme_event_new_year',
    icon: 'new-years',
    ownedDefault: true,
  },
  {
    id: 'bg-dark-strands',
    nameId: 'theme_bg_dark_strands',
    eventNameId: 'theme_event_dark_strands',
    icon: 'menu-dark-being',
  },
  {
    id: 'bg-deep-sea',
    nameId: 'theme_bg_deep_sea',
    eventNameId: 'theme_event_deep_blue_sea',
    icon: 'ocean-night',
  },
  {
    id: 'bg-hyper-space',
    nameId: 'theme_bg_hyper_space',
    eventNameId: 'theme_event_faster_than_light',
    icon: 'interstellar',
  },
  {
    id: 'bg-invasion',
    nameId: 'theme_bg_invasion',
    eventNameId: 'theme_event_invaders',
    icon: 'alien',
  },
  {
    id: 'bg-sunset-river',
    nameId: 'theme_bg_sunset_river',
    eventNameId: 'theme_event_sunset_fishing',
    icon: 'ocean-night',
    ownedDefault: true,
  },
  {
    id: 'bg-hurricane',
    nameId: 'theme_bg_hurricane',
    eventNameId: 'theme_event_into_the_storm',
    icon: 'snowstorm',
    ownedDefault: true,
  },
  {
    id: 'bg-rainfall',
    nameId: 'theme_bg_rainfall',
    eventNameId: 'theme_event_rainfall',
    icon: 'water-droplet',
  },
  {
    id: 'bg-tv-wall',
    nameId: 'theme_bg_tv_wall',
    eventNameId: 'theme_event_towers_channel',
    icon: 'arcade',
    ownedDefault: true,
  },
  {
    id: 'bg-abduction',
    nameId: 'theme_bg_abduction',
    eventNameId: 'theme_event_abduction',
    icon: 'sheep',
  },
  {
    id: 'bg-snowstorm',
    nameId: 'theme_bg_snowstorm',
    eventNameId: 'theme_event_snowstorm',
    icon: 'snowstorm',
    ownedDefault: true,
  },
  {
    id: 'bg-forest-of-cats',
    nameId: 'theme_bg_forest_of_cats',
    eventNameId: 'theme_event_meowy_night',
    icon: 'cat',
  },
  {
    id: 'bg-event-horizon',
    nameId: 'theme_bg_event_horizon',
    eventNameId: 'theme_event_gravity',
    icon: 'eclipse',
  },
  {
    id: 'bg-clock-tower',
    nameId: 'theme_bg_clock_tower',
    eventNameId: 'theme_event_what_time_is_it',
    icon: 'atomic',
    ownedDefault: true,
  },
  {
    id: 'bg-pi-disk',
    nameId: 'theme_bg_pi_disk',
    eventNameId: 'theme_event_pi',
    icon: 'matrix',
  },
  {
    id: 'bg-koi-pond',
    nameId: 'theme_bg_koi_pond',
    eventNameId: 'theme_event_koi_pond',
    icon: 'turtle',
    ownedDefault: true,
  },
  {
    id: 'bg-camping',
    nameId: 'theme_bg_camping',
    eventNameId: 'theme_event_camping',
    icon: 'sheep',
    ownedDefault: true,
  },
  {
    id: 'bg-cthulhu',
    nameId: 'theme_bg_cthulhu',
    eventNameId: 'theme_event_cthulhu',
    icon: 'alien',
    ownedDefault: true,
  },
  {
    id: 'bg-cyberpunk',
    nameId: 'theme_bg_cyberpunk',
    eventNameId: 'theme_event_cyberpunk',
    icon: 'cyber',
    ownedDefault: true,
  },
  {
    id: 'bg-crystal-cave',
    nameId: 'theme_bg_crystal_cave',
    eventNameId: 'theme_event_crystal_cave',
    icon: 'eclipse',
    ownedDefault: true,
  },
  {
    id: 'bg-amusement-park',
    nameId: 'theme_bg_amusement_park',
    eventNameId: 'theme_event_amusement_park',
    icon: 'donut',
    ownedDefault: true,
  },
  {
    id: 'bg-valentine',
    nameId: 'theme_bg_valentine',
    eventNameId: 'theme_event_valentine',
    icon: 'cherry-blossom',
    ownedDefault: true,
  },
  {
    id: 'bg-glitch',
    nameId: 'theme_bg_glitch',
    eventNameId: 'theme_event_glitch',
    icon: 'matrix',
    ownedDefault: true,
  },
  {
    id: 'bg-neuron',
    nameId: 'theme_bg_neuron',
    eventNameId: 'theme_event_neuron',
    icon: 'atomic',
    ownedDefault: true,
  },
]

export const BACKGROUND_GUILD_ROWS: readonly BackgroundGuildRow[] = [
  {
    id: 'bg-guild-throne-room',
    nameId: 'theme_bg_throne_room',
    icon: 'menu-crown',
    guildSeason: 1,
    image: '/themes/background/throne_room.webp',
  },
  {
    id: 'bg-guild-mech-world',
    nameId: 'theme_bg_mech_world',
    icon: 'menu-mech',
    guildSeason: 2,
    image: '/themes/background/mech_world.webp',
    ownedDefault: true,
  },
  {
    id: 'bg-guild-party',
    nameId: 'theme_bg_party',
    icon: 'menu-party',
    guildSeason: 3,
    image: '/themes/background/party.webp',
    ownedDefault: true,
  },
  {
    id: 'bg-guild-pixel-alien-war',
    nameId: 'theme_bg_pixel_alien_war',
    icon: 'menu-pixel',
    guildSeason: 4,
    image: '/themes/background/pixel_alien_war.webp',
    ownedDefault: true,
  },
  {
    id: 'bg-guild-crimson-horror',
    nameId: 'theme_bg_crimson_horror',
    icon: 'menu-horror',
    guildSeason: 5,
    image: '/themes/background/crimson_horror.webp',
    ownedDefault: true,
  },
  {
    id: 'bg-guild-cozy-cosmos',
    nameId: 'theme_bg_cozy_cosmos',
    icon: 'menu-cosmos',
    guildSeason: 6,
    image: '/themes/background/cozy_cosmos.webp',
    ownedDefault: true,
  },
  {
    id: 'bg-guild-supernova',
    nameId: 'theme_bg_supernova',
    icon: 'menu-supernova',
    guildSeason: 7,
    image: '/themes/background/supernova.webp',
    ownedDefault: true,
  },
  {
    id: 'bg-guild-claw-machine',
    nameId: 'theme_bg_claw_machine',
    icon: 'menu-claw',
    guildSeason: 8,
    image: '/themes/background/claw_machine.webp',
    ownedDefault: true,
  },
]
