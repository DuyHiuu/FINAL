import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    const nameFromStorage = localStorage.getItem("name");
    if (token) {
      setIsLoggedIn(true);
      setUserName(nameFromStorage || "");
    }
  }, []);
  // useEffect(() => {
  //   if (token) {
  //     window.location.href = "/";
  //   }
  // }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/");
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white/100 fixed top-0 left-0 right-0 z-50 shadow-lg transition duration-300 ease-in-out">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">PetSpa</span>
            <img className="h-20 w-auto" src="/images/logo.webp" alt="Logo" />
          </Link>
        </div>

        {/* Nút Hamburger cho màn hình nhỏ */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={handleMenuToggle}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Mở menu chính</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        {/* Menu cho màn hình lớn */}
        <div className="hidden lg:flex lg:gap-x-12">
          <Link
            to="/"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Trang chủ
          </Link>
          <Link
            to="/about"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Giới Thiệu
          </Link>
          <Link
            to="/danhsach"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Danh sách phòng
          </Link>
          <Link
            to="/lienhe"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Liên hệ
          </Link>
          <Link
            to="/blog"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Blog
          </Link>
          <Link
            to="/history1"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Lịch sử mua hàng
          </Link>
        </div>

        {/* Hiển thị điều kiện cho đăng nhập/đăng ký hoặc tên người dùng/đăng xuất */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {isLoggedIn ? (
            <>
              <span className="text-sm font-semibold leading-6 text-gray-900 mr-4">
                Xin chào, {userName}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Đăng ký
              </Link>
              <Link
                to="/login"
                className="ml-6 text-sm font-semibold leading-6 text-gray-900"
              >
                Đăng nhập
              </Link>
            </>
          )}
        </div>

        {/* Menu cho màn hình nhỏ */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-gray-200 shadow-lg p-6 z-40">
            <Link
              to="/"
              className="block text-sm font-semibold leading-6 text-gray-900 mb-4"
            >
              Trang chủ
            </Link>
            <Link
              to="/about"
              className="block text-sm font-semibold leading-6 text-gray-900 mb-4"
            >
              Giới Thiệu
            </Link>
            <Link
              to="/danhsach"
              className="block text-sm font-semibold leading-6 text-gray-900 mb-4"
            >
              Danh sách phòng
            </Link>
            <Link
              to="/lienhe"
              className="block text-sm font-semibold leading-6 text-gray-900 mb-4"
            >
              Liên hệ
            </Link>
            <Link
              to="/blog"
              className="block text-sm font-semibold leading-6 text-gray-900 mb-4"
            >
              Blog
            </Link>
            <Link
              to="/history1"
              className="block text-sm font-semibold leading-6 text-gray-900 mb-4"
            >
              Lịch sử mua hàng
            </Link>
            <Link
              to="/register"
              className="block text-sm font-semibold leading-6 text-gray-900 mb-4"
            >
              Đăng ký
            </Link>
            <Link
              to="/login"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Đăng nhập
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
