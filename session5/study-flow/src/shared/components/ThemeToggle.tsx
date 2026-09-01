import { useTranslation } from 'react-i18next'
import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '../lib/themeStore'
import { Button } from './Button'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useThemeStore()
  const { t } = useTranslation()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}
      aria-label="Toggle theme"
      className={className}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-(--foreground)" />
      ) : (
        <Moon className="h-4 w-4 text-(--foreground)" />
      )}
    </Button>
  )
}
