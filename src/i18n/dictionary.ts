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
    'Import, export, share, and compare lab data. These actions use your current lab workspace (levels and presets).',
  app_tools_lab_hint:
    'Tip: switch to the LAB tab to edit levels; presets and notices appear there while you work.',
  app_settings_title: 'Settings',
  app_settings_language_label: 'Language',

  ws_title: 'Workshop',
  ws_tab_upgrade: 'Upgrade',
  ws_tab_enhance: 'Enhance',
  ws_enhance_empty: 'Enhance is not modeled in this tool yet.',
  ws_section_attack: 'Attack upgrades',
  ws_section_defense: 'Defense upgrades',
  ws_section_utility: 'Utility upgrades',
  ws_section_ultimate: 'Ultimate upgrades',
  ws_multiplier_group_aria: 'Buy multiplier',
  ws_multiplier_toggle_expand: 'Show multiplier options (×1, ×5, ×10)',
  ws_multiplier_toggle_collapse: 'Hide multiplier options',
  ws_cat_attack_aria: 'Attack upgrades category',
  ws_cat_defense_aria: 'Defense upgrades category',
  ws_cat_utility_aria: 'Utility upgrades category',
  ws_cat_ultimate_aria: 'Ultimate upgrades category',
  ws_disclaimer:
    'Layout reference only — workshop stats are not connected to lab data in this app.',
  ws_reset_demo: 'Reset Workshop',
  ws_stat_damage: 'Damage',
  ws_stat_attackSpeed: 'Attack speed',
  ws_stat_critChance: 'Critical chance',
  ws_stat_critFactor: 'Critical factor',
  ws_stat_attackRange: 'Attack range',
  ws_stat_damagePerMeter: 'Damage / meter',
  ws_stat_multishotChance: 'Multishot chance',
  ws_stat_multishotTargets: 'Multishot targets',
  ws_stat_rapidFireChance: 'Rapid fire chance',
  ws_stat_rapidFireDuration: 'Rapid fire duration',
  ws_stat_bounceChance: 'Bounce shot chance',
  ws_stat_bounceTargets: 'Bounce shot targets',
  ws_max: 'Max',

  sr_title: 'LAB',
  sr_toolbar_aria: 'Find and filter labs',
  sr_search_label_hidden: 'Search research',
  sr_search_placeholder: 'Search… (press / to focus)',
  sr_search_slash_hint:
    'Press slash (/) when not in a text field or number field to move focus to this search box.',

  sr_presets_build_label: 'Build',
  sr_preset_scratch_option: 'Scratch (unsaved workspace)',
  sr_preset_select_aria: 'Load a saved lab build or the scratch workspace',
  sr_preset_save_as: 'Save as…',
  sr_preset_delete_build: 'Delete build',
  sr_preset_delete_aria: 'Delete the active saved build',
  sr_hide_completed: 'Hide Completed',
  sr_reset_lab_levels: 'Reset Lab',
  sr_import_export_launcher: 'Import, export & share labs…',

  sr_budget_title: 'Simulator coins',
  sr_budget_aria:
    'Spent {{spent}}, to max {{toMax}}, next visible upgrades {{next}}.',
  sr_budget_footnote:
    'Card Mastery rows omitted (stones). Missing toolkit coin data counts as 0 per step.',
  sr_budget_spent_dt: 'Spent (all coin labs)',
  sr_budget_to_max_dt: 'To max (finite caps)',
  sr_budget_next_dt: 'Next upgrade (visible)',

  sr_lab_data_title: 'Lab backup & sharing',
  sr_lab_data_intro:
    'Import or export lab levels as CSV, or copy / QR a share link for this device.',
  sr_lab_data_files: 'Files',
  sr_lab_data_share: 'Share link',
  sr_lab_import_file: 'Import lab levels from CSV',
  sr_lab_export_file: 'Export lab levels to CSV',
  sr_compare_launcher: 'Compare builds…',
  sr_compare_title: 'Compare two lab snapshots',
  sr_compare_intro:
    'Paste a CSV export from this app (header key,level), a page URL that includes ?labs=…, or a raw share payload (starts with u or z). Coin totals match the simulator budget (Card Mastery omitted); each side uses its own Labs Coin Discount level.',
  sr_compare_build_a: 'Build A',
  sr_compare_build_b: 'Build B',
  sr_compare_placeholder: 'CSV, URL, or share payload…',
  sr_compare_use_current: 'Insert current workspace',
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
    'Invalid CSV: use the same key,level format as "Export lab levels to CSV".',
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
    'Encodes the short share link (same as “Copy short share link”).',
  sr_qr_copy_link: 'Copy link',

  sr_reset_confirm_title: 'Reset all lab levels and builds?',
  sr_reset_confirm_body:
    'This clears the scratch workspace and every saved build in this browser. Export or copy a share link first if you want to keep this setup.',
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
  sr_notice_reset_all:
    'All custom lab levels cleared (scratch and every saved build).',
  sr_notice_copy_short_ok: 'Short share link copied (labs only).',
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
    'Invalid CSV: use a header row key,level and one row per lab (e.g. 0-3,12).',
  sr_preset_prompt_title: 'Name this lab build (saved in this browser only)',
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
    'Importar, exportar, compartir y comparar datos de labs. Usan el espacio de trabajo actual (niveles y presets).',
  app_tools_lab_hint:
    'Consejo: ve a LAB para editar niveles; los avisos y presets aparecen allí mientras trabajas.',
  app_settings_title: 'Ajustes',
  app_settings_language_label: 'Idioma',

  ws_title: 'Taller',
  ws_tab_upgrade: 'Mejorar',
  ws_tab_enhance: 'Potenciar',
  ws_enhance_empty: 'Potenciar aún no está modelado en esta herramienta.',
  ws_section_attack: 'Mejoras de ataque',
  ws_section_defense: 'Mejoras de defensa',
  ws_section_utility: 'Mejoras de utilidad',
  ws_section_ultimate: 'Mejoras definitivas',
  ws_multiplier_group_aria: 'Multiplicador de compra',
  ws_multiplier_toggle_expand: 'Mostrar opciones de multiplicador (×1, ×5, ×10)',
  ws_multiplier_toggle_collapse: 'Ocultar opciones de multiplicador',
  ws_cat_attack_aria: 'Categoría de mejoras de ataque',
  ws_cat_defense_aria: 'Categoría de mejoras de defensa',
  ws_cat_utility_aria: 'Categoría de mejoras de utilidad',
  ws_cat_ultimate_aria: 'Categoría de mejoras definitivas',
  ws_disclaimer:
    'Solo referencia visual — las estadísticas del taller no están enlazadas a los datos de lab en esta app.',
  ws_reset_demo: 'Restablecer taller',
  ws_stat_damage: 'Daño',
  ws_stat_attackSpeed: 'Velocidad de ataque',
  ws_stat_critChance: 'Prob. de crítico',
  ws_stat_critFactor: 'Factor de crítico',
  ws_stat_attackRange: 'Alcance de ataque',
  ws_stat_damagePerMeter: 'Daño / metro',
  ws_stat_multishotChance: 'Prob. multidisparo',
  ws_stat_multishotTargets: 'Objetivos multidisparo',
  ws_stat_rapidFireChance: 'Prob. fuego rápido',
  ws_stat_rapidFireDuration: 'Duración fuego rápido',
  ws_stat_bounceChance: 'Prob. rebote',
  ws_stat_bounceTargets: 'Objetivos de rebote',
  ws_max: 'Máx',

  sr_title: 'LAB',
  sr_toolbar_aria: 'Buscar y filtrar laboratorios',
  sr_search_label_hidden: 'Buscar investigación',
  sr_search_placeholder: 'Buscar… (pulsa / para enfocar)',
  sr_search_slash_hint:
    'Pulsa la barra (/) cuando no estés en un campo de texto o numérico para enfocar este cuadro de búsqueda.',

  sr_presets_build_label: 'Build',
  sr_preset_scratch_option: 'Borrador (espacio de trabajo sin guardar)',
  sr_preset_select_aria: 'Cargar un build guardado o el espacio de trabajo',
  sr_preset_save_as: 'Guardar como…',
  sr_preset_delete_build: 'Eliminar build',
  sr_preset_delete_aria: 'Eliminar el build guardado activo',
  sr_hide_completed: 'Ocultar completados',
  sr_reset_lab_levels: 'Restablecer LAB',
  sr_import_export_launcher: 'Importar, exportar y compartir labs…',

  sr_budget_title: 'Monedas del simulador',
  sr_budget_aria:
    'Gastado {{spent}}, hasta el máximo {{toMax}}, siguientes mejoras visibles {{next}}.',
  sr_budget_footnote:
    'Filas de Card Mastery omitidas (piedras). Si faltan datos de monedas del toolkit, se cuenta 0 por paso.',
  sr_budget_spent_dt: 'Gastado (todos los labs de monedas)',
  sr_budget_to_max_dt: 'Hasta el máximo (topes finitos)',
  sr_budget_next_dt: 'Siguiente mejora (visible)',

  sr_lab_data_title: 'Copia de seguridad y compartir',
  sr_lab_data_intro:
    'Importa o exporta niveles de lab en CSV, o copia / QR de un enlace para este dispositivo.',
  sr_lab_data_files: 'Archivos',
  sr_lab_data_share: 'Enlace para compartir',
  sr_lab_import_file: 'Importar niveles desde CSV',
  sr_lab_export_file: 'Exportar niveles a CSV',
  sr_compare_launcher: 'Comparar builds…',
  sr_compare_title: 'Comparar dos instantáneas de labs',
  sr_compare_intro:
    'Pega un CSV de esta app (cabecera key,level), una URL con ?labs=… o un payload de compartir en crudo (empieza por u o z). Las monedas coinciden con el presupuesto del simulador (sin Card Mastery); cada lado usa su propio nivel de Labs Coin Discount.',
  sr_compare_build_a: 'Build A',
  sr_compare_build_b: 'Build B',
  sr_compare_placeholder: 'CSV, URL o payload…',
  sr_compare_use_current: 'Insertar espacio de trabajo actual',
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
    'CSV no válido: usa el mismo formato key,level que «Exportar niveles a CSV».',
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
    'Codifica el enlace corto (igual que «Copiar enlace corto»).',
  sr_qr_copy_link: 'Copiar enlace',

  sr_reset_confirm_title: '¿Restablecer todos los niveles y builds?',
  sr_reset_confirm_body:
    'Esto borra el espacio de trabajo y cada build guardado en este navegador. Exporta o copia un enlace antes si quieres conservar esta configuración.',
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
  sr_notice_reset_all:
    'Se borraron todos los niveles personalizados (borrador y cada build guardado).',
  sr_notice_copy_short_ok: 'Enlace corto copiado (solo labs).',
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
    'CSV no válido: usa la fila de cabecera key,level y una fila por lab (p. ej. 0-3,12).',
  sr_preset_prompt_title: 'Nombre del build (solo en este navegador)',
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
  shareOpenedLevels: (count: number) => string
  importedLevels: (count: number) => string
  deleteBuildConfirm: (nameOrId: string) => string
  savedPreset: (name: string) => string
  levelRangeTitle: (max: number) => string
  levelAriaLabel: (itemName: string) => string
  manifestLoadError: (status: number) => string
  sectionLoadError: (rel: string, status: number) => string
  simulatorBudgetAria: (spent: string, toMax: string, next: string) => string
  versionAria: (version: string) => string
  compareDifferingLabsCount: (count: number) => string
}

function formatters(s: Record<StringId, string>): I18nFormatters {
  return {
    shareOpenedLevels(count) {
      if (count === 0) return s.sr_notice_share_cleared
      if (count === 1) return s.sr_notice_share_one
      return replaceParams(s.sr_notice_share_many, { count })
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
    versionAria(version) {
      return replaceParams(s.sr_version_aria, { version })
    },
    compareDifferingLabsCount(count) {
      if (count === 0) return s.sr_compare_diff_count_none
      if (count === 1) return s.sr_compare_diff_count_one
      return replaceParams(s.sr_compare_diff_count_many, { count })
    },
  }
}

export const FORMAT_EN: I18nFormatters = formatters(
  STRINGS_EN as unknown as Record<StringId, string>,
)

export const FORMAT_ES: I18nFormatters = formatters(STRINGS_ES)
