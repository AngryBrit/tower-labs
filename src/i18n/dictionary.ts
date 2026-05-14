/** UI string ids — English is the source of truth; Spanish must define every key. */
export const STRINGS_EN = {
  app_skipToMain: 'Skip to main content',
  app_loadingResearch: 'Loading research…',
  app_nav_main_aria: 'Primary pages',
  app_nav_research: 'LAB',
  app_nav_workshop: 'WORKSHOP',
  app_nav_tools: 'TOOLS',
  app_nav_settings: 'SETTINGS',
  app_inpanel_tabs_aria: 'Main sections',
  app_tools_title: 'Tools',
  app_tools_intro:
    'Import, export, share, and compare Tower data. These actions use your current Tower workspace (levels, workshop snapshot, and presets).',
  app_tools_lab_hint:
    'Tip: switch to the LAB tab to edit levels, or WORKSHOP for modeled attack, defense, and utility stats; presets and notices appear on the LAB tab while you work.',
  app_settings_title: 'Settings',
  app_settings_language_label: 'Language',

  ws_title: 'Workshop',
  ws_tab_upgrade: 'Upgrade',
  ws_tab_enhance: 'Enhance',
  ws_enhance_empty: 'Enhance is not modeled in this tool yet.',
  ws_budget_title: 'Workshop coins',
  ws_budget_aria:
    'Spent {{spent}}, to max {{toMax}}, next visible upgrades {{next}}.',
  ws_budget_footnote:
    'Totals include attack, defense, and utility rows. “Next upgrade” sums only cards visible on the Upgrade tab for the selected category (respects Hide Completed).',
  ws_budget_spent_dt: 'Spent (all workshop upgrades)',
  ws_budget_to_max_dt: 'To max (finite caps)',
  ws_budget_next_dt: 'Next upgrade (visible)',
  ws_section_attack: 'Attack Upgrades',
  ws_section_defense: 'Defense Upgrades',
  ws_section_utility: 'Utility Upgrades',
  ws_section_ultimate: 'Ultimate Upgrades',
  ws_multiplier_group_aria: 'Buy multiplier',
  ws_multiplier_toggle_expand: 'Show multiplier options (×1, ×5, ×10, ×100)',
  ws_multiplier_toggle_collapse: 'Hide multiplier options',
  ws_cat_attack_aria: 'Attack upgrades category',
  ws_cat_defense_aria: 'Defense upgrades category',
  ws_cat_utility_aria: 'Utility upgrades category',
  ws_cat_ultimate_aria: 'Ultimate upgrades category',
  ws_reset_demo: 'Reset Workshop',
  ws_reset_confirm_title: 'Reset all workshop levels?',
  ws_reset_confirm_body:
    'This restores default workshop levels stored in this browser. The lab and other tools are not affected. Export or copy a share link first if you want to keep these levels.',
  ws_damage_level_down_aria: 'Decrease workshop damage level',
  ws_damage_level_up_aria: 'Increase workshop damage level',
  ws_damage_level_input_aria: 'Workshop damage level (type a number, Enter or blur to apply)',
  ws_damage_max_label: 'Max',
  ws_attack_speed_level_down_aria: 'Decrease workshop attack speed level',
  ws_attack_speed_level_up_aria: 'Increase workshop attack speed level',
  ws_attack_speed_level_input_aria:
    'Workshop attack speed level (type a number, Enter or blur to apply)',
  ws_crit_chance_level_down_aria: 'Decrease workshop critical chance level',
  ws_crit_chance_level_up_aria: 'Increase workshop critical chance level',
  ws_crit_chance_level_input_aria:
    'Workshop critical chance level (type a number, Enter or blur to apply)',
  ws_crit_factor_level_down_aria: 'Decrease workshop critical factor level',
  ws_crit_factor_level_up_aria: 'Increase workshop critical factor level',
  ws_crit_factor_level_input_aria:
    'Workshop critical factor level (type a number, Enter or blur to apply)',
  ws_attack_range_level_down_aria: 'Decrease workshop attack range level',
  ws_attack_range_level_up_aria: 'Increase workshop attack range level',
  ws_attack_range_level_input_aria:
    'Workshop attack range level (type a number, Enter or blur to apply)',
  ws_damage_per_meter_level_down_aria: 'Decrease workshop damage per meter level',
  ws_damage_per_meter_level_up_aria: 'Increase workshop damage per meter level',
  ws_damage_per_meter_level_input_aria:
    'Workshop damage per meter level (type a number, Enter or blur to apply)',
  ws_multishot_chance_level_down_aria: 'Decrease workshop multishot chance level',
  ws_multishot_chance_level_up_aria: 'Increase workshop multishot chance level',
  ws_multishot_chance_level_input_aria:
    'Workshop multishot chance level (type a number, Enter or blur to apply)',
  ws_multishot_targets_level_down_aria: 'Decrease workshop multishot targets level',
  ws_multishot_targets_level_up_aria: 'Increase workshop multishot targets level',
  ws_multishot_targets_level_input_aria:
    'Workshop multishot targets level (type a number, Enter or blur to apply)',
  ws_rapid_fire_chance_level_down_aria: 'Decrease workshop rapid fire chance level',
  ws_rapid_fire_chance_level_up_aria: 'Increase workshop rapid fire chance level',
  ws_rapid_fire_chance_level_input_aria:
    'Workshop rapid fire chance level (type a number, Enter or blur to apply)',
  ws_rapid_fire_duration_level_down_aria: 'Decrease workshop rapid fire duration level',
  ws_rapid_fire_duration_level_up_aria: 'Increase workshop rapid fire duration level',
  ws_rapid_fire_duration_level_input_aria:
    'Workshop rapid fire duration level (type a number, Enter or blur to apply)',
  ws_bounce_shot_chance_level_down_aria: 'Decrease workshop bounce shot chance level',
  ws_bounce_shot_chance_level_up_aria: 'Increase workshop bounce shot chance level',
  ws_bounce_shot_chance_level_input_aria:
    'Workshop bounce shot chance level (type a number, Enter or blur to apply)',
  ws_bounce_shot_targets_level_down_aria: 'Decrease workshop bounce shot targets level',
  ws_bounce_shot_targets_level_up_aria: 'Increase workshop bounce shot targets level',
  ws_bounce_shot_targets_level_input_aria:
    'Workshop bounce shot targets level (type a number, Enter or blur to apply)',
  ws_bounce_shot_range_level_down_aria: 'Decrease workshop bounce shot range level',
  ws_bounce_shot_range_level_up_aria: 'Increase workshop bounce shot range level',
  ws_bounce_shot_range_level_input_aria:
    'Workshop bounce shot range level (type a number, Enter or blur to apply)',
  ws_super_crit_chance_level_down_aria: 'Decrease workshop super crit chance level',
  ws_super_crit_chance_level_up_aria: 'Increase workshop super crit chance level',
  ws_super_crit_chance_level_input_aria:
    'Workshop super crit chance level (type a number, Enter or blur to apply)',
  ws_super_crit_mult_level_down_aria: 'Decrease workshop super crit mult level',
  ws_super_crit_mult_level_up_aria: 'Increase workshop super crit mult level',
  ws_super_crit_mult_level_input_aria:
    'Workshop super crit mult level (type a number, Enter or blur to apply)',
  ws_rend_armor_chance_level_down_aria: 'Decrease workshop rend armor chance level',
  ws_rend_armor_chance_level_up_aria: 'Increase workshop rend armor chance level',
  ws_rend_armor_chance_level_input_aria:
    'Workshop rend armor chance level (type a number, Enter or blur to apply)',
  ws_rend_armor_mult_level_down_aria: 'Decrease workshop rend armor mult level',
  ws_rend_armor_mult_level_up_aria: 'Increase workshop rend armor mult level',
  ws_rend_armor_mult_level_input_aria:
    'Workshop rend armor mult level (type a number, Enter or blur to apply)',
  ws_stat_damage: 'Damage',
  ws_stat_attackSpeed: 'Attack Speed',
  ws_stat_critChance: 'Critical Chance',
  ws_stat_critFactor: 'Critical Factor',
  ws_stat_attackRange: 'Attack Range',
  ws_stat_damagePerMeter: 'Damage / Meter',
  ws_stat_multishotChance: 'Multishot Chance',
  ws_stat_multishotTargets: 'Multishot Targets',
  ws_stat_rapidFireChance: 'Rapid Fire Chance',
  ws_stat_rapidFireDuration: 'Rapid Fire Duration',
  ws_stat_bounceChance: 'Bounce Shot Chance',
  ws_stat_bounceTargets: 'Bounce Shot Targets',
  ws_stat_bounceShotRange: 'Bounce Shot Range',
  ws_stat_superCritChance: 'Super Crit Chance',
  ws_stat_superCritMult: 'Super Crit Mult',
  ws_stat_rendArmorChance: 'Rend Armor Chance',
  ws_stat_rendArmorMult: 'Rend Armor Multiplier',
  ws_defense_level_down_aria: 'Decrease workshop level',
  ws_defense_level_up_aria: 'Increase workshop level',
  ws_defense_level_input_aria: 'Workshop level (type a number, Enter or blur to apply)',
  ws_stat_defHealth: 'Health',
  ws_stat_defHealthRegen: 'Health Regen',
  ws_stat_defDefensePct: 'Defense %',
  ws_stat_defDefenseAbs: 'Defense Absolute',
  ws_stat_defThornDamage: 'Thorn Damage',
  ws_stat_defLifesteal: 'Lifesteal',
  ws_stat_defKnockbackChance: 'Knockback Chance',
  ws_stat_defKnockbackForce: 'Knockback Force',
  ws_stat_defOrbSpeed: 'Orb Speed',
  ws_stat_defOrbs: 'Orbs',
  ws_stat_defShockwaveSize: 'Shockwave Size',
  ws_stat_defShockwaveFreq: 'Shockwave Frequency',
  ws_stat_defLandMineChance: 'Land Mine Chance',
  ws_stat_defLandMineDamage: 'Land Mine Damage',
  ws_stat_defLandMineRadius: 'Land Mine Radius',
  ws_stat_defDeathDefy: 'Death Defy',
  ws_stat_defWallHealth: 'Wall Health',
  ws_stat_defWallRebuild: 'Wall Rebuild',
  ws_stat_utilCashBonus: 'Cash Bonus',
  ws_stat_utilCashPerWave: 'Cash / Wave',
  ws_stat_utilCoinsKillBonus: 'Coins / Kill Bonus',
  ws_stat_utilCoinsWave: 'Coins / Wave',
  ws_stat_utilFreeAttackUpgrade: 'Free Attack Upgrade',
  ws_stat_utilFreeDefenseUpgrade: 'Free Defense Upgrade',
  ws_stat_utilFreeUtilityUpgrade: 'Free Utility Upgrade',
  ws_stat_utilInterestPerWave: 'Interest / Wave',
  ws_stat_utilRecoveryAmount: 'Recovery Amount',
  ws_stat_utilMaxRecovery: 'Max Recovery',
  ws_stat_utilPackageChance: 'Package Chance',
  ws_stat_utilEnemyAttackLevelSkip: 'Enemy Attack Level Skip',
  ws_stat_utilEnemyHealthLevelSkip: 'Enemy Health Level Skip',
  ws_max: 'Max',

  sr_title: 'LAB',
  sr_toolbar_aria: 'Find and filter labs',
  sr_search_label_hidden: 'Search research',
  sr_search_placeholder: 'Search… (press / to focus)',
  sr_search_slash_hint:
    'Press slash (/) when not in a text field or number field to move focus to this search box.',

  sr_presets_build_label: 'Build',
  sr_preset_scratch_option: 'Scratch (unsaved workspace)',
  sr_preset_select_aria: 'Load a saved build (lab + workshop) or the scratch workspace',
  sr_preset_save_as: 'Save as…',
  sr_preset_delete_build: 'Delete build',
  sr_preset_delete_aria: 'Delete the active saved build',
  sr_hide_completed: 'Hide Completed',
  sr_reset_lab_levels: 'Reset Lab',
  sr_import_export_launcher: 'Import, export & share labs…',

  sr_budget_title: 'Lab coins',
  sr_budget_aria:
    'Spent {{spent}}, to max {{toMax}}, next visible upgrades {{next}}.',
  sr_budget_footnote:
    'Card Mastery rows omitted (stones). Missing toolkit coin data counts as 0 per step.',
  sr_budget_spent_dt: 'Spent (all coin labs)',
  sr_budget_to_max_dt: 'To max (finite caps)',
  sr_budget_next_dt: 'Next upgrade (visible)',

  sr_lab_data_title: 'Tower Backup & Sharing',
  sr_lab_data_intro:
    'Use one CSV for lab levels and workshop together (first line tower_csv_v1), or copy / QR a share link.',
  sr_lab_data_files: 'Tower CSV (lab + workshop)',
  sr_lab_data_share: 'Share link',
  sr_lab_import_file: 'Import tower from CSV',
  sr_lab_export_file: 'Export tower to CSV',
  sr_compare_launcher: 'Compare builds…',
  sr_compare_title: 'Compare two lab snapshots',
  sr_compare_intro:
    'Paste a tower CSV (first line tower_csv_v1), legacy lab CSV (key,level), a page URL with ?labs=…, a raw share payload (u… / z…), or JSON { "v":2, "o":{…}, "w"? }. Coin totals match the simulator budget (Card Mastery omitted). Workshop rows use defaults when a side has no embedded w. Each side uses its own Labs Coin Discount level.',
  sr_compare_build_a: 'Build A',
  sr_compare_build_b: 'Build B',
  sr_compare_placeholder: 'Tower CSV, legacy CSV, URL, payload, or JSON…',
  sr_compare_use_current: 'Insert current tower CSV',
  sr_compare_ws_title: 'Workshop snapshot',
  sr_compare_ws_identical: 'No workshop field differences (or both sides used defaults).',
  sr_compare_ws_diff_one: '1 workshop field differs.',
  sr_compare_ws_diff_many: '{{count}} workshop fields differ.',
  sr_compare_ws_col_field: 'Field',
  sr_ws_field_hide_maxed: 'Hide maxed',
  sr_ws_field_main_tab: 'Main tab',
  sr_ws_field_category: 'Category',
  sr_ws_field_multiplier: 'Buy multiplier',
  sr_compare_run: 'Compare',
  sr_compare_busy: 'Comparing…',
  sr_compare_clear: 'Clear',
  sr_compare_spent_a: 'Spent coins (A)',
  sr_compare_spent_b: 'Spent coins (B)',
  sr_compare_coin_delta: 'Coin delta (B − A)',
  sr_compare_footnote:
    'Card Mastery rows are ignored in coin totals (same as the budget panel). Missing toolkit data counts as 0 per upgrade step.',
  sr_compare_table_section: 'Section',
  sr_compare_table_lab: 'Lab',
  sr_compare_table_lv_a: 'Lv. A',
  sr_compare_table_lv_b: 'Lv. B',
  sr_compare_table_delta: 'ΔLv.',
  sr_compare_parse_empty: 'That side is empty.',
  sr_compare_parse_invalid_csv:
    'Invalid CSV: use legacy key,level rows, or a valid tower CSV (first line tower_csv_v1).',
  sr_compare_parse_invalid_payload:
    'Could not parse as CSV or share text.',
  sr_compare_parse_share_fail: 'Could not decode the ?labs= / share payload.',
  sr_compare_diff_count_none:
    'No level differences — effective levels match for every lab.',
  sr_compare_diff_count_one: '1 lab has a different level.',
  sr_compare_diff_count_many: '{{count}} labs have different levels.',
  sr_copy_short_link: 'Copy short share link',
  sr_copy_full_url: 'Copy full page URL',
  sr_qr_share: 'Show QR for share link',
  sr_close: 'Close',

  sr_sections_aria: 'Research lab sections',
  sr_collapse_all: 'Collapse all',
  sr_bulk_collapse_aria:
    'When checked, every research section is collapsed. When cleared, every section is expanded.',

  sr_qr_dialog_title: 'Scan to load lab levels',
  sr_qr_image_alt: 'QR code that opens the lab share link in a browser',
  sr_qr_hint:
    'Encodes the short share link (same as “Copy short share link”), including workshop when it differs from defaults.',
  sr_qr_copy_link: 'Copy link',

  sr_reset_confirm_title: 'Reset all lab levels?',
  sr_reset_confirm_body:
    'This restores default research levels for the lab stored in this browser. The Workshop and other tools are not affected. Export or copy a share link first if you want to keep these levels.',
  sr_cancel: 'Cancel',
  sr_reset_all: 'Reset all',

  sr_footer_nav_aria: 'App version and changelog',
  sr_version_aria: 'Version {{version}}',
  sr_changelog: 'Changelog',
  sr_changelog_title: 'Release notes on GitHub (opens in a new tab)',
  sr_locale_aria: 'Language',
  sr_locale_option_en: 'English',
  sr_locale_option_es: 'Español',

  sr_notice_share_cleared: 'Share link opened: lab levels cleared to defaults.',
  sr_notice_share_one: 'Share link opened: loaded 1 custom lab level.',
  sr_notice_share_many:
    'Share link opened: loaded {{count}} custom lab levels.',
  sr_notice_share_ws_suffix: 'Workshop snapshot from the link was applied.',
  sr_notice_reset_all: 'Lab levels reset to defaults in this browser.',
  sr_notice_copy_short_ok:
    'Short share link copied (includes workshop when it is not the default snapshot).',
  sr_notice_copy_short_fail:
    'Could not copy link (clipboard blocked or unavailable).',
  sr_notice_copy_full_ok:
    'Full page URL copied (keeps other query params and hash).',
  sr_notice_copy_full_fail:
    'Could not copy link (clipboard blocked or unavailable).',
  sr_notice_qr_fail: 'Could not create QR code.',
  sr_notice_import_cleared: 'Imported file: all custom levels cleared.',
  sr_notice_import_one: 'Imported 1 lab level.',
  sr_notice_import_many: 'Imported {{count}} lab levels.',
  sr_notice_import_read_fail:
    'Could not read file. Use a valid CSV export from this app.',
  sr_notice_import_invalid_csv:
    'Invalid CSV: use a header row key,level and one row per lab (e.g. 0-3,12), or a valid tower CSV (first line tower_csv_v1).',
  sr_notice_import_invalid_tower_csv:
    'Invalid tower CSV: first line must be tower_csv_v1, then type,key,value rows (lab / ws).',
  sr_notice_import_tower_ok: 'Imported lab levels and workshop from tower CSV.',
  sr_preset_prompt_title: 'Name this build — lab + workshop (saved in this browser only)',
  sr_preset_name_label: 'Build name',
  sr_preset_dialog_save: 'Save build',
  sr_notice_preset_empty_name: 'Preset name was empty; nothing saved.',
  sr_notice_preset_saved: 'Saved preset "{{name}}".',
  sr_notice_delete_confirm_prefix: 'Delete saved build',
  sr_notice_delete_confirm_suffix: '? This cannot be undone.',
  sr_notice_preset_deleted: 'Preset deleted; restored scratch workspace.',
  sr_notice_qr_link_copied: 'Link copied from QR dialog.',
  sr_notice_copy_fail_short: 'Could not copy link.',

  sr_load_manifest: 'Could not load research manifest ({{status}})',
  sr_load_section: 'Could not load {{path}} ({{status}})',

  research_empty_filter: 'No research matches filters.',

  researchCard_decrease_aria: 'Decrease level',
  researchCard_increase_aria: 'Increase level',
  researchCard_level_aria: '{{name}} level',
  researchCard_level_title: 'Level 0–{{max}}',
  researchCard_researching: 'Researching…',
  researchCard_max: 'Max',
  researchCard_cost_unknown_title:
    'Not on this CSV row. Set Level in the Lab Calculator sheet to match, export CSV, and run import so cost reflects that level.',
  researchCard_cost_stones_title: 'Stones (wiki unlock cost)',
  researchCard_cost_coins_title: 'Coins (next upgrade)',
} as const

