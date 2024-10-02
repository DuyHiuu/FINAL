import React from "react";

const Dichvu = () => {
  const rows = [
    {
      imageSrc: "/images/anh3.webp", // Đường dẫn ảnh mẫu
      title: "P.100",
      icon: (
        <img
          src="/images/icon1.jpg" // Đường dẫn icon chó mèo
          alt="dog-cat-icon"
          className="h-8 w-8"
        />
      ),
      description: "Vị trí 01  |  Tầng 1  |  Phòng bé",
      additionalInfo: "Trống 22/9/2024",
      time: "Từ 80.000 vnđ / ngày",
    },
    // Thêm các dòng khác ở đây theo mẫu
  ];

  return (
    <div className="container mx-auto p-4 lg:p-8 flex flex-col lg:flex-row">
      {/* Phần danh sách dịch vụ bên trái */}
      <div className="flex-1 w-full lg:w-1/2">
        <a href="detail">
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
                <p className="text-gray-600 mt-2">{row.description}</p>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-[#064749]">
                  <p className="text-white text-sm">{row.additionalInfo}</p>
                </div>
                <span className="ml-2 text-gray-500">{row.time}</span>
              </div>
            </div>
          ))}
        </a>
      </div>

      {/* Phần Google Maps bên phảii */}
      <div className="w-full lg:w-1/2 mt-6 lg:mt-0 lg:ml-8">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.3332506192323!2d105.79762327508054!3d21.019347780627584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab5c0ce45feb%3A0x5c370d2686dbfca!2zMTQyIFAuIFbFqSBQaOG6oW0gSMOgbSwgWcOqbiBIb8OgLCBD4bqndSBHaeG6pXksIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1727451838418!5m2!1svi!2s"
          width="100%"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default Dichvu;
