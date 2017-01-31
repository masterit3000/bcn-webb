/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 */
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import viLocaleData from 'react-intl/locale-data/vi';

import { DEFAULT_LOCALE } from './constants';

import enTranslationMessages from './translations/en.json';
import viTranslationMessages from './translations/vi.json';

addLocaleData(enLocaleData);
addLocaleData(viLocaleData);

export const appLocales = [
  'vi',
  'en',
];

export const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages = locale !== DEFAULT_LOCALE
    ? formatTranslationMessages(DEFAULT_LOCALE, enTranslationMessages)
    : {};
  return Object.keys(messages).reduce((formattedMessages, key) => {
    const formattedMessage = !messages[key] && locale !== DEFAULT_LOCALE
      ? defaultFormattedMessages[key]
      : messages[key];
    return Object.assign(formattedMessages, { [key]: formattedMessage });
  }, {});
};

export const translationMessages = {
  vi: formatTranslationMessages('vi', viTranslationMessages),
  en: formatTranslationMessages('en', enTranslationMessages),
};
