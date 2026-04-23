import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { getCurrentUser, isAuthenticated } from './utils/auth.js';
import { Navbar } from './components/Navbar.jsx';
import { PublicNavbar } from './components/PublicNavbar.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import { Home } from './pages/Home.jsx';
import WriteBlog from './pages/WriteBlog.jsx';
import { ReadBlog } from './pages/ReadBlog.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import UserManagement from './pages/UserManagement.jsx';

const PUBLIC_ROUTES = ['/', '/login', '/register'];

function AppLayout() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  const refreshAuth = useCallback(() => {
    try {
      const authed = isAuthenticated();
      setAuthenticated(authed);
      if (authed) {
        setCurrentUser(getCurrentUser());
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('AppLayout.refreshAuth failed:', err);
      setAuthenticated(false);
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [location.pathname, refreshAuth]);

  const handleLogout = useCallback(() => {
    setAuthenticated(false);
    setCurrentUser(null);
  }, []);

  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
  const showPublicNavbar = !authenticated && isPublicRoute;
  const showAuthNavbar = authenticated && !isPublicRoute;

  return (
    <div className="min-h-screen bg-surface-50">
      {showPublicNavbar && <PublicNavbar />}
      {showAuthNavbar && <Navbar currentUser={currentUser} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <WriteBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <WriteBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <ProtectedRoute>
              <ReadBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <UserManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;