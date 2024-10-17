import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditRole = () => {
    const showUrl = "http://localhost:8000/api/roles";
    const { id } = useParams();

    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRole = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${showUrl}/${id}`);
                if (res.ok) {
                    const role = await res.json();
                    setRoleName(role.role_name);
                    setDescription(role.description);
                } else {
                    setErrorMessage('Không thể lấy thông tin quyền');
                }
            } catch (error) {
                setErrorMessage('Đã xảy ra lỗi khi kết nối API');
            } finally {
                setLoading(false);
            }
        };
        fetchRole();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        const updateRole = {
            role_name: roleName,
            description: description,
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
                setSuccessMessage('Quyền đã sửa thành công!');
                setTimeout(() => {
                    navigate('/admin/roles');
                }, 2000);
            } else {
                const errorData = await response.json();
                setErrorMessage(`Lỗi khi sửa quyền: ${errorData.message}`);
            }
        } catch (error) {
            setErrorMessage('Lỗi kết nối API');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 border border-gray-300 rounded shadow-md bg-white">
                <h2 className="text-2xl font-bold mb-4 text-center">Sửa Thông Tin Quyền</h2>

                {successMessage && (
                    <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                        {errorMessage}
                    </div>
                )}

                <div className="mb-4">
                    <label htmlFor="role_name" className="block text-sm font-medium text-gray-700">Tên:</label>
                    <input
                        type="text"
                        id="role_name"
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
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200"
                >
                    {loading ? 'Đang sửa...' : 'Sửa'}
                </button>
            </form>
        </div>
    );
};

export default EditRole;
