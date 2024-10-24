import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddService = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const storeUrl = "http://localhost:8000/api/services";

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('price', price);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('image', image);

        setIsLoading(true); // Bắt đầu trạng thái loading

        try {
            const response = await fetch(storeUrl, {
                method: 'POST',
                body: formData,
            });

            setIsLoading(false); // Kết thúc trạng thái loading

            if (response.ok) {
                const data = await response.json();
                console.log('Dịch vụ đã thêm thành công:', data);
                setMessage("Dịch vụ đã được thêm thành công!");
                setTimeout(() => {
                    navigate('/admin/services'); // Chuyển hướng sau 2 giây
                }, 2000);
            } else {
                const errorData = await response.json();
                console.error('Lỗi khi thêm dịch vụ:', errorData.message);
                setMessage(`Thêm dịch vụ thất bại: ${errorData.message}`);
            }
        } catch (error) {
            setIsLoading(false); // Kết thúc trạng thái loading
            console.error('Lỗi kết nối API:', error);
            setMessage("Đã xảy ra lỗi khi thêm dịch vụ.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Thêm Dịch Vụ Mới</h2>

                {/* Thông báo */}
                {message && (
                    <div className={`mb-4 p-2 rounded ${message.includes("thất bại") ? "bg-red-200 text-red-700" : "bg-green-200 text-green-700"}`}>
                        {message}
                    </div>
                )}

                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Hình Ảnh:</label>
                    <input
                        type="file"
                        id="image"
                        onChange={(e) => setImage(e.target.files[0])}
                        accept="image/*"
                        className="mt-1 block w-full text-gray-700 border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô Tả:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Giá (VND):</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading} // Vô hiệu hóa nút khi đang loading
                    className={`w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200 ${isLoading ? 'bg-gray-400' : ''}`}
                >
                    {isLoading ? "Đang thêm..." : "Thêm Dịch Vụ"}
                </button>
            </form>
        </div>
    );
};

export default AddService;
