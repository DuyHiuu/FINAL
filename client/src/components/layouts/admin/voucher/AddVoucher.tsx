import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPercentage, FaCalendarAlt, FaBarcode } from 'react-icons/fa';
import { HiOutlineTicket } from 'react-icons/hi';

const AddVoucher = () => {
  const [tenVoucher, setVoucher] = useState("");
  const [Code, setCode] = useState("");
  const [type, setType] = useState('%');
  const [min_total_amount, setMin_total_amount] = useState("");
  const [giamGia, setGiamGia] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [ngayBatDau, setNgayBatDau] = useState("");
  const [ngayKetThuc, setNgayKetThuc] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!tenVoucher.trim()) newErrors.tenVoucher = "Tên voucher không được để trống.";
    if (!Code.trim()) newErrors.Code = "Mã code không được để trống.";
    if (!type) newErrors.type = "Vui lòng chọn loại.";
    if (!giamGia || isNaN(giamGia) || parseFloat(giamGia) <= 0)
      newErrors.giamGia = "Giảm giá phải là số lớn hơn 0.";
    if (!min_total_amount || isNaN(min_total_amount) || parseFloat(min_total_amount) < 0)
      newErrors.min_total_amount = "Số tiền tối thiểu phải là số không âm.";
    if (!soLuong || isNaN(soLuong) || parseInt(soLuong, 10) <= 0)
      newErrors.soLuong = "Số lượng phải là số nguyên lớn hơn 0.";
    if (!ngayBatDau) newErrors.ngayBatDau = "Ngày bắt đầu không được để trống.";
    if (!ngayKetThuc) newErrors.ngayKetThuc = "Ngày kết thúc không được để trống.";
    if (ngayBatDau && ngayKetThuc && new Date(ngayBatDau) > new Date(ngayKetThuc))
      newErrors.ngayKetThuc = "Ngày kết thúc phải sau ngày bắt đầu.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrors({});

    if (!validate()) return; 

    const newVoucher = {
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
      const response = await fetch("http://localhost:8000/api/vouchers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVoucher),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData.message || { general: "Đã xảy ra lỗi không xác định." });
      } else {
        setSuccessMessage("Thêm voucher thành công!");
        setTimeout(() => navigate("/admin/vouchers"), 1500);
      }
    } catch (error) {
      setErrors({ general: "Đã xảy ra lỗi khi kết nối với server." });
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

      {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}
      {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

      <div className="mb-4 relative">
        <label htmlFor="tenVoucher" className="block text-sm font-medium text-gray-700">
          Tên Voucher:
        </label>
        <input
          type="text"
          id="tenVoucher"
          value={tenVoucher}
          onChange={(e) => setVoucher(e.target.value)}
          placeholder="Nhập tên voucher"
          className={`mt-1 block w-full border ${
            errors.tenVoucher ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 ${
            errors.tenVoucher ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
        />
        {errors.tenVoucher && <p className="text-red-500 text-sm mt-1">{errors.tenVoucher}</p>}
      </div>

      <div className="mb-4 relative">
        <label htmlFor="Code" className="block text-sm font-medium text-gray-700">
          Code:
        </label>
        <input
          type="text"
          id="Code"
          value={Code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Nhập mã code"
          className={`mt-1 block w-full border ${
            errors.Code ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 ${
            errors.Code ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
        />
        {errors.Code && <p className="text-red-500 text-sm mt-1">{errors.Code}</p>}
      </div>

      <div className="mb-4 relative">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Loại:
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={`mt-1 block w-full border ${
            errors.type ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 ${
            errors.type ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
        >
          <option value="%">%</option>
          <option value="amount">Amount</option>
        </select>
        {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
      </div>

      <div className="mb-4 relative">
        <label htmlFor="giamGia" className="block text-sm font-medium text-gray-700">
          Giảm giá (VND/%):
        </label>
        <input
          type="number"
          id="giamGia"
          value={giamGia}
          onChange={(e) => setGiamGia(e.target.value)}
          placeholder="Nhập số tiền/phần trăm giảm giá"
          className={`mt-1 block w-full border ${
            errors.giamGia ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 ${
            errors.giamGia ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
        />
        {errors.giamGia && <p className="text-red-500 text-sm mt-1">{errors.giamGia}</p>}
      </div>

      <div className="mb-4 relative">
        <label htmlFor="min_total_amount" className="block text-sm font-medium text-gray-700">
          Số tiền tối thiểu để áp dụng:
        </label>
        <input
          type="number"
          id="min_total_amount"
          value={min_total_amount}
          onChange={(e) => setMin_total_amount(e.target.value)}
          placeholder="Nhập số tiền tối thiểu để áp dụng"
          className={`mt-1 block w-full border ${
            errors.min_total_amount ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 ${
            errors.min_total_amount ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
        />
        {errors.min_total_amount && <p className="text-red-500 text-sm mt-1">{errors.min_total_amount}</p>}
      </div>

      <div className="mb-4 relative">
        <label htmlFor="soLuong" className="block text-sm font-medium text-gray-700">
          Số lượng:
        </label>
        <input
          type="number"
          id="soLuong"
          value={soLuong}
          onChange={(e) => setSoLuong(e.target.value)}
          placeholder="Nhập số lượng voucher"
          className={`mt-1 block w-full border ${
            errors.soLuong ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 ${
            errors.soLuong ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
        />
        {errors.soLuong && <p className="text-red-500 text-sm mt-1">{errors.soLuong}</p>}
      </div>

      <div className="mb-4 relative">
        <label htmlFor="ngayBatDau" className="block text-sm font-medium text-gray-700">
          Ngày bắt đầu:
        </label>
        <input
          type="date"
          id="ngayBatDau"
          value={ngayBatDau}
          onChange={(e) => setNgayBatDau(e.target.value)}
          className={`mt-1 block w-full border ${
            errors.ngayBatDau ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 ${
            errors.ngayBatDau ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
        />
        {errors.ngayBatDau && <p className="text-red-500 text-sm mt-1">{errors.ngayBatDau}</p>}
      </div>

      <div className="mb-4 relative">
        <label htmlFor="ngayKetThuc" className="block text-sm font-medium text-gray-700">
          Ngày kết thúc:
        </label>
        <input
          type="date"
          id="ngayKetThuc"
          value={ngayKetThuc}
          onChange={(e) => setNgayKetThuc(e.target.value)}
          className={`mt-1 block w-full border ${
            errors.ngayKetThuc ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 ${
            errors.ngayKetThuc ? "focus:ring-red-500" : "focus:ring-blue-500"
          }`}
        />
        {errors.ngayKetThuc && <p className="text-red-500 text-sm mt-1">{errors.ngayKetThuc}</p>}
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
