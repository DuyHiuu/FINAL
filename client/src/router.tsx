import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import LayoutWebsite from "./components/layouts/website/LayoutWebsite";
import LayoutAdmin from "./components/layouts/admin/LayoutAdmin"; // Đảm bảo rằng đã import LayoutAdmin
import HomePage from "./pages/website/HomePage";
import AboutPage from "./pages/website/AboutPage";
import ListRoom from "./pages/website/ListRoom";
import Detail from "./pages/website/Detail";
import Lienhe from "./pages/website/Lienhe";
import Login from "./pages/website/Login";
import Register from "./pages/website/Register";
import PaymentConfirmation from "./pages/website/PaymentConfirmation";
import Pay1 from "./pages/website/Pay1";
import Pay2 from "./pages/website/Pay2";
import History1 from "./pages/website/History1";
import History2 from "./pages/website/History2";
import Blog from "./pages/website/Blog";
import PrivateRoute from "./api/PrivateRoute";
import RoomList from "./components/layouts/admin/room/RoomList";
import AddRoom from "./components/layouts/admin/room/AddRoom";
import EditRoom from "./components/layouts/admin/room/EditRoom";
import SizeList from "./components/layouts/admin/size/SizeList";
import AddSize from "./components/layouts/admin/size/AddSize";
import EditSize from "./components/layouts/admin/size/EditSize";
import VoucherList from "./components/layouts/admin/voucher/VoucherList";
import AddVoucher from "./components/layouts/admin/voucher/AddVoucher";
import EditVoucher from "./components/layouts/admin/voucher/EditVoucher";
import ListService from "./components/layouts/admin/service/ListService";
import AddService from "./components/layouts/admin/service/AddService";
import EditService from "./components/layouts/admin/service/EditService";
import ListRole from "./components/layouts/admin/role/ListRole";
import AddRole from "./components/layouts/admin/role/AddRole";
import EditRole from "./components/layouts/admin/role/EditRole";
import BlogList from "./components/layouts/admin/blog/BlogList";
import AddBlog from "./components/layouts/admin/blog/AddBlog";
import EditBlog from "./components/layouts/admin/blog/EditBlog";

// Kiểm tra người dùng đã đăng nhập và có vai trò admin
const isAuthenticated = !!localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));
const isAdmin = user?.role_id === 2; // Kiểm tra nếu role_id = 2

export const router = createBrowserRouter([
  {
    element: <LayoutWebsite />, // Layout cho các route không phải admin
    children: [
      { path: "", element: <Navigate to={"/home"} /> },
      { path: "/home", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/danhsach", element: <ListRoom /> },
      { path: "/blog", element: <Blog /> },
      { path: "/detail/:id", element: <Detail /> },
      { path: "/lienhe", element: <Lienhe /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/paymentconfirmation", element: <PaymentConfirmation /> },
      { path: "/pay1/:id", element: <Pay1 /> },
      { path: "/pay2/:id", element: <Pay2 /> },

      // Áp dụng PrivateRoute cho trang lịch sử mua hàng
      {
        path: "/history1",
        element: (
          <PrivateRoute>
            <History1 />
          </PrivateRoute>
        ),
      },
      {
        path: "/history2",
        element: (
          <PrivateRoute>
            <History2 />
          </PrivateRoute>
        ),
      },
    ],
  },

  // Routes Admin
  {
    element: (
      <PrivateRoute isAdmin={isAdmin}> {/* Kiểm tra quyền admin */}
        <LayoutAdmin /> {/* Sử dụng LayoutAdmin cho tất cả các route admin */}
      </PrivateRoute>
    ),
    children: [
      { path: "/admin", element: <Navigate to="/admin/rooms" /> }, // Điều hướng đến danh sách phòng
      { path: "/admin/rooms", element: <RoomList /> },
      { path: "/admin/rooms/add", element: <AddRoom /> },
      { path: "/admin/rooms/edit/:id", element: <EditRoom /> },
      { path: "/admin/sizes", element: <SizeList /> },
      { path: "/admin/sizes/add", element: <AddSize /> },
      { path: "/admin/sizes/:id", element: <EditSize /> },
      { path: "/admin/vouchers", element: <VoucherList /> },
      { path: "/admin/vouchers/add", element: <AddVoucher /> },
      { path: "/admin/vouchers/:id", element: <EditVoucher /> },
      { path: "/admin/services", element: <ListService /> },
      { path: "/admin/services/add", element: <AddService /> },
      { path: "/admin/services/edit/:id", element: <EditService /> },
      { path: "/admin/roles", element: <ListRole /> },
      { path: "/admin/roles/add", element: <AddRole /> },
      { path: "/admin/roles/edit/:id", element: <EditRole /> },
      { path: "/admin/blogs", element: <BlogList /> },
      { path: "/admin/blogs/add", element: <AddBlog /> },
      { path: "/admin/blogs/edit/:id", element: <EditBlog /> },
    ],
  },
]);
