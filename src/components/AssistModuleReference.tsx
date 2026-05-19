import {
  ASSIST_STONE_EFFICIENCY_ROWS,
  ASSIST_UNIQUE_RARITY_ROWS,
  ASSIST_UNIQUE_RARITY_STONE_TOTAL,
  WORKSHOP_ASSIST_GLOBAL_INTRO,
  WORKSHOP_ASSIST_GLOBAL_NOTES,
} from '../data/workshopAssistModuleCatalog'
import { WORKSHOP_CHASSIS_MODULE_RARITY_CLASS } from '../data/workshopChassisModuleShared'
import { useI18n } from '../i18n'
import type { StringId } from '../i18n/dictionary'

const RARITY_LABEL: Record<
  (typeof ASSIST_UNIQUE_RARITY_ROWS)[number]['rarity'],
  StringId
> = {
  epic: 'ws_modules_col_epic',
  legendary: 'ws_modules_col_legendary',
  mythic: 'ws_modules_col_mythic',
  ancestral: 'ws_modules_col_ancestral',
}

export function AssistModuleReference() {
  const { t } = useI18n()

  return (
    <section className="modules-assist-wiki" aria-labelledby="modules-assist-wiki-title">
      <h3 id="modules-assist-wiki-title" className="modules-catalog__title">
        {t('ws_assist_wiki_title')}
      </h3>
      <div className="modules-catalog__notes modules-catalog__notes--intro">
        <ul className="modules-catalog__notes-list">
          {WORKSHOP_ASSIST_GLOBAL_INTRO.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>

      <h4 className="modules-catalog__subtitle">{t('ws_assist_table_rarity_title')}</h4>
      <p className="modules-catalog__hint">{t('ws_assist_table_rarity_hint')}</p>
      <div className="modules-catalog__scroll">
        <table className="modules-catalog__table modules-catalog__table--assist-wiki">
          <thead>
            <tr>
              <th scope="col">{t('ws_assist_col_rarity')}</th>
              <th scope="col" className="modules-catalog__th-num">
                {t('ws_assist_col_stones')}
              </th>
              <th scope="col" className="modules-catalog__th-num">
                {t('ws_assist_col_cumulative')}
              </th>
            </tr>
          </thead>
          <tbody>
            {ASSIST_UNIQUE_RARITY_ROWS.map((row) => (
              <tr key={row.rarity} className="modules-catalog__row">
                <th scope="row" className={WORKSHOP_CHASSIS_MODULE_RARITY_CLASS[row.rarity]}>
                  {t(RARITY_LABEL[row.rarity])}
                  {row.rarity === 'epic' ? ` (${t('ws_assist_rarity_unlock')})` : ''}
                </th>
                <td className="modules-catalog__num">{row.stoneCost.toLocaleString()}</td>
                <td className="modules-catalog__num">
                  {row.cumulativeStones.toLocaleString()}
                </td>
              </tr>
            ))}
            <tr className="modules-catalog__row modules-catalog__row--total">
              <th scope="row">{t('ws_assist_row_total')}</th>
              <td className="modules-catalog__num" colSpan={2}>
                {ASSIST_UNIQUE_RARITY_STONE_TOTAL.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="modules-catalog__hint">{t('ws_assist_slot_unlock_note')}</p>

      <h4 className="modules-catalog__subtitle">{t('ws_assist_table_efficiency_title')}</h4>
      <p className="modules-catalog__hint">{t('ws_assist_table_efficiency_hint')}</p>
      <div className="modules-catalog__scroll">
        <table className="modules-catalog__table modules-catalog__table--assist-wiki">
          <thead>
            <tr>
              <th scope="col" className="modules-catalog__th-num">
                {t('ws_assist_col_value')}
              </th>
              <th scope="col" className="modules-catalog__th-num">
                {t('ws_assist_col_marginal')}
              </th>
              <th scope="col" className="modules-catalog__th-num">
                {t('ws_assist_col_cumulative')}
              </th>
              <th scope="col" className="modules-catalog__th-num">
                {t('ws_assist_col_to_max')}
              </th>
            </tr>
          </thead>
          <tbody>
            {ASSIST_STONE_EFFICIENCY_ROWS.map((row) => (
              <tr key={row.valuePercent} className="modules-catalog__row">
                <td className="modules-catalog__num">{row.valuePercent}%</td>
                <td className="modules-catalog__num">
                  {row.marginalStones.toLocaleString()}
                </td>
                <td className="modules-catalog__num">
                  {row.cumulativeStones.toLocaleString()}
                </td>
                <td className="modules-catalog__num">
                  {row.stonesToMax.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="modules-catalog__notes">
        <ul className="modules-catalog__notes-list">
          {WORKSHOP_ASSIST_GLOBAL_NOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
