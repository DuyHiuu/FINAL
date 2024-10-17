import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddRole = () => {
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const storeUrl = "http://localhost:8000/api/roles";

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('role_name', roleName);
        formData.append('description', description);

        setIsLoading(true); // Bắt đầu loading

        try {
            const response = await fetch(storeUrl, {
                method: 'POST',
                body: formData,
            });

            setIsLoading(false); // Kết thúc loading

            if (response.ok) {
                const data = await response.json();
                console.log('Quyền đã thêm thành công:', data);
                setMessage("Quyền đã được thêm thành công!");
                setTimeout(() => {
                    navigate('/admin/roles');
                }, 2000); // Chuyển hướng sau 2 giây
            } else {
                const errorData = await response.json();
                console.error('Lỗi khi thêm quyền:', errorData.message);
                setMessage(`Thêm quyền thất bại: ${errorData.message}`);
            }
        } catch (error) {
            setIsLoading(false); // Kết thúc loading
            console.error('Lỗi kết nối API:', error);
            setMessage("Đã xảy ra lỗi khi thêm quyền.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Thêm Quyền Mới</h2>

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
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
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
                    disabled={isLoading} // Vô hiệu hóa nút khi đang loading
                    className={`w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200 ${isLoading ? 'bg-gray-400' : ''}`}
                >
                    {isLoading ? "Đang thêm..." : "Thêm Quyền"}
                </button>
            </form>
        </div>
    );
};

export default AddRole;
