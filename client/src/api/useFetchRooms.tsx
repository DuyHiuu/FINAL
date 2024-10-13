import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000/api";

// Nhận tham số tìm kiếm từ component ListRoom
const useFetchRooms = (priceFilter: string, sizeFilter: string) => {
  const [room, setRoom] = useState<any>([]);
  const [loading, setLoading] = useState(true); // Thêm loading state để hiển thị khi đang fetch dữ liệu
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true); // Bắt đầu quá trình load
      setError(null); // Reset lại lỗi mỗi khi fetch mới

      try {
        // Xây dựng URL với các tham số tìm kiếm nếu có
        let url = `${API_URL}/rooms`;
        const params = new URLSearchParams();
        
        if (priceFilter) {
          params.append("price", priceFilter);
        }

        if (sizeFilter) {
          params.append("size", sizeFilter);
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
        setRoom(data); // Lưu dữ liệu vào state
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false); // Dừng quá trình load sau khi fetch xong
      }
    };

    fetchRooms();
  }, [priceFilter, sizeFilter]); // Chỉ gọi lại khi priceFilter hoặc sizeFilter thay đổi

  return { room, loading, error };
};

export default useFetchRooms;
