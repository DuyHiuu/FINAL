import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState(""); // Thông báo cho người dùng
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading

  const storeUrl = "http://localhost:8000/api/blogs";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);
    if (image) formData.append("image", image); // Thêm ảnh nếu có
    formData.append("user_id", "1");

    setIsLoading(true); // Bắt đầu loading

    try {
      const response = await fetch(storeUrl, {
        method: "POST",
        body: formData,
      });

      setIsLoading(false); // Kết thúc loading

      if (response.ok) {
        const data = await response.json();
        console.log("Bài viết đã thêm thành công:", data);
        setMessage("Bài viết đã được thêm thành công!");
        setTimeout(() => {
          navigate("/admin/blogs");
        }, 2000); // Chuyển hướng sau 2 giây
      } else {
        const errorData = await response.json();
        console.error("Lỗi khi thêm bài viết:", errorData.message);
        setMessage(`Thêm bài viết thất bại: ${errorData.message}`);
      }
    } catch (error) {
      setIsLoading(false); // Kết thúc loading
      console.error("Lỗi kết nối API:", error);
      setMessage("Đã xảy ra lỗi khi thêm bài viết.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Thêm Bài Viết</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        {/* Thông báo */}
        {message && (
          <div className={`mb-4 p-2 rounded ${message.includes("thất bại") ? "bg-red-200 text-red-700" : "bg-green-200 text-green-700"}`}>
            {message}
          </div>
        )}

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
            onChange={(e) => setImage(e.target.files?.[0] || null)}
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
            disabled={isLoading} // Vô hiệu hóa nút khi đang loading
            className={`bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition duration-200 ${isLoading ? 'bg-gray-400' : ''}`}
          >
            {isLoading ? "Đang thêm..." : "Thêm Bài Viết"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
