import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State để lưu trữ thông báo thành công
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    role_id: 1, // Giá trị mặc định hoặc có thể thay đổi dựa vào người dùng
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); // Xóa thông báo thành công khi form submit

    // Kiểm tra mật khẩu và mật khẩu xác nhận
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu và mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          address: formData.address,
          role_id: formData.role_id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        setSuccessMessage("Đăng ký thành công!"); // Đặt thông báo thành công
        setTimeout(() => {
          navigate("/login"); // Điều hướng sau 2 giây
        }, 2000);
      } else {
        const result = await response.json();
        setError(result.message || "Đăng ký không thành công");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi, vui lòng thử lại sau");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 mt-10">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Đăng Ký
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-center">{successMessage}</p>
        )}{" "}
        {/* Hiển thị thông báo thành công */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trường nhập Tên */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Tên
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm"
              placeholder="Tên của bạn"
            />
          </div>

          {/* Trường nhập Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm"
              placeholder="Email của bạn"
            />
          </div>

          {/* Trường nhập Số điện thoại */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Số điện thoại
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm"
              placeholder="Số điện thoại của bạn"
            />
          </div>

          {/* Trường nhập Mật khẩu */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm"
              placeholder="Mật khẩu của bạn"
            />
          </div>

          {/* Trường nhập Xác nhận Mật khẩu */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Xác nhận mật khẩu
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm"
              placeholder="Nhập lại mật khẩu"
            />
          </div>

          {/* Trường nhập Địa chỉ */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Địa chỉ
            </label>
            <textarea
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm"
              placeholder="Địa chỉ của bạn"
            />
          </div>

          {/* Nút Đăng ký */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-[#064749] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm"
            >
              Đăng ký
            </button>
          </div>
        </form>
        <p className="mt-10 text-center text-sm text-gray-500">
          Bạn đã có tài khoản?{" "}
          <a
            href="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Đăng Nhập
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
