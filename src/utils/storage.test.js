import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getPosts,
  savePosts,
  addPost,
  updatePost,
  removePost,
  getUsers,
  saveUsers,
  addUser,
  updateUser,
  removeUser,
  getSession,
  saveSession,
  clearSession,
} from './storage';

const mockPost = {
  id: 'p_1234567890',
  title: 'Test Post',
  content: 'This is test content.',
  createdAt: '2024-06-01T12:00:00Z',
  authorId: 'u_1234567890',
  authorName: 'Test User',
};

const mockPost2 = {
  id: 'p_9876543210',
  title: 'Second Post',
  content: 'Another test post.',
  createdAt: '2024-06-02T12:00:00Z',
  authorId: 'u_1234567890',
  authorName: 'Test User',
};

const mockUser = {
  id: 'u_1234567890',
  displayName: 'Test User',
  username: 'testuser',
  password: 'pass1234',
  role: 'user',
  createdAt: '2024-06-01T12:00:00Z',
};

const mockUser2 = {
  id: 'u_9876543210',
  displayName: 'Admin User',
  username: 'adminuser',
  password: 'admin123',
  role: 'admin',
  createdAt: '2024-06-01T11:00:00Z',
};

const mockSession = {
  userId: 'u_1234567890',
  username: 'testuser',
  displayName: 'Test User',
  role: 'user',
};

