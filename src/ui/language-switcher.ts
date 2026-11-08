import { getLocale, translate } from '../i18n';

export const renderLanguageSwitcher = (): string => {
  const currentLocale = getLocale();

  return `
    <div
     class="language-switcher"
     role="group"
     aria-label="${translate('selectLanguage')}"
     data-i18n-aria-label="selectLanguage"
    >
      ${(['en', 'ru', 'es'] as const)
        .map(
          (locale) => `
            <button
              type="button"
              class="language-switcher__button ${currentLocale === locale ? 'language-switcher__button--active' : ''}"
              data-locale="${locale}"
              aria-pressed="${currentLocale === locale}"
              lang="${locale}"
            >
              ${locale.toUpperCase()}
            </button>
          `,
        )
        .join('')}
    </div>
  `;
};
