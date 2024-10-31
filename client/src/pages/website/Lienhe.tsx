import React, { useState } from "react";
import { PulseLoader } from "react-spinners"; // Import PulseLoader từ react-spinners

const Lienhe = () => {
  const [loading, setLoading] = useState(false); // Thêm state loading

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    setLoading(true); // Bắt đầu loading

    // Giả lập gửi dữ liệu
    setTimeout(() => {
      // Thực hiện gửi dữ liệu tại đây
      alert("Tin nhắn đã được gửi!");
      setLoading(false); // Kết thúc loading
    }, 2000); // Giả lập thời gian gửi 2 giây
  };

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between max-w-7xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg mt-24">
      {/* Phần liên hệ bên trái */}
      <div className="w-full lg:w-1/2 p-6 flex flex-col space-y-4">
        <h2 className="text-3xl font-bold mb-4">Liên hệ với chúng tôi</h2>
        <p className="text-lg">
          Chúng tôi rất mong được nghe phản hồi từ bạn. Vui lòng liên hệ qua các
          thông tin dưới đây:
        </p>

        {/* Form liên hệ */}
        <form className="flex flex-col space-y-4 mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tên của bạn"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            placeholder="Email của bạn"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Số điện thoại của bạn"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min="0"
          />

          <textarea
            placeholder="Tin nhắn của bạn"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
          <button
            type="submit"
            className="bg-[#064749] text-white py-3 px-6 rounded-lg hover:bg-[#043d3c] transition duration-200"
            disabled={loading} // Vô hiệu hóa nút khi đang loading
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <PulseLoader color="#ffffff" size={10} margin={2} /> {/* Hiển thị spinner */}
                <span className="ml-2">Đang gửi...</span> {/* Text loading */}
              </div>
            ) : (
              "Gửi tin nhắn"
            )}
          </button>
        </form>
      </div>

      {/* Phần hình ảnh bên phải */}
      <div className="w-full lg:w-1/2 p-6 mt-6 lg:mt-0">
        <img
          src="/images/img.webp"
          alt="Liên hệ với chúng tôi"
          className="w-full h-auto lg:h-[400px] object-cover rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default Lienhe;