describe('storage.js', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // ─── Posts ─────────────────────────────────────────────────────────────────

  describe('getPosts', () => {
    it('returns an empty array when no posts exist in localStorage', () => {
      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('returns parsed posts array from localStorage', () => {
      localStorage.setItem('writespace_posts', JSON.stringify([mockPost]));
      const posts = getPosts();
      expect(posts).toEqual([mockPost]);
    });

    it('returns an empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_posts', 'not valid json{{{');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const posts = getPosts();
      expect(posts).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_posts', JSON.stringify({ not: 'an array' }));
      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('returns an empty array when localStorage contains a string value', () => {
      localStorage.setItem('writespace_posts', JSON.stringify('just a string'));
      const posts = getPosts();
      expect(posts).toEqual([]);
    });
  });

  describe('savePosts', () => {
    it('saves an array of posts to localStorage', () => {
      savePosts([mockPost, mockPost2]);
      const raw = localStorage.getItem('writespace_posts');
      expect(JSON.parse(raw)).toEqual([mockPost, mockPost2]);
    });

    it('saves an empty array to localStorage', () => {
      savePosts([]);
      const raw = localStorage.getItem('writespace_posts');
      expect(JSON.parse(raw)).toEqual([]);
    });

    it('saves an empty array when given a non-array value', () => {
      savePosts('not an array');
      const raw = localStorage.getItem('writespace_posts');
      expect(JSON.parse(raw)).toEqual([]);
    });

    it('handles localStorage.setItem errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      savePosts([mockPost]);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('addPost', () => {
    it('adds a post to an empty posts array', () => {
      addPost(mockPost);
      const posts = getPosts();
      expect(posts).toEqual([mockPost]);
    });

    it('appends a post to existing posts', () => {
      savePosts([mockPost]);
      addPost(mockPost2);
      const posts = getPosts();
      expect(posts).toHaveLength(2);
      expect(posts[1]).toEqual(mockPost2);
    });
  });

  describe('updatePost', () => {
    it('updates an existing post by id', () => {
      savePosts([mockPost]);
      updatePost({ id: mockPost.id, title: 'Updated Title' });
      const posts = getPosts();
      expect(posts[0].title).toBe('Updated Title');
      expect(posts[0].content).toBe(mockPost.content);
    });

    it('does nothing when the post id does not exist', () => {
      savePosts([mockPost]);
      updatePost({ id: 'p_nonexistent', title: 'Nope' });
      const posts = getPosts();
      expect(posts).toEqual([mockPost]);
    });

    it('merges updated fields with existing post data', () => {
      savePosts([mockPost]);
      updatePost({ id: mockPost.id, content: 'New content', title: 'New title' });
      const posts = getPosts();
      expect(posts[0].content).toBe('New content');
      expect(posts[0].title).toBe('New title');
      expect(posts[0].authorId).toBe(mockPost.authorId);
    });
  });

  describe('removePost', () => {
    it('removes a post by id', () => {
      savePosts([mockPost, mockPost2]);
      removePost(mockPost.id);
      const posts = getPosts();
      expect(posts).toHaveLength(1);
      expect(posts[0].id).toBe(mockPost2.id);
    });

    it('does nothing when the post id does not exist', () => {
      savePosts([mockPost]);
      removePost('p_nonexistent');
      const posts = getPosts();
      expect(posts).toEqual([mockPost]);
    });

    it('results in an empty array when removing the only post', () => {
      savePosts([mockPost]);
      removePost(mockPost.id);
      const posts = getPosts();
      expect(posts).toEqual([]);
    });
  });

  // ─── Users ─────────────────────────────────────────────────────────────────

  describe('getUsers', () => {
    it('returns an empty array when no users exist in localStorage', () => {
      const users = getUsers();
      expect(users).toEqual([]);
    });

    it('returns parsed users array from localStorage', () => {
      localStorage.setItem('writespace_users', JSON.stringify([mockUser]));
      const users = getUsers();
      expect(users).toEqual([mockUser]);
    });

    it('returns an empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_users', '{{broken json');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const users = getUsers();
      expect(users).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_users', JSON.stringify('string value'));
      const users = getUsers();
      expect(users).toEqual([]);
    });
  });

  describe('saveUsers', () => {
    it('saves an array of users to localStorage', () => {
      saveUsers([mockUser, mockUser2]);
      const raw = localStorage.getItem('writespace_users');
      expect(JSON.parse(raw)).toEqual([mockUser, mockUser2]);
    });

    it('saves an empty array when given a non-array value', () => {
      saveUsers(null);
      const raw = localStorage.getItem('writespace_users');
      expect(JSON.parse(raw)).toEqual([]);
    });

    it('handles localStorage.setItem errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      saveUsers([mockUser]);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('addUser', () => {
    it('adds a user to an empty users array', () => {
      addUser(mockUser);
      const users = getUsers();
      expect(users).toEqual([mockUser]);
    });

    it('appends a user to existing users', () => {
      saveUsers([mockUser]);
      addUser(mockUser2);
      const users = getUsers();
      expect(users).toHaveLength(2);
      expect(users[1]).toEqual(mockUser2);
    });
  });

  describe('updateUser', () => {
    it('updates an existing user by id', () => {
      saveUsers([mockUser]);
      updateUser({ id: mockUser.id, displayName: 'Updated Name' });
      const users = getUsers();
      expect(users[0].displayName).toBe('Updated Name');
      expect(users[0].username).toBe(mockUser.username);
    });

    it('does nothing when the user id does not exist', () => {
      saveUsers([mockUser]);
      updateUser({ id: 'u_nonexistent', displayName: 'Nope' });
      const users = getUsers();
      expect(users).toEqual([mockUser]);
    });

    it('merges updated fields with existing user data', () => {
      saveUsers([mockUser]);
      updateUser({ id: mockUser.id, role: 'admin', displayName: 'Promoted User' });
      const users = getUsers();
      expect(users[0].role).toBe('admin');
      expect(users[0].displayName).toBe('Promoted User');
      expect(users[0].password).toBe(mockUser.password);
    });
  });

  describe('removeUser', () => {
    it('removes a user by id', () => {
      saveUsers([mockUser, mockUser2]);
      removeUser(mockUser.id);
      const users = getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].id).toBe(mockUser2.id);
    });

    it('does nothing when the user id does not exist', () => {
      saveUsers([mockUser]);
      removeUser('u_nonexistent');
      const users = getUsers();
      expect(users).toEqual([mockUser]);
    });

    it('results in an empty array when removing the only user', () => {
      saveUsers([mockUser]);
      removeUser(mockUser.id);
      const users = getUsers();
      expect(users).toEqual([]);
    });
  });

  // ─── Session ───────────────────────────────────────────────────────────────

  describe('getSession', () => {
    it('returns null when no session exists in localStorage', () => {
      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns parsed session object from localStorage', () => {
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));
      const session = getSession();
      expect(session).toEqual(mockSession);
    });

    it('returns null when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_session', 'not json!!!');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const session = getSession();
      expect(session).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('returns null when localStorage contains an array instead of an object', () => {
      localStorage.setItem('writespace_session', JSON.stringify([1, 2, 3]));
      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns null when localStorage contains a primitive value', () => {
      localStorage.setItem('writespace_session', JSON.stringify('just a string'));
      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns null when localStorage contains null', () => {
      localStorage.setItem('writespace_session', JSON.stringify(null));
      const session = getSession();
      expect(session).toBeNull();
    });
  });

  describe('saveSession', () => {
    it('saves a session object to localStorage', () => {
      saveSession(mockSession);
      const raw = localStorage.getItem('writespace_session');
      expect(JSON.parse(raw)).toEqual(mockSession);
    });

    it('handles localStorage.setItem errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      saveSession(mockSession);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('clearSession', () => {
    it('removes the session from localStorage', () => {
      saveSession(mockSession);
      expect(getSession()).toEqual(mockSession);
      clearSession();
      expect(getSession()).toBeNull();
    });

    it('does nothing when no session exists', () => {
      clearSession();
      expect(getSession()).toBeNull();
    });

    it('handles localStorage.removeItem errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      clearSession();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});