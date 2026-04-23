import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage.js';
import { getCurrentUser } from '../utils/auth.js';
import { BlogCard } from '../components/BlogCard.jsx';

export function Home() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const allPosts = getPosts();
      const sorted = [...allPosts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sorted);
      setCurrentUser(getCurrentUser());
    } catch (err) {
      console.error('Home: failed to load posts', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-surface-500 text-lg">Loading posts…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">All Posts</h1>
          <p className="mt-1 text-surface-500">
            Browse the latest blog posts from the community.
          </p>
        </div>
        {currentUser && (
          <Link
            to="/create"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create Post
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-surface-200 bg-white py-16 px-6 text-center shadow-sm">
          <span className="text-5xl" role="img" aria-hidden="true">
            📝
          </span>
          <h2 className="mt-4 text-xl font-semibold text-surface-900">
            No posts yet
          </h2>
          <p className="mt-2 max-w-md text-surface-500">
            There are no blog posts to display. Be the first to share something
            with the community!
          </p>
          {currentUser && (
            <Link
              to="/create"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              Create Your First Post
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} currentUser={currentUser} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;