import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8000/api";

interface RegisterResponse {
  token: string; // Token trả về
  message?: string; // Thông báo lỗi (nếu có)
}

const useFetchRegister = (email: string, password: string) => {
  const [registerData, setRegisterData] = useState<RegisterResponse | null>(null); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchRegister = async () => {
      if (!email || !password) return; 
      setLoading(true); 
      setError(null); 

      try {
        const res = await fetch(`${API_URL}/register`, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }), 
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Đăng ký thất bại!");
        }

        const data: RegisterResponse = await res.json(); 
        setRegisterData(data); 
      } catch (error) {
        setError((error as Error).message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchRegister(); 
  }, [email, password]); 

  return { registerData, loading, error }; 
};

export default useFetchRegister;
