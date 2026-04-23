import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPosts, getUsers, removePost } from '../utils/storage.js';
import { getCurrentUser } from '../utils/auth.js';
import { StatCard } from '../components/StatCard.jsx';

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

function truncateTitle(title, maxLength = 60) {
  if (!title) return '';
  if (title.length <= maxLength) return title;
  return title.slice(0, maxLength).trimEnd() + '…';
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const loadData = useCallback(() => {
    try {
      const session = getCurrentUser();
      setCurrentUser(session);

      if (!session || session.role !== 'admin') {
        navigate('/login', { replace: true });
        return;
      }

      setPosts(getPosts());
      setUsers(getUsers());
    } catch (err) {
      console.error('AdminDashboard.loadData failed:', err);
      setPosts([]);
      setUsers([]);
    }
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeletePost = (postId) => {
    try {
      removePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error('AdminDashboard.handleDeletePost failed:', err);
    }
  };

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for hard-coded admin
  const adminCount = users.filter((u) => u.role === 'admin').length + 1; // +1 for hard-coded admin
  const userCount = users.filter((u) => u.role === 'user').length;

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-surface-500">
          Welcome back, {currentUser?.displayName || 'Admin'}. Here&apos;s an overview of your platform.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Posts" value={totalPosts} icon="📝" color="blue" />
        <StatCard title="Total Users" value={totalUsers} icon="👥" color="green" />
        <StatCard title="Admins" value={adminCount} icon="👑" color="purple" />
        <StatCard title="Users" value={userCount} icon="📖" color="indigo" />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-surface-900">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/create"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
            Write New Post
          </Link>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 rounded-lg border border-surface-300 bg-white px-5 py-2.5 text-sm font-medium text-surface-700 shadow-sm transition-colors hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Manage Users
          </Link>
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-surface-900">Recent Posts</h2>
          <Link
            to="/blogs"
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View all →
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="rounded-lg border border-surface-200 bg-white p-8 text-center">
            <p className="text-surface-500">No posts yet. Create your first post!</p>
            <Link
              to="/create"
              className="mt-3 inline-block text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Create Post →
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-surface-200 bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="border-b border-surface-200 bg-surface-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-surface-700">Title</th>
                  <th className="hidden px-4 py-3 text-sm font-semibold text-surface-700 sm:table-cell">Author</th>
                  <th className="hidden px-4 py-3 text-sm font-semibold text-surface-700 md:table-cell">Date</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-surface-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-surface-200 transition-colors hover:bg-surface-50 last:border-b-0"
                  >
                    <td className="px-4 py-3">
                      <Link
                        to={`/blog/${post.id}`}
                        className="font-medium text-surface-900 hover:text-primary-600 transition-colors"
                      >
                        {truncateTitle(post.title)}
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-surface-500 sm:table-cell">
                      {post.authorName || 'Unknown'}
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-surface-500 md:table-cell">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/edit/${post.id}`}
                          className="rounded-md bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-600 border border-primary-200 transition-colors hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-300"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;