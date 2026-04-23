import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage.js';
import { getCurrentUser } from '../utils/auth.js';
import { BlogCard } from '../components/BlogCard.jsx';

function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function LandingPage() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const posts = getPosts();
      const sorted = [...posts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLatestPosts(sorted.slice(0, 3));
    } catch (err) {
      console.error('LandingPage: failed to load posts', err);
      setLatestPosts([]);
    }

    try {
      const user = getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      console.error('LandingPage: failed to get current user', err);
      setCurrentUser(null);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-surface-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-600">WriteSpace</span>
            </Link>
            <div className="flex items-center gap-4">
              {currentUser ? (
                <Link
                  to="/blogs"
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-surface-700 transition-colors hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-surface-900 sm:text-5xl lg:text-6xl">
            Your Creative{' '}
            <span className="text-primary-600">Writing Space</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-surface-500 sm:text-xl">
            Share your ideas, stories, and insights with the world. WriteSpace is a
            modern blogging platform built for writers who value simplicity and
            elegance.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center rounded-lg bg-primary-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center rounded-lg border border-surface-300 bg-white px-8 py-3 text-base font-semibold text-surface-700 shadow-sm transition-colors hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-surface-900 sm:text-4xl">
              Why WriteSpace?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-surface-500">
              Everything you need to start writing and sharing your content.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border border-surface-200 bg-surface-50 p-8 text-center shadow-sm transition-shadow hover:shadow-md">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
                <span className="text-2xl" role="img" aria-hidden="true">✍️</span>
              </div>
              <h3 className="mt-6 text-lg font-bold text-surface-900">
                Easy Writing
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-surface-500">
                Create and publish blog posts in seconds with our clean, distraction-free
                editor. Focus on what matters — your words.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-surface-200 bg-surface-50 p-8 text-center shadow-sm transition-shadow hover:shadow-md">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-100">
                <span className="text-2xl" role="img" aria-hidden="true">🔒</span>
              </div>
              <h3 className="mt-6 text-lg font-bold text-surface-900">
                Role-Based Access
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-surface-500">
                Secure your content with built-in role management. Admins moderate
                the platform while users manage their own posts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-surface-200 bg-surface-50 p-8 text-center shadow-sm transition-shadow hover:shadow-md sm:col-span-2 lg:col-span-1">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <span className="text-2xl" role="img" aria-hidden="true">🚀</span>
              </div>
              <h3 className="mt-6 text-lg font-bold text-surface-900">
                Instant & Private
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-surface-500">
                All data stays in your browser. No servers, no tracking, no waiting.
                Lightning-fast performance with complete privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      {latestPosts.length > 0 && (
        <section className="py-16 sm:py-20 bg-surface-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-surface-900 sm:text-4xl">
                Latest Posts
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-surface-500">
                Check out the most recent stories from our community.
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <BlogCard key={post.id} post={post} currentUser={currentUser} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                to="/blogs"
                className="inline-flex items-center rounded-lg border border-primary-300 bg-white px-6 py-3 text-sm font-semibold text-primary-600 shadow-sm transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                View All Posts
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-surface-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link to="/" className="text-xl font-bold text-primary-600">
                WriteSpace
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-surface-500">
                A modern blogging platform for writers who value simplicity and privacy.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-900">
                Quick Links
              </h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    to="/blogs"
                    className="text-sm text-surface-500 transition-colors hover:text-primary-600"
                  >
                    All Posts
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-sm text-surface-500 transition-colors hover:text-primary-600"
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-sm text-surface-500 transition-colors hover:text-primary-600"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-900">
                Platform
              </h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <span className="text-sm text-surface-500">
                    Built with React
                  </span>
                </li>
                <li>
                  <span className="text-sm text-surface-500">
                    Styled with Tailwind CSS
                  </span>
                </li>
                <li>
                  <span className="text-sm text-surface-500">
                    Deployed on Vercel
                  </span>
                </li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-900">
                About
              </h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <span className="text-sm text-surface-500">
                    Privacy-first design
                  </span>
                </li>
                <li>
                  <span className="text-sm text-surface-500">
                    No external servers
                  </span>
                </li>
                <li>
                  <span className="text-sm text-surface-500">
                    100% client-side
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-surface-200 pt-8 text-center">
            <p className="text-sm text-surface-400">
              &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}