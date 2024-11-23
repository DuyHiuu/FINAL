import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddSize = () => {
    const [tenSize, setTenSize] = useState('');
    const [moTa, setMoTa] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Validate form data
    const validate = () => {
        const newErrors = {};
        if (!tenSize.trim()) {
            newErrors.tenSize = 'Tên size không được để trống.';
        }
      
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra dữ liệu trước khi gửi
        if (!validate()) {
            return;
        }

        // Dữ liệu hợp lệ, chuẩn bị gửi yêu cầu
        const newSize = {
            name: tenSize,
            description: moTa,
        };

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/sizes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSize),
            });

            setIsLoading(false);

            if (response.ok) {
                setMessage('Thêm size thành công!');
                setTimeout(() => {
                    navigate('/admin/sizes');
                }, 2000);
            } else {
                const errorData = await response.json();
                console.error('Thêm size thất bại:', errorData);
                setMessage(`Thêm size thất bại: ${errorData.message}`);
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Lỗi:', error);
            setMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto p-6 border border-gray-300 rounded shadow-md bg-white"
        >
            <h2 className="text-2xl font-bold mb-4 text-center">Thêm Size Phòng</h2>

            {/* Notification message */}
            {message && (
                <div
                    className={`mb-4 p-2 rounded ${
                        message.includes('thất bại') ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'
                    }`}
                >
                    {message}
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="tenSize" className="block text-sm font-medium text-gray-700">
                    Tên Size:
                </label>
                <input
                    type="text"
                    id="tenSize"
                    value={tenSize}
                    onChange={(e) => setTenSize(e.target.value)}
                    className={`mt-1 block w-full border ${
                        errors.tenSize ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm p-2 focus:outline-none focus:ring ${
                        errors.tenSize ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                />
                {errors.tenSize && <p className="text-red-500 text-sm mt-1">{errors.tenSize}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="moTa" className="block text-sm font-medium text-gray-700">
                    Mô Tả:
                </label>
                <textarea
                    id="moTa"
                    value={moTa}
                    onChange={(e) => setMoTa(e.target.value)}
                    className={`mt-1 block w-full border ${
                        errors.moTa ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm p-2 focus:outline-none focus:ring ${
                        errors.moTa ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                />
                {errors.moTa && <p className="text-red-500 text-sm mt-1">{errors.moTa}</p>}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-blue-600'} text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200`}
            >
                {isLoading ? 'Đang thêm...' : 'Thêm Size Phòng'}
            </button>
        </form>
    );
};

export default AddSize;
