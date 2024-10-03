// pages/website/HomePage.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleClickDanhsachphong = () => {
    navigate("/dichvu"); // Điều hướng đến trang /dichvu
  };
  const handleClickDocthem = () => {
    navigate("/blog"); // Điều hướng đến trang /dichvu
  };

  const cards = [
    {
      title: "Thời gian linh hoạt",
      description: "Nhận trông thú mọi lúc và tối đa trong 1 tháng",
      icon: (
        <svg
          className="h-8 w-8 text-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Đầy đủ đồ dùng",
      description: "Các đồ dùng cần thiết của các bé đều được trang bị đầy đủ",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 9h18M3 15h18M3 12h18M4 6h16M4 18h16"
          />
        </svg>
      ),
    },
    {
      title: "Camera theo dõi",
      description: "Theo dõi thú cưng 24/24",
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
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      ),
    },
    {
      title: "Hỗ trợ 24/7",
      description: "Liên hệ fanpage",
      icon: (
        <svg
          className="h-8 w-8 text-500"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />
          <line x1="12" y1="12" x2="12" y2="12.01" />
          <line x1="8" y1="12" x2="8" y2="12.01" />
          <line x1="16" y1="12" x2="16" y2="12.01" />
        </svg>
      ),
    },
  ];

  const cardItems = [
    { title: "Nhà 2 tầng", imageUrl: "/images/anh1.webp" },
    { title: "Đơn giản", imageUrl: "/images/anh2.webp" },
    { title: "Phong cách", imageUrl: "/images/anh3.webp" },
    { title: "Tiện nghi", imageUrl: "/images/anh4.webp" },
    { title: "Cổ điển", imageUrl: "/images/anh5.webp" },
    { title: "Chắc chắn", imageUrl: "/images/anh6.webp" },
  ];

  const khuonItems = [
    {
      title: "Tắm",
      description:
        "Sử dụng các sản phầm 100% được kiểm định về an toàn cho các bế",
      imageUrl: "/images/anh1.webp",
    },
    {
      title: "Tỉa lông",
      description: "Chuyên nghiệp - Gọn gàng - Đẹp mắt",
      imageUrl: "/images/anh2.webp",
    },
    {
      title: "Tiêm vắc xin",
      description:
        "Mô tả chĐược các bác sĩ thú y tư vấn và trực tiếp tiêm cho các béo khuôn 3",
      imageUrl: "/images/anh3.webp",
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Banner Image */}
      <img
        className="w-full h-auto max-h-[450px] sm:max-h-[350px] md:max-h-[450px] lg:max-h-[600px] object-cover"
        src="/images/img.webp"
        alt="PetSpa"
      />
      <div className="flex justify-center mt-10">
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

      {/* Content */}
      <h1 className="text-3xl font-bold mt-4 text-center">
        PetSpa xin chào bạn
      </h1>
      <p className="text-lg text-center mt-2">
        Ở đây chúng tôi có các dịch vụ chăm sóc và trông giữ chó mèo hàng đầu.
      </p>
      <p>Liên hệ hotline: 0868403204</p>

      {/* Cards Section */}
      <div className="flex flex-wrap justify-center mt-10">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center w-full sm:w-1/3 md:w-1/4 lg:w-1/6 bg-[#E2F1E8] text-black rounded-lg shadow-lg p-4 m-2"
          >
            <div className="mb-2">{card.icon}</div>
            <h1 className="text-xl font-bold">{card.title}</h1>
            <p className="text-sm text-center">{card.description}</p>
          </div>
        ))}
      </div>

      <h1 className="text-3xl font-bold mt-40 text-center">
        Một số hình ảnh PetHose
      </h1>
      <div className="flex flex-wrap justify-center mt-10">
        {cardItems.map((card, index) => (
          <div
            key={index}
            className="flex flex-col items-center m-2 p-4 border rounded-lg shadow-lg bg-white w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
          >
            <h2 className="mt-2 text-lg font-semibold text-center">
              {card.title}
            </h2>
            <img
              src={card.imageUrl}
              alt={card.title}
              className="w-full h-32 object-cover rounded-md"
            />
          </div>
        ))}
      </div>

      <button className="mt-10 bg-[#33CCFF] text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300">
        Danh sách phòng
      </button>

      {/* Services Section */}
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mt-10">Các dịch vụ chăm sóc</h1>
        <div className="flex flex-wrap justify-center mt-6">
          {khuonItems.map((khuon, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-[#E2F1E8] p-4 rounded-lg shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 m-2" // Responsive width
            >
              <img
                src={khuon.imageUrl}
                alt={khuon.title}
                className="w-full h-[450px] object-cover rounded-md mb-2"
              />
              <h1 className="text-lg font-semibold">{khuon.title}</h1>
              <p className="text-sm text-center">{khuon.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mt-10">Đánh giá</h1>
        <p className="text-lg text-center mt-2">Một số đánh giá tiêu biểu</p>
        <div className="flex flex-wrap justify-center mt-6">
          {khuonItems.map((khuon, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-[#F2F0F2] p-4 rounded-lg shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 m-2"
            >
              <h1 className="text-lg font-semibold">{khuon.title}</h1>
              <p className="text-sm text-center">{khuon.description}</p>
              <p className="text-sm text-center">Mô tả thêm về dịch vụ này.</p>
            </div>
          ))}
        </div>
      </div>

      {/* Blog Sectii */}
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mt-10">Blog</h1>
        <div className="flex flex-wrap justify-center mt-6">
          {khuonItems.map((khuon, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-[#F2F0F2] p-4 rounded-lg shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 m-2"
            >
              <img
                src={khuon.imageUrl}
                alt={khuon.title}
                className="w-full h-[450px] object-cover rounded-md mb-2"
              />
              <h1 className="text-lg font-semibold">{khuon.title}</h1>
              <p className="text-sm text-center">{khuon.description}</p>
              <p className="text-sm text-center">Mô tả thêm về dịch vụ này.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
