import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8000/api";

const useFetchRole = () => {
  const [roles, setRoles] = useState<any[]>([]); // Khởi tạo với mảng rỗng
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading
  const [error, setError] = useState<string | null>(null); // Trạng thái lỗi

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${API_URL}/roles`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        setRoles(data);
      } catch (error: any) {
        setError(error.message); // Lưu lại thông báo lỗi
      } finally {
        setLoading(false); // Cập nhật trạng thái loading
      }
    };

    fetchRoles();
  }, []);

  return { roles, loading, error }; // Trả về roles, loading và error
};

export default useFetchRole;
