const KEYS = {
  POSTS: 'writespace_posts',
  USERS: 'writespace_users',
  SESSION: 'writespace_session',
};

// ─── Posts ───────────────────────────────────────────────────────────────────

/**
 * Retrieve all posts from localStorage.
 * @returns {Array<{id: string, title: string, content: string, createdAt: string, authorId: string, authorName: string}>}
 */
export function getPosts() {
  try {
    const raw = localStorage.getItem(KEYS.POSTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('storage.getPosts failed:', err);
    return [];
  }
}

/**
 * Overwrite the entire posts array in localStorage.
 * @param {Array<Object>} posts
 */
export function savePosts(posts) {
  try {
    localStorage.setItem(KEYS.POSTS, JSON.stringify(Array.isArray(posts) ? posts : []));
  } catch (err) {
    console.error('storage.savePosts failed:', err);
  }
}

/**
 * Add a single post to localStorage.
 * @param {{id: string, title: string, content: string, createdAt: string, authorId: string, authorName: string}} post
 */
export function addPost(post) {
  try {
    const posts = getPosts();
    posts.push(post);
    savePosts(posts);
  } catch (err) {
    console.error('storage.addPost failed:', err);
  }
}

/**
 * Update an existing post by id.
 * @param {{id: string, title?: string, content?: string, createdAt?: string, authorId?: string, authorName?: string}} updatedPost
 */
export function updatePost(updatedPost) {
  try {
    const posts = getPosts();
    const index = posts.findIndex((p) => p.id === updatedPost.id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updatedPost };
      savePosts(posts);
    }
  } catch (err) {
    console.error('storage.updatePost failed:', err);
  }
}

/**
 * Remove a post by id.
 * @param {string} postId
 */
export function removePost(postId) {
  try {
    const posts = getPosts();
    const filtered = posts.filter((p) => p.id !== postId);
    savePosts(filtered);
  } catch (err) {
    console.error('storage.removePost failed:', err);
  }
}

// ─── Users ───────────────────────────────────────────────────────────────────

/**
 * Retrieve all users from localStorage.
 * @returns {Array<{id: string, displayName: string, username: string, password: string, role: string, createdAt: string}>}
 */
export function getUsers() {
  try {
    const raw = localStorage.getItem(KEYS.USERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('storage.getUsers failed:', err);
    return [];
  }
}

/**
 * Overwrite the entire users array in localStorage.
 * @param {Array<Object>} users
 */
export function saveUsers(users) {
  try {
    localStorage.setItem(KEYS.USERS, JSON.stringify(Array.isArray(users) ? users : []));
  } catch (err) {
    console.error('storage.saveUsers failed:', err);
  }
}

/**
 * Add a single user to localStorage.
 * @param {{id: string, displayName: string, username: string, password: string, role: string, createdAt: string}} user
 */
export function addUser(user) {
  try {
    const users = getUsers();
    users.push(user);
    saveUsers(users);
  } catch (err) {
    console.error('storage.addUser failed:', err);
  }
}

/**
 * Update an existing user by id.
 * @param {{id: string, displayName?: string, username?: string, password?: string, role?: string, createdAt?: string}} updatedUser
 */
export function updateUser(updatedUser) {
  try {
    const users = getUsers();
    const index = users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      saveUsers(users);
    }
  } catch (err) {
    console.error('storage.updateUser failed:', err);
  }
}

/**
 * Remove a user by id.
 * @param {string} userId
 */
export function removeUser(userId) {
  try {
    const users = getUsers();
    const filtered = users.filter((u) => u.id !== userId);
    saveUsers(filtered);
  } catch (err) {
    console.error('storage.removeUser failed:', err);
  }
}

// ─── Session ─────────────────────────────────────────────────────────────────

/**
 * Retrieve the current session from localStorage.
 * @returns {{userId: string, username: string, displayName: string, role: string} | null}
 */
export function getSession() {
  try {
    const raw = localStorage.getItem(KEYS.SESSION);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch (err) {
    console.error('storage.getSession failed:', err);
    return null;
  }
}

/**
 * Save a session object to localStorage.
 * @param {{userId: string, username: string, displayName: string, role: string}} session
 */
export function saveSession(session) {
  try {
    localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
  } catch (err) {
    console.error('storage.saveSession failed:', err);
  }
}

/**
 * Clear the current session from localStorage.
 */
export function clearSession() {
  try {
    localStorage.removeItem(KEYS.SESSION);
  } catch (err) {
    console.error('storage.clearSession failed:', err);
  }
}