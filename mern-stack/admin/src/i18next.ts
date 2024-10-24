import English from '@/assets/locales/en.json'
import Vietnamese from '@/assets/locales/vi.json'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: English
  },
  vi: {
    translation: Vietnamese
  }
}

i18next.use(initReactI18next).use(LanguageDetector).init({
  resources,
  lng: 'vi' // default language
})

export default i18next
