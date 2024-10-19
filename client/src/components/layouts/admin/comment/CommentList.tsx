import React from "react";
import { Link } from "react-router-dom";
import useFetchComments from "../../../../api/useFetchComments";

const CommentList = () => {
    const { comments, loading, error } = useFetchComments(); // Không cần truyền roomId

    // Nếu đang tải, hiển thị thông báo
    if (loading) return <div className="text-center mt-5">Đang tải...</div>;

    // Nếu có lỗi, hiển thị thông báo lỗi
    if (error) return <div className="text-center text-red-600 mt-5">{error}</div>;

    // Hàm xử lý xóa
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa bình luận này?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8000/api/comments/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                alert("Bình luận đã được xóa thành công");
                window.location.reload(); // Tải lại trang sau khi xóa thành công
            } else {
                const errorData = await response.json(); // Lấy dữ liệu lỗi từ phản hồi
                console.error("Xóa bình luận thất bại:", errorData.message); // Ghi lại thông điệp lỗi
                alert(`Xóa bình luận thất bại: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Đã xảy ra lỗi khi xóa bình luận");
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Danh Sách Bình Luận</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {comments?.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-200">
                            <div className="flex items-center mb-3">
                                <div>
                                    <h2 className="font-semibold">{comment.user ? comment.user.name : "Ẩn danh"}</h2>
                                    <p className="text-gray-500 text-sm">{new Date(comment.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <p className="text-gray-600 mb-4">
                                <strong>Loại phòng:</strong> {comment.room ? comment.room.description : "Không có phòng"}
                            </p>
                            <p className="text-gray-600 mb-4"><strong>Nội dung:</strong> {comment.content}</p>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition duration-200 flex items-center">
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center col-span-full py-4 text-gray-600">
                        Không có bình luận nào
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentList;
