import React, { useState } from "react";

const Lienhe = () => {
  const [loading, setLoading] = useState(false); // Loading state

  // Simulate form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Start loading when form is submitted

    // Simulate a network request with setTimeout
    setTimeout(() => {
      setLoading(false); // Stop loading after request completes
      alert("Tin nhắn của bạn đã được gửi thành công!"); // Confirmation message
    }, 2000); // 2-second delay to mimic an async operation
  };

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between max-w-7xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg mt-24">
      {/* Left Contact Section */}
      <div className="w-full lg:w-1/2 p-6 flex flex-col space-y-4">
        <h2 className="text-3xl font-bold mb-4">Liên hệ với chúng tôi</h2>
        <p className="text-lg">
          Chúng tôi rất mong được nghe phản hồi từ bạn. Vui lòng liên hệ qua các
          thông tin dưới đây:
        </p>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-4">
          <input
            type="text"
            placeholder="Tên của bạn"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="email"
            placeholder="Email của bạn"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
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
            required
          ></textarea>

          <button
            type="submit"
            disabled={loading} // Disable button when loading
            className={`bg-[#064749] text-white py-3 px-6 rounded-lg transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#043d3c]"
            }`}
          >
            {loading ? "Đang gửi..." : "Gửi tin nhắn"}
          </button>
        </form>
      </div>

      {/* Right Image Section */}
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
