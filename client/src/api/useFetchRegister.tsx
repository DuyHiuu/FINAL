import { useEffect, useState } from "react";
const API_URL = "http://localhost:8000/api";

interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  role_id?: number; // role_id có thể là tùy chọn
}
interface RegisterResponse {
  token: string; // Token trả về từ API nếu đăng ký thành công
  message?: string; // Thông báo lỗi nếu có, có thể không bắt buộc
}

const useFetchRegister = (registerData: RegisterRequest) => {
  const [response, setResponse] = useState<RegisterResponse | null>(null); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchRegister = async () => {
      if (!registerData.email || !registerData.password) return; // Kiểm tra nếu thiếu email hoặc mật khẩu
      setLoading(true); 
      setError(null); 

      try {
        const res = await fetch(`${API_URL}/register`, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData), // Gửi toàn bộ dữ liệu đăng ký
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Đăng ký thất bại!");
        }

        const data: RegisterResponse = await res.json(); 
        setResponse(data); 
      } catch (error) {
        setError((error as Error).message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchRegister(); 
  }, [registerData]); 

  return { response, loading, error }; 
};

export default useFetchRegister;
