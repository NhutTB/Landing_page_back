import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Hoặc một spinner loading
  }

  // Nếu đã load xong, kiểm tra user và role
  // Chuyển hướng về trang menu nếu không phải admin
  return user && user.role === "admin" ? <Outlet /> : <Navigate to="/menu" />;
};

export default AdminRoute;