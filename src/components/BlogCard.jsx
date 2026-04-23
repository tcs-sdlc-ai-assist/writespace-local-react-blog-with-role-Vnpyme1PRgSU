import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Avatar } from './Avatar.jsx';

function truncateContent(content, maxLength = 120) {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength).trimEnd() + '…';
}

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

export function BlogCard({ post, currentUser }) {
  const { id, title, content, createdAt, authorId, authorName } = post || {};

  const canEdit =
    currentUser &&
    (currentUser.role === 'admin' || currentUser.userId === authorId);

  return (
    <div className="flex flex-col rounded-lg border border-surface-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link to={`/blog/${id}`} className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-surface-900 line-clamp-2 hover:text-primary-600 transition-colors">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-surface-500 leading-relaxed">
          {truncateContent(content)}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar role={currentUser && authorId === currentUser.userId ? currentUser.role : 'user'} size="sm" />
            <span className="text-sm font-medium text-surface-700">
              {authorName || 'Unknown'}
            </span>
          </div>
          <span className="text-xs text-surface-400">{formatDate(createdAt)}</span>
        </div>
      </Link>
      {canEdit && (
        <div className="border-t border-surface-200 px-6 py-3">
          <Link
            to={`/edit/${id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
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
        </div>
      )}
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    authorId: PropTypes.string,
    authorName: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({
    userId: PropTypes.string,
    username: PropTypes.string,
    displayName: PropTypes.string,
    role: PropTypes.oneOf(['admin', 'user']),
  }),
};

BlogCard.defaultProps = {
  currentUser: null,
};

export default BlogCard;