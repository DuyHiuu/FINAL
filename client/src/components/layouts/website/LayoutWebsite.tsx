import React from "react";
import Header from "./Header";
import HomePage from "../../../pages/website/HomePage";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const LayoutWebsite = () => {
  return (
    <div>
      <Header />

      <Outlet />
      <Footer />
    </div>
  );
};

export default LayoutWebsite;
