






import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginRequired from "../pages/LoginRequired";





export const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.userdata);
  const loading = useSelector((state) => state.user.loading);
  const location = useLocation();

  
  if (loading) {
    return null;
  }

  
  if (!user) {
    return <LoginRequired />;
  }

  return children;
};






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






export const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state.user.userdata);
  const loading = useSelector((state) => state.user.loading);

  if (loading) {
    return null;
  }

  
  if (!user) {
    return <LoginRequired />;
  }

  
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};





export default ProtectedRoute;