import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPercentage, FaCalendarAlt, FaBarcode } from 'react-icons/fa';
import { HiOutlineTicket } from 'react-icons/hi';

const AddVoucher = () => {
  const [tenVoucher, setVoucher] = useState("");
  const [Code, setCode] = useState("");
  const [giamGia, setGiamGia] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [ngayBatDau, setNgayBatDau] = useState("");
  const [ngayKetThuc, setNgayKetThuc] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!tenVoucher || !Code || !giamGia || !soLuong || !ngayBatDau || !ngayKetThuc) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const newVoucher = {
      name: tenVoucher.trim(),
      code: Code.trim(),
      discount: parseInt(giamGia, 10),
      quantity: parseInt(soLuong, 10),
      start_date: ngayBatDau,
      end_date: ngayKetThuc,
    };

    try {
      const response = await fetch("http://localhost:8000/api/vouchers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVoucher),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Thêm voucher thất bại:", errorData);
        setError(`Thêm voucher thất bại: ${JSON.stringify(errorData.message)}`);
      } else {
        setSuccessMessage("Thêm voucher thành công!");
        setTimeout(() => navigate("/admin/vouchers"), 1500);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setError("Đã xảy ra lỗi khi thêm voucher!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-8 border border-gray-300 rounded-lg shadow-lg bg-white"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">
        Thêm Voucher Mới
      </h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

      <div className="mb-4 relative">
        <label htmlFor="tenVoucher" className="block text-sm font-medium text-gray-700">
          Tên Voucher:
        </label>
        <div className="flex items-center">
          <HiOutlineTicket className="absolute left-3 text-gray-400" />
          <input
            type="text"
            id="tenVoucher"
            value={tenVoucher}
            onChange={(e) => setVoucher(e.target.value)}
            required
            placeholder="Nhập tên voucher"
            className="pl-10 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-4 relative">
        <label htmlFor="Code" className="block text-sm font-medium text-gray-700">
          Code:
        </label>
        <div className="flex items-center">
          <FaBarcode className="absolute left-3 text-gray-400" />
          <input
            type="text"
            id="Code"
            value={Code}
            onChange={(e) => setCode(e.target.value)}
            required
            placeholder="Nhập mã code"
            className="pl-10 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-4 relative">
        <label htmlFor="giamGia" className="block text-sm font-medium text-gray-700">
          Giảm giá:
        </label>
        <div className="flex items-center">
          <input
            type="number"
            id="giamGia"
            value={giamGia}
            onChange={(e) => setGiamGia(e.target.value)}
            required
            placeholder="Nhập số tiền giảm giá"
            className="pl-10 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-4 relative">
        <label htmlFor="soLuong" className="block text-sm font-medium text-gray-700">
          Số lượng:
        </label>
        <div className="flex items-center">
          <input
            type="number"
            id="soLuong"
            value={soLuong}
            onChange={(e) => setSoLuong(e.target.value)}
            required
            placeholder="Nhập số lượng"
            className="pl-10 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-4 relative">
        <label htmlFor="ngayBatDau" className="block text-sm font-medium text-gray-700">
          Ngày Bắt Đầu:
        </label>
        <div className="flex items-center">
          <FaCalendarAlt className="absolute left-3 text-gray-400" />
          <input
            type="date"
            id="ngayBatDau"
            value={ngayBatDau}
            onChange={(e) => setNgayBatDau(e.target.value)}
            required
            className="pl-10 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-4 relative">
        <label htmlFor="ngayKetThuc" className="block text-sm font-medium text-gray-700">
          Ngày Kết Thúc:
        </label>
        <div className="flex items-center">
          <FaCalendarAlt className="absolute left-3 text-gray-400" />
          <input
            type="date"
            id="ngayKetThuc"
            value={ngayKetThuc}
            onChange={(e) => setNgayKetThuc(e.target.value)}
            required
            className="pl-10 mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
