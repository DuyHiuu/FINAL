import React from "react";
import { Link } from "react-router-dom";
import useFetchBlogs from "../../../../api/useFetchBlogs";

const BlogList = () => {
  const { blog, loading, error } = useFetchBlogs(); // Đảm bảo rằng error có sẵn

  // Nếu đang tải, hiển thị thông báo
  if (loading) return <div className="text-center mt-5">Đang tải...</div>;

  // Nếu có lỗi, hiển thị thông báo lỗi
  if (error) return <div className="text-center text-red-600 mt-5">{error}</div>;

  // Hàm xử lý xóa
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa bài viết này?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/blogs/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Bài viết đã được xóa thành công");
        window.location.reload(); // Tải lại trang sau khi xóa thành công
      } else {
        const errorData = await response.json(); // Lấy dữ liệu lỗi từ phản hồi
        console.error("Xóa bài viết thất bại:", errorData.message); // Ghi lại thông điệp lỗi
        alert(`Xóa bài viết thất bại: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Đã xảy ra lỗi khi xóa bài viết");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Danh Sách Blog</h1>
        <Link
          to="/admin/blogs/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Thêm Bài Viết
        </Link>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Tiêu đề</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Mô tả</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Ảnh</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {blog?.length > 0 ? (
              blog.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">{item.title}</td>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/admin/blogs/edit/${item.id}`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600 transition duration-200"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition duration-200"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-600">
                  Không có bài viết nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogList;
