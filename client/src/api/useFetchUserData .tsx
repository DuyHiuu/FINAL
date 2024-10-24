import { useState, useEffect } from "react";

const useFetchUserData = (token) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            if (token) { // Đảm bảo token có sẵn trước khi thực hiện yêu cầu
                try {
                    const response = await fetch("http://localhost:8000/api/users", {
                        headers: {
                            Authorization: `Bearer ${token}`, // Thêm header xác thực
                        },
                    });

                    if (!response.ok) {
                        // Ghi lại trạng thái và văn bản lỗi để debug
                        const errorText = await response.text();
                        console.error("Không thể lấy dữ liệu người dùng:", response.status, errorText);
                        throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
                    }

                    const data = await response.json();
                    setComments(data.data); // Lưu danh sách bình luận vào state
                } catch (err) {
                    console.error("Không thể lấy dữ liệu người dùng:", err);
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false); // Nếu không có token, set loading thành false
            }
        };

        fetchComments();
    }, [token]); // Thêm token vào danh sách phụ gia để khi token thay đổi, hàm fetchComments sẽ được gọi lại

    return { comments, loading, error };
};

export default useFetchUserData;
