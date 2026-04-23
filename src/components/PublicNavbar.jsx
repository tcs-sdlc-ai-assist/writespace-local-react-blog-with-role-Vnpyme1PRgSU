import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-surface-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-700 transition-colors hover:text-primary-600">
          <span role="img" aria-hidden="true">✍️</span>
          <span>WriteSpace</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-4 sm:flex">
          <Link
            to="/login"
            className="rounded-md px-4 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100 hover:text-primary-600"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            Register
          </Link>
        </div>

        {/* Mobile hamburger button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-300 sm:hidden"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-surface-200 bg-white px-4 pb-4 pt-2 sm:hidden">
          <div className="flex flex-col gap-2">
            <Link
              to="/login"
              className="rounded-md px-4 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-100 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-primary-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default PublicNavbar;