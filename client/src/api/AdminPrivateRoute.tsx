import React from "react";
import { Navigate } from "react-router-dom";

const AdminPrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userRoleId = localStorage.getItem("role_id");

  // Nếu người dùng không có token -> chưa đăng nhập -> điều hướng về trang login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Nếu người dùng không có quyền admin (role_id !== 2), điều hướng về trang 404
  if (userRoleId !== "2") {
    return <Navigate to="/404" />;
  }

  // Nếu người dùng hợp lệ (admin), trả về children (trang con)
  return children;
};

export default AdminPrivateRoute;
