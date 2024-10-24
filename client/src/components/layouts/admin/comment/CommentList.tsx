import React, { useState } from "react";
import useFetchComments from "../../../../api/useFetchComments";

const CommentList = () => {
    const { comments, loading, error } = useFetchComments();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState("content");
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 6;

    // Phân trang
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

    // Số lượng trang
    const totalPages = Math.ceil(comments.length / commentsPerPage);

    // Chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Hàm tìm kiếm và lọc
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterBy(e.target.value);
    };

    // Hàm xử lý logic lọc bình luận
    const filterComment = (comment) => {
        let fieldValue = comment[filterBy];

        if (filterBy === "user") {
            fieldValue = comment.user ? comment.user.name : "";
        }

        if (filterBy === "created_at") {
            const date = new Date(comment.created_at);
            fieldValue = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}/${date.getFullYear()}`;
        }

        if (typeof fieldValue === "string") {
            return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
        }

        return false;
    };

    const filteredComments = currentComments.filter(filterComment);

    if (loading) return <div className="text-center mt-5">Đang tải...</div>;

    if (error) return <div className="text-center text-red-600 mt-5">{error}</div>;

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa bình luận này?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8000/api/comments/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                alert("Bình luận đã được xóa thành công");
                window.location.reload();
            } else {
                const errorData = await response.json();
                console.error("Xóa bình luận thất bại:", errorData.message);
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

            {/* Thanh tìm kiếm và lọc */}
            <div className="mb-6">
                <input
                    type="text"
                    className="border p-2 mr-4"
                    placeholder="Tìm kiếm bình luận..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <select value={filterBy} onChange={handleFilterChange} className="border p-2">
                    <option value="content">Nội dung</option>
                    <option value="user">Người dùng</option>
                    <option value="created_at">Ngày tạo</option>
                </select>
            </div>

            {/* Danh sách bình luận dưới dạng bảng */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-200 text-gray-600">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Người dùng</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Nội dung</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Loại phòng</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Ngày tạo</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredComments?.length > 0 ? (
                            filteredComments.map((comment) => (
                                <tr key={comment.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-2">{comment.user ? comment.user.name : "Ẩn danh"}</td>
                                    <td className="px-4 py-2 break-words max-w-xs">{comment.content}</td>
                                    <td className="px-4 py-2">{comment.room ? comment.room.description : "Không có phòng"}</td>
                                    <td className="px-4 py-2">{new Date(comment.created_at).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition duration-200"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-600">
                                    Không có bình luận nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Phân trang */}
            <div className="flex justify-center mt-6">
                {[...Array(totalPages).keys()].map((number) => (
                    <button
                        key={number}
                        className={`mx-1 px-3 py-1 rounded-lg ${currentPage === number + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => handlePageChange(number + 1)}
                    >
                        {number + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CommentList;
