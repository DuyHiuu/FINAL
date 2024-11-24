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
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState('');
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

    setErrors({});
    setMessage('');
    setSuccessMessage(''); // Reset success message before submitting

    const updatedBlog = {
      title: title,
      description: description,
      content: content,
      image: image,
    };

    setIsLoading(true);

    try {
      const response = await fetch(`${showUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBlog),
      });

      setIsLoading(false);

      if (response.ok) {
        setSuccessMessage('Bài viết đã được cập nhật thành công!');

        // Hiển thị thông báo thành công trong 3 giây rồi chuyển trang
        setTimeout(() => {
          setSuccessMessage('');
          navigate('/admin/blogs');
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
      setMessage('Đã xảy ra lỗi khi kết nối với server.');
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Sửa Bài Viết</h1>

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
          {image && (
            <img src={image} alt="image" className="h-32 mb-2" />
          )}
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full text-gray-700 border rounded focus:outline-none focus:ring focus:ring-blue-500"
          />
          {errors.image && <div className="text-red-500 text-sm mt-2">{errors.image}</div>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Mô tả
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Nhập mô tả"
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
            {isLoading ? 'Đang cập nhật...' : 'Cập nhật bài viết'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
