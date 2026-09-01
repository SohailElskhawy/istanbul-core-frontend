import { create } from 'zustand'
import i18n, { type Language, LANGUAGE_STORAGE_KEY, applyDocumentDirection } from './i18n'

interface LanguageState {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: (i18n.language as Language) || 'en',
  setLanguage: (lang) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
    i18n.changeLanguage(lang)
    applyDocumentDirection(lang)
    set({ language: lang })
  },
  toggleLanguage: () => {
    const next = get().language === 'en' ? 'ar' : 'en'
    get().setLanguage(next)
  },
}))
