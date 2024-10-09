import React, { useEffect, useState } from "react";
const API_URL = "http://localhost:8000/api";

const useFetchServices = () => {
  const [service, setService] = useState<any>();
  useEffect(() => {
    try {
      const fetservice = async () => {
        const res = await fetch(`${API_URL}/services`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json(); // Phân tích phản hồi thành JSON
        setService(data); // Lưu dữ liệu vào state
      };
      fetservice();
    } catch (error) {
      console.log(error);
    }
  }, []);
  return { service };
};

export default useFetchServices;
