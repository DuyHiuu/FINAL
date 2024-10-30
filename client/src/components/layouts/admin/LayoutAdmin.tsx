import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { Outlet } from "react-router-dom";

// Lấy thông tin từ localStorage
const user = {
  name: localStorage.getItem("name") || "Unknown User", // Lấy tên người dùng từ localStorage
  email: localStorage.getItem("email") || "unknown@example.com", // Lấy email từ localStorage (đảm bảo bạn lưu email trước đó)
  imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const navigation = [
  { name: "PestSpa", href: "/", current: true },
  { name: "Danh sách phòng", href: "/admin/rooms", current: false },
  { name: "Danh sách size", href: "/admin/sizes", current: false },
  { name: "Danh sách voucher", href: "/admin/vouchers", current: false },
  { name: "Danh sách dịch vụ", href: "/admin/services", current: false },
  { name: "Danh sách bài viết", href: "/admin/blogs", current: false },
  { name: "Danh sách người dùng", href: "/admin/users", current: false },
  { name: "Danh sách bình luận", href: "/admin/comments", current: false },
  { name: "Danh sách liên hệ", href: "/admin/contacts", current: false },
  { name: "Biểu đồ", href: "/admin/chart", current: false },
];

const userNavigation = [
  { name: "Đăng xuất", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const LayoutAdmin = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 flex flex-col justify-between">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center py-6">
            <img className="h-12 w-auto" src="/images/logo.png" alt="Logo" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col space-y-4 px-2 py-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "group flex px-2 py-2 text-sm font-medium rounded-md"
                )}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>

        {/* User info */}
        <div className="bg-gray-900 p-4 flex items-center space-x-3">
          <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt={user.name} />
          <div className="text-white">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top navigation bar */}
        <header className="bg-white shadow">
          <div className="flex justify-between items-center px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin {user.name}</h1>
            <div className="flex items-center space-x-4">
              <button className="bg-gray-800 p-1 text-gray-400 hover:text-white rounded-full">
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* User Profile Dropdown */}
              <Menu as="div" className="relative">
                <MenuButton className="flex items-center text-sm rounded-full bg-gray-800 focus:outline-none">
                  <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                </MenuButton>
                <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      <a href={item.href} className="block px-4 py-2 text-sm text-gray-700">
                        {item.name}
                      </a>
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-gray-100 overflow-auto">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default LayoutAdmin;
