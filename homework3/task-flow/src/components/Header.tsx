import type { ThemeMode } from '../types/task';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onResetApi: () => void;
}

export function Header({
  title = 'TaskFlow',
  subtitle = 'Organize your tasks. Stay productive.',
  theme,
  onToggleTheme,
  onResetApi,
}: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-top-bar">
        <div className="header-badge">
          <span>⚡</span>
          <span>React + TS</span>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="neo-btn-sm reset-api-btn"
            onClick={onResetApi}
            title="Reset tasks from DummyJSON API"
            aria-label="Reset tasks from DummyJSON API"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            <span>Reset API</span>
          </button>

          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>

      <div className="header-center">
        <h1 className="header-title">{title}</h1>
        <p className="header-subtitle">{subtitle}</p>
      </div>
    </header>
  );
}