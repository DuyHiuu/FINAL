import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8000/api";

// Định nghĩa kiểu dữ liệu cho LoginResponse
interface LoginResponse {
  token: string; // Thay đổi theo cấu trúc phản hồi của bạn
  message?: string; // Có thể có hoặc không
}

const useFetchLogin = (email: string, password: string) => {
  const [loginData, setLoginData] = useState<LoginResponse | null>(null); // State để lưu dữ liệu login
  const [loading, setLoading] = useState<boolean>(false); // State để theo dõi trạng thái loading
  const [error, setError] = useState<string | null>(null); // State để lưu thông báo lỗi

  useEffect(() => {
    const fetchLogin = async () => {
      if (!email || !password) return; // Không gọi API nếu không có email hoặc password
      setLoading(true); // Đặt loading thành true khi bắt đầu yêu cầu
      setError(null); // Reset lỗi trước mỗi lần gửi yêu cầu

      try {
        const res = await fetch(`${API_URL}/login`, {
          method: "POST", // Sử dụng phương thức POST
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }), // Gửi email và password
        });

        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }

        const data: LoginResponse = await res.json(); // Phân tích phản hồi thành JSON
        setLoginData(data); // Lưu dữ liệu vào state
      } catch (error) {
        setError((error as Error).message); // Lưu thông báo lỗi vào state
      } finally {
        setLoading(false); // Kết thúc trạng thái loading
      }
    };

    fetchLogin(); // Gọi hàm fetchLogin
  }, [email, password]); // Chạy lại khi email hoặc password thay đổi

  return { loginData, loading, error }; // Trả về dữ liệu login, trạng thái loading và thông báo lỗi
};

export default useFetchLogin;
