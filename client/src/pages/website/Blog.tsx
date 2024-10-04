// pages/website/Blog.js
import React from "react";
import useFetchBlogs from "../../api/useFetchBlogs";

const Blog = () => {
  const { blog } = useFetchBlogs();
  console.log(blog);
  return (
    <div className="flex flex-col items-center mb-10">
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
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-3xl font-bold">Blog</h1>

        {/* Grid layout for blog cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 px-4">
          {blog?.map((blog: any) => (
            <div
              key={blog.id}
              className="flex flex-col items-center bg-[#F2F0F2] p-4 rounded-lg shadow-lg"
            >
              {/* Image */}
              <img src={blog.image} alt="" />

              <h1 className="text-lg font-semibold mb-2">{blog.title}</h1>
              <p className="text-sm text-center">{blog.description}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Blog;
