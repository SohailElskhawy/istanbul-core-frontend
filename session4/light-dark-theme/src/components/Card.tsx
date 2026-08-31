import { useContext } from 'react'
import { ThemeContext } from '../ThemeContext'

export const Card = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <div className={`card ${theme}`}>
      <div className="card-icon-wrapper">
        <span className="card-icon">{theme === 'dark' ? '🌙' : '☀️'}</span>
      </div>

      <div className="card-header">
        <span className="badge">Direct Context Consumer</span>
        <h2>Current Theme: <span className="theme-name">{theme}</span></h2>
      </div>

      <p className="card-description">
        This <strong>Card</strong> component is nested inside <strong>Layout</strong> without receiving any theme props.
        It accesses the theme state and toggle function directly via <code>useContext(ThemeContext)</code>.
      </p>

      <div className="card-status">
        <div className="status-item">
          <span className="status-label">Active Mode</span>
          <span className="status-value">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Prop Drilling</span>
          <span className="status-value status-success">Eliminated ⚡</span>
        </div>
      </div>

      <button
        className="toggle-button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <span className="btn-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
        <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
      </button>
    </div>
  )
}
