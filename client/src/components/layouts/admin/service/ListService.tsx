import React, { useState } from "react";
import { Link } from "react-router-dom";
import useFetchServices from "../../../../api/useFetchServices";
import { FaSearch } from "react-icons/fa";

const ListService = () => {
  const { service, loading, error } = useFetchServices(); // Giả định useFetchServices cũng có trạng thái loading và error
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [filterBy, setFilterBy] = useState("name"); // Bộ lọc (mặc định là theo tên)
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const servicesPerPage = 3; // Số dịch vụ trên mỗi trang

  // Xử lý tìm kiếm và lọc theo các trường
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setFilterBy(filter);
  };

  // Kiểm tra nếu service không tồn tại hoặc rỗng
  if (!service || service.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-gray-600">
          {loading ? "Đang tải..." : "Không có dịch vụ nào"}
        </div>
      </div>
    );
  }

  // Lọc dịch vụ dựa trên từ khóa tìm kiếm và bộ lọc
  const filteredServices = service.filter((item) => {
    let fieldValue = item[filterBy];
    if (typeof fieldValue === "string") {
      return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (typeof fieldValue === "number") {
      return fieldValue.toString().includes(searchTerm);
    }
    return false;
  });

  // Lấy chỉ số của dịch vụ đầu tiên và cuối cùng trên trang hiện tại
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/services/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Dịch vụ đã được xóa thành công");
        window.location.reload(); // Tải lại trang sau khi xóa thành công
      } else {
        const errorData = await response.json();
        console.error("Xóa dịch vụ thất bại:", errorData.message);
        alert(`Xóa dịch vụ thất bại: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Đã xảy ra lỗi khi xóa dịch vụ");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Danh Sách Dịch Vụ</h1>
        <Link
          to="/admin/services/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Thêm Dịch Vụ
        </Link>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        {/* Thanh tìm kiếm */}
        <div className="relative flex-1">
          <input
            type="text"
            className="border p-2 w-full rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tìm kiếm dịch vụ..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute top-3 left-3 text-gray-500" />
        </div>

        {/* Tabs Lọc */}
        <div className="flex items-center gap-2 border-b-2 border-gray-300">
          <button
            onClick={() => handleFilterChange("name")}
            className={`px-4 py-2 transition duration-300 border-b-4 ${filterBy === "name"
              ? "border-blue-500 text-blue-500 font-semibold"
              : "border-transparent text-gray-600 hover:text-blue-500 hover:border-blue-500"
              }`}
          >
            Tên dịch vụ
          </button>
          <button
            onClick={() => handleFilterChange("price")}
            className={`px-4 py-2 transition duration-300 border-b-4 ${filterBy === "price"
              ? "border-blue-500 text-blue-500 font-semibold"
              : "border-transparent text-gray-600 hover:text-blue-500 hover:border-blue-500"
              }`}
          >
            Giá
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

      {/* Danh sách dịch vụ dưới dạng bảng */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">STT</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Tên dịch vụ</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Ảnh</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Giá</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Mô tả</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {currentServices.length > 0 ? (
              currentServices.map((service) => (
                <tr key={service.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2">{service.id}</td>
                  <td className="px-4 py-2">{service.name}</td>
                  <td className="px-4 py-2">
                    <img
                      src={service.img_thumbnail}
                      alt={service.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2">{service.price.toLocaleString("vi-VN")} VND</td>
                  <td className="px-4 py-2">{service.description}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/admin/services/edit/${service.id}`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600 transition duration-200"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(service.id)}
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
                <td colSpan={6} className="text-center py-4 text-gray-600">
                  Không có dịch vụ nào
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

export default ListService;
