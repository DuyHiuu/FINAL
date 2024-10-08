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
import ProductList from "./components/layouts/admin/ProductList";
import AddProduct from "./components/layouts/admin/AddProduct";
import EditProduct from "./components/layouts/admin/EditProduct";

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
    ],
  },
  {
    element: <LayoutAdmin />, // Layout chính
    path: "/admin",
    children: [
      { path: "", element: <Navigate to="/admin/product" /> }, // Điều hướng tới danh sách sản phẩmm
      { path: "product", element: <ProductList /> },  // Hiển thị ProductList ở /admin/product
      { path: "add", element: <AddProduct /> },
      { path: "edit", element: <EditProduct /> }, // Hiển thị AddProduct ở /admin/add
    ],
  },
  
]);
