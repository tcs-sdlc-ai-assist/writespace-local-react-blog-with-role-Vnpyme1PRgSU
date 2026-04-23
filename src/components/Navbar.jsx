import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Avatar } from './Avatar.jsx';
import { logout } from '../utils/auth.js';

export function Navbar({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = currentUser && currentUser.role === 'admin';

  function handleLogout() {
    logout();
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  }

  function isActive(path) {
    return location.pathname === path;
  }

  function linkClass(path) {
    const base = 'px-3 py-2 rounded-md text-sm font-medium transition-colors';
    if (isActive(path)) {
      return `${base} bg-primary-100 text-primary-700`;
    }
    return `${base} text-surface-600 hover:bg-surface-100 hover:text-surface-900`;
  }

  function mobileLinkClass(path) {
    const base = 'block px-3 py-2 rounded-md text-base font-medium transition-colors';
    if (isActive(path)) {
      return `${base} bg-primary-100 text-primary-700`;
    }
    return `${base} text-surface-600 hover:bg-surface-100 hover:text-surface-900`;
  }

  return (
    <nav className="border-b border-surface-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link
              to="/blogs"
              className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
            >
              WriteSpace
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link to="/blogs" className={linkClass('/blogs')}>
                Blogs
              </Link>
              <Link to="/create" className={linkClass('/create')}>
                Write
              </Link>
              {isAdmin && (
                <>
                  <Link to="/dashboard" className={linkClass('/dashboard')}>
                    Admin Dashboard
                  </Link>
                  <Link to="/admin" className={linkClass('/admin')}>
                    Users
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Desktop User Info & Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar role={currentUser ? currentUser.role : 'user'} size="sm" />
              <span className="text-sm font-medium text-surface-700">
                {currentUser ? currentUser.displayName : ''}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-md border border-surface-300 bg-white px-3 py-1.5 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-50 hover:text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-md p-2 text-surface-500 hover:bg-surface-100 hover:text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-200">
          <div className="space-y-1 px-4 py-3">
            <Link
              to="/blogs"
              className={mobileLinkClass('/blogs')}
              onClick={() => setMobileMenuOpen(false)}
            >
              Blogs
            </Link>
            <Link
              to="/create"
              className={mobileLinkClass('/create')}
              onClick={() => setMobileMenuOpen(false)}
            >
              Write
            </Link>
            {isAdmin && (
              <>
                <Link
                  to="/dashboard"
                  className={mobileLinkClass('/dashboard')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin"
                  className={mobileLinkClass('/admin')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Users
                </Link>
              </>
            )}
          </div>
          <div className="border-t border-surface-200 px-4 py-3">
            <div className="flex items-center gap-3 mb-3">
              <Avatar role={currentUser ? currentUser.role : 'user'} size="sm" />
              <span className="text-sm font-medium text-surface-700">
                {currentUser ? currentUser.displayName : ''}
              </span>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full rounded-md border border-surface-300 bg-white px-3 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-50 hover:text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

Navbar.propTypes = {
  currentUser: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['admin', 'user']).isRequired,
  }),
  onLogout: PropTypes.func,
};

Navbar.defaultProps = {
  currentUser: null,
  onLogout: null,
};

export default Navbar;