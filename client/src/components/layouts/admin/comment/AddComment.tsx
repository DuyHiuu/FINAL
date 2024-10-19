import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AddCommentProps {
    roomId: number; // ID của phòng để thêm bình luận
    onAddComment: (content: string) => void; // Hàm callback để xử lý thêm bình luận
}

const AddComment: React.FC<AddCommentProps> = ({ roomId, onAddComment }) => {
    const [newComment, setNewComment] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();
    const API_URL = "http://localhost:8000/api"; // Đường dẫn tới API của bạn

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // Đặt commentData ở đây
        const commentData = {
            content: newComment,
            room_id: roomId, // Sử dụng roomId từ props
            user_id: localStorage.getItem("user_id"), // Đảm bảo user_id được gửi
        };

        try {
            const response = await fetch(`${API_URL}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(commentData),
            });

            if (response.ok) {
                const newCommentData = await response.json();
                onAddComment(newCommentData.comment); // Gọi hàm callback để thêm bình luận vào danh sách
                setNewComment(""); // Reset comment
                setMessage(""); // Reset message
            } else {
                const errorData = await response.json();
                setMessage(`Lỗi: ${errorData.message || response.statusText}`);
                console.error("Error posting comment:", errorData);
            }
        } catch (error) {
            console.error("Error posting comment:", error);
            setMessage("Đã xảy ra lỗi khi gửi bình luận.");
        }
    };

    return (
        <form onSubmit={handleAddComment} className="mt-4">
            {message && <div className="text-red-500">{message}</div>}
            <textarea
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="border w-full p-2 rounded"
                placeholder="Thêm bình luận..."
                required
            />
            <button
                type="submit"
                className="mt-2 text-white px-4 py-2 rounded bg-[#064749]"
            >
                Gửi
            </button>
        </form>
    );
};

export default AddComment;
