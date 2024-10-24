import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditUserInfo = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const navigate = useNavigate();

  // Lấy thông tin từ localStorage để hiển thị trong form
  useEffect(() => {
    const nameFromStorage = localStorage.getItem("name");
    const emailFromStorage = localStorage.getItem("email");
    const phoneFromStorage = localStorage.getItem("phone");

    setUserName(nameFromStorage || "");
    setUserEmail(emailFromStorage || "");
    setUserPhone(phoneFromStorage || "");
  }, []);

  // Xử lý khi nhấn nút lưu
  const handleSave = () => {
    // Lưu thông tin cập nhật vào localStorage
    localStorage.setItem("name", userName);
    localStorage.setItem("email", userEmail);
    localStorage.setItem("phone", userPhone);

    // Điều hướng trở lại trang account và load lại trang
    navigate("/account");
    window.location.reload(); // Load lại trang để cập nhật thông tin mới
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-md shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Chỉnh sửa thông tin cá nhân</h2>

      <form>
        {/* Trường chỉnh sửa Tên */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Tên
          </label>
          <input
            type="text"
            id="name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Trường chỉnh sửa Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Trường chỉnh sửa Số điện thoại */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 mb-2">
            Số điện thoại
          </label>
          <input
            type="text"
            id="phone"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Nút lưu */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserInfo;
