import React, { useState } from "react";
import { message } from "antd";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        message.success("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.");
        setEmail("");
      } else {
        const data = await response.json();
        message.error(data.message || "Không thể gửi liên kết đặt lại mật khẩu.");
      }
    } catch (err) {
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Quên mật khẩu</h2>
      <form onSubmit={handleSubmit} className="w-96 space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full mt-1 rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Đang gửi..." : "Gửi liên kết khôi phục"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
