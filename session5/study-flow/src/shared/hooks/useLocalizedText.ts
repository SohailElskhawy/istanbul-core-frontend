import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { getLocalizedText } from '../lib/utils'
import type { LocalizedString } from '../types'

/**
 * Returns a memoized function that resolves a LocalizedString
 * to the current language. Avoids repeating `i18n.language` setup in every component.
 */
export function useLocalizedText() {
  const { i18n } = useTranslation()
  const lang = i18n.language

  return useCallback(
    (value: LocalizedString | string | undefined | null) =>
      getLocalizedText(value, lang),
    [lang]
  )
}
