import React from "react";
import { Navigate } from "react-router-dom";

// Hàm kiểm tra người dùng có đăng nhập không
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Nếu không có token, chuyển hướng đến trang đăng nhập
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Nếu đã có token, cho phép truy cập vào trang con
  return children;
};

export default PrivateRoute;
