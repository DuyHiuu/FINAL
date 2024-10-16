import React from "react";
import { Navigate } from "react-router-dom";

const UserPrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Nếu người dùng không có token -> chưa đăng nhập -> điều hướng về trang login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Nếu người dùng hợp lệ (đã đăng nhập), trả về children (trang con)
  return children;
};

export default UserPrivateRoute;
