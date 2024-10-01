import React from "react";

const PaymentConfirmation = () => {
  const largeImageSrc = "/images/anh8.webp"; // Đường dẫn ảnh lớn
  const smallImageSrcs = [
    "/images/anh9.webp", // Đường dẫn ảnh nhỏ 1
    "/images/anh10.webp", // Đường dẫn ảnh nhỏ 2
    "/images/anh2.webp", // Đường dẫn ảnh nhỏ 3
    "/images/anh11.webp", // Đường dẫn ảnh nhỏ 4
  ];
  const row = [
    {
      icon: (
        <img
          src="/images/icon1.jpg" // Đường dẫn icon chó mèo
          alt="dog-cat-icon"
          className="h-8 w-8"
        />
      ),
    },
  ];

  return (
    <div className="container mx-auto p-8">
      {/* Phần hình ảnh */}
      <div className="flex mb-8">
        {/* Hình ảnh lớn bên trái */}
        <div className="w-2/3 p-2 h-96">
          <img
            src={largeImageSrc}
            alt="Large"
            className="w-full h-full object-cover rounded-lg shadow"
          />
        </div>

        {/* Hình ảnh nhỏ bên phải */}
        <div className="w-1/3 p-2 flex flex-col">
          <div className="flex mb-2 h-48">
            <img
              src={smallImageSrcs[0]}
              alt="Small 1"
              className="w-1/2 h-full object-cover rounded-lg shadow mr-1"
            />
            <img
              src={smallImageSrcs[1]}
              alt="Small 2"
              className="w-1/2 h-full object-cover rounded-lg shadow ml-1"
            />
          </div>
          <div className="flex h-40">
            <img
              src={smallImageSrcs[2]}
              alt="Small 3"
              className="w-1/2 h-full object-cover rounded-lg shadow mr-1"
            />
            <img
              src={smallImageSrcs[3]}
              alt="Small 4"
              className="w-1/2 h-full object-cover rounded-lg shadow ml-1"
            />
          </div>
        </div>
      </div>

      {/* Phần thông tin */}
      <div className="flex">
        {/* Phần thông tin phòng */}
        <div className="w-2/3 p-4">
          <div className="text-left">
            <strong className="text-5xl">P.100</strong>
            <div className="flex items-center mt-10">
              <span className="flex items-center justify-center mr-2">
                {row[0].icon}
              </span>
              <p className="flex items-center">1 thú cưng</p>
            </div>
            <p>Vị trí 01 | Tầng 1 | Phòng bé</p>
          </div>
          <h3 className="text-left text-2xl font-semibold mt-10">Dịch vụ kèm thêm</h3>
          <div className="mt-2">
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                className="mr-2 appearance-none checked:bg-[#064749] border rounded-full w-4 h-4 cursor-pointer"
              />
              <span>Tắm</span>
            </label>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                className="mr-2 appearance-none checked:bg-[#064749] border rounded-full w-4 h-4 cursor-pointer"
              />
              <span>Tỉa lông</span>
            </label>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                className="mr-2 appearance-none checked:bg-[#064749] border rounded-full w-4 h-4 cursor-pointer"
              />
              <span>Tiêm vắc xin</span>
            </label>
          </div>

          <h3 className="text-left text-2xl font-semibold mt-10">Mô tả</h3>
          <p className="text-left mt-1">
            Phòng khách sạn cho chó mèo thường được thiết kế để đảm bảo sự thoải mái và an toàn cho thú cưng khi chủ của chúng vắng mặt. Dưới đây là một số đặc điểm phổ biến của loại phòng này:
            <br />
            <strong>Diện Tích và Bố Trí:</strong>
            <br />
            Phòng thường có diện tích đủ rộng để chó mèo có thể di chuyển tự do.
            <br />
            Có khu vực nghỉ ngơi riêng biệt, thường là giường mềm hoặc nệm êm.
            <br />
            Có khu vực chơi với các đồ chơi như bóng, chuông, hoặc các vật dụng kích thích khác.
            <br />
            <strong>Điều Kiện An Toàn:</strong>
            <br />
            Phòng có hàng rào hoặc cửa chắn an toàn để ngăn không cho thú cưng ra ngoài.
            <br />
            Sàn phòng được làm từ vật liệu dễ vệ sinh và chống trơn trượt.
            <br />
            <strong>Dịch Vụ và Tiện Nghi:</strong>
            <br />
            Cung cấp thức ăn và nước uống đầy đủ, có thể theo yêu cầu của chủ thú cưng.
            <br />
            Có dịch vụ vệ sinh và chăm sóc hàng ngày, bao gồm việc dọn dẹp và thay đổi đồ dùng.
            <br />
            Có nhân viên chăm sóc tận tình, thường là những người yêu động vật và có kinh nghiệm.
            <br />
            <strong>Hỗ Trợ Y Tế:</strong>
            <br />
            Có sẵn dịch vụ y tế cơ bản, như kiểm tra sức khỏe định kỳ hoặc hỗ trợ trong trường hợp khẩn cấp.
            <br />
            <strong>Không Gian Xanh:</strong>
            <br />
            Một số khách sạn còn có khu vực ngoài trời cho thú cưng có thể chạy nhảy hoặc thư giãn.
            <br />
            Tùy vào từng khách sạn, phòng có thể được trang trí theo nhiều phong cách khác nhau, từ hiện đại đến cổ điển, để phù hợp với nhu cầu và sở thích của chủ nuôi.
          </p>
        </div>

        {/* Phần thông tin đặt phòng */}
        <div className="w-1/3 p-4 mt-10 border rounded-lg shadow-lg ml-4 bg-[#F2F0F2] h-96">
          <h2 className="text-2xl font-semibold mb-5">80.000/Ngày</h2>

          {/* Ngày vào và Ngày ra nằm ngang */}
          <div className="flex space-x-4 mb-4">
            <label className="text-left block w-1/2">
              <strong>Ngày vào</strong>
              <input type="date" className="border p-1 w-full mt-1" />
            </label>
            <label className="text-left block w-1/2">
              <strong>Ngày ra</strong>
              <input type="date" className="border p-1 w-full mt-1" />
            </label>
          </div>

          {/* Số lượng thú cưng */}
          <div className="flex items-center mt-1">
              <span className="flex items-center justify-center mr-2">
                {row[0].icon}
              </span>
              <p className="flex items-center">1 thú cưng</p>
            </div>
          <p className="text-left mt-4">Mọi chi phí đã được tính tổng</p>

          {/* Chi phí chia dọc hai bên */}
          <div className="flex justify-between mt-4">
            <div>
              <p className="text-left">Giá phòng:</p>
              <p className="text-left mt-2">Phí dịch vụ:</p>
              <p className="text-left font-bold mt-2">Tổng:</p>
            </div>
            <div className="text-right">
              <p>880.000</p>
              <p className="mt-2">330.000</p>
              <p className="font-bold mt-2">1.121.000</p>
            </div>
          </div>

          <button className="mt-2 text-white px-10 py-2 rounded-full bg-[#064749]">
            Đặt phòng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;