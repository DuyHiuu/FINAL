import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authClient from "../../../../api/authClient";

const EditVoucher = () => {
  const [tenVoucher, setVoucher] = useState("");
  const [Code, setCode] = useState("");
  const [type, setType] = useState('%');
  const [min_total_amount, setMin_total_amount] = useState("");
  const [giamGia, setGiamGia] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [ngayBatDau, setNgayBatDau] = useState("");
  const [ngayKetThuc, setNgayKetThuc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch voucher details
  const fetchVoucher = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/vouchers/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch voucher details");
      }
      const data = await response.json();
      setVoucher(data.name);
      setCode(data.code);
      setType(data.type);
      setMin_total_amount(data.min_total_amount);
      setGiamGia(data.discount);
      setSoLuong(data.quantity);
      setNgayBatDau(data.start_date);
      setNgayKetThuc(data.end_date);
    } catch (error) {
      setError("Không thể tải dữ liệu voucher");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoucher();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tenVoucher || !Code || !type || !giamGia || !min_total_amount || !soLuong || !ngayBatDau || !ngayKetThuc) {
      setError("Tất cả các trường đều phải được điền đầy đủ.");
      return;
    }

    if (isNaN(giamGia) || giamGia <= 0) {
      setError("Giảm giá phải là số lớn hơn 0.");
      return;
    }
    if (isNaN(min_total_amount) || min_total_amount < 0) {
      setError("Số tiền tối thiểu phải là số lớn hơn 0.");
      return;
    }
    if (isNaN(soLuong) || soLuong < 0) {
      setError("Số lượng voucher phải là số lớn hơn 0.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(ngayBatDau);
    const endDate = new Date(ngayKetThuc);

    if (startDate < today) {
      setError("Ngày bắt đầu không được là ngày trong quá khứ.");
      return;
    }

    const maxEndDate = new Date(today);
    maxEndDate.setMonth(today.getMonth() + 3);
    if (endDate > maxEndDate) {
      setError("Ngày kết thúc không được vượt quá 3 tháng từ hôm nay.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const updatedVoucher = {
      name: tenVoucher.trim(),
      code: Code.trim(),
      type: type.trim(),
      min_total_amount: parseInt(min_total_amount),
      discount: parseInt(giamGia, 10),
      quantity: parseInt(soLuong, 10),
      start_date: ngayBatDau,
      end_date: ngayKetThuc,
    };

    try {
      const response = await authClient.put(`http://127.0.0.1:8000/api/vouchers/${id}`, updatedVoucher);

      if (response.status !== 200) {
        const errorData = await response.json();
        setError(`Cập nhật thất bại: ${errorData.message}`);
      } else {
        setSuccessMessage("Cập nhật voucher thành công!");
        setTimeout(() => {
          navigate("/admin/vouchers");
        }, 2000);
      }
    } catch (error) {
      setError("Đã xảy ra lỗi khi cập nhật voucher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-6 border border-gray-300 rounded-lg shadow-md bg-white"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Chỉnh sửa Voucher
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 text-green-600 p-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="tenVoucher" className="block text-sm font-medium text-gray-700">
            Tên Voucher:
          </label>
          <input
            type="text"
            id="tenVoucher"
            value={tenVoucher}
            onChange={(e) => setVoucher(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập tên voucher"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="Code" className="block text-sm font-medium text-gray-700">
            Code:
          </label>
          <input
            id="Code"
            value={Code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập mã voucher"
          />
        </div>

        <div className="mb-4 relative">
          <label htmlFor="Type" className="block text-sm font-medium text-gray-700">
            Loại:
          </label>
          <div className="flex items-center">
            <select name="type" id="" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={type}
              onChange={(e) => setType(e.target.value)}>
              <option value="%">%</option>
              <option value="amount">Amount</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="giamGia" className="block text-sm font-medium text-gray-700">
            Giảm giá (VND/%):
          </label>
          <input
            type="number"
            id="giamGia"
            value={giamGia ? Math.trunc(giamGia).toLocaleString("vi-VN") : ""}
            onChange={(e) => setGiamGia(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập phần trăm giảm giá"
          />
        </div>

        <div className="mb-4 relative">
          <label htmlFor="min_total_amount" className="block text-sm font-medium text-gray-700">
            Số tiền tối thiểu để áp dụng:
          </label>
          <div className="flex items-center">
            <input
              type="number"
              id="min_total_amount"
              value={min_total_amount || ""}
              onChange={(e) => setMin_total_amount(e.target.value)}

              placeholder="Nhập số tiền tối thiểu để áp dụng"
              className="pl-10 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {min_total_amount && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {parseInt(min_total_amount).toLocaleString("vi-VN")} VND
              </div>
            )}
          </div>
        </div>


        <div className="mb-4">
          <label htmlFor="soLuong" className="block text-sm font-medium text-gray-700">
            Số lượng Voucher:
          </label>
          <input
            type="number"
            id="soLuong"
            value={soLuong}
            onChange={(e) => setSoLuong(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập số lượng voucher"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="ngayBatDau" className="block text-sm font-medium text-gray-700">
            Ngày Bắt Đầu:
          </label>
          <input
            type="date"
            id="ngayBatDau"
            value={ngayBatDau}
            onChange={(e) => setNgayBatDau(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="ngayKetThuc" className="block text-sm font-medium text-gray-700">
            Ngày Kết Thúc:
          </label>
          <input
            type="date"
            id="ngayKetThuc"
            value={ngayKetThuc}
            onChange={(e) => setNgayKetThuc(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200 ${loading ? 'bg-gray-400 cursor-not-allowed' : ''}`}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật Voucher"}
        </button>
      </form>
    </div>
  );
};

export default EditVoucher;
