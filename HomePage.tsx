
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetchServices from "../../api/useFetchServices";
import useFetchRooms from "../../api/useFetchRooms";
import useFetchBlogs from "../../api/useFetchBlogs";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { services, loading: loadingServices, error: errorServices } = useFetchServices();
  const { rooms, loading: loadingRooms, error: errorRooms } = useFetchRooms();
  const { blogs, loading: loadingBlogs, error: errorBlogs } = useFetchBlogs();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleClickDanhsachphong = () => {
    navigate("/danhsach"); // Điều hướng đến trang /danhsach
  };
  
  const handleClickDocthem = () => {
    navigate("/blog"); // Điều hướng đến trang /blog
  };

  // // Hiển thị loading hoặc error nếu có
  // if (loadingServices || loadingRooms || loadingBlogs) {
  //   return <div>Loading...</div>;
  // }

  if (errorServices || errorRooms || errorBlogs) {
    return (
      <div>
        {errorServices && <p>Error Services: {errorServices}</p>}
        {errorRooms && <p>Error Rooms: {errorRooms}</p>}
        {errorBlogs && <p>Error Blogs: {errorBlogs}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mb-20">
      {/* Banner Image */}
      <img
        className="w-full h-auto max-h-[450px] sm:max-h-[350px] md:max-h-[450px] lg:max-h-[600px] object-cover"
        src="/images/img.webp"
        alt="PetSpa"
      />
      
      {/* Search Bar */}
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

      {/* Introduction */}
      <h1 className="text-3xl font-bold mt-4 text-center">
        PetSpa xin chào bạn
      </h1>
      <p className="text-lg text-center mt-2">
        Ở đây chúng tôi có các dịch vụ chăm sóc và trông giữ chó mèo hàng đầu.
      </p>
      <p>Liên hệ hotline: 0868403204</p>

      {/* Cards Section */}
      <div className="flex flex-wrap justify-center mt-10">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-col items-center justify-center w-full sm:w-1/3 md:w-1/4 lg:w-1/6 bg-[#E2F1E8] text-black rounded-lg shadow-lg p-4 m-2"
          >
            {/* Icon or Image can be dynamic if available */}
            <svg
              className="h-8 w-8 text-gray-700 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {/* Thay đổi nội dung SVG tùy theo service */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h1 className="text-xl font-bold">{service.name}</h1>
            <p className="text-sm text-center">{service.description}</p>
          </div>
        ))}
      </div>

      {/* Rooms Section */}
      <h1 className="text-3xl font-bold mt-40 text-center">
        Một số hình ảnh phòng PetHouse
      </h1>
      <div className="flex flex-wrap justify-center mt-10">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="flex flex-col items-center m-2 p-4 border rounded-lg shadow-lg bg-white w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
          >
            <h2 className="mt-2 text-lg font-semibold text-center">
              {room.name}
            </h2>
            <img
              src={`/images/${room.imageUrl}`} // Đảm bảo imageUrl đúng tên file ảnh
              alt={room.name}
              className="w-full h-32 object-cover rounded-md"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleClickDanhsachphong} 
        className="mt-10 bg-[#33CCFF] text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300">
          Danh sách phòng
      </button>

      {/* Services Section */}
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mt-10">Các dịch vụ chăm sóc</h1>
        <div className="flex flex-wrap justify-center mt-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col items-center bg-[#E2F1E8] p-4 rounded-lg shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 m-2" // Responsive width
            >
              <img
                src={`/images/${service.imageUrl}`} // Nếu có imageUrl
                alt={service.name}
                className="w-full h-[200px] object-cover rounded-md mb-2"
              />
              <h1 className="text-lg font-semibold">{service.name}</h1>
              <p className="text-sm text-center">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mt-10">Đánh giá</h1>
        <p className="text-lg text-center mt-2">Một số đánh giá tiêu biểu</p>
        <div className="flex flex-wrap justify-center mt-6">
          {/* Bạn có thể tạo một API endpoint riêng cho Reviews nếu cần */}
          {/* Dưới đây là ví dụ giả định */}
          {/* {reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col items-center bg-[#F2F0F2] p-4 rounded-lg shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 m-2"
            >
              <h1 className="text-lg font-semibold">{review.title}</h1>
              <p className="text-sm text-center">{review.description}</p>
              <p className="text-sm text-center">Mô tả thêm về đánh giá này.</p>
            </div>
          ))} */}
        </div>
      </div>

      {/* Blog Section */}
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mt-10">Blog</h1>
        <div className="flex flex-wrap justify-center mt-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="flex flex-col items-center bg-[#F2F0F2] p-4 rounded-lg shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 m-2"
            >
              <img
                src={`/images/${blog.imageUrl}`} // Đảm bảo imageUrl đúng tên file ảnh
                alt={blog.title}
                className="w-full h-[200px] object-cover rounded-md mb-2"
              />
              <h1 className="text-lg font-semibold">{blog.title}</h1>
              <p className="text-sm text-center">{blog.content}</p>
              <p className="text-sm text-center">Mô tả thêm về bài viết này.</p>
            </div>
          ))}
        </div>
        <button
          onClick={handleClickDocthem} 
          className="mt-10 bg-[#33CCFF] text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300">
            Đọc thêm
        </button>
      </div>
    </div>
  );
};

export default HomePage;
