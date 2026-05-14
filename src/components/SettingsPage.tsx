import { APP_VERSION, CHANGELOG_URL } from '../appVersion'
import { useI18n, type AppLocale } from '../i18n'

export function SettingsPage() {
  const { t, fmt, locale, setLocale } = useI18n()

  return (
    <div className="settings-page" role="region" aria-label={t('app_settings_title')}>
      <div className="settings-page__field">
        <label className="settings-page__label" htmlFor="settings-locale-select">
          {t('app_settings_language_label')}
        </label>
        <select
          id="settings-locale-select"
          className="select-research__header-locale-select settings-page__locale-select"
          value={locale}
          onChange={(e) => setLocale(e.target.value as AppLocale)}
          aria-label={t('sr_locale_aria')}
        >
          <option value="en">{t('sr_locale_option_en')}</option>
          <option value="es">{t('sr_locale_option_es')}</option>
        </select>
      </div>

      <div className="settings-page__meta">
        <span
          className="select-research__version-label"
          aria-label={fmt.versionAria(APP_VERSION)}
        >
          v{APP_VERSION}
        </span>
        <a
          className="select-research__changelog-link"
          href={CHANGELOG_URL}
          target="_blank"
          rel="noopener noreferrer"
          title={t('sr_changelog_title')}
        >
          {t('sr_changelog')}
        </a>
      </div>
    </div>
  )
}
