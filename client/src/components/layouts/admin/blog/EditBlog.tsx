import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams để lấy id từ URL

const EditBlog = () => {
  // State để quản lý các giá trị input của form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate(); 

  // Hàm để lấy dữ liệu blog theo id
  const fetchBlog = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/blogs/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch blog details");
      }
      const data = await response.json();
      
      // Set state với dữ liệu blog lấy được
      setTitle(data.title);
      setDescription(data.description);
      setContent(data.content);
      setImage(data.image);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu blog:", error);
    }
  };

  // Lấy dữ liệu blog khi component được mount
  useEffect(() => {
    fetchBlog();
  }, [id]);

  // Hàm xử lý khi submit form để cập nhật dữ liệu
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedBlog = {
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      image: image.trim(),
    };

    try {
      const response = await fetch(`http://localhost:8000/api/blogs/${id}`, {
        method: "PUT", // Phương thức PUT để cập nhật dữ liệu
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBlog),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cập nhật blog thất bại:", errorData);
        alert(`Cập nhật blog thất bại: ${JSON.stringify(errorData.message)}`);
      } else {
        // Nếu cập nhật thành công, điều hướng về trang /admin/blogs
        navigate("/admin/blogs");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 border border-gray-300 rounded shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Chỉnh sửa Blog</h2>

      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Tiêu Đề:
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Mô Tả:
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Nội Dung:
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Hình Ảnh:
        </label>
        <input
          type="text"
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200"
      >
        Cập nhật Blog
      </button>
    </form>
  );
};

export default EditBlog;
