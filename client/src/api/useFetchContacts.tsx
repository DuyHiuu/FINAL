import React, { useEffect, useState } from "react";
const API_URL = "http://localhost:8000/api";

const useFetchContacts = () => {
  const [contacts, setContacts] = useState<any[]>([]); // Khởi tạo mảng rỗng
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const [error, setError] = useState<string | null>(null); // Thêm trạng thái error

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true); // Bắt đầu tải dữ liệu
      setError(null); // Reset error trước khi fetch
      try {
        const res = await fetch(`${API_URL}/contacts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }

        const responseData = await res.json();
        console.log("Dữ liệu từ API:", responseData); // Kiểm tra dữ liệu từ API

        setContacts(responseData.contacts);
      } catch (error) {
        console.error("Lỗi khi fetch contact:", error);
        setError(error.message); // Lưu lỗi vào state
      } finally {
        setLoading(false); // Kết thúc tải dữ liệu
      }
    };

    fetchContacts();
  }, []);

  return { contacts, loading, error }; // Trả về contacts, loading và error
};

export default useFetchContacts;
