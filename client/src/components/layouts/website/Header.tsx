import React from "react";

const Header = () => {
  return (
    <header className="bg-white fixed top-0 left-0 right-0 z-50">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              className="h-20 w-auto"
              src="/images/logo.webp"
              alt=""
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <a href="/" className="text-sm font-semibold leading-6 text-gray-900">
            Trang chủ
          </a>
          <a href="/about" className="text-sm font-semibold leading-6 text-gray-900">
            Giới Thiệu
          </a>
          <a href="dichvu" className="text-sm font-semibold leading-6 text-gray-900">
            Dịch vụ
          </a>
          <a href="/lienhe" className="text-sm font-semibold leading-6 text-gray-900">
            Liên hệ
          </a>
          <a href="/blog" className="text-sm font-semibold leading-6 text-gray-900">
            Blog
          </a>
          <a href="detail" className="text-sm font-semibold leading-6 text-gray-900">
            Lịch sử mua hàng
          </a>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="/register" className="text-sm font-semibold leading-6 text-gray-900">
            Đăng ký
          </a>
          <a
            href="login"
            className="ml-6 text-sm font-semibold leading-6 text-gray-900"
          >
            Đăng nhập
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
