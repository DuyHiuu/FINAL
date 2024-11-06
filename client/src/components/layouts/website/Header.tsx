import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Menu, Dropdown, Button, Avatar, Modal, message } from "antd";
import { DownOutlined } from "@ant-design/icons";

const { Header } = Layout;

const AppHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [roleId, setRoleId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const nameFromStorage = localStorage.getItem("name");
    const roleIdFromStorage = localStorage.getItem("role_id");
    if (token) {
      setIsLoggedIn(true);
      setUserName(nameFromStorage || "");
      setRoleId(roleIdFromStorage);
    }
  }, [token]);

  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc chắn muốn đăng xuất không?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      onOk: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("role_id");

        setIsLoggedIn(false);
        setUserName("");
        setRoleId(null);

        message.success("Đăng xuất thành công!");
        navigate("/login");
      },
    });
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Hàm điều hướng đến trang admin
  const handleGoToAdmin = () => {
    navigate("/admin");
  };

  // Hàm điều hướng đến lịch sử đơn hàng
  const handleGoToHistory = () => {
    navigate("/history1");
  };

  // Hàm điều hướng đến thông tin tài khoản
  const handleGoToAccountInfo = () => {
    navigate("/account");
  };

  const userMenu = (
    <Menu>
      <Menu.Item onClick={handleGoToAccountInfo}>Thông tin tài khoản</Menu.Item>
      <Menu.Item onClick={handleGoToHistory}>Lịch sử đơn hàng</Menu.Item>
      {roleId === "2" && (
        <Menu.Item onClick={handleGoToAdmin}>Trang quản trị</Menu.Item>
      )}
      <Menu.Item onClick={handleLogout}>Đăng xuất</Menu.Item>
    </Menu>
  );

  return (
    <Header
      className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50"
      style={{ height: "100px" }} // Đặt chiều cao của Header là 80px
    >
      <div className="container mx-auto flex items-center justify-between p-6">
        {/* Logo */}
        <Link to="/">
          <img src="/images/logo.png" alt="Logo" className="h-12" /> {/* Tăng chiều cao của logo */}
        </Link>

        {/* Menu for large screens */}
        <Menu mode="horizontal" className="hidden lg:flex">
          <Menu.Item key="home">
            <Link to="/">Trang chủ</Link>
          </Menu.Item>
          <Menu.Item key="about">
            <Link to="/about">Giới Thiệu</Link>
          </Menu.Item>
          <Menu.Item key="danhsach">
            <Link to="/danhsach">Danh sách phòng</Link>
          </Menu.Item>
          <Menu.Item key="lienhe">
            <Link to="/lienhe">Liên hệ</Link>
          </Menu.Item>
          <Menu.Item key="blog">
            <Link to="/blog">Blog</Link>
          </Menu.Item>
          <Menu.Item key="cart">
            <Link to="/#">Giỏ hàng</Link>
          </Menu.Item>
        </Menu>

        {/* Right section for login/logout */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <Dropdown
              overlay={userMenu}
              trigger={["click"]}
              className="flex items-center space-x-2"
            >
              <Button
                type="primary"
                icon={<DownOutlined />}
                className="flex items-center space-x-2"
              >
                <Avatar>{userName[0]}</Avatar>
                <span>{userName}</span>
              </Button>
            </Dropdown>
          ) : (
            <>
              <Link to="/register">
                <Button type="link">Đăng ký</Button>
              </Link>
              <Link to="/login">
                <Button type="primary">Đăng nhập</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Button
            icon={<DownOutlined />}
            onClick={handleMenuToggle}
            type="text"
            size="large"
          />
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;
