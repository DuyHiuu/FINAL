import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddSize = () => {
    const [tenSize, setTenSize] = useState('');
    const [moTa, setMoTa] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare new size data without quantity
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
                setMessage("Thêm size thành công!");
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
            setMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
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
                <div className={`mb-4 p-2 rounded ${message.includes('thất bại') ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'}`}>
                    {message}
                </div>
            )}

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
                disabled={isLoading}
                className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-blue-600'} text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200`}
            >
                {isLoading ? 'Đang thêm...' : 'Thêm Size Phòng'}
            </button>
        </form>
    );
};

export default AddSize;
