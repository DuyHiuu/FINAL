import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000/api";

// Nhận tham số tìm kiếm từ component (roleFilter)
const useFetchUsers = (roleFilter: string | null = null) => {
  const [users, setUsers] = useState<any[]>([]); // Mảng lưu danh sách người dùng
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState<string | null>(null); // Trạng thái lỗi

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Bắt đầu quá trình load
      setError(null); // Reset lỗi mỗi khi fetch mới

      try {
        // Xây dựng URL với tham số tìm kiếm nếu có
        let url = `${API_URL}/users`;
        const params = new URLSearchParams();
        
        if (roleFilter) {
          params.append("role", roleFilter); // Thêm bộ lọc role nếu có
        }

        // Nếu có tham số tìm kiếm, thêm chúng vào URL
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        setUsers(data); // Lưu dữ liệu người dùng vào state
      } catch (error: any) {
        setError(error.message); // Ghi lại lỗi nếu có
      } finally {
        setLoading(false); // Dừng quá trình load sau khi fetch xong
      }
    };

    fetchUsers();
  }, [roleFilter]); // Chỉ gọi lại khi roleFilter thay đổi

  return { users, loading, error }; // Trả về danh sách users, trạng thái loading, và lỗi
};

export default useFetchUsers;
