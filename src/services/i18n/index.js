import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import httpBackend from 'i18next-http-backend';

const options = {
  fallbackLng: 'oz',
  backend: {
    loadPath: '/locales/{{lng}}.json',
    addPath: '/locales/add/{{lng}}',
  },
  react: {
    useSuspense: true,
    transSupportBasicHtmlNodes: true,
    bindI18n: 'languageChanged',
  },
  detection: {
    caches: ['localStorage'],
    lookupLocalStorage: 'language',
    order: ["localStorage"],
  }
};

i18n
  .use(httpBackend)
  // .use(LangDetector)
  .use(initReactI18next)
  .init(options);

export default i18n;