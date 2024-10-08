import React, { useEffect, useState } from "react";
const API_URL = "http://localhost:8000/api";

const useFetchSize = () => {
  const [sizes, setSizes] = useState<any[]>([]); // Khởi tạo size là mảng rỗng

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const res = await fetch(`${API_URL}/sizes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }

        const responseData = await res.json(); // Phân tích phản hồi thành JSON

        if (responseData && responseData.status && responseData.data) {
          setSizes(responseData.data); // Lưu danh sách size vào state
        } else {
          throw new Error("Dữ liệu không hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi khi fetch size:", error);
      }
    };

    fetchSizes();
  }, []);

  return { sizes };
};

export default useFetchSize;
