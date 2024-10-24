import { createContext, useContext, useEffect, useState } from 'react'

import { LanguageType } from '@/types/language.type'
import { useTranslation } from 'react-i18next'

type LanguageContextType = {
  language: LanguageType
  setLanguage: (language: LanguageType) => void
}

type LanguageProviderProps = {
  children: React.ReactNode
  languageLocal: LanguageType
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'vi',
  setLanguage: (_lang: LanguageType) => {}
})

export const LanguageProvider = ({ children, languageLocal }: LanguageProviderProps) => {
  const [languageDefault, setLanguageDefault] = useState(languageLocal)
  const { i18n } = useTranslation()

  const setLanguage = (language: LanguageType) => {
    setLanguageDefault(language)
    i18n.changeLanguage(language) // thay đổi ngôn ngữ cho i18n
  }

  useEffect(() => {
    i18n.changeLanguage(languageDefault)
  }, [languageDefault])

  return (
    <LanguageContext.Provider
      value={{
        language: languageDefault,
        setLanguage
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }

  return context
}
