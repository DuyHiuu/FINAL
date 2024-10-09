import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Thêm useParams để lấy ID size từ URL

const EditSize = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const navigate = useNavigate(); // Khởi tạo useNavigate để chuyển hướng

    // State để quản lý các giá trị input của form
    const [tenSize, setTenSize] = useState('');
    const [moTa, setMoTa] = useState('');
    const [soLuong, setSoLuong] = useState('');

    // Hàm để lấy thông tin size hiện tại khi trang được tải
    useEffect(() => {
        const fetchSize = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/sizes/${id}`); // Lấy thông tin size theo ID
                if (response.ok) {
                    const size = await response.json();
                    setTenSize(size.data.name);
                    setMoTa(size.data.description);
                    setSoLuong(size.data.quantity);
                } else {
                    console.error('Không thể lấy thông tin size');
                }
            } catch (error) {
                console.error('Lỗi:', error);
            }
        };

        fetchSize();
    }, [id]);

    // Hàm xử lý khi submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Tạo đối tượng size mới
        const updatedSize = {
            name: tenSize,
            description: moTa,
            quantity: parseInt(soLuong), // Đảm bảo số lượng là một số
        };

        try {
            // Thay thế bằng endpoint API của bạn để cập nhật size
            const response = await fetch(`http://localhost:8000/api/sizes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSize),
            });

            if (response.ok) {
                // Nếu thành công, chuyển hướng đến trang danh sách size
                navigate('/admin/sizes');
            } else {
                // Xử lý các phản hồi lỗi từ API
                console.error('Cập nhật size thất bại');
            }
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    return (
        <form 
            onSubmit={handleSubmit} // Gắn hàm xử lý khi submit form
            className="max-w-lg mx-auto p-6 border border-gray-300 rounded shadow-md"
        >
            <h2 className="text-2xl font-bold mb-4">Sửa Size phòng</h2>
            
            <div className="mb-4">
                <label htmlFor="tenSize" className="block text-sm font-medium text-gray-700">Tên Size:</label>
                <input
                    type="text"
                    id="tenSize"
                    value={tenSize}
                    onChange={(e) => setTenSize(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="soLuong" className="block text-sm font-medium text-gray-700">Số lượng size:</label>
                <input
                    type="number"
                    id="soLuong"
                    value={soLuong}
                    onChange={(e) => setSoLuong(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="moTa" className="block text-sm font-medium text-gray-700">Mô Tả:</label>
                <textarea
                    id="moTa"
                    value={moTa}
                    onChange={(e) => setMoTa(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                />
            </div>

            <button 
                type="submit" 
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200"
            >
                Cập nhật Size phòng
            </button>
        </form>
    );
};

export default EditSize;
