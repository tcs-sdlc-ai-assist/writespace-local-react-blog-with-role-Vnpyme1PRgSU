import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from './Avatar.jsx';

const DEFAULT_ADMIN_USERNAME = 'admin@writespace.com';

export function UserRow({ user, currentUser, onDelete }) {
  const isDefaultAdmin = user.username === DEFAULT_ADMIN_USERNAME;
  const isSelf = currentUser && currentUser.userId === user.id;
  const canDelete = !isDefaultAdmin && !isSelf;

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown';

  const roleBadgeClass =
    user.role === 'admin'
      ? 'bg-violet-100 text-violet-700 border-violet-200'
      : 'bg-indigo-100 text-indigo-700 border-indigo-200';

  return (
    <tr className="border-b border-surface-200 transition-colors hover:bg-surface-50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar role={user.role} size="sm" />
          <div>
            <p className="font-medium text-surface-900">{user.displayName}</p>
            <p className="text-sm text-surface-500">{user.username}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${roleBadgeClass}`}
        >
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-surface-500">{formattedDate}</td>
      <td className="px-4 py-3 text-right">
        {canDelete ? (
          <button
            onClick={() => onDelete(user.id)}
            className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Delete
          </button>
        ) : (
          <span className="text-sm text-surface-400 italic">
            {isSelf ? 'You' : 'Protected'}
          </span>
        )}
      </td>
    </tr>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['admin', 'user']).isRequired,
    createdAt: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['admin', 'user']).isRequired,
  }),
  onDelete: PropTypes.func.isRequired,
};

UserRow.defaultProps = {
  currentUser: null,
};

export default UserRow;