import React, { useEffect, useState } from "react";
const API_URL = "http://localhost:8000/api";

const useFetchRooms = () => {
  const [room, setRoom] = useState<any>();
  useEffect(() => {
    try {
      const fetRoom = async () => {
        const res = await fetch(`${API_URL}/rooms`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json(); // Phân tích phản hồi thành JSON
        setRoom(data); // Lưu dữ liệu vào state
      };
      fetRoom();
    } catch (error) {
      console.log(error);
    }
  }, []);
  return { room };
};

export default useFetchRooms;
