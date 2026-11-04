import { translations } from './translations';

import type { Locale, TranslationKey } from './translations';

const STORAGE_KEY = 'alchemists-cauldron-locale';

const isLocale = (value: string | null): value is Locale =>
  value === 'en' || value === 'ru' || value === 'es';

const loadLocale = (): Locale => {
  try {
    const savedLocale = localStorage.getItem(STORAGE_KEY);

    return isLocale(savedLocale) ? savedLocale : 'en';
  } catch {
    return 'en';
  }
};

let currentLocale: Locale = loadLocale();

export const getLocale = (): Locale => currentLocale;

export const setLocale = (locale: Locale): void => {
  currentLocale = locale;
  document.documentElement.lang = locale;

  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // The game remains usable if storage is unavailable.
  }
};

export const t = (key: TranslationKey): string => translations[currentLocale][key];
