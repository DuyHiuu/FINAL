import React, { useState } from "react";
import { Link } from "react-router-dom";
import useFetchBlogs from "../../../../api/useFetchBlogs";
import { FaSearch } from "react-icons/fa";

const BlogList = () => {
  const { blog, loading, error } = useFetchBlogs();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  // Kiểm tra nếu blog không tồn tại hoặc rỗng
  if (!blog || blog.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-gray-600">
          {loading ? "Đang tải..." : "Không có bài viết nào"}
        </div>
      </div>
    );
  }

  // Lấy chỉ số của bài viết đầu tiên và cuối cùng trên trang hiện tại
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blog.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(blog.length / blogsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setFilterBy(filter);
  };

  const filterBlog = (item) => {
    let fieldValue = item[filterBy];
    if (typeof fieldValue === "string") {
      return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  };

  const filteredBlogs = currentBlogs.filter(filterBlog);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa bài viết này?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/blogs/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Bài viết đã được xóa thành công");
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Xóa bài viết thất bại:", errorData.message);
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

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        {/* Thanh tìm kiếm */}
        <div className="relative flex-1">
          <input
            type="text"
            className="border p-2 w-full rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tìm kiếm blog..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute top-3 left-3 text-gray-500" />
        </div>

        {/* Tabs Lọc */}
        <div className="flex items-center gap-2 border-b-2 border-gray-300">
          <button
            onClick={() => handleFilterChange("title")}
            className={`px-4 py-2 transition duration-300 border-b-4 ${filterBy === "title"
              ? "border-blue-500 text-blue-500 font-semibold"
              : "border-transparent text-gray-600 hover:text-blue-500 hover:border-blue-500"
              }`}
          >
            Tiêu đề
          </button>
          <button
            onClick={() => handleFilterChange("description")}
            className={`px-4 py-2 transition duration-300 border-b-4 ${filterBy === "description"
              ? "border-blue-500 text-blue-500 font-semibold"
              : "border-transparent text-gray-600 hover:text-blue-500 hover:border-blue-500"
              }`}
          >
            Mô tả
          </button>
        </div>
      </div>

      {/* Danh sách blog dưới dạng bảng */}
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
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((item) => (
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

      {/* Phân trang */}
      <div className="flex justify-center mt-6">
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number}
            className={`mx-1 px-3 py-1 rounded-lg ${currentPage === number + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            onClick={() => handlePageChange(number + 1)}
          >
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
