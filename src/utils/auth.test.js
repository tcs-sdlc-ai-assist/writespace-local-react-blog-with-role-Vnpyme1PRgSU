import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  login,
  logout,
  register,
  getCurrentUser,
  isAdmin,
  isAuthenticated,
} from './auth';

const mockSession = {
  userId: 'u_1234567890',
  username: 'testuser',
  displayName: 'Test User',
  role: 'user',
};

const mockAdminSession = {
  userId: 'u_admin',
  username: 'admin',
  displayName: 'Admin',
  role: 'admin',
};

const mockUser = {
  id: 'u_1234567890',
  displayName: 'Test User',
  username: 'testuser',
  password: 'pass1234',
  role: 'user',
  createdAt: '2024-06-01T12:00:00Z',
};

describe('auth.js', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // ─── login ─────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('returns success and session when logging in with hard-coded admin credentials', () => {
      const result = login('admin', 'admin123');
      expect(result.success).toBe(true);
      expect(result.session).toEqual(mockAdminSession);
      expect(result.error).toBeUndefined();
    });

    it('saves session to localStorage on successful admin login', () => {
      login('admin', 'admin123');
      const raw = localStorage.getItem('writespace_session');
      expect(JSON.parse(raw)).toEqual(mockAdminSession);
    });

    it('returns success when logging in with a registered localStorage user', () => {
      localStorage.setItem('writespace_users', JSON.stringify([mockUser]));
      const result = login('testuser', 'pass1234');
      expect(result.success).toBe(true);
      expect(result.session).toEqual({
        userId: mockUser.id,
        username: mockUser.username,
        displayName: mockUser.displayName,
        role: mockUser.role,
      });
    });

    it('saves session to localStorage on successful user login', () => {
      localStorage.setItem('writespace_users', JSON.stringify([mockUser]));
      login('testuser', 'pass1234');
      const raw = localStorage.getItem('writespace_session');
      const session = JSON.parse(raw);
      expect(session.userId).toBe(mockUser.id);
    });

    it('returns error when username is empty', () => {
      const result = login('', 'password');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username and password are required');
    });

    it('returns error when password is empty', () => {
      const result = login('admin', '');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username and password are required');
    });

    it('returns error when both username and password are empty', () => {
      const result = login('', '');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username and password are required');
    });

    it('returns error when credentials do not match any user', () => {
      const result = login('nonexistent', 'wrongpass');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('returns error when admin password is wrong', () => {
      const result = login('admin', 'wrongpassword');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('returns error when user password is wrong', () => {
      localStorage.setItem('writespace_users', JSON.stringify([mockUser]));
      const result = login('testuser', 'wrongpassword');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('is case-insensitive for username', () => {
      const result = login('Admin', 'admin123');
      expect(result.success).toBe(true);
      expect(result.session.username).toBe('admin');
    });

    it('is case-insensitive for localStorage user username', () => {
      localStorage.setItem('writespace_users', JSON.stringify([mockUser]));
      const result = login('TestUser', 'pass1234');
      expect(result.success).toBe(true);
      expect(result.session.username).toBe('testuser');
    });

    it('trims whitespace from username and password', () => {
      const result = login('  admin  ', '  admin123  ');
      expect(result.success).toBe(true);
    });

    it('returns error when username is null', () => {
      const result = login(null, 'password');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username and password are required');
    });

    it('returns error when password is null', () => {
      const result = login('admin', null);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username and password are required');
    });
  });

  // ─── logout ────────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('clears the session from localStorage', () => {
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));
      logout();
      const raw = localStorage.getItem('writespace_session');
      expect(raw).toBeNull();
    });

    it('does nothing when no session exists', () => {
      logout();
      const raw = localStorage.getItem('writespace_session');
      expect(raw).toBeNull();
    });

    it('handles localStorage.removeItem errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      logout();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  // ─── register ──────────────────────────────────────────────────────────────

  describe('register', () => {
    it('registers a new user and returns success with session', () => {
      const result = register({
        displayName: 'New User',
        username: 'newuser',
        password: 'pass1234',
      });
      expect(result.success).toBe(true);
      expect(result.session).toBeDefined();
      expect(result.session.username).toBe('newuser');
      expect(result.session.displayName).toBe('New User');
      expect(result.session.role).toBe('user');
      expect(result.session.userId).toMatch(/^u_/);
    });

    it('saves the new user to localStorage', () => {
      register({
        displayName: 'New User',
        username: 'newuser',
        password: 'pass1234',
      });
      const users = JSON.parse(localStorage.getItem('writespace_users'));
      expect(users).toHaveLength(1);
      expect(users[0].username).toBe('newuser');
      expect(users[0].displayName).toBe('New User');
      expect(users[0].role).toBe('user');
      expect(users[0].password).toBe('pass1234');
    });

    it('saves session to localStorage on successful registration', () => {
      register({
        displayName: 'New User',
        username: 'newuser',
        password: 'pass1234',
      });
      const session = JSON.parse(localStorage.getItem('writespace_session'));
      expect(session).toBeDefined();
      expect(session.username).toBe('newuser');
    });

    it('returns error when displayName is missing', () => {
      const result = register({
        displayName: '',
        username: 'newuser',
        password: 'pass1234',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('returns error when username is missing', () => {
      const result = register({
        displayName: 'New User',
        username: '',
        password: 'pass1234',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('returns error when password is missing', () => {
      const result = register({
        displayName: 'New User',
        username: 'newuser',
        password: '',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('returns error when all fields are missing', () => {
      const result = register({});
      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required');
    });

    it('returns error when called with no arguments', () => {
      const result = register();
      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required');
    });

    it('returns error when password is shorter than 4 characters', () => {
      const result = register({
        displayName: 'New User',
        username: 'newuser',
        password: 'abc',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Password must be at least 4 characters');
    });

    it('returns error when username matches the hard-coded admin username', () => {
      const result = register({
        displayName: 'Fake Admin',
        username: 'admin',
        password: 'pass1234',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username is already taken');
    });

    it('returns error when username matches the hard-coded admin username case-insensitively', () => {
      const result = register({
        displayName: 'Fake Admin',
        username: 'Admin',
        password: 'pass1234',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username is already taken');
    });

    it('returns error when username is already taken by an existing user', () => {
      localStorage.setItem('writespace_users', JSON.stringify([mockUser]));
      const result = register({
        displayName: 'Another User',
        username: 'testuser',
        password: 'pass5678',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username is already taken');
    });

    it('returns error when username is already taken case-insensitively', () => {
      localStorage.setItem('writespace_users', JSON.stringify([mockUser]));
      const result = register({
        displayName: 'Another User',
        username: 'TestUser',
        password: 'pass5678',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username is already taken');
    });

    it('trims whitespace from displayName and username', () => {
      const result = register({
        displayName: '  Trimmed User  ',
        username: '  trimmeduser  ',
        password: 'pass1234',
      });
      expect(result.success).toBe(true);
      expect(result.session.displayName).toBe('Trimmed User');
      expect(result.session.username).toBe('trimmeduser');
    });

    it('creates user with createdAt timestamp', () => {
      register({
        displayName: 'New User',
        username: 'newuser',
        password: 'pass1234',
      });
      const users = JSON.parse(localStorage.getItem('writespace_users'));
      expect(users[0].createdAt).toBeDefined();
      expect(() => new Date(users[0].createdAt)).not.toThrow();
    });

    it('creates user with a unique id starting with u_', () => {
      register({
        displayName: 'New User',
        username: 'newuser',
        password: 'pass1234',
      });
      const users = JSON.parse(localStorage.getItem('writespace_users'));
      expect(users[0].id).toMatch(/^u_\d+$/);
    });

    it('returns error when displayName is only whitespace', () => {
      const result = register({
        displayName: '   ',
        username: 'newuser',
        password: 'pass1234',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Display name is required');
    });

    it('returns error when username is only whitespace', () => {
      const result = register({
        displayName: 'New User',
        username: '   ',
        password: 'pass1234',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username is required');
    });
  });

  // ─── getCurrentUser ────────────────────────────────────────────────────────

  describe('getCurrentUser', () => {
    it('returns null when no session exists', () => {
      const user = getCurrentUser();
      expect(user).toBeNull();
    });

    it('returns the session object when a session exists', () => {
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));
      const user = getCurrentUser();
      expect(user).toEqual(mockSession);
    });

    it('returns null when session data is corrupted', () => {
      localStorage.setItem('writespace_session', 'not valid json');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const user = getCurrentUser();
      expect(user).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('returns the admin session after admin login', () => {
      login('admin', 'admin123');
      const user = getCurrentUser();
      expect(user).toEqual(mockAdminSession);
    });

    it('returns the user session after user login', () => {
      localStorage.setItem('writespace_users', JSON.stringify([mockUser]));
      login('testuser', 'pass1234');
      const user = getCurrentUser();
      expect(user.userId).toBe(mockUser.id);
      expect(user.username).toBe(mockUser.username);
    });

    it('returns null after logout', () => {
      login('admin', 'admin123');
      expect(getCurrentUser()).not.toBeNull();
      logout();
      expect(getCurrentUser()).toBeNull();
    });
  });

  // ─── isAdmin ───────────────────────────────────────────────────────────────

  describe('isAdmin', () => {
    it('returns false when no session exists', () => {
      expect(isAdmin()).toBe(false);
    });

    it('returns true when the session has admin role', () => {
      localStorage.setItem('writespace_session', JSON.stringify(mockAdminSession));
      expect(isAdmin()).toBe(true);
    });

    it('returns false when the session has user role', () => {
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));
      expect(isAdmin()).toBe(false);
    });

    it('returns true after admin login', () => {
      login('admin', 'admin123');
      expect(isAdmin()).toBe(true);
    });

    it('returns false after regular user login', () => {
      localStorage.setItem('writespace_users', JSON.stringify([mockUser]));
      login('testuser', 'pass1234');
      expect(isAdmin()).toBe(false);
    });

    it('returns false after logout', () => {
      login('admin', 'admin123');
      expect(isAdmin()).toBe(true);
      logout();
      expect(isAdmin()).toBe(false);
    });

    it('returns false when session data is corrupted', () => {
      localStorage.setItem('writespace_session', 'broken json');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(isAdmin()).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  // ─── isAuthenticated ──────────────────────────────────────────────────────

  describe('isAuthenticated', () => {
    it('returns false when no session exists', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('returns true when a valid session exists', () => {
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));
      expect(isAuthenticated()).toBe(true);
    });

    it('returns true after admin login', () => {
      login('admin', 'admin123');
      expect(isAuthenticated()).toBe(true);
    });

    it('returns true after regular user login', () => {
      localStorage.setItem('writespace_users', JSON.stringify([mockUser]));
      login('testuser', 'pass1234');
      expect(isAuthenticated()).toBe(true);
    });

    it('returns false after logout', () => {
      login('admin', 'admin123');
      expect(isAuthenticated()).toBe(true);
      logout();
      expect(isAuthenticated()).toBe(false);
    });

    it('returns false when session data is corrupted', () => {
      localStorage.setItem('writespace_session', 'not json');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(isAuthenticated()).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('returns false when session has empty userId', () => {
      localStorage.setItem(
        'writespace_session',
        JSON.stringify({ ...mockSession, userId: '' })
      );
      expect(isAuthenticated()).toBe(false);
    });

    it('returns true after successful registration', () => {
      register({
        displayName: 'New User',
        username: 'newuser',
        password: 'pass1234',
      });
      expect(isAuthenticated()).toBe(true);
    });
  });
});