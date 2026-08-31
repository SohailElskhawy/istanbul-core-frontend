import { useContext } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { ThemeContext } from '../ThemeContext'

export const Layout = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <div className="layout-wrapper">
      <header className="navbar">
        <div className="nav-brand">
          <span className="brand-logo">🌐</span>
          <div className="brand-text">
            <span className="brand-title">Core Istanbul</span>
            <span className="brand-subtitle">Session 4: Routing</span>
          </div>
        </div>

        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Contact
          </NavLink>
          <NavLink
            to="/unknown-page"
            className={({ isActive }) => (isActive ? 'nav-item test-404' : 'nav-item test-404')}
            title="Test the 404 wildcard route"
          >
            404 Test
          </NavLink>
        </nav>

        <div className="nav-actions">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span className="theme-toggle-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className="theme-toggle-text">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="layout-footer">
        <div className="footer-content">
          <p className="footer-arch">
            Architecture: <code>&lt;Routes&gt;</code> &rarr; <code>&lt;Route path="/" element=&lbrace;&lt;Layout /&gt;&rbrace;&gt;</code> &rarr; <code>&lt;Outlet /&gt;</code>
          </p>
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Core Istanbul. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
