import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'
import { useLanguageStore } from '../lib/languageStore'
import { Button } from './Button'

export function LanguageToggle({ className }: { className?: string }) {
  const { language, toggleLanguage } = useLanguageStore()
  const { t } = useTranslation()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      title={t('language.toggle')}
      aria-label="Toggle language"
      className={className}
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-semibold">{language === 'en' ? 'عربي' : 'EN'}</span>
    </Button>
  )
}
