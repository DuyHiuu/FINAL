import React, { useEffect, useState } from "react";
const API_URL = "http://localhost:8000/api";

const useFetchDichvu = () => {
  const [dichvu, setDichvu] = useState<any>();
  useEffect(() => {
    try {
      const fetDichvu = async () => {
        const res = await fetch(`${API_URL}/dichvu`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json(); // Phân tích phản hồi thành JSON
        setDichvu(data); // Lưu dữ liệu vào state
      };
      fetDichvu();
    } catch (error) {
      console.log(error);
    }
  }, []);
  return { dichvu };
};

export default useFetchDichvu;
