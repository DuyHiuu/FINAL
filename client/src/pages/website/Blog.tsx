import React, { useState } from "react";
import useFetchBlogs from "../../api/useFetchBlogs";

const Blog = () => {
  const { blog, loading } = useFetchBlogs();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredBlogs = blog?.filter((blog: any) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center mb-10 mt-24">
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
            value={searchTerm}
            onChange={handleSearch}
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

      <div className="flex flex-col items-center mt-10">
        <h1 className="text-3xl font-bold">Blog</h1>

        {/* Display loading spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 px-4">
            {filteredBlogs?.map((blog: any) => (
              <div
                key={blog.id}
                className="flex flex-col items-center bg-[#F2F0F2] p-4 rounded-lg shadow-lg"
              >
                <div className="w-full h-[200px] bg-gray-200 rounded-md mb-24">
                  <img src={blog.image} alt="" />
                </div>
                <h1 className="text-lg font-semibold mb-2">{blog.title}</h1>
                <p className="text-sm text-center">{blog.description}</p>
                <p className="text-sm text-center">Mô tả thêm về dịch vụ này.</p>
              </div>
            ))}

            {filteredBlogs?.length === 0 && (
              <p className="text-gray-500">Không tìm thấy bài viết nào.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
