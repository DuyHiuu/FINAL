import React, { useState } from "react";

const History1 = () => {
  const rows = [
    {
      imageSrc: "/images/anh8.webp", // Đường dẫn ảnh mẫu
      title: "P.100",
      icon: (
        <img
          src="/images/icon1.jpg" // Đường dẫn icon chó mèo
          alt="dog-cat-icon"
          className="h-8 w-8"
        />
      ),
      date: "03-10-2024 -> 13-10-2024",
      price: "1.121.000",
    },
    // Thêm các dòng khác ở đây theo mẫu
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
      setSearchTerm(e.target.value);
      
  };


  return (
    <div>
      <strong className="text-4xl font-bold">Lịch sử đặt hàng</strong>
      <div className="container mx-auto p-4 lg:p-8 flex flex-col lg:flex-row">
        {/* Phần bên trái */}
        <div className="flex-1 w-full lg:w-1/2">
          <a href="/history2">
            {rows.map((row, index) => (
              <div
                key={index}
                className="flex flex-col lg:flex-row items-center mb-6 p-4 bg-white shadow rounded-lg"
              >
                {/* Hình ảnh bên trái */}
                <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mr-4">
                  <img
                    src={row.imageSrc}
                    alt={`image-${index}`}
                    className="w-24 h-24 rounded-md"
                  />
                </div>

                {/* Nội dung bên phải */}
                <div className="flex-1 text-center lg:text-left">
                  {/* Tiêu đề */}
                  <h1 className="text-xl font-bold text-gray-900">{row.title}</h1>
                  {/* Icon và Chữ nằm cạnh nhau, căn giữa */}
                  <div className="flex justify-center lg:justify-start items-center mt-1">
                    <span className="mr-2">{row.icon}</span>
                    <p className="text-gray-600">1 thú cưng</p>
                  </div>
                  {/* Mô tả và thông tin bổ sung */}
                  <p className="text-gray-600 mt-2">Ngày: {row.date}</p>
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-[#064749]">
                    <p className="text-white text-sm"><a href="/history2">
                      Xem chi tiết
                    </a></p>
                  </div>
                  <span className="ml-2 text-gray-500">Giá: {row.price} đ</span>
                </div>
              </div>
            ))}
          </a>
        </div>

        {/* Phần bên phảii */}
        <div className="lg:w-1/3 p-4  border rounded-lg shadow-lg ml-0 lg:ml-4 bg-[#F2F0F2]">
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
          <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Tìm kiếm phòng"
                    className="w-full h-12 px-4 pr-12 border rounded-full shadow-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-300 ease-in-out"
                />
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
