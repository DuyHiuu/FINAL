import React, { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white/100 fixed top-0 left-0 right-0 z-50 shadow-lg transition duration-300 ease-in-out">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">PetSpa</span>
            <img className="h-20 w-auto" src="/images/logo.webp" alt="Logo" />
          </a>
        </div>

        {/* Hamburger button for small screens */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={handleMenuToggle}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
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

        {/* Menu for larger screens */}
        <div className="hidden lg:flex lg:gap-x-12">
          <a href="/" className="text-sm font-semibold leading-6 text-gray-900">
            Trang chủ
          </a>
          <a href="/about" className="text-sm font-semibold leading-6 text-gray-900">
            Giới Thiệu
          </a>
          <a href="/danhsach" className="text-sm font-semibold leading-6 text-gray-900">
            Dach sách phòng
          </a>
          <a href="/lienhe" className="text-sm font-semibold leading-6 text-gray-900">
            Liên hệ
          </a>
          <a href="/blog" className="text-sm font-semibold leading-6 text-gray-900">
            Blog
          </a>
          <a href="/history1" className="text-sm font-semibold leading-6 text-gray-900">
            Lịch sử mua hàng
          </a>
        </div>

        {/* Login and Register buttons for larger screens */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="/register" className="text-sm font-semibold leading-6 text-gray-900">
            Đăng ký
          </a>
          <a href="login" className="ml-6 text-sm font-semibold leading-6 text-gray-900">
            Đăng nhập
          </a>
        </div>

        {/* Menu for small screens (conditionally rendered) */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-gray-200 shadow-lg p-6 z-40">
            <a href="/" className="block text-sm font-semibold leading-6 text-gray-900 mb-4">
              Trang chủ
            </a>
            <a href="/about" className="block text-sm font-semibold leading-6 text-gray-900 mb-4">
              Giới Thiệu
            </a>
            <a href="dichvu" className="block text-sm font-semibold leading-6 text-gray-900 mb-4">
              Dịch vụ
            </a>
            <a href="/lienhe" className="block text-sm font-semibold leading-6 text-gray-900 mb-4">
              Liên hệ
            </a>
            <a href="/blog" className="block text-sm font-semibold leading-6 text-gray-900 mb-4">
              Blog
            </a>
            <a href="detail" className="block text-sm font-semibold leading-6 text-gray-900 mb-4">
              Lịch sử mua hàng
            </a>
            <a href="/register" className="block text-sm font-semibold leading-6 text-gray-900 mb-4">
              Đăng ký
            </a>
            <a href="login" className="block text-sm font-semibold leading-6 text-gray-900">
              Đăng nhập
            </a>
          </div>
        )}
      </nav>
    </header>
  );
};

const MainContent = () => {
  return <div className="mt-[120px] p-6"> {/* Add your main content here */} </div>;
};

const App = () => {
  return (
    <div>
      <Header />
      <MainContent />
    </div>
  );
};

export default App;
