import React, { useState } from 'react';
import useFetchSize from '../../../../api/useFetchSize';
import { useNavigate } from 'react-router-dom';

const AddRoom = () => {

    const [size_id, setSize_id] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [statusroom, setStatusRoom] = useState('');
    const [img_thumbnail, setImg_thumbnail] = useState(null);

    const navigate = useNavigate();

    const storeUrl = "http://localhost:8000/api/rooms";

    const { sizes } = useFetchSize();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Tạo form data để gửi cả text và file ảnh
        const formData = new FormData();
        formData.append('price', price);
        formData.append('size_id', size_id);
        formData.append('description', description);
        formData.append('statusroom', statusroom);
        formData.append('img_thumbnail', img_thumbnail);

        try {
            const response = await fetch(storeUrl, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Phòng đã thêm thành công:', data);
                navigate('/admin');
            } else {
                console.error('Lỗi khi thêm phòng:', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi kết nối API:', error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto p-6 border border-gray-300 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Thêm Phòng Mới</h2>

            <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Giá:</label>
                <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="size_id" className="block text-sm font-medium text-gray-700">Size:</label>

                <select
                    id="size_id"
                    onChange={(e) => setSize_id(e.target.value)} 
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                >
                    <option value="">Chọn kích thước</option>
                    {sizes?.map((size) => (
                        <option key={size.id} value={size.id}>
                            {size.name}
                        </option>
                    ))}
                </select>

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
                <label htmlFor="statusroom" className="block text-sm font-medium text-gray-700">Trạng thái:</label>
                <input
                    type="text"
                    id="statusroom"
                    value={statusroom}
                    onChange={(e) => setStatusRoom(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="img_thumbnail" className="block text-sm font-medium text-gray-700">Hình Ảnh Chính:</label>
                <input
                    type="file"
                    id="img_thumbnail"
                    onChange={(e) => setImg_thumbnail(e.target.files[0])}
                    accept="img_thumbnail/*"
                    className="mt-1 block w-full text-gray-700 border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200"
            >
                Thêm Phòng
            </button>
        </form>
    );
};

export default AddRoom;
