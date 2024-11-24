import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState(""); // Thêm trạng thái cho thông báo thành công

  const storeUrl = "http://localhost:8000/api/blogs";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    setMessage("");
    setSuccessMessage(""); // Reset success message before submitting

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);
    if (image) formData.append("image", image);
    formData.append("user_id", "1");

    setIsLoading(true);

    try {
      const response = await fetch(storeUrl, {
        method: "POST",
        body: formData,
      });

      setIsLoading(false);

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage("Bài viết đã được thêm thành công!");

        // Hiển thị thông báo thành công trong 3 giây rồi chuyển trang
        setTimeout(() => {
          setSuccessMessage(""); // Ẩn thông báo sau 3 giây
          navigate("/admin/blogs");
        }, 3000);
      } else {
        const errorData = await response.json();
        if (errorData.message) {
          let errorMessages: string[] = [];
          for (const [field, messages] of Object.entries(errorData.message)) {
            if (Array.isArray(messages)) {
              messages.forEach((msg) => {
                errorMessages.push(`${field}: ${msg}`);
              });
            }
          }
          setMessage(errorMessages.join(", "));
        }
        setErrors(errorData.message);
      }
    } catch (error) {
      setIsLoading(false);
      setMessage("Đã xảy ra lỗi khi kết nối với server.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Thêm Bài Viết</h1>

      {/* Hiển thị thông báo thành công trong trang */}
      {successMessage && (
        <div className="bg-green-200 text-green-800 p-4 rounded-lg mb-4">
          <p>{successMessage}</p>
        </div>
      )}

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
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Nhập tiêu đề"
          />
          {errors.title && <div className="text-red-500 text-sm mt-2">{errors.title}</div>}
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
            className="w-full text-gray-700 border rounded focus:outline-none focus:ring focus:ring-blue-500"
          />
          {errors.image && <div className="text-red-500 text-sm mt-2">{errors.image}</div>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Mô tả ngắn
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Nhập mô tả ngắn"
          />
          {errors.description && <div className="text-red-500 text-sm mt-2">{errors.description}</div>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
            Nội dung bài viết
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Nhập nội dung bài viết"
          />
          {errors.content && <div className="text-red-500 text-sm mt-2">{errors.content}</div>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
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
