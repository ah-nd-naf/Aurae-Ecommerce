import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // While checking if user is logged in (reading from localStorage)
  if (loading) {
    return <div className="flex h-screen items-center justify-center font-serif uppercase tracking-widest">Loading...</div>;
  }

  // If no user is found, redirect them to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists, show the protected page (children)
  return children;
};

export default ProtectedRoute;