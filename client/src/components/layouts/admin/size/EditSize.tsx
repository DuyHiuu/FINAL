import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authClient from '../../../../api/authClient';

const EditSize = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tenSize, setTenSize] = useState('');
    const [moTa, setMoTa] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchSize = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/api/sizes/${id}`);
                if (response.ok) {
                    const size = await response.json();
                    setTenSize(size.data.name);
                    setMoTa(size.data.description);
                } else {
                    setErrorMessage('Không thể lấy thông tin size');
                }
            } catch (error) {
                setErrorMessage('Lỗi kết nối API');
            } finally {
                setLoading(false);
            }
        };

        fetchSize();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        const updatedSize = {
            name: tenSize,
            description: moTa,
        };

        try {
            const response = await authClient.put(`http://127.0.0.1:8000/api/sizes/${id}`, updatedSize);

            if (response.status === 200) {
                setSuccessMessage('Cập nhật size thành công!');
                setTimeout(() => {
                    navigate('/admin/sizes');
                }, 2000);
            } else {
                const errorData = await response.json();
                setErrorMessage(`Cập nhật size thất bại: ${errorData.message}`);
            }
        } catch (error) {
            setErrorMessage('Lỗi kết nối API');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <form
                onSubmit={handleSubmit}
                className="max-w-lg mx-auto p-6 border border-gray-300 rounded shadow-md bg-white"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Sửa Size Phòng</h2>

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
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200"
                >
                    {loading ? 'Đang cập nhật...' : 'Cập nhật Size'}
                </button>
            </form>
        </div>
    );
};

export default EditSize;
