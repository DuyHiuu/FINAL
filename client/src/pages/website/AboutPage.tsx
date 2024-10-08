// pages/website/AboutPage.js
import React from "react";

const AboutPage = () => {
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

  const chungchis = [
    {
      title: "Chứng chỉ về chăm sóc thú y (Veterinary Care Certification)",
      description:
        "Petspa có chứng chỉ từ các tổ chức thú y uy tín, đảm bảo rằng nhân viên được đào tạo về chăm sóc sức khỏe, sơ cứu, và xử lý tình huống khẩn cấp cho chó mèo.",
      icon: (
        <svg
          className="h-8 w-8 text-500"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          {" "}
          <path
            stroke="none"
            d="M0 0h24v24H0z"
          /> <path d="M9 12l2 2l4 -4" />{" "}
          <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
        </svg>
      ),
    },
    {
      title: "Chứng chỉ vệ sinh an toàn thực phẩm",
      description:
        "Chứng chỉ này đảm bảo rằng thức ăn và quy trình chế biến, bảo quản thực phẩm cho vật nuôi tuân thủ tiêu chuẩn vệ sinh, tránh nguy cơ nhiễm khuẩn hoặc ngộ độc cho thú cưng.",
      icon: (
        <svg
          className="h-8 w-8 text-500"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          {" "}
          <path
            stroke="none"
            d="M0 0h24v24H0z"
          /> <path d="M9 12l2 2l4 -4" />{" "}
          <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
        </svg>
      ),
    },
    {
      title:
        "Chứng chỉ quản lý khách sạn cho thú cưng (Pet Boarding Facility Certification)",
      description:
        "Chứng chỉ này được cấp bởi các tổ chức chuyên về chăm sóc thú cưng, xác nhận khách sạn đáp ứng các tiêu chuẩn về an toàn, không gian, và chất lượng dịch vụ dành riêng cho vật nuôi.",
      icon: (
        <svg
          className="h-8 w-8 text-500"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          {" "}
          <path
            stroke="none"
            d="M0 0h24v24H0z"
          /> <path d="M9 12l2 2l4 -4" />{" "}
          <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
        </svg>
      ),
    },
    {
      title:
        "Chứng chỉ đào tạo huấn luyện thú cưng (Pet Training Certification)",
      description:
        "Nếu khách sạn cung cấp thêm dịch vụ huấn luyện, nhân viên cần có chứng chỉ đào tạo để đảm bảo họ có kỹ năng làm việc và huấn luyện chó mèo một cách hiệu quả, khoa học và nhân văn.",
      icon: (
        <svg
          className="h-8 w-8 text-500"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          {" "}
          <path
            stroke="none"
            d="M0 0h24v24H0z"
          /> <path d="M9 12l2 2l4 -4" />{" "}
          <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
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
  ];
  const handelclick = () => {};
  const handleSubmit = () => {};
  return (
    <div className="flex flex-col items-center mt-20">
      {/* Banner Image */}
      <img
        className="w-full h-auto max-h-[450px] sm:max-h-[350px] md:max-h-[450px] lg:max-h-[600px] object-cover"
        src="/images/img.webp"
        alt="PetSpa"
      />
      <div className="flex justify-center mt-10">
        <div className="relative w-full max-w-xs sm:max-w-md">
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
      <p>Liên hệ hotline : 0868403204</p>

      {/* Tạo 4 khuôn chữ nhật bo tròn */}
      <div className="flex flex-wrap justify-center mt-10 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center w-full sm:w-[45%] md:w-[30%] lg:w-64 h-40 bg-[#E2F1E8] text-black rounded-lg shadow-lg p-4"
          >
            <div className="mb-2">{card.icon}</div>
            <h1 className="text-xl font-bold text-center">{card.title}</h1>
            <p className="text-sm text-center">{card.description}</p>
          </div>
        ))}
      </div>
      <h1 className="text-3xl font-bold mt-40 text-center">
        Hợp tác với hãng lồng chó mèo Lucky Pet
      </h1>
      <p className="text-lg text-center mt-2">
        Lucky Pet là nơi sản xuất các loại lồng chó mèo hàng đầu Việt Nam, đạt
        các tiêu chuẩn về độ bền. an toàn và thoải mái cho thú cưng
      </p>
      <div className="flex flex-col items-center">
        <div className="flex justify-center mt-6">
          {/* Hàng khuôn ảnh với tiêu đề và mô tảa */}
          <div className="flex flex-wrap justify-center mt-6 gap-4">
            {khuonItems.map((khuon, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center bg-[#F2F0F2] p-4 rounded-lg shadow-lg w-full sm:w-[600px] h-[400px]"
              >
                <img
                  src={khuon.imageUrl}
                  alt={khuon.title}
                  className="w-full sm:w-[50%] h-[300px] object-cover rounded-md mb-2 sm:mb-0"
                />
                <div className="p-4">
                  <h2 className="text-2xl font-bold">{khuon.title}</h2>
                  <p className="mt-2 text-sm">{khuon.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {chungchis.map((chungchi, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center bg-white text-black rounded-lg shadow-lg p-4"
          >
            <div className="mb-2">{chungchi.icon}</div>
            <h1 className="text-xl font-bold text-center">{chungchi.title}</h1>
            <p className="text-sm text-center">{chungchi.description}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center h-screen bg-100">
        <div className="flex flex-col lg:flex-row items-center bg-white rounded-lg shadow-lg p-6 max-w-4xl mt-10">
          <img
            src="/images/anh2.webp"
            alt="Example"
            className="w-full lg:w-48 h-48 object-cover rounded-md mb-4 lg:mb-0 lg:mr-6"
          />
          <p className="text-lg text-gray-700">
            Giới thiệu Khách sạn Thú Cưng Petspa Chào mừng bạn đến với Petspa,
            khách sạn thú cưng cao cấp, nơi mà chúng tôi coi chó mèo của bạn là
            thành viên trong gia đình! Với sứ mệnh mang đến một môi trường an
            toàn, thoải mái và vui vẻ cho các bé thú cưng khi vắng chủ, chúng
            tôi luôn đặt sự chăm sóc và hạnh phúc của thú cưng lên hàng đầu. Tại
            Petspa, chúng tôi cung cấp các dịch vụ toàn diện như chăm sóc ăn
            uống, tắm rửa, chải chuốt, cùng với các hoạt động vui chơi và giải
            trí hàng ngày. Đặc biệt, đội ngũ nhân viên của chúng tôi được đào
            tạo chuyên nghiệp trong việc chăm sóc và quan sát thú cưng, đảm bảo
            các bé luôn khỏe mạnh và tinh thần thoải mái. Không gian rộng rãi,
            thoáng mát cùng cơ sở vật chất hiện đại, bao gồm khu vui chơi ngoài
            trời và các phòng nghỉ riêng biệt, giúp thú cưng của bạn có cảm giác
            như ở nhà. Chúng tôi còn có dịch vụ thú y sẵn sàng hỗ trợ 24/7, giúp
            bạn yên tâm trong mọi trường hợp. Hãy để Petspa trở thành ngôi nhà
            thứ hai cho thú cưng của bạn – nơi các bé không chỉ được chăm sóc mà
            còn được yêu thương!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