export type StringId = keyof typeof STRINGS_EN

export const STRINGS_ES = {
  app_skipToMain: 'Saltar al contenido principal',
  app_loadingResearch: 'Cargando investigación…',
  app_nav_main_aria: 'Páginas principales',
  app_nav_research: 'Laboratorio',
  app_nav_workshop: 'Taller',
  app_nav_tools: 'Herramientas',
  app_nav_settings: 'Ajustes',
  app_inpanel_tabs_aria: 'Secciones principales',
  app_tools_title: 'Herramientas',
  app_tools_intro:
    'Importar, exportar, compartir y comparar datos de Tower. Usan el espacio de trabajo actual de Tower (niveles, instantánea del taller y presets).',
  app_tools_lab_hint:
    'Consejo: ve a LAB para editar niveles o a WORKSHOP para las estadísticas de ataque, defensa y utilidad modeladas; los avisos y presets aparecen en LAB mientras trabajas.',
  app_settings_title: 'Ajustes',
  app_settings_language_label: 'Idioma',

  ws_title: 'Taller',
  ws_tab_upgrade: 'Mejorar',
  ws_tab_enhance: 'Potenciar',
  ws_enhance_empty: 'Potenciar aún no está modelado en esta herramienta.',
  ws_budget_title: 'Monedas del taller',
  ws_budget_aria:
    'Gastado {{spent}}, hasta el máximo {{toMax}}, siguientes mejoras visibles {{next}}.',
  ws_budget_footnote:
    'Los totales incluyen filas de ataque, defensa y utilidad. “Siguiente mejora” suma solo las tarjetas visibles en la pestaña Mejorar para la categoría seleccionada (respeta Ocultar completados).',
  ws_budget_spent_dt: 'Gastado (todas las mejoras del taller)',
  ws_budget_to_max_dt: 'Hasta el máximo (topes finitos)',
  ws_budget_next_dt: 'Siguiente mejora (visible)',
  ws_section_attack: 'Mejoras de ataque',
  ws_section_defense: 'Mejoras de defensa',
  ws_section_utility: 'Mejoras de utilidad',
  ws_section_ultimate: 'Mejoras definitivas',
  ws_multiplier_group_aria: 'Multiplicador de compra',
  ws_multiplier_toggle_expand:
    'Mostrar opciones de multiplicador (×1, ×5, ×10, ×100)',
  ws_multiplier_toggle_collapse: 'Ocultar opciones de multiplicador',
  ws_cat_attack_aria: 'Categoría de mejoras de ataque',
  ws_cat_defense_aria: 'Categoría de mejoras de defensa',
  ws_cat_utility_aria: 'Categoría de mejoras de utilidad',
  ws_cat_ultimate_aria: 'Categoría de mejoras definitivas',
  ws_reset_demo: 'Restablecer taller',
  ws_reset_confirm_title: '¿Restablecer todos los niveles del taller?',
  ws_reset_confirm_body:
    'Esto restablece los niveles predeterminados del taller guardados en este navegador. El laboratorio y las demás herramientas no se ven afectados. Exporta o copia un enlace para compartir antes si quieres conservar estos niveles.',
  ws_damage_level_down_aria: 'Bajar el nivel de daño del taller',
  ws_damage_level_up_aria: 'Subir el nivel de daño del taller',
  ws_damage_level_input_aria:
    'Nivel de daño del taller (escribe un número; pulsa Intro o sal del campo para aplicar)',
  ws_damage_max_label: 'Máx',
  ws_attack_speed_level_down_aria: 'Bajar el nivel de velocidad de ataque del taller',
  ws_attack_speed_level_up_aria: 'Subir el nivel de velocidad de ataque del taller',
  ws_attack_speed_level_input_aria:
    'Nivel de velocidad de ataque del taller (escribe un número; pulsa Intro o sal del campo para aplicar)',
  ws_crit_chance_level_down_aria: 'Bajar el nivel de prob. de crítico del taller',
  ws_crit_chance_level_up_aria: 'Subir el nivel de prob. de crítico del taller',
  ws_crit_chance_level_input_aria:
    'Nivel de prob. de crítico del taller (escribe un número; pulsa Intro o sal del campo para aplicar)',
  ws_crit_factor_level_down_aria: 'Bajar el nivel de factor de crítico del taller',
  ws_crit_factor_level_up_aria: 'Subir el nivel de factor de crítico del taller',
  ws_crit_factor_level_input_aria:
    'Nivel de factor de crítico del taller (escribe un número; pulsa Intro o sal del campo para aplicar)',
  ws_attack_range_level_down_aria: 'Bajar el nivel de alcance de ataque del taller',
  ws_attack_range_level_up_aria: 'Subir el nivel de alcance de ataque del taller',
  ws_attack_range_level_input_aria:
    'Nivel de alcance de ataque del taller (escribe un número; pulsa Intro o sal del campo para aplicar)',
  ws_damage_per_meter_level_down_aria: 'Bajar el nivel de daño por metro del taller',
  ws_damage_per_meter_level_up_aria: 'Subir el nivel de daño por metro del taller',
  ws_damage_per_meter_level_input_aria:
    'Nivel de daño por metro del taller (escribe un número; pulsa Intro o sal del campo para aplicar)',
  ws_multishot_chance_level_down_aria: 'Bajar el nivel de prob. multidisparo del taller',
  ws_multishot_chance_level_up_aria: 'Subir el nivel de prob. multidisparo del taller',
  ws_multishot_chance_level_input_aria:
    'Nivel de prob. multidisparo del taller (escribe un número; pulsa Intro o sal del campo para aplicar)',
  ws_multishot_targets_level_down_aria: 'Bajar el nivel de objetivos multidisparo del taller',
  ws_multishot_targets_level_up_aria: 'Subir el nivel de objetivos multidisparo del taller',
  ws_multishot_targets_level_input_aria:
    'Nivel de objetivos multidisparo del taller (escribe un número; pulsa Intro o sal del campo para aplicar)',
  ws_rapid_fire_chance_level_down_aria: 'Bajar el nivel de prob. de fuego rápido del taller',
  ws_rapid_fire_chance_level_up_aria: 'Subir el nivel de prob. de fuego rápido del taller',
  ws_rapid_fire_chance_level_input_aria:
    'Nivel de prob. de fuego rápido del taller (escribe un número; pulsa Intro o sal del campo para aplicar)',
  ws_rapid_fire_duration_level_down_aria: 'Bajar el nivel de duración de fuego rápido del taller',
  ws_rapid_fire_duration_level_up_aria: 'Subir el nivel de duración de fuego rápido del taller',
  ws_rapid_fire_duration_level_input_aria:
    'Nivel de duración de fuego rápido del taller (escribe un número; pulsa Intro o sal del campo para aplicar)',
  ws_bounce_shot_chance_level_down_aria: 'Bajar el nivel de prob. de rebote del taller',
  ws_bounce_shot_chance_level_up_aria: 'Subir el nivel de prob. de rebote del taller',
  ws_bounce_shot_chance_level_input_aria:
    'Nivel de prob. de rebote del taller (escribe un número; pulsa Intro o sal del campo para aplicar)',
  ws_bounce_shot_targets_level_down_aria: 'Bajar el nivel de objetivos de rebote del taller',
  ws_bounce_shot_targets_level_up_aria: 'Subir el nivel de objetivos de rebote del taller',
  ws_bounce_shot_targets_level_input_aria:
    'Nivel de objetivos de rebote del taller (escribe un número; pulsa Intro o sal del campo para aplicar)',
  ws_bounce_shot_range_level_down_aria: 'Bajar el nivel de alcance de rebote del taller',
  ws_bounce_shot_range_level_up_aria: 'Subir el nivel de alcance de rebote del taller',
  ws_bounce_shot_range_level_input_aria:
    'Nivel de alcance de rebote del taller (escribe un número; pulsa Intro o sal del campo para aplicar)',
  ws_super_crit_chance_level_down_aria: 'Bajar el nivel de prob. de súper crítico del taller',
  ws_super_crit_chance_level_up_aria: 'Subir el nivel de prob. de súper crítico del taller',
  ws_super_crit_chance_level_input_aria:
    'Nivel de prob. de súper crítico del taller (escribe un número; pulsa Intro o sal del campo para aplicar)',
  ws_super_crit_mult_level_down_aria: 'Bajar el nivel de mult. de súper crítico del taller',
  ws_super_crit_mult_level_up_aria: 'Subir el nivel de mult. de súper crítico del taller',
  ws_super_crit_mult_level_input_aria:
    'Nivel de mult. de súper crítico del taller (escribe un número; pulsa Intro o sal del campo para aplicar)',
  ws_rend_armor_chance_level_down_aria: 'Bajar el nivel de prob. de perforar armadura del taller',
  ws_rend_armor_chance_level_up_aria: 'Subir el nivel de prob. de perforar armadura del taller',
  ws_rend_armor_chance_level_input_aria:
    'Nivel de prob. de perforar armadura del taller (escribe un número; pulsa Intro o sal del campo para aplicar)',
  ws_rend_armor_mult_level_down_aria: 'Bajar el nivel de mult. de perforar armadura del taller',
  ws_rend_armor_mult_level_up_aria: 'Subir el nivel de mult. de perforar armadura del taller',
  ws_rend_armor_mult_level_input_aria:
    'Nivel de mult. de perforar armadura del taller (escribe un número; pulsa Intro o sal del campo para aplicar)',
  ws_stat_damage: 'Daño',
  ws_stat_attackSpeed: 'Velocidad de ataque',
  ws_stat_critChance: 'Prob. de crítico',
  ws_stat_critFactor: 'Factor de crítico',
  ws_stat_attackRange: 'Alcance de ataque',
  ws_stat_damagePerMeter: 'Daño / Metro',
  ws_stat_multishotChance: 'Prob. multidisparo',
  ws_stat_multishotTargets: 'Objetivos multidisparo',
  ws_stat_rapidFireChance: 'Prob. fuego rápido',
  ws_stat_rapidFireDuration: 'Duración fuego rápido',
  ws_stat_bounceChance: 'Prob. rebote',
  ws_stat_bounceTargets: 'Objetivos de rebote',
  ws_stat_bounceShotRange: 'Alcance de rebote',
  ws_stat_superCritChance: 'Prob. súper crítico',
  ws_stat_superCritMult: 'Mult. súper crítico',
  ws_stat_rendArmorChance: 'Prob. perforar armadura',
  ws_stat_rendArmorMult: 'Mult. perforar armadura',
  ws_defense_level_down_aria: 'Disminuir nivel del taller',
  ws_defense_level_up_aria: 'Aumentar nivel del taller',
  ws_defense_level_input_aria: 'Nivel del taller (escribe un número; Enter o salir para aplicar)',
  ws_stat_defHealth: 'Salud',
  ws_stat_defHealthRegen: 'Regeneración de salud',
  ws_stat_defDefensePct: 'Defensa %',
  ws_stat_defDefenseAbs: 'Defensa absoluta',
  ws_stat_defThornDamage: 'Daño de espinas',
  ws_stat_defLifesteal: 'Robo de vida',
  ws_stat_defKnockbackChance: 'Prob. de empuje',
  ws_stat_defKnockbackForce: 'Fuerza de empuje',
  ws_stat_defOrbSpeed: 'Velocidad de orbes',
  ws_stat_defOrbs: 'Orbes',
  ws_stat_defShockwaveSize: 'Tamaño de onda de choque',
  ws_stat_defShockwaveFreq: 'Frecuencia de onda de choque',
  ws_stat_defLandMineChance: 'Prob. de mina terrestre',
  ws_stat_defLandMineDamage: 'Daño de mina terrestre',
  ws_stat_defLandMineRadius: 'Radio de mina terrestre',
  ws_stat_defDeathDefy: 'Desafío a la muerte',
  ws_stat_defWallHealth: 'Salud del muro',
  ws_stat_defWallRebuild: 'Reconstrucción del muro',
  ws_stat_utilCashBonus: 'Bono de efectivo',
  ws_stat_utilCashPerWave: 'Efectivo / oleada',
  ws_stat_utilCoinsKillBonus: 'Bono de monedas / eliminación',
  ws_stat_utilCoinsWave: 'Monedas / oleada',
  ws_stat_utilFreeAttackUpgrade: 'Mejora de ataque gratis',
  ws_stat_utilFreeDefenseUpgrade: 'Mejora de defensa gratis',
  ws_stat_utilFreeUtilityUpgrade: 'Mejora de utilidad gratis',
  ws_stat_utilInterestPerWave: 'Interés / oleada',
  ws_stat_utilRecoveryAmount: 'Cantidad de recuperación',
  ws_stat_utilMaxRecovery: 'Recuperación máxima',
  ws_stat_utilPackageChance: 'Prob. de paquete',
  ws_stat_utilEnemyAttackLevelSkip: 'Salto de nivel de ataque enemigo',
  ws_stat_utilEnemyHealthLevelSkip: 'Salto de nivel de salud enemiga',
  ws_max: 'Máx',

  sr_title: 'LAB',
  sr_toolbar_aria: 'Buscar y filtrar laboratorios',
  sr_search_label_hidden: 'Buscar investigación',
  sr_search_placeholder: 'Buscar… (pulsa / para enfocar)',
  sr_search_slash_hint:
    'Pulsa la barra (/) cuando no estés en un campo de texto o numérico para enfocar este cuadro de búsqueda.',

  sr_presets_build_label: 'Build',
  sr_preset_scratch_option: 'Borrador (espacio de trabajo sin guardar)',
  sr_preset_select_aria: 'Cargar un build guardado (lab + taller) o el espacio de trabajo',
  sr_preset_save_as: 'Guardar como…',
  sr_preset_delete_build: 'Eliminar build',
  sr_preset_delete_aria: 'Eliminar el build guardado activo',
  sr_hide_completed: 'Ocultar completados',
  sr_reset_lab_levels: 'Restablecer LAB',
  sr_import_export_launcher: 'Importar, exportar y compartir labs…',

  sr_budget_title: 'Monedas del laboratorio',
  sr_budget_aria:
    'Gastado {{spent}}, hasta el máximo {{toMax}}, siguientes mejoras visibles {{next}}.',
  sr_budget_footnote:
    'Filas de Card Mastery omitidas (piedras). Si faltan datos de monedas del toolkit, se cuenta 0 por paso.',
  sr_budget_spent_dt: 'Gastado (todos los labs de monedas)',
  sr_budget_to_max_dt: 'Hasta el máximo (topes finitos)',
  sr_budget_next_dt: 'Siguiente mejora (visible)',

  sr_lab_data_title: 'Tower — copia de seguridad y compartir',
  sr_lab_data_intro:
    'Un solo CSV reúne lab y taller (primera línea tower_csv_v1), o copia / QR un enlace.',
  sr_lab_data_files: 'CSV Tower (lab + taller)',
  sr_lab_data_share: 'Enlace para compartir',
  sr_lab_import_file: 'Importar tower desde CSV',
  sr_lab_export_file: 'Exportar tower a CSV',
  sr_compare_launcher: 'Comparar builds…',
  sr_compare_title: 'Comparar dos instantáneas de labs',
  sr_compare_intro:
    'Pega un CSV tower (primera línea tower_csv_v1), CSV de lab antiguo (key,level), URL con ?labs=…, payload u…/z… o JSON { "v":2, "o":{…}, "w"? }. Las monedas coinciden con el simulador (sin Card Mastery). El taller usa valores predeterminados si un lado no trae w. Cada lado usa su propio nivel de Labs Coin Discount.',
  sr_compare_build_a: 'Build A',
  sr_compare_build_b: 'Build B',
  sr_compare_placeholder: 'CSV tower, CSV antiguo, URL, payload o JSON…',
  sr_compare_use_current: 'Insertar CSV tower actual',
  sr_compare_ws_title: 'Instantánea del taller',
  sr_compare_ws_identical:
    'Sin diferencias en campos del taller (o ambos lados usaron valores predeterminados).',
  sr_compare_ws_diff_one: '1 campo del taller difiere.',
  sr_compare_ws_diff_many: '{{count}} campos del taller difieren.',
  sr_compare_ws_col_field: 'Campo',
  sr_ws_field_hide_maxed: 'Ocultar al máximo',
  sr_ws_field_main_tab: 'Pestaña principal',
  sr_ws_field_category: 'Categoría',
  sr_ws_field_multiplier: 'Multiplicador de compra',
  sr_compare_run: 'Comparar',
  sr_compare_busy: 'Comparando…',
  sr_compare_clear: 'Borrar',
  sr_compare_spent_a: 'Monedas gastadas (A)',
  sr_compare_spent_b: 'Monedas gastadas (B)',
  sr_compare_coin_delta: 'Delta de monedas (B − A)',
  sr_compare_footnote:
    'Las filas de Card Mastery no cuentan en monedas (igual que el panel de presupuesto). Si faltan datos del toolkit, cada paso cuenta como 0.',
  sr_compare_table_section: 'Sección',
  sr_compare_table_lab: 'Lab',
  sr_compare_table_lv_a: 'Nv. A',
  sr_compare_table_lv_b: 'Nv. B',
  sr_compare_table_delta: 'ΔNv.',
  sr_compare_parse_empty: 'Ese lado está vacío.',
  sr_compare_parse_invalid_csv:
    'CSV no válido: usa key,level como en exportaciones antiguas, o un CSV tower válido (primera línea tower_csv_v1).',
  sr_compare_parse_invalid_payload:
    'No se pudo interpretar como CSV o texto de compartir.',
  sr_compare_parse_share_fail: 'No se pudo decodificar ?labs= / el payload.',
  sr_compare_diff_count_none:
    'Sin diferencias de nivel: los niveles efectivos coinciden en todos los labs.',
  sr_compare_diff_count_one: '1 lab tiene un nivel distinto.',
  sr_compare_diff_count_many: '{{count}} labs tienen niveles distintos.',
  sr_copy_short_link: 'Copiar enlace corto',
  sr_copy_full_url: 'Copiar URL completa',
  sr_qr_share: 'Mostrar QR del enlace',
  sr_close: 'Cerrar',

  sr_sections_aria: 'Secciones de laboratorio',
  sr_collapse_all: 'Contraer todo',
  sr_bulk_collapse_aria:
    'Si está marcado, cada sección está contraída. Si no, cada sección está expandida.',

  sr_qr_dialog_title: 'Escanea para cargar niveles',
  sr_qr_image_alt: 'Código QR que abre el enlace de compartir en el navegador',
  sr_qr_hint:
    'Codifica el enlace corto (igual que «Copiar enlace corto»), incluyendo taller si no es la instantánea predeterminada.',
  sr_qr_copy_link: 'Copiar enlace',

  sr_reset_confirm_title: '¿Restablecer todos los niveles del laboratorio?',
  sr_reset_confirm_body:
    'Esto restablece los niveles de investigación del laboratorio guardados en este navegador. El taller y las demás herramientas no cambian. Exporta o copia un enlace antes si quieres conservar estos niveles.',
  sr_cancel: 'Cancelar',
  sr_reset_all: 'Restablecer todo',

  sr_footer_nav_aria: 'Versión de la app y registro de cambios',
  sr_version_aria: 'Versión {{version}}',
  sr_changelog: 'Cambios',
  sr_changelog_title: 'Notas de versión en GitHub (se abre en una pestaña nueva)',
  sr_locale_aria: 'Idioma',
  sr_locale_option_en: 'Inglés',
  sr_locale_option_es: 'Español',

  sr_notice_share_cleared:
    'Enlace abierto: niveles de lab restablecidos a los predeterminados.',
  sr_notice_share_one: 'Enlace abierto: se cargó 1 nivel de lab personalizado.',
  sr_notice_share_many:
    'Enlace abierto: se cargaron {{count}} niveles de lab personalizados.',
  sr_notice_share_ws_suffix: 'Se aplicó la instantánea del taller del enlace.',
  sr_notice_reset_all:
    'Niveles de lab restablecidos a los valores predeterminados en este navegador.',
  sr_notice_copy_short_ok:
    'Enlace corto copiado (incluye taller si no es la instantánea predeterminada).',
  sr_notice_copy_short_fail:
    'No se pudo copiar el enlace (portapapeles bloqueado o no disponible).',
  sr_notice_copy_full_ok:
    'URL completa copiada (conserva otros parámetros y el ancla).',
  sr_notice_copy_full_fail:
    'No se pudo copiar el enlace (portapapeles bloqueado o no disponible).',
  sr_notice_qr_fail: 'No se pudo crear el código QR.',
  sr_notice_import_cleared: 'Archivo importado: se borraron todos los niveles.',
  sr_notice_import_one: 'Se importó 1 nivel de lab.',
  sr_notice_import_many: 'Se importaron {{count}} niveles de lab.',
  sr_notice_import_read_fail:
    'No se pudo leer el archivo. Usa una exportación CSV válida de esta app.',
  sr_notice_import_invalid_csv:
    'CSV no válido: cabecera key,level y una fila por lab (p. ej. 0-3,12), o un CSV tower válido (primera línea tower_csv_v1).',
  sr_notice_import_invalid_tower_csv:
    'CSV tower no válido: la primera línea debe ser tower_csv_v1 y luego filas type,key,value (lab / ws).',
  sr_notice_import_tower_ok: 'Se importaron niveles de lab y taller desde CSV tower.',
  sr_preset_prompt_title: 'Nombre del build — lab + taller (solo en este navegador)',
  sr_preset_name_label: 'Nombre del build',
  sr_preset_dialog_save: 'Guardar build',
  sr_notice_preset_empty_name: 'El nombre estaba vacío; no se guardó nada.',
  sr_notice_preset_saved: 'Preset guardado: «{{name}}».',
  sr_notice_delete_confirm_prefix: '¿Eliminar el build guardado',
  sr_notice_delete_confirm_suffix: '? No se puede deshacer.',
  sr_notice_preset_deleted: 'Preset eliminado; se restauró el borrador.',
  sr_notice_qr_link_copied: 'Enlace copiado desde el diálogo QR.',
  sr_notice_copy_fail_short: 'No se pudo copiar el enlace.',

  sr_load_manifest: 'No se pudo cargar el manifiesto ({{status}})',
  sr_load_section: 'No se pudo cargar {{path}} ({{status}})',

  research_empty_filter: 'Ninguna investigación coincide con los filtros.',

  researchCard_decrease_aria: 'Disminuir nivel',
  researchCard_increase_aria: 'Aumentar nivel',
  researchCard_level_aria: 'Nivel de {{name}}',
  researchCard_level_title: 'Nivel 0–{{max}}',
  researchCard_researching: 'Investigando…',
  researchCard_max: 'Máx',
  researchCard_cost_unknown_title:
    'No está en esta fila CSV. Ajusta el nivel en la hoja Lab Calculator, exporta CSV y ejecuta import para que el coste refleje ese nivel.',
  researchCard_cost_stones_title: 'Piedras (coste wiki)',
  researchCard_cost_coins_title: 'Monedas (siguiente mejora)',
} satisfies Record<StringId, string>

