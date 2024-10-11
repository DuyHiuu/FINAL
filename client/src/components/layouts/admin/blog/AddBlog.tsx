import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  const storeUrl = "http://localhost:8000/api/blogs";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Tạo form data để gửi cả text và file ảnh
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);
    formData.append("image", image);
    formData.append("user_id", "1"); // Giả định ID người dùng (thay đổi theo thực tế)

    try {
      const response = await fetch(storeUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Bài viết đã thêm thành công:", data);
        alert("Bài viết đã được thêm thành công");
        navigate("/admin/blogs"); // Chuyển hướng về danh sách bài viết
      } else {
        const errorData = await response.json();
        console.error("Lỗi khi thêm bài viết:", errorData.message);
        alert(`Thêm bài viết thất bại: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
      alert("Đã xảy ra lỗi khi thêm bài viết");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Thêm Bài Viết</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Tiêu đề
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Nhập tiêu đề"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            Ảnh
          </label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
            required
            className="w-full text-gray-700 border rounded focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Mô tả ngắn
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Nhập mô tả ngắn"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
            Nội dung bài viết
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Nhập nội dung bài viết"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            Thêm Bài Viết
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
