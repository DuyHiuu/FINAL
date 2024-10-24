import React from "react";
import { Link } from "react-router-dom";
import useFetchRooms from "../../../../api/useFetchRooms";

const RoomList = () => {
  const { room, loading, error } = useFetchRooms(); // Giả định useFetchRooms cũng có trạng thái loading và error

  // Nếu đang tải, hiển thị thông báo
  if (loading) return <div className="text-center mt-5">Đang tải...</div>;

  // Nếu có lỗi, hiển thị thông báo lỗi
  if (error) return <div className="text-center text-red-600 mt-5">{error}</div>;

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa phòng này?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/rooms/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Phòng đã được xóa thành công");
        window.location.reload(); // Tải lại trang sau khi xóa thành công
      } else {
        const errorData = await response.json(); // Lấy dữ liệu lỗi từ phản hồi
        console.error("Xóa Phòng thất bại:", errorData.message); // Ghi lại thông điệp lỗi
        alert(`Xóa Phòng thất bại: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Đã xảy ra lỗi khi xóa Phòng");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Danh Sách Phòng</h1>
        <Link
          to="/admin/rooms/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Thêm Phòng
        </Link>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">STT</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Hình Ảnh</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Size Phòng</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Giá (VND)</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Số Lượng</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Trạng Thái</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {room?.length > 0 ? (
              room.map((room) => (
                <tr key={room.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2">{room.id}</td>
                  <td className="px-4 py-2">
                    <img src={room.img_thumbnail} alt={room.size_name} className="w-20 h-20 object-cover rounded" />
                  </td>
                  <td className="px-4 py-2">{room.size_name}</td>
                  <td className="px-4 py-2">{room.price.toLocaleString("vi-VN")} VND</td>
                  <td className="px-4 py-2">{room.quantity}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${room.statusroom === "Còn phòng"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {room.statusroom}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/admin/rooms/edit/${room.id}`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600 transition duration-200"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(room.id)}
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
                <td colSpan={7} className="text-center py-4 text-gray-600">
                  Không có phòng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomList;