function replaceParams(
  template: string,
  params: Record<string, string | number>,
): string {
  let out = template
  for (const [k, v] of Object.entries(params)) {
    out = out.split(`{{${k}}}`).join(String(v))
  }
  return out
}

export type I18nFormatters = {
  shareOpenedLevels: (count: number, workshopFromLink?: boolean) => string
  importedLevels: (count: number) => string
  deleteBuildConfirm: (nameOrId: string) => string
  savedPreset: (name: string) => string
  levelRangeTitle: (max: number) => string
  levelAriaLabel: (itemName: string) => string
  manifestLoadError: (status: number) => string
  sectionLoadError: (rel: string, status: number) => string
  simulatorBudgetAria: (spent: string, toMax: string, next: string) => string
  workshopBudgetAria: (spent: string, toMax: string, next: string) => string
  versionAria: (version: string) => string
  compareDifferingLabsCount: (count: number) => string
  compareDifferingWorkshopFields: (count: number) => string
}

function formatters(s: Record<StringId, string>): I18nFormatters {
  return {
    shareOpenedLevels(count, workshopFromLink = false) {
      const base =
        count === 0
          ? s.sr_notice_share_cleared
          : count === 1
            ? s.sr_notice_share_one
            : replaceParams(s.sr_notice_share_many, { count })
      return workshopFromLink ? `${base} ${s.sr_notice_share_ws_suffix}` : base
    },
    importedLevels(count) {
      if (count === 0) return s.sr_notice_import_cleared
      if (count === 1) return s.sr_notice_import_one
      return replaceParams(s.sr_notice_import_many, { count })
    },
    deleteBuildConfirm(nameOrId) {
      return `${s.sr_notice_delete_confirm_prefix} "${nameOrId}"${s.sr_notice_delete_confirm_suffix}`
    },
    savedPreset(name) {
      return replaceParams(s.sr_notice_preset_saved, { name })
    },
    levelRangeTitle(max) {
      return replaceParams(s.researchCard_level_title, { max })
    },
    levelAriaLabel(itemName) {
      return replaceParams(s.researchCard_level_aria, { name: itemName })
    },
    manifestLoadError(status) {
      return replaceParams(s.sr_load_manifest, { status })
    },
    sectionLoadError(rel, status) {
      return replaceParams(s.sr_load_section, { path: rel, status })
    },
    simulatorBudgetAria(spent, toMax, next) {
      return replaceParams(s.sr_budget_aria, { spent, toMax, next })
    },
    workshopBudgetAria(spent, toMax, next) {
      return replaceParams(s.ws_budget_aria, { spent, toMax, next })
    },
    versionAria(version) {
      return replaceParams(s.sr_version_aria, { version })
    },
    compareDifferingLabsCount(count) {
      if (count === 0) return s.sr_compare_diff_count_none
      if (count === 1) return s.sr_compare_diff_count_one
      return replaceParams(s.sr_compare_diff_count_many, { count })
    },
    compareDifferingWorkshopFields(count) {
      if (count === 1) return s.sr_compare_ws_diff_one
      return replaceParams(s.sr_compare_ws_diff_many, { count })
    },
  }
}

export const FORMAT_EN: I18nFormatters = formatters(
  STRINGS_EN as unknown as Record<StringId, string>,
)

export const FORMAT_ES: I18nFormatters = formatters(STRINGS_ES)
