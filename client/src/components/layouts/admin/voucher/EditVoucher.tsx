import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authClient from "../../../../api/authClient";

const EditVoucher = () => {
  const [tenVoucher, setVoucher] = useState("");
  const [Code, setCode] = useState("");
  const [type, setType] = useState('%');
  const [min_total_amount, setMinTotalAmount] = useState("");
  const [giamGia, setGiamGia] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [ngayBatDau, setNgayBatDau] = useState("");
  const [ngayKetThuc, setNgayKetThuc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [maxTotalAmount, setMaxTotalAmount] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch voucher details
  const fetchVoucher = async () => {
    setLoading(true);
    try {
      const response = await authClient.get(`/vouchers/${id}`);
      if (response.status === 200) {
        const data = response.data;
        setVoucher(data.name);
        setCode(data.code);
        setType(data.type);
        setMinTotalAmount(data.min_total_amount);
        setMaxTotalAmount(data.max_total_amount);
        setGiamGia(data.discount);
        setSoLuong(data.quantity);
        setNgayBatDau(data.start_date);
        setNgayKetThuc(data.end_date);
      } else {
        throw new Error("Failed to fetch voucher details");
      }
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

    // Validation
    if (!tenVoucher || !Code || !type || !giamGia || !min_total_amount || !soLuong || !ngayBatDau || !ngayKetThuc) {
      setError("Tất cả các trường đều phải được điền đầy đủ.");
      return;
    }

    if (isNaN(giamGia) || giamGia <= 0) {
      setError("Giảm giá phải là số lớn hơn 0.");
      return;
    }

    if (isNaN(min_total_amount) || min_total_amount < 0) {
      setError("Số tiền tối thiểu phải là số lớn hơn hoặc bằng 0.");
      return;
    }

    if (isNaN(maxTotalAmount) || maxTotalAmount < 0) {
      setError("Số tiền tối đa phải là số lớn hơn hoặc bằng 0.");
      return;
    }

    if (type === "amount") {
      if (giamGia > min_total_amount) {
        setError("Mức giảm không được lớn hơn số tiền tối thiểu.");
        return;
      }

      if (giamGia > maxTotalAmount) {
        setError("Mức giảm không được lớn hơn số tiền tối đa.");
        return;
      }
    }

    if (min_total_amount > maxTotalAmount) {
      setError("Số tiền tối thiểu không được lớn hơn số tiền tối đa.");
      return;
    }

    if (isNaN(soLuong) || soLuong <= 0) {
      setError("Số lượng voucher phải là số lớn hơn 0.");
      return;
    }

    if (type === '%') {
      if (giamGia < 1 || giamGia > 100) {
        setError("Mức giảm phải từ 1% - 100%");
        return;
      }
    }

    const startDate = new Date(ngayBatDau);
    const endDate = new Date(ngayKetThuc);
    if (startDate > endDate) {
      setError("Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }

    // Create voucher object
    const updatedVoucher = {
      name: tenVoucher.trim(),
      code: Code.trim(),
      type: type.trim(),
      min_total_amount: parseInt(min_total_amount, 10),
      max_total_amount: parseInt(maxTotalAmount, 10), // Thêm vào đây
      discount: parseInt(giamGia, 10),
      quantity: parseInt(soLuong, 10),
      start_date: ngayBatDau,
      end_date: ngayKetThuc,
    };


    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await authClient.put(`/vouchers/${id}`, updatedVoucher);
      if (response.status === 200) {
        setSuccessMessage("Cập nhật voucher thành công!");
        setTimeout(() => navigate("/admin/vouchers"), 2000);
      } else {
        throw new Error("Failed to update voucher");
      }
    } catch (error) {
      setError("Đã xảy ra lỗi khi cập nhật voucher");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return parseInt(value, 10).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
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
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500"
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
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Loại:
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500"
          >
            <option value="%">Phần trăm (%)</option>
            <option value="amount">Số tiền (VND)</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="giamGia" className="block text-sm font-medium text-gray-700">
            Giảm giá:
          </label>
          <input
            type="number"
            id="giamGia"
            value={giamGia}
            onChange={(e) => setGiamGia(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="min_total_amount" className="block text-sm font-medium text-gray-700">
            Số tiền tối thiểu:
          </label>
          <input
            type="number"
            id="min_total_amount"
            value={min_total_amount}
            onChange={(e) => setMinTotalAmount(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="max_total_amount" className="block text-sm font-medium text-gray-700">
            Số tiền tối đa:
          </label>
          <input
            type="number"
            id="max_total_amount"
            value={maxTotalAmount}
            onChange={(e) => setMaxTotalAmount(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500"
          />
        </div>


        <div className="mb-4">
          <label htmlFor="soLuong" className="block text-sm font-medium text-gray-700">
            Số lượng:
          </label>
          <input
            type="number"
            id="soLuong"
            value={soLuong}
            onChange={(e) => setSoLuong(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500"
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
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500"
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
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật Voucher"}
        </button>
      </form>
    </div>
  );
};

export default EditVoucher;
