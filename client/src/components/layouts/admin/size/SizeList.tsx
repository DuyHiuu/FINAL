import React, { useState } from "react";
import { Link } from "react-router-dom";
import useFetchSize from "../../../../api/useFetchSize";

const SizeList = () => {
  const { sizes, loading } = useFetchSize();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sizesPerPage] = useState(5); // Số lượng size trên mỗi trang

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Hàm lọc size dựa trên tên và miêu tả
  const filteredSizes = sizes?.filter(
    (size) =>
      size.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      size.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const indexOfLastSize = currentPage * sizesPerPage;
  const indexOfFirstSize = indexOfLastSize - sizesPerPage;
  const currentSizes = filteredSizes?.slice(indexOfFirstSize, indexOfLastSize);

  const totalPages = Math.ceil(filteredSizes?.length / sizesPerPage);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa size này?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/sizes/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Size đã được xóa thành công");
        window.location.reload(); // Tải lại trang sau khi xóa thành công
      } else {
        const errorData = await response.json();
        console.error("Xóa size thất bại:", errorData.message);
        alert(`Xóa size thất bại: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Đã xảy ra lỗi khi xóa size");
    }
  };

  // Hàm chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Danh Sách Size</h1>
        <Link
          to="/admin/sizes/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Thêm Size
        </Link>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc miêu tả"
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">STT</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Tên size</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Số lượng</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Miêu tả</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Hành động</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {Array.isArray(currentSizes) && currentSizes.length > 0 ? (
                currentSizes.map((size, index) => (
                  <tr key={size.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 border-b">{indexOfFirstSize + index + 1}</td>
                    <td className="px-4 py-3 border-b">{size.name}</td>
                    <td className="px-4 py-3 border-b">{size.quantity}</td>
                    <td className="px-4 py-3 border-b">{size.description}</td>
                    <td className="px-4 py-3 border-b">
                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/admin/sizes/${size.id}`}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600 transition duration-200"
                        >
                          Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(size.id)}
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
                  <td colSpan={5} className="text-center py-4">
                    Không có size nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Phân trang */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-3 py-1 mx-1 rounded-lg ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeList;
