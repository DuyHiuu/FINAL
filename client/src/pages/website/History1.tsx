import React, { useState } from "react";
import useFetchPayments from "../../api/useFetchPayments";

const History1 = () => {

  const { payment } = useFetchPayments();

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);

  };


  return (
    <div className="mt-32">
      <strong className="ms-10 text-4xl font-semibold">Lịch sử mua hàng</strong>
      <div className="container mx-auto p-4 lg:p-8 flex flex-col lg:flex-row">
        {/* Phần bên trái */}
        <div className="flex-1 w-full lg:w-1/2">
          <a href="/history2">
            {payment.map((item) => (
              <div
                key={item.id}
                className="flex flex-col lg:flex-row items-center mb-6 p-4 bg-white shadow rounded-lg"
              >
                {/* Hình ảnh bên trái */}
                <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mr-4">
                  <img
                    src={item.img_thumbnail}
                    alt={`image-${item.id}`}
                    className="w-24 h-24 rounded-md"
                  />
                </div>

                {/* Nội dung bên phải */}
                <div className="flex-1 text-center lg:text-left">
                  {/* Tiêu đề */}
                  <h1 className="text-xl font-bold text-gray-900">{item.title}</h1>
                  {/* Icon và Chữ nằm cạnh nhau, căn giữa */}
                  <div className="flex justify-center lg:justify-start items-center mt-1">
                    <span className="mr-2">{item.icon}</span>
                    <p className="text-gray-600">1 thú cưng</p>
                  </div>
                  {/* Mô tả và thông tin bổ sung */}
                  <p className="text-gray-600 mt-2">Ngày: {item.date}</p>
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-[#064749]">
                    <p className="text-white text-sm"><a href="/history2">
                      Xem chi tiết
                    </a></p>
                  </div>
                  <span className="ml-2 text-gray-500">Giá: {item.price} đ</span>
                </div>
              </div>
            ))}
          </a>
        </div>

        {/* Phần bên phảii */}
        <div className="lg:w-1/3 p-4  border rounded-lg shadow-lg ml-0 lg:ml-4 bg-white">
          <div className="flex items-center">
            <div className="mr-4 sm:mr-20">
              <p className="text-left font-bold mt-2">Tổng số phòng đã đặt:</p>
            </div>
            <div className="text-right ml-4 sm:ml-20">
              <p className="font-bold mt-2">1</p>
            </div>
          </div>

          {/* Chi phí chia dọc hai bên */}
          <div className="flex justify-between mt-4">
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M21 21l-4.35-4.35M18.5 10.5A7.5 7.5 0 1111 3a7.5 7.5 0 017.5 7.5z" />
                </svg>
              </button>
            </div>
          </div>
          <button

            className="mt-5 text-white px-10 py-2 rounded-full bg-[#2563eb]"
          >
            <a href="">Tìm kiếm</a>
          </button>
        </div>
      </div>
    </div>

  );
};

export default History1;
