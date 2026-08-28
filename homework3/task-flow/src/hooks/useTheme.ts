import { useState, useEffect, useCallback } from 'react';
import type { ThemeMode } from '../types/task';
import { STORAGE_KEYS } from '../constants/taskConfig';
import { storage } from '../utils/storage';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = storage.getTheme(STORAGE_KEYS.THEME);
    if (saved) return saved;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    storage.setTheme(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme };
}
