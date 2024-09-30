// pages/website/Blog.js
import React, { useEffect, useState } from "react";
import { fetchBlogs } from "../../api";
import useFetchBlogs from "../../api/useFetchBlogs";
const Blog = () => {
  const { blog } = useFetchBlogs();
  console.log(blog);
  return (
    <div className="flex flex-col items-center">
      {/* Banner Image */}
      <img
        className="w-full h-[450px] object-cover"
        src="/images/img.webp"
        alt="PetSpa"
      />

      {/* Search Box */}
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

      {/* Blog Section */}
      <div className="flex flex-col items-center">
  <h1 className="text-3xl font-bold mt-10">Blog</h1>

  {/* Grid layout for blog cards */}
  <div className="flex justify-center mt-6">
    <div className="flex space-x-4">
      {blog?.map((blog: any, index: number) => (
        <div
          key={blog.id}
          className="flex flex-col items-center bg-[#F2F0F2] p-4 rounded-lg shadow-lg w-[400px] h-[500px]"
        >
          {/* Image placeholder - can replace with actual image if available */}
          <div className="w-full h-[200px] bg-gray-200 rounded-md mb-4"></div>

          <h1 className="text-lg font-semibold mb-2">{blog.title}</h1>
          <p className="text-sm text-center">{blog.description}</p>
          <p className="text-sm text-center">Mô tả thêm về dịch vụ này.</p> {/* Thêm thẻ p thứ hai */}
        </div>
      ))}
    </div>
  </div>

  {/* Read More Button */}
  <button className="mt-10 bg-[#064749] text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-500 transition-colors duration-300">
    Đọc thêm
  </button>
</div>

    </div>
  );
};

export default Blog;
