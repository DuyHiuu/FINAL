import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi reload của form
    setError(""); // Reset lại lỗi trước mỗi lần submit

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    try {
      // Gửi yêu cầu POST để đăng nhập
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      const data = await response.json(); // Parse JSON để kiểm tra phản hồi

      if (response.ok) {
        // Kiểm tra nếu tài khoản chưa kích hoạt
        if (data.user.is_active === 0) {
          message.error("Tài khoản chưa được kích hoạt.");
        } else {
          // Lưu thông tin vào localStorage nếu đăng nhập thành công
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem("email", data.user.email);
          localStorage.setItem("user_id", data.user.id);
          localStorage.setItem("name", data.user.name);
          localStorage.setItem("role_id", data.user.role.role_id);
          localStorage.setItem("phone", data.user.phone);
          localStorage.setItem("role_name", data.user.role.role_name);
          message.success("Đăng nhập thành công!");
          navigate("/"); // Chuyển hướng đến trang chính
        }
      } else {
        // Nếu phản hồi lỗi, kiểm tra loại lỗi
        if (data.error === "Invalid email or password") {
          message.error("Sai email hoặc mật khẩu.");
        } else {
          message.error(data.error || "Đã xảy ra lỗi. Vui lòng thử lại.");
        }
      }
    } catch (error) {
      // Hiển thị lỗi nếu có vấn đề khi gọi API
      message.error("Đã xảy ra lỗi trong quá trình kết nối. Vui lòng thử lại.");
    }


  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 mt-10">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Đăng Nhập
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Mật khẩu
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="text-sm">
            <Link
              to="/forgot-password" // Dùng Link thay vì thẻ <a> để điều hướng
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-[#064749] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Đăng nhập
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Bạn chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Đăng kí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
