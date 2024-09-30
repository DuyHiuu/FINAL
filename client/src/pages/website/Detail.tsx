import React, { useState } from "react";

const Detail = () => {
  const largeImageSrc = "/images/anh8.webp"; // Đường dẫn ảnh lớn
  const smallImageSrcs = [
    "/images/anh9.webp", // Đường dẫn ảnh nhỏ 1
    "/images/anh10.webp", // Đường dẫn ảnh nhỏ 2
    "/images/anh2.webp", // Đường dẫn ảnh nhỏ 3
    "/images/anh11.webp", // Đường dẫn ảnh nhỏ 4
  ];

  const rows = [
    {
      title: "80.000 / ngày",
      icon: (
        <svg
          className="h-8 w-8 text-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      description: "Mọi chi phí đã được tính tổng",
      priceroom: "Giá phòng: 880.300",
      pricedichvu: "Phí dịch vụ: 330.000",
      total: "Tổng: 1.210.000",
      confirm: "Phòng chỉ có thể hủy được trước ngày check-in 48 tiếng!",
    },
  ];

  const thongtin = [
    {
      title: "P100",
      icon: (
        <svg
          className="h-8 w-8 text-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      description: "Vị trí 01 | Tầng 1 | Phòng bé",
      mota: "Phòng thường có diện tích đủ rộng để chó mèo có thể di chuyển tự do. Có khu vực nghỉ ngơi riêng biệt, thường là giường mềm hoặc nệm êm. Có khu vực chơi với các đồ chơi như bóng, chuông, hoặc các vật dụng kích thích khác.\n\nĐiều Kiện An Toàn: Phòng có hàng rào hoặc cửa chắn an toàn để ngăn không cho thú cưng ra ngoài. Sàn phòng được làm từ vật liệu dễ vệ sinh và chống trơn trượt.\n\nDịch Vụ và Tiện Nghi: Cung cấp thức ăn và nước uống đầy đủ, có thể theo yêu cầu của chủ thú cưng. Có dịch vụ vệ sinh và chăm sóc hàng ngày, bao gồm việc dọn dẹp và thay đổi đồ dùng. Có nhân viên chăm sóc tận tình, thường là những người yêu động vật và có kinh nghiệm.\n\nHỗ Trợ Y Tế: Có sẵn dịch vụ y tế cơ bản, như kiểm tra sức khỏe định kỳ hoặc hỗ trợ trong trường hợp khẩn cấp.\n\nKhông Gian Xanh: Một số khách sạn còn có khu vực ngoài trời cho thú cưng có thể chạy nhảy hoặc thư giãn.\n\nTùy vào từng khách sạn, phòng có thể được trang trí theo nhiều phong cách khác nhau, từ hiện đại đến cổ điển, để phù hợp với nhu cầu và sở thích của chủ nuôi.",
      services: [
        { name: "Tắm", price: "50.000" },
        { name: "Tỉa lông", price: "100.000" },
        { name: "Tiêm vắc xin", price: "150.000" },
      ],
    },
  ];

  // State to track selected services
  const [selectedServices, setSelectedServices] = useState({});
  const [checkInDate, setCheckInDate] = useState(""); // Ngày vào
  const [checkOutDate, setCheckOutDate] = useState(""); // Ngày ra

  const handleServiceChange = (serviceName) => {
    setSelectedServices((prev) => ({
      ...prev,
      [serviceName]: !prev[serviceName], // Toggle selection
    }));
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex">
        {/* Hình ảnh lớn bên trái */}
        <div className="flex-shrink-0 w-1/2 p-2">
          <img
            src={largeImageSrc}
            alt="Large"
            className="w-full h-auto rounded-lg shadow"
          />
        </div>

        {/* Hình ảnh nhỏ bên phải */}
        <div className="flex flex-col w-1/2 p-2">
          <div className="flex mb-2">
            <img
              src={smallImageSrcs[0]}
              alt="Small 1"
              className="w-1/2 h-auto rounded-lg shadow mr-1"
            />
            <img
              src={smallImageSrcs[1]}
              alt="Small 2"
              className="w-1/2 h-auto rounded-lg shadow ml-1"
            />
          </div>
          <div className="flex mb-2">
            <img
              src={smallImageSrcs[2]}
              alt="Small 3"
              className="w-1/2 h-auto rounded-lg shadow mr-1"
            />
            <img
              src={smallImageSrcs[3]}
              alt="Small 4"
              className="w-1/2 h-auto rounded-lg shadow ml-1"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto p-8 flex">
        {/* Cột bên trái chứa thông tin */}
        <div className="flex-1 p-4 mr-4">
          {thongtin.map((item, index) => (
            <div key={index} className="mb-6">
              <h1 className="text-xl font-bold mb-4">{item.title}</h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center mt-1">
                  <span className="flex items-center justify-center mr-2">
                    {item.icon}
                  </span>
                  <p className="text-gray-600 flex items-center">1 thú cưng</p>
                </div>
              </div>
              <p className="text-gray-600">{item.description}</p>
              {/* Dịch vụ kèm thêm */}
              <h1 className="text-lg font-semibold mt-6">Dịch Vụ Kèm Thêm</h1>
              <div className="mt-2 space-y-2">
                {item.services.map((service, serviceIndex) => (
                  <label
                    key={serviceIndex}
                    className="flex items-center justify-start p-2 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition duration-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={!!selectedServices[service.name]}
                      onChange={() => handleServiceChange(service.name)}
                      className="hidden" // Ẩn checkbox mặc định
                    />
                    <span
                      className={`inline-block w-5 h-5 mr-2 rounded-full border-2 border-gray-300 transition-colors duration-200 ${
                        selectedServices[service.name]
                          ? "bg-[#064749] border-[#064749]"
                          : ""
                      }`}
                    ></span>
                    <span className="text-gray-800">{service.name}</span>
                    <span className="text-gray-600 ml-auto">
                      {service.price} VND
                    </span>
                  </label>
                ))}

                <h1 className="text-lg font-semibold mt-6">Mô Tả</h1>
                <p className="text-gray-600 mt-2">{item.mota}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Cột bên phải chứa khuôn thông tin */}
        <div className="flex-1">
          {rows.map((row, index) => (
            <div
              key={index}
              className="flex items-center mb-6 p-4 bg-[#F2F0F2] shadow rounded-lg"
            >
              {/* Nội dung bên phải */}
              <div className="flex-1">
                {/* Tiêu đề */}
                <h1 className="text-xl font-bold text-gray-900">{row.title}</h1>

                {/* Mục chọn ngày vào và ngày ra ở cùng một dòng */}
                <div className="flex mt-4">
                  <div className="flex-1 mr-2">
                    <label className="block mb-2 text-gray-700">Ngày vào</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                  <div className="flex-1 ml-2">
                    <label className="block mb-2 text-gray-700">Ngày ra</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                </div>

                {/* Icon và Chữ nằm cạnh nhau, căn giữa */}
                <div className="flex items-center mt-1">
                  <span className="flex items-center justify-center mr-2">
                    {row.icon}
                  </span>
                  <p className="text-gray-600 flex items-center">1 thú cưng</p>
                </div>
                {/* Mô tả ngắn gọn */}
                <p className="text-gray-600 mt-2">{row.description}</p>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full">
                  <p className="text-gray-500">{row.priceroom}</p>
                </div>
                <p className="text-gray-500">{row.pricedichvu}</p>
                <p className="text-gray-500 text-sm">{row.total}</p>
                {/* Nút button ngay dưới total */}
                <button className="mt-4 bg-[#064749] text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300">
                  Đặt phòng
                </button>
                <p className="text-red-500 text-sm">{row.confirm}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Detail;
