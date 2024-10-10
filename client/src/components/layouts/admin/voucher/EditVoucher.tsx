import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams để lấy id từ URL

const EditVoucher = () => {
  // State để quản lý các giá trị input của form
  const [tenVoucher, setVoucher] = useState("");
  const [Code, setCode] = useState("");
  const [giamGia, setGiamGia] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [ngayBatDau, setNgayBatDau] = useState(""); 
  const [ngayKetThuc, setNgayKetThuc] = useState(""); 

  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate(); 

  // Hàm để lấy dữ liệu voucher theo id
  const fetchVoucher = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/vouchers/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch voucher details");
      }
      const data = await response.json();
      
      // Set state với dữ liệu voucher lấy được
      setVoucher(data.name);
      setCode(data.code);
      setGiamGia(data.discount);
      setSoLuong(data.quantity);
      setNgayBatDau(data.start_date);
      setNgayKetThuc(data.end_date);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu voucher:", error);
    }
  };

  // Lấy dữ liệu voucher khi component được mount
  useEffect(() => {
    fetchVoucher();
  }, [id]);

  // Hàm xử lý khi submit form để cập nhật dữ liệu
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedVoucher = {
      name: tenVoucher.trim(),
      code: Code.trim(),
      discount: parseInt(giamGia, 10),
      quantity: parseInt(soLuong, 10),
      start_date: ngayBatDau,
      end_date: ngayKetThuc,
    };

    try {
      const response = await fetch(`http://localhost:8000/api/vouchers/${id}`, {
        method: "PUT", // Phương thức PUT để cập nhật dữ liệu
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedVoucher),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cập nhật voucher thất bại:", errorData);
        alert(`Cập nhật voucher thất bại: ${JSON.stringify(errorData.message)}`);
      } else {
        // Nếu cập nhật thành công, điều hướng về trang /admin/vouchers
        navigate("/admin/vouchers");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 border border-gray-300 rounded shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Chỉnh sửa Voucher</h2>

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
        Cập nhật Voucher
      </button>
    </form>
  );
};

export default EditVoucher;
