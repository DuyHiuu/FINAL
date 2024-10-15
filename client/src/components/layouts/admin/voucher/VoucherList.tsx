import { Link } from "react-router-dom";
import useFetchVoucher from "../../../../api/useFetchVoucher";

const VoucherList = () => {
  const { vouchers, setVouchers } = useFetchVoucher();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa voucher này?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/vouchers/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Voucher đã được xóa thành công");

        // Cập nhật lại state tại client thay vì tải lại trang
        setVouchers((prevVouchers) => prevVouchers.filter((voucher) => voucher.id !== id));
      } else {
        const errorData = await response.json();
        console.error("Xóa voucher thất bại:", errorData.message);
        alert(`Xóa voucher thất bại: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Đã xảy ra lỗi khi xóa voucher");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Danh Sách Voucher</h1>
        <Link
          to="/admin/vouchers/add"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Thêm Voucher
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
                Tên voucher
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Code
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Giảm giá
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Số Lượng
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Ngày bắt đầu
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Ngày kết thúc
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Hành động {/* Cột mới cho các nút hành động */}
              </th>
            </tr>
          </thead>

          <tbody>
            {vouchers?.length > 0 ? (
              vouchers.map((voucher, index) => (
                <tr key={voucher.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{voucher.name}</td>
                  <td className="px-4 py-2">{voucher.code}</td>
                  <td className="px-4 py-2">{voucher.discount}</td>
                  <td className="px-4 py-2">{voucher.quantity}</td>
                  <td className="px-4 py-2">{voucher.start_date}</td>
                  <td className="px-4 py-2">{voucher.end_date}</td>

                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/admin/vouchers/${voucher.id}`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(voucher.id)}
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
                <td colSpan={6} className="px-4 py-2 text-center text-gray-600">
                  Không có voucher nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VoucherList;
