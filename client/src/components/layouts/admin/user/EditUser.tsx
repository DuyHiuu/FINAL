import React, { useEffect, useState } from 'react';
import useFetchRoles from '../../../../api/admin/useFetchRole';
import { useNavigate, useParams } from 'react-router-dom';
import authClient from '../../../../api/authClient';

const EditUser = () => {
    const showUrl = "http://localhost:8000/api/users";
    const { id } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [role_id, setRole_id] = useState('');
    const { roles } = useFetchRoles();
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${showUrl}/${id}`);
                if (res.ok) {
                    const user = await res.json();
                    setName(user.name);
                    setEmail(user.email);
                    setPhone(user.phone);
                    setAddress(user.address);
                    setRole_id(user.role_id);
                } else if (res.status === 404) {
                    alert('Không tìm thấy người dùng');
                    navigate('/admin/users');
                } else {
                    alert('Không thể lấy thông tin người dùng');
                }
            } catch (error) {
                console.log('Lỗi kết nối:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');
        setErrorMessage('');
        const updateUser = { name, email, phone, role_id };

        setLoading(true);
        try {
            const response = await authClient.put(`http://127.0.0.1:8000/api/users/${id}`, updateUser);

            if (response.status === 200) {
                setSuccessMessage('Người dùng đã cập nhật thành công!');
                setTimeout(() => {
                    navigate('/admin/users');
                }, 2000);
            } else {
                const errorData = await response.json();
                if (errorData.errors) {
                    setErrors(errorData.errors);
                } else {
                    alert(`Lỗi: ${errorData.message}`);
                }
            }
        } catch (error) {
            console.error('Lỗi kết nối API:', error);
            alert('Đã xảy ra lỗi khi cập nhật người dùng');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-8 bg-white border border-gray-300 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sửa Thông Tin Người Dùng</h2>

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

                <div className="mb-6">
                    <label htmlFor="name" className="block text-lg font-semibold text-gray-700">Tên:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled
                        className="mt-2 block w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-500 shadow-sm"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
                </div>

                <div className="mb-6">
                    <label htmlFor="email" className="block text-lg font-semibold text-gray-700">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled
                        className="mt-2 block w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-500 shadow-sm"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
                </div>

                <div className="mb-6">
                    <label htmlFor="phone" className="block text-lg font-semibold text-gray-700">Số Điện Thoại:</label>
                    <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled
                        className="mt-2 block w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-500 shadow-sm"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>}
                </div>

                <div className="mb-6">
                    <label htmlFor="address" className="block text-lg font-semibold text-gray-700">Địa chỉ:</label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled
                        className="mt-2 block w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-500 shadow-sm"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address[0]}</p>}
                </div>

                <div className="mb-6">
                    <label htmlFor="role_id" className="block text-lg font-semibold text-gray-700">Vai Trò:</label>
                    <select
                        id="role_id"
                        value={role_id}
                        onChange={(e) => setRole_id(e.target.value)}
                        className="mt-2 block w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring focus:ring-blue-500 shadow-sm"
                        required
                    >
                        <option value="">Chọn vai trò</option>
                        {roles?.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.role_name}
                            </option>
                        ))}
                    </select>
                    {errors.role_id && <p className="text-red-500 text-sm mt-1">{errors.role_id[0]}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg"
                >
                    {loading ? 'Đang cập nhật...' : 'Cập Nhật'}
                </button>
            </form>
        </div>
    );
};

export default EditUser;
