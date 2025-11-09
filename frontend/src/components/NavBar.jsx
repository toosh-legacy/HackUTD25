import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import '../css/Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const adminEmails = ['sai@gmail.com', 'fanenfury@gmail.com'];
  const isAdmin = user && adminEmails.includes(user.email);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/report', label: 'Report a Problem' },
    { path: '/status', label: 'Status' },
  ];

  const adminItems = [
    { path: '/alerts', label: 'Alerts' },
    { path: '/announcements', label: 'Announcements' },
    { path: '/server-status', label: 'Server Status' },
    { path: '/admin/reports', label: 'Manage Reports' },
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
          {/* 🔷 Logo */}
          <div className="navbar-logo">
            <span>T-Mobile Sentiment Tracker</span>
          </div>

          {/* 🔷 Main Menu */}
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

            {/* 🛠️ Admin Dropdown (Only for admin users) */}
            {isAdmin && (
              <div
                className="navbar-admin-dropdown"
                onMouseEnter={() => setIsAdminMenuOpen(true)}
                onMouseLeave={() => setIsAdminMenuOpen(false)}
              >
                {/* Make Admin itself a link so it behaves like other nav buttons */}
                <Link
                  to={adminItems[0].path}
                  className={`navbar-button admin-button ${adminItems.some(i => location.pathname === i.path) ? 'active' : ''}`}
                >
                  Admin ▾
                </Link>
                {isAdminMenuOpen && (
                  <div className="admin-dropdown-menu">
                    {adminItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`dropdown-item ${location.pathname === item.path ? 'active' : ''}`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 🔷 Profile / Logout */}
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
