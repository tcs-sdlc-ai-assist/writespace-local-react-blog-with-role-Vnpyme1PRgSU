import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPosts, removePost } from '../utils/storage.js';
import { getCurrentUser } from '../utils/auth.js';
import { Avatar } from '../components/Avatar.jsx';

function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }

    const posts = getPosts();
    const found = posts.find((p) => p.id === id);

    if (found) {
      setPost(found);
      setNotFound(false);
    } else {
      setPost(null);
      setNotFound(true);
    }
  }, [id]);

  const canEditOrDelete =
    currentUser &&
    post &&
    (currentUser.role === 'admin' || currentUser.userId === post.authorId);

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    removePost(post.id);
    setShowConfirm(false);
    navigate('/blogs');
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8">
          <h2 className="text-2xl font-bold text-red-600">Post Not Found</h2>
          <p className="mt-2 text-surface-500">
            The blog post you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/blogs"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
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
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-surface-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Back link */}
      <Link
        to="/blogs"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
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
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Blogs
      </Link>

      {/* Article */}
      <article className="rounded-lg border border-surface-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold text-surface-900 leading-tight sm:text-4xl">
          {post.title}
        </h1>

        {/* Author & date */}
        <div className="mt-4 flex items-center gap-3 border-b border-surface-200 pb-4">
          <Avatar
            role={
              currentUser && post.authorId === currentUser.userId
                ? currentUser.role
                : 'user'
            }
            size="md"
          />
          <div>
            <p className="font-medium text-surface-700">
              {post.authorName || 'Unknown'}
            </p>
            <p className="text-sm text-surface-400">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 whitespace-pre-wrap text-surface-700 leading-relaxed">
          {post.content}
        </div>

        {/* Actions */}
        {canEditOrDelete && (
          <div className="mt-8 flex items-center gap-3 border-t border-surface-200 pt-6">
            <Link
              to={`/edit/${post.id}`}
              className="inline-flex items-center gap-1 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1 rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
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
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Delete
            </button>
          </div>
        )}
      </article>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-surface-900">Delete Post</h3>
            <p className="mt-2 text-sm text-surface-500">
              Are you sure you want to delete &ldquo;{post.title}&rdquo;? This action
              cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="rounded-md border border-surface-200 bg-white px-4 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-surface-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadBlog;