import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import LayoutWebsite from "./components/layouts/website/LayoutWebsite";
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
import LayoutAdmin from "./components/layouts/admin/LayoutAdmin";
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
import BlogList from "./components/layouts/admin/blog/BlogList";
import AddBlog from "./components/layouts/admin/blog/AddBlog";
import EditBlog from "./components/layouts/admin/blog/EditBlog";

export const router = createBrowserRouter([
  {
    element: <LayoutWebsite />,
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
      { path: "/pay1", element: <Pay1 /> },
      { path: "/pay2", element: <Pay2 /> },
      { path: "/history1", element: <History1 /> },
      { path: "/history2", element: <History2 /> },
      { path: "/services", element: <ListService /> },
      { path: "/services/add", element: <AddService /> },
      { path: "/services/edit/:id", element: <EditService /> },
    ],
  },
  {
    element: <LayoutAdmin />, // Layout chính
    path: "/admin",
    children: [
      { path: "", element: <Navigate to="/admin/rooms" /> }, // Điều hướng tới danh sách sản phẩmm
      { path: "rooms", element: <RoomList /> },  // Hiển thị RoomList ở /admin/product
      { path: "rooms/add", element: <AddRoom /> },
      { path: "rooms/edit/:id", element: <EditRoom /> }, // Hiển thị AddProduct ở /admin/add
      { path: "sizes", element: <SizeList /> }, 
      { path: "addsizes", element: <AddSize /> }, 
      { path: "sizes/:id", element: <EditSize /> }, 
      { path: "vouchers", element: <VoucherList /> }, 
      { path: "addvouchers", element: <AddVoucher /> }, 
      { path: "vouchers/:id", element: <EditVoucher /> }, 
      { path: "services", element: <ListService /> },
      { path: "services/add", element: <AddService /> },
      { path: "services/edit/:id", element: <EditService /> },
      { path: "blogs", element: <BlogList /> }, // Thêm đường dẫn cho Blog
      { path: "blogs/add", element: <AddBlog /> }, // Thêm Blog
      { path: "blogs/edit/:id", element: <EditBlog /> }, // Chỉnh sửa Blog
      
    ],
  },
  
]);
