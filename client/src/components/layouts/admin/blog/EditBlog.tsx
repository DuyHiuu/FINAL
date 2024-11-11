import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditBlog = () => {
  const showUrl = "http://localhost:8000/api/blogs"; // URL API
  const { id } = useParams(); // Lấy ID từ URL

  // Khởi tạo state cho các trường dữ liệu của blog
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate(); // Để điều hướng trang

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${showUrl}/${id}`);
        if (res.ok) {
          const blog = await res.json(); // Lấy dữ liệu blog từ API
          setTitle(blog.title); // Cập nhật state với dữ liệu blog
          setDescription(blog.description);
          setContent(blog.content);
          setImage(blog.image);
        } else {
          console.error('Không thể lấy thông tin blog');
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchBlog();
  }, [id]);

  // Xử lý sự kiện submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedBlog = {
      title: title,
      description: description,
      content: content,
      image: image,
    };

    try {
      const response = await fetch(`${showUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBlog), // Chuyển đổi đối tượng thành chuỗi JSON
      });

      if (response.ok) {
        console.log('Blog đã được cập nhật thành công');
        navigate('/admin/blogs'); // Điều hướng về danh sách blog
      } else {
        console.error('Lỗi khi sửa phòng:', response.statusText);
      }
    } catch (error) {
      console.error('Lỗi kết nối API:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 border border-gray-300 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Sửa Thông Tin Blog</h2>

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Tiêu Đề:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Cập nhật state khi thay đổi
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô Tả:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Cập nhật state khi thay đổi
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Nội Dung:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)} // Cập nhật state khi thay đổi
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Hình Ảnh:</label>
        {image && (
          <img src={image} alt="image" className="h-32 mb-2" />
        )}
        <input
          type="file"
          id="image"
          onChange={handleImageChange}
          accept="image/*"
          className="mt-1 block w-full text-gray-700 border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200"
      >
        Cập Nhật
      </button>
    </form>
  );
};

export default EditBlog;
