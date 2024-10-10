import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate để chuyển hướng

const AddVoucher = () => {
  // State để quản lý các giá trị input của form
  const [tenVoucher, setVoucher] = useState("");
  const [Code, setCode] = useState("");
  const [giamGia, setGiamGia] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [ngayBatDau, setNgayBatDau] = useState(""); // State cho ngày bắt đầu
  const [ngayKetThuc, setNgayKetThuc] = useState(""); // State cho ngày kết thúc

  const navigate = useNavigate(); // Khởi tạo useNavigate để chuyển hướng

  // Hàm xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Chuyển đổi giảm giá và số lượng sang dạng số
    const newVoucher = {
      name: tenVoucher.trim(), // Đảm bảo không có khoảng trắng thừa
      code: Code.trim(),
      discount: parseInt(giamGia, 10), // parseInt với cơ số 10 để chuyển đổi thành số
      quantity: parseInt(soLuong, 10), // Chuyển đổi số lượng thành số nguyên
      start_date: ngayBatDau, // Sử dụng định dạng ISO cho ngày
      end_date: ngayKetThuc, // Sử dụng định dạng ISO cho ngày
    };

    console.log(newVoucher); // In ra dữ liệu để kiểm tra

    try {
      const response = await fetch("http://localhost:8000/api/vouchers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVoucher),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Lấy thông tin chi tiết lỗi từ API
        console.error("Thêm voucher thất bại:", errorData);
        alert(`Thêm voucher thất bại: ${JSON.stringify(errorData.message)}`);
      } else {
        // Nếu thêm thành công, điều hướng về trang /admin/vouchers
        navigate("/admin/vouchers");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit} // Gắn hàm xử lý khi submit form
      className="max-w-lg mx-auto p-6 border border-gray-300 rounded shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Thêm Voucher</h2>

      <div className="mb-4">
        <label
          htmlFor="tenVoucher"
          className="block text-sm font-medium text-gray-700"
        >
          Tên Voucher:
        </label>
        <input
          type="text"
          id="tenVoucher"
          value={tenVoucher}
          onChange={(e) => setVoucher(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="Code"
          className="block text-sm font-medium text-gray-700"
        >
          Code:
        </label>
        <textarea
          id="Code"
          value={Code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="giamGia"
          className="block text-sm font-medium text-gray-700"
        >
          Giảm giá:
        </label>
        <input
          type="number"
          id="giamGia"
          value={giamGia}
          onChange={(e) => setGiamGia(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="soLuong"
          className="block text-sm font-medium text-gray-700"
        >
          Số lượng Voucher:
        </label>
        <input
          type="number"
          id="soLuong"
          value={soLuong}
          onChange={(e) => setSoLuong(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      {/* Thêm input cho Ngày Bắt Đầu */}
      <div className="mb-4">
        <label
          htmlFor="ngayBatDau"
          className="block text-sm font-medium text-gray-700"
        >
          Ngày Bắt Đầu:
        </label>
        <input
          type="date"
          id="ngayBatDau"
          value={ngayBatDau}
          onChange={(e) => setNgayBatDau(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      {/* Thêm input cho Ngày Kết Thúc */}
      <div className="mb-4">
        <label
          htmlFor="ngayKetThuc"
          className="block text-sm font-medium text-gray-700"
        >
          Ngày Kết Thúc:
        </label>
        <input
          type="date"
          id="ngayKetThuc"
          value={ngayKetThuc}
          onChange={(e) => setNgayKetThuc(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200"
      >
        Thêm Voucher
      </button>
    </form>
  );
};

export default AddVoucher;
