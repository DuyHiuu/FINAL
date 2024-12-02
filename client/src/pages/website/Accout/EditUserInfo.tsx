import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, message } from "antd";

const EditUserInfo = () => {
  const apiUrl = "http://localhost:8000/api/users";
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [user_id, setUser_id] = useState("");

  const [originalUserName, setOriginalUserName] = useState("");
  const [originalUserEmail, setOriginalUserEmail] = useState("");
  const [originalUserPhone, setOriginalUserPhone] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const nameFromStorage = localStorage.getItem("name");
    const emailFromStorage = localStorage.getItem("email");
    const phoneFromStorage = localStorage.getItem("phone");
    const idFromStorage = localStorage.getItem("user_id");

    setUserName(nameFromStorage || "");
    setUserEmail(emailFromStorage || "");
    setUserPhone(phoneFromStorage || "");
    setUser_id(idFromStorage || "");

    setOriginalUserName(nameFromStorage || "");
    setOriginalUserEmail(emailFromStorage || "");
    setOriginalUserPhone(phoneFromStorage || "");
  }, []);

  const showErrorModal = (title, content) => {
    Modal.error({
      title: title,
      content: content,
      onOk: () => {
        setUserName(originalUserName);
        setUserEmail(originalUserEmail);
        setUserPhone(originalUserPhone);
      },
    });
  };

  const handleSave = async () => {
    if (!userName.trim() || !userEmail.trim() || !userPhone.trim()) {
      showErrorModal(
        "Lỗi xác thực",
        "Tất cả các trường đều bắt buộc. Vui lòng kiểm tra lại."
      );
      return;
    }

    const updatedUser = {
      name: userName,
      email: userEmail,
      phone: userPhone,
    };

    try {
      const response = await axios.put(`${apiUrl}/${user_id}`, updatedUser);

      if (response.status === 200) {
        message.success("Cập nhật thông tin thành công!");

        localStorage.setItem("name", userName);
        localStorage.setItem("email", userEmail);
        localStorage.setItem("phone", userPhone);

        navigate("/account");
        window.location.reload();
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const { email, phone } = error.response.data.errors;

        if (email) {
          showErrorModal(
            "Lỗi email",
            "Email này đã tồn tại. Vui lòng sử dụng email khác."
          );
        }

        if (phone) {
          showErrorModal(
            "Lỗi số điện thoại",
            "Số điện thoại này đã tồn tại. Vui lòng sử dụng số khác."
          );
        }
      } else {
        showErrorModal(
          "Lỗi kết nối",
          "Không thể kết nối đến server. Vui lòng thử lại sau."
        );
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-md shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Chỉnh sửa thông tin cá nhân</h2>

      <form>
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