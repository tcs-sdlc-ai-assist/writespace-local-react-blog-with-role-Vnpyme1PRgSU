import {
  getUsers,
  addUser,
  getSession,
  saveSession,
  clearSession,
} from './storage.js';

/**
 * Hard-coded admin credentials.
 * @type {{id: string, displayName: string, username: string, password: string, role: string, createdAt: string}}
 */
const ADMIN_ACCOUNT = {
  id: 'u_admin',
  displayName: 'Admin',
  username: 'admin',
  password: 'admin123',
  role: 'admin',
  createdAt: '2025-01-01T00:00:00.000Z',
};

/**
 * Attempt to log in with the given credentials.
 * Checks against the hard-coded admin account first, then localStorage users.
 * @param {string} username
 * @param {string} password
 * @returns {{ success: boolean, session?: { userId: string, username: string, displayName: string, role: string }, error?: string }}
 */
export function login(username, password) {
  try {
    if (!username || !password) {
      return { success: false, error: 'Username and password are required' };
    }

    const trimmedUsername = username.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Check hard-coded admin
    if (
      trimmedUsername === ADMIN_ACCOUNT.username &&
      trimmedPassword === ADMIN_ACCOUNT.password
    ) {
      const session = {
        userId: ADMIN_ACCOUNT.id,
        username: ADMIN_ACCOUNT.username,
        displayName: ADMIN_ACCOUNT.displayName,
        role: ADMIN_ACCOUNT.role,
      };
      saveSession(session);
      return { success: true, session };
    }

    // Check localStorage users
    const users = getUsers();
    const user = users.find(
      (u) => u.username.toLowerCase() === trimmedUsername && u.password === trimmedPassword
    );

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    const session = {
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    };
    saveSession(session);
    return { success: true, session };
  } catch (err) {
    console.error('auth.login failed:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Log out the current user by clearing the session.
 */
export function logout() {
  try {
    clearSession();
  } catch (err) {
    console.error('auth.logout failed:', err);
  }
}

/**
 * Register a new user with the 'user' role.
 * Validates required fields, password length, and username uniqueness.
 * @param {{ displayName: string, username: string, password: string }} userData
 * @returns {{ success: boolean, session?: { userId: string, username: string, displayName: string, role: string }, error?: string }}
 */
export function register({ displayName, username, password } = {}) {
  try {
    if (!displayName || !username || !password) {
      return { success: false, error: 'All fields are required' };
    }

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedDisplayName) {
      return { success: false, error: 'Display name is required' };
    }

    if (!trimmedUsername) {
      return { success: false, error: 'Username is required' };
    }

    if (trimmedPassword.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters' };
    }

    // Check uniqueness against hard-coded admin
    if (trimmedUsername === ADMIN_ACCOUNT.username) {
      return { success: false, error: 'Username is already taken' };
    }

    // Check uniqueness against existing users
    const users = getUsers();
    const exists = users.some((u) => u.username.toLowerCase() === trimmedUsername);
    if (exists) {
      return { success: false, error: 'Username is already taken' };
    }

    const newUser = {
      id: 'u_' + Date.now().toString(),
      displayName: trimmedDisplayName,
      username: trimmedUsername,
      password: trimmedPassword,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    addUser(newUser);

    const session = {
      userId: newUser.id,
      username: newUser.username,
      displayName: newUser.displayName,
      role: newUser.role,
    };
    saveSession(session);

    return { success: true, session };
  } catch (err) {
    console.error('auth.register failed:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Get the current session object from localStorage.
 * @returns {{ userId: string, username: string, displayName: string, role: string } | null}
 */
export function getCurrentUser() {
  try {
    return getSession();
  } catch (err) {
    console.error('auth.getCurrentUser failed:', err);
    return null;
  }
}

/**
 * Check if the current session user has the 'admin' role.
 * @returns {boolean}
 */
export function isAdmin() {
  try {
    const session = getSession();
    return session !== null && session.role === 'admin';
  } catch (err) {
    console.error('auth.isAdmin failed:', err);
    return false;
  }
}

/**
 * Check if there is an active session.
 * @returns {boolean}
 */
export function isAuthenticated() {
  try {
    const session = getSession();
    return session !== null && typeof session.userId === 'string' && session.userId.length > 0;
  } catch (err) {
    console.error('auth.isAuthenticated failed:', err);
    return false;
  }
}