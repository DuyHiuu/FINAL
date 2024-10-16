// import React from "react";
// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   const userRoleId = localStorage.getItem("role_id");

//   // Nếu người dùng không có token -> chưa đăng nhập -> điều hướng về trang login
//   if (!token) {
//     return <Navigate to="/login" />;
//   }

//   // Nếu người dùng có role_id = 1 -> điều hướng đến trang 404
//   if (userRoleId === "1") {
//     return <Navigate to="/404" />;
//   }

//   // Nếu người dùng có quyền admin (role_id !== 2), điều hướng về trang 404
//   if (userRoleId !== "2") {
//     return <Navigate to="/404" />;
//   }

//   // Nếu người dùng hợp lệ, trả về children (trang con)
//   return children;
// };

// export default PrivateRoute;
