import { Link } from "react-router-dom";
import useFetchVoucher from "../../../../api/useFetchVoucher";

const VoucherList = () => {
  const { vouchers, setVouchers, loading } = useFetchVoucher();

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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Danh Sách Voucher</h1>
        <Link
          to="/admin/vouchers/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Thêm Voucher
        </Link>
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
                <th className="px-4 py-3 text-left text-sm font-semibold">Tên voucher</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Code</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Giảm giá</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Số Lượng</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Ngày bắt đầu</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Ngày kết thúc</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {vouchers?.length > 0 ? (
                vouchers.map((voucher, index) => (
                  <tr key={voucher.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 border-b">{index + 1}</td>
                    <td className="px-4 py-3 border-b">{voucher.name}</td>
                    <td className="px-4 py-3 border-b">{voucher.code}</td>
                    <td className="px-4 py-3 border-b">{voucher.discount}</td>
                    <td className="px-4 py-3 border-b">{voucher.quantity}</td>
                    <td className="px-4 py-3 border-b">{voucher.start_date}</td>
                    <td className="px-4 py-3 border-b">{voucher.end_date}</td>
                    <td className="px-4 py-3 border-b">
                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/admin/vouchers/${voucher.id}`}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600 transition duration-200"
                        >
                          Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(voucher.id)}
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
                  <td colSpan={8} className="text-center py-4">
                    Không có voucher nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VoucherList;
