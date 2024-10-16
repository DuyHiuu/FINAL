import React from "react";
import { Link } from "react-router-dom";
import useFetchRooms from "../../../../api/useFetchRooms";

const RoomList = () => {

  const {room} = useFetchRooms();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa phòng này?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/rooms/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Người dùng đã được xóa thành công");
        window.location.reload(); // Tải lại trang sau khi xóa thành công
      } else {
        const errorData = await response.json(); // Lấy dữ liệu lỗi từ phản hồi
        console.error("Xóa người dùng thất bại:", errorData.message); // Ghi lại thông điệp lỗi
        alert(`Xóa người dùng thất bại: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Đã xảy ra lỗi khi xóa người dùng");
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Danh Sách Phòng</h1>
        <Link to="/admin/rooms/add" className="bg-blue-600 text-white px-4 py-2 rounded shadow">
          Thêm Phòng
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">STT</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Hình Ảnh</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Size Phòng</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Giá</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Số Lượng</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Trạng Thái</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {room?.map((room:any) => (
              <tr key={room.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{room.id}</td>
                <td className="px-4 py-2">
                  <img src={room.img_thumbnail} alt={room.size_name} className="w-20 h-20 object-cover rounded" />
                </td>
                <td className="px-4 py-2">{room.size_name}</td>
                <td className="px-4 py-2">{room.price}</td>
                <td className="px-4 py-2">{room.quantity}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      room.statusroom === "Còn phòng"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {room.statusroom}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/admin/rooms/edit/${room.id}`} 
                      className="bg-yellow-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600"
                    >
                      Sửa
                    </Link>
                    <button
                        onClick={() => handleDelete(room.id)} // Gọi hàm xóa khi click nút
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

export default RoomList;
