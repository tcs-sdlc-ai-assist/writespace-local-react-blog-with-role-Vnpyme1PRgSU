import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../utils/auth.js';

export function ProtectedRoute({ children, role }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin') {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return <Navigate to="/blogs" replace />;
    }
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string,
};

ProtectedRoute.defaultProps = {
  role: null,
};

export default ProtectedRoute;