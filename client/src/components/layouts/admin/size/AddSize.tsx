import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để chuyển hướng

const AddSize = () => {
    // State để quản lý các giá trị input của form
    const [tenSize, setTenSize] = useState('');
    const [moTa, setMoTa] = useState('');
    const [soLuong, setSoLuong] = useState('');
    
    const navigate = useNavigate(); // Khởi tạo useNavigate để chuyển hướng

    // Hàm xử lý khi submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Tạo đối tượng size mới
        const newSize = {
            name: tenSize,
            description: moTa,
            quantity: parseInt(soLuong), // Đảm bảo số lượng là một số
        };

        try {
            // Thay thế bằng endpoint API của bạn để thêm size
            const response = await fetch('http://localhost:8000/api/sizes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSize),
            });

            if (response.ok) {
                // Nếu thành công, chuyển hướng đến trang danh sách size
                navigate('/admin/sizes');
            } else {
                // Xử lý các phản hồi lỗi từ API
                console.error('Thêm size thất bại');
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
            <h2 className="text-2xl font-bold mb-4">Thêm Size phòng</h2>
            
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
                Thêm Size phòng
            </button>
        </form>
    );
};

export default AddSize;
