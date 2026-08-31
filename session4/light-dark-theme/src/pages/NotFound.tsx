import { Link, useLocation } from 'react-router-dom'

export const NotFound = () => {
  const location = useLocation()

  return (
    <div className="page notfound-page">
      <div className="notfound-card">
        <div className="notfound-status">404</div>
        <div className="notfound-icon">🛸</div>
        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-description">
          The requested route <code>{location.pathname}</code> does not exist in this application.
        </p>
        <div className="notfound-info">
          <span>Captured by the React Router wildcard route: <code>path="*"</code></span>
        </div>
        <Link to="/" className="back-home-btn">
          ⬅ Return to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
