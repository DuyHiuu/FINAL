import React from "react";
import { Link } from "react-router-dom";
import useFetchRole from "../../../../api/admin/useFetchRole";

const ListRole = () => {

  const {role} = useFetchRole();
  

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa quyền này?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/roles/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Quyền đã được xóa thành công");
        window.location.reload(); // Tải lại trang sau khi xóa thành công
      } else {
        const errorData = await response.json(); // Lấy dữ liệu lỗi từ phản hồi
        console.error("Xóa quyền thất bại:", errorData.message); // Ghi lại thông điệp lỗi
        alert(`Xóa quyền thất bại: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Đã xảy ra lỗi khi xóa quyền");
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Danh Sách Quyền</h1>
        <Link to="/admin/roles/add" className="bg-blue-600 text-white px-4 py-2 rounded shadow">
          Thêm Quyền
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">STT</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Tên quyền</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Mô tả</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {role?.map((role:any) => (
              <tr key={role.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{role.id}</td>
                <td className="px-4 py-2">{role.role_name}</td>
                <td className="px-4 py-2">{role.description}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/admin/roles/edit/${role.id}`} 
                      className="bg-yellow-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600"
                    >
                      Sửa
                    </Link>
                    <button
                        onClick={() => handleDelete(role.id)} // Gọi hàm xóa khi click nút
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

export default ListRole;
