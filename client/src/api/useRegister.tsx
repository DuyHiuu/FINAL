import React, { useEffect, useState } from "react";
const API_URL = "http://localhost:8000/api";

const useFetchRegister = () => {
  const [register, setRegister] = useState<any>();
  useEffect(() => {
    try {
      const fetRegister = async () => {
        const res = await fetch(`${API_URL}/register`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json(); // Phân tích phản hồi thành JSON
        setRegister(data); // Lưu dữ liệu vào state
      };
      fetRegister();
    } catch (error) {
      console.log(error);
    }
  }, []);
  return { register };
};

export default useFetchRegister;
