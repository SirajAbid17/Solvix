// src/components/ProtectedRoute.jsx
// ============================================================
// PROTECTED ROUTE WRAPPER
// Only renders children if user is authenticated
// Otherwise shows LoginRequired page
// ============================================================

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginRequired from "../pages/LoginRequired";

// ============================================================
// PROTECTED ROUTE
// ============================================================

export const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.userdata);
  const loading = useSelector((state) => state.user.loading);
  const location = useLocation();

  // While checking auth, don't render anything (App will show Loading)
  if (loading) {
    return null;
  }

  // If not logged in, show LoginRequired
  if (!user) {
    return <LoginRequired />;
  }

  return children;
};

// ============================================================
// PUBLIC ROUTE
// Redirects to home if user is already logged in
// ============================================================

export const PublicRoute = ({ children }) => {
  const user = useSelector((state) => state.user.userdata);
  const loading = useSelector((state) => state.user.loading);

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ============================================================
// ADMIN ROUTE
// Only renders if user is admin
// ============================================================

export const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state.user.userdata);
  const loading = useSelector((state) => state.user.loading);

  if (loading) {
    return null;
  }

  // Not logged in → LoginRequired
  if (!user) {
    return <LoginRequired />;
  }

  // Logged in but not admin → Redirect to home
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default ProtectedRoute;