import React from "react";
import { Link } from "react-router-dom";
import useFetchServices from "../../../../api/useFetchServices";

const ListService = () => {

  const {service} = useFetchServices();

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
        const errorData = await response.json(); // Lấy dữ liệu lỗi từ phản hồi
        console.error("Xóa dịch vụ thất bại:", errorData.message); // Ghi lại thông điệp lỗi
        alert(`Xóa dịch vụ thất bại: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Đã xảy ra lỗi khi xóa dịch vụ");
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Danh Sách Dịch Vụ</h1>
        <Link to="/admin/services/add" className="bg-blue-600 text-white px-4 py-2 rounded shadow">
          Thêm Dịch Vụ
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">STT</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Tên dịch vụ</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Ảnh</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Giá</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Mô tả</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {service?.map((service:any) => (
              <tr key={service.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{service.id}</td>
                <td className="px-4 py-2">{service.name}</td>
                <td className="px-4 py-2">
                  <img src={service.img_thumbnail} alt={service.size_name} className="w-20 h-20 object-cover rounded" />
                </td>
                <td className="px-4 py-2">{service.price}</td>
                <td className="px-4 py-2">{service.description}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/admin/services/edit/${service.id}`} 
                      className="bg-yellow-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600"
                    >
                      Sửa
                    </Link>
                    <button
                        onClick={() => handleDelete(service.id)} // Gọi hàm xóa khi click nút
                        className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600"
                      >
                        Xóa
                      </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListService;
