import { useState, useEffect } from "react";

const useFetchComments = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/comments"); // API lấy tất cả bình luận
                if (!response.ok) {
                    throw new Error("Không thể lấy danh sách bình luận");
                }
                const data = await response.json();
                setComments(data.data); // Lưu danh sách bình luận vào state
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, []);

    return { comments, loading, error };
};

export default useFetchComments;
