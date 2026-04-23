import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated } from '../utils/auth.js';
import { getPosts, addPost, updatePost } from '../utils/storage.js';

const TITLE_MAX = 100;
const CONTENT_MAX = 2000;

export default function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    if (isEditMode) {
      const posts = getPosts();
      const post = posts.find((p) => p.id === id);

      if (!post) {
        navigate('/blogs', { replace: true });
        return;
      }

      const currentUser = getCurrentUser();
      const canEdit =
        currentUser &&
        (currentUser.role === 'admin' || currentUser.userId === post.authorId);

      if (!canEdit) {
        navigate('/blogs', { replace: true });
        return;
      }

      setTitle(post.title || '');
      setContent(post.content || '');
    }

    setInitialLoading(false);
  }, [id, isEditMode, navigate]);

  function validate() {
    if (!title.trim()) {
      return 'Title is required';
    }
    if (title.trim().length > TITLE_MAX) {
      return `Title must be ${TITLE_MAX} characters or less`;
    }
    if (!content.trim()) {
      return 'Content is required';
    }
    if (content.trim().length > CONTENT_MAX) {
      return `Content must be ${CONTENT_MAX} characters or less`;
    }
    return '';
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        updatePost({
          id,
          title: title.trim(),
          content: content.trim(),
        });
        navigate(`/blog/${id}`, { replace: true });
      } else {
        const newPost = {
          id: 'p_' + Date.now().toString(),
          title: title.trim(),
          content: content.trim(),
          createdAt: new Date().toISOString(),
          authorId: currentUser.userId,
          authorName: currentUser.displayName,
        };
        addPost(newPost);
        navigate(`/blog/${newPost.id}`, { replace: true });
      }
    } catch (err) {
      console.error('WriteBlog.handleSubmit failed:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  function handleCancel() {
    navigate(-1);
  }

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50">
        <p className="text-surface-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-writing">
        <h1 className="text-2xl font-bold text-surface-900 sm:text-3xl">
          {isEditMode ? 'Edit Post' : 'Create New Post'}
        </h1>
        <p className="mt-1 text-sm text-surface-500">
          {isEditMode
            ? 'Update your blog post below.'
            : 'Fill in the details to publish a new blog post.'}
        </p>

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-surface-700"
              >
                Title
              </label>
              <span
                className={`text-xs ${
                  title.trim().length > TITLE_MAX
                    ? 'text-red-500 font-semibold'
                    : 'text-surface-400'
                }`}
              >
                {title.trim().length}/{TITLE_MAX}
              </span>
            </div>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title"
              className="mt-1 block w-full rounded-md border border-surface-300 bg-white px-3 py-2 text-surface-900 shadow-sm placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 sm:text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-surface-700"
              >
                Content
              </label>
              <span
                className={`text-xs ${
                  content.trim().length > CONTENT_MAX
                    ? 'text-red-500 font-semibold'
                    : 'text-surface-400'
                }`}
              >
                {content.trim().length}/{CONTENT_MAX}
              </span>
            </div>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here…"
              rows={12}
              className="mt-1 block w-full rounded-md border border-surface-300 bg-white px-3 py-2 text-surface-900 shadow-sm placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 sm:text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-surface-200 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="rounded-md border border-surface-300 bg-white px-4 py-2 text-sm font-medium text-surface-700 shadow-sm transition-colors hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-50"
            >
              {loading
                ? 'Saving…'
                : isEditMode
                ? 'Update Post'
                : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}