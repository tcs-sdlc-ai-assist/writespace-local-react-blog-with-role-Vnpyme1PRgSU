import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, addUser, removeUser } from '../utils/storage.js';
import { getCurrentUser, isAdmin } from '../utils/auth.js';
import { UserRow } from '../components/UserRow.jsx';

const DEFAULT_ADMIN_ID = 'u_admin';
const DEFAULT_ADMIN_USERNAME = 'admin';

function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    password: '',
    role: 'user',
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const loadUsers = useCallback(() => {
    const storedUsers = getUsers();
    const adminAccount = {
      id: DEFAULT_ADMIN_ID,
      displayName: 'Admin',
      username: DEFAULT_ADMIN_USERNAME,
      role: 'admin',
      createdAt: '2025-01-01T00:00:00.000Z',
    };
    const hasAdmin = storedUsers.some((u) => u.id === DEFAULT_ADMIN_ID);
    if (hasAdmin) {
      setUsers(storedUsers);
    } else {
      setUsers([adminAccount, ...storedUsers]);
    }
  }, []);

  useEffect(() => {
    const session = getCurrentUser();
    if (!session || !isAdmin()) {
      navigate('/login');
      return;
    }
    setCurrentUser(session);
    loadUsers();
  }, [navigate, loadUsers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError('');
    setFormSuccess('');
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const trimmedDisplayName = formData.displayName.trim();
    const trimmedUsername = formData.username.trim().toLowerCase();
    const trimmedPassword = formData.password.trim();
    const selectedRole = formData.role;

    if (!trimmedDisplayName) {
      setFormError('Display name is required');
      return;
    }

    if (!trimmedUsername) {
      setFormError('Username is required');
      return;
    }

    if (!trimmedPassword) {
      setFormError('Password is required');
      return;
    }

    if (trimmedPassword.length < 4) {
      setFormError('Password must be at least 4 characters');
      return;
    }

    if (trimmedUsername === DEFAULT_ADMIN_USERNAME) {
      setFormError('Username is already taken');
      return;
    }

    const existingUsers = getUsers();
    const exists = existingUsers.some(
      (u) => u.username.toLowerCase() === trimmedUsername
    );
    if (exists) {
      setFormError('Username is already taken');
      return;
    }

    const newUser = {
      id: 'u_' + Date.now().toString(),
      displayName: trimmedDisplayName,
      username: trimmedUsername,
      password: trimmedPassword,
      role: selectedRole,
      createdAt: new Date().toISOString(),
    };

    addUser(newUser);
    setFormData({ displayName: '', username: '', password: '', role: 'user' });
    setFormSuccess(`User "${trimmedDisplayName}" created successfully`);
    loadUsers();
  };

  const handleDeleteRequest = (userId) => {
    if (userId === DEFAULT_ADMIN_ID) {
      return;
    }
    if (currentUser && userId === currentUser.userId) {
      return;
    }
    setDeleteConfirmId(userId);
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    removeUser(deleteConfirmId);
    setDeleteConfirmId(null);
    loadUsers();
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
  };

  const deleteTargetUser = deleteConfirmId
    ? users.find((u) => u.id === deleteConfirmId)
    : null;

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900">User Management</h1>
          <p className="mt-2 text-surface-500">
            Manage all registered users on the platform.
          </p>
        </div>

        {/* Create User Form */}
        <div className="mb-8 rounded-lg border border-surface-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-surface-900">
            Create New User
          </h2>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="displayName"
                  className="mb-1 block text-sm font-medium text-surface-700"
                >
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="Jane Doe"
                  className="w-full rounded-md border border-surface-300 px-3 py-2 text-sm text-surface-900 placeholder-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm font-medium text-surface-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="janedoe"
                  className="w-full rounded-md border border-surface-300 px-3 py-2 text-sm text-surface-900 placeholder-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-surface-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Min 4 characters"
                  className="w-full rounded-md border border-surface-300 px-3 py-2 text-sm text-surface-900 placeholder-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="mb-1 block text-sm font-medium text-surface-700"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-surface-300 px-3 py-2 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {formError && (
              <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
                {formSuccess}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                Create User
              </button>
            </div>
          </form>
        </div>

        {/* Users Table */}
        <div className="rounded-lg border border-surface-200 bg-white shadow-sm">
          <div className="border-b border-surface-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-surface-900">
              All Users ({users.length})
            </h2>
          </div>
          {users.length === 0 ? (
            <div className="px-6 py-12 text-center text-surface-500">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-surface-200 bg-surface-50">
                    <th className="px-4 py-3 text-sm font-semibold text-surface-700">
                      User
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-surface-700">
                      Role
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-surface-700">
                      Joined
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-surface-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      currentUser={currentUser}
                      onDelete={handleDeleteRequest}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && deleteTargetUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-surface-900">
                Confirm Deletion
              </h3>
              <p className="mt-2 text-sm text-surface-600">
                Are you sure you want to delete user{' '}
                <span className="font-semibold">
                  {deleteTargetUser.displayName}
                </span>{' '}
                ({deleteTargetUser.username})? This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={handleDeleteCancel}
                  className="rounded-md border border-surface-300 bg-white px-4 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-surface-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;