import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditRole = () => {

    const showUrl = "http://localhost:8000/api/roles";
    const { id } = useParams();
    
    const [role_name, setRole_name] = useState('');
    const [description, setDescription] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const res = await fetch(`${showUrl}/${id}`);
                if (res.ok) {
                    const role = await res.json();
                    setRole_name(role.role_name);
                    setDescription(role.description);
                } else {
                    console.error('Không thể lấy thông tin phòng');
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchRole();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updateRole = {
            role_name:  role_name,
            description:  description,
        };
       


        try {
            const response = await fetch(`${showUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateRole),
            });

            if (response.ok) {
                console.log('Quyền đã sửa thành công:');
                navigate('/admin/roles');
            } else {
                console.error('Lỗi khi sửa quyền:', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi kết nối API:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 border border-gray-300 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Sửa Thông Tin Quyền</h2>

            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên:</label>
                <input
                    type="text"
                    id="role_name"
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
                Sửa
            </button>
        </form>
    );
};

export default EditRole;
