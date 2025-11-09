import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../css/Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/report', label: 'Report a Problem' },
    { path: '/status', label: 'Status' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-logo">
            <span>T-Mobile Sentiment Tracker</span>
          </div>
          <div className="navbar-menu">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`navbar-button ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="navbar-profile">
            {user ? (
              <button onClick={handleLogout} className="profile-button">
                <span className="profile-email">{user.email}</span>
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            ) : (
              <Link to="/login" className="profile-button">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}