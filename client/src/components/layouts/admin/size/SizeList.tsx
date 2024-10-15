import { Link } from "react-router-dom";
import useFetchSize from "../../../../api/useFetchSize";

const SizeList = () => {
  const { sizes } = useFetchSize(); // Sử dụng fetchSizes để làm mới danh sách sau khi xóa

  // Hàm xử lý khi xóa size
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
        const errorData = await response.json(); // Lấy dữ liệu lỗi từ phản hồi
        console.error("Xóa size thất bại:", errorData.message); // Ghi lại thông điệp lỗi
        alert(`Xóa size thất bại: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Đã xảy ra lỗi khi xóa size");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Danh Sách Size</h1>
        <Link
          to="/admin/sizes/add"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Thêm Size
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                STT
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Tên size
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Số lượng
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Miêu tả
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody>
            {sizes?.length > 0 ? (
              sizes.map((size, index) => (
                <tr key={size.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{size.name}</td>
                  <td className="px-4 py-2">{size.quantity}</td>
                  <td className="px-4 py-2">{size.description}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/admin/sizes/${size.id}`} // Sửa đường dẫn
                        className="bg-yellow-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(size.id)} // Gọi hàm xóa khi click nút
                        className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center text-gray-600">
                  Không có size nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SizeList;
