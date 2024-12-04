import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import LayoutWebsite from "./components/layouts/website/LayoutWebsite";
import LayoutAdmin from "./components/layouts/admin/LayoutAdmin";
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
import AdminPrivateRoute from "./api/AdminPrivateRoute";
import UserPrivateRoute from "./api/UserPrivateRoute"; // Import UserPrivateRoute
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
import UserList from "./components/layouts/admin/user/UserList";
import AddUser from "./components/layouts/admin/user/AddUser";
import EditUser from "./components/layouts/admin/user/EditUser";
import CommentList from "./components/layouts/admin/comment/CommentList";
import AddComment from "./components/layouts/admin/comment/AddComment";
import EditComment from "./components/layouts/admin/comment/EditComment";
import ListPay from "./components/layouts/admin/payment/ListPay";
import DetailPay from "./components/layouts/admin/payment/DetailPay";
import Loi404 from "./pages/website/Loi404"; // Import trang lỗi 404
import Chart from "./components/layouts/admin/chart/Chart";
import AccoutProfile from "./pages/website/Accout/AccoutProfile";
import UserInfo from "./pages/website/Accout/UserInfo";
import EditUserInfo from "./pages/website/Accout/EditUserInfo";
import ContactList from "./components/layouts/admin/contact/ContactList";
import ForgotPassword from "./pages/website/ForgotPassword";
import ResetPassword from "./pages/website/ResetPassword";
import CheckPay from "./pages/website/checkPay";
import HomeAdmin from "./components/layouts/admin/home/home";
import BlogDetail from "./pages/website/BlogDetail";

import ReturnPay from "./components/layouts/admin/refund/ReturnPayList";

import PayReturn from "./pages/website/PayReturn";


export const router = createBrowserRouter([
  {
    element: <LayoutWebsite />,
    children: [
      { path: "", element: <Navigate to={"/home"} /> },
      { path: "/home", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/danhsach", element: <ListRoom /> },
      { path: "/blog", element: <Blog /> },
      { path: "/blog/:id", element: <BlogDetail /> },
      { path: "/detail/:id", element: <Detail /> },
      { path: "/lienhe", element: <Lienhe /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/paymentconfirmation", element: <PaymentConfirmation /> },
      { path: "/pay1/:id", element: <Pay1 /> },
      { path: "/pay2", element: <Pay2 /> },
      { path: "/pay2/:id", element: <Pay2 /> },
      { path: "/account", element: <AccoutProfile /> },
      // { path: "/infor", element: <UserInfo /> },
      { path: "/editinfor", element: <EditUserInfo /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/check_pay", element: <CheckPay /> },
      { path: "/pay_return/:id", element: <PayReturn /> },

      // Áp dụng UserPrivateRoute cho trang lịch sử mua hàng
      {
        path: "/history1",
        element: (
          <UserPrivateRoute>
            <History1 />
          </UserPrivateRoute>
        ),
      },
      {
        path: "/history2/:id",
        element: (
          <UserPrivateRoute>
            <History2 />
          </UserPrivateRoute>
        ),
      },
    ],
  },

  // Routes Admin chỉ cho phép người dùng có role_id = 2 (admin)
  {
    element: (
      <AdminPrivateRoute>
        <LayoutAdmin />
      </AdminPrivateRoute>
    ),
    children: [
      { path: "/admin", element: <Navigate to="/admin/rooms" /> },
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
      { path: "/admin/users", element: <UserList /> },
      { path: "/admin/users/add", element: <AddUser /> },
      { path: "/admin/users/edit/:id", element: <EditUser /> },
      { path: "/admin/comments", element: <CommentList /> },
      { path: "/admin/comments/add", element: <AddComment /> },
      { path: "/admin/comments/edit/:id", element: <EditComment /> },
      { path: "/admin/chart", element: <Chart /> },
      { path: "/admin/home", element: <HomeAdmin /> },
      { path: "/admin/contacts", element: <ContactList /> },
      { path: "/admin/payments", element: <ListPay /> },
      { path: "/admin/payments/detail/:id", element: <DetailPay /> },
      { path: "/admin/chart", element: <Chart /> },
      { path: "/admin/returnPay", element: <ReturnPay /> },
    ],
  },

  // Đường dẫn cho trang 404
  { path: "/404", element: <Loi404 /> },

  // Bắt tất cả các đường dẫn không tồn tại và điều hướng đến trang 404
  { path: "*", element: <Navigate to="/404" /> },
]);
