import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddRole = () => {

    const [role_name, setRole_name] = useState('');
    const [description, setDescription] = useState('');

    const navigate = useNavigate();

    const storeUrl = "http://localhost:8000/api/roles";


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Tạo form data để gửi cả text và file ảnh
        const formData = new FormData();
        formData.append('role_name', role_name);
        formData.append('description', description);

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const response = await fetch(storeUrl, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Quyền đã thêm thành công:', data);
                navigate('/admin/roles');
            } else {
                console.error('Lỗi khi thêm quyền:', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi kết nối API:', error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto p-6 border border-gray-300 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Thêm Quyền Mới</h2>

            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên:</label>
                <input
                    type="text"
                    id="name"
                    value={role_name}
                    onChange={(e) => setRole_name(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
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

            <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200"
            >
                Thêm Quyền
            </button>
        </form>
    );
};

export default AddRole;
