import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { LocalizedString } from '../types'
import type { BadgeProps } from '../components/Badge'
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Returns the localized text based on the current active language (en or ar).
 * Gracefully handles legacy strings or partial objects.
 */
export function getLocalizedText(
  value: LocalizedString | string | undefined | null,
  lang: string
): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (lang === 'ar') return value.ar || value.en || ''
  return value.en || value.ar || ''
}

/** Maps task priority to the corresponding Badge variant. Used across multiple features. */
export const PRIORITY_BADGE_VARIANT: Record<string, BadgeProps['variant']> = {
  high: 'danger',
  medium: 'warning',
  low: 'success',
}
