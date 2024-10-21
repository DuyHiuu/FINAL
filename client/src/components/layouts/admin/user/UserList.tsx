import React from 'react';
import { Link } from 'react-router-dom';
import useFetchUsers from '../../../../api/useFetchUsers';

const UserList = () => {
    const { users, loading } = useFetchUsers();

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa Người dùng này?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8000/api/users/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                alert("Người dùng đã được xóa thành công");
                window.location.reload(); // Cập nhật sau khi xóa thành công
            } else {
                const errorData = await response.json();
                console.error("Xóa Người dùng thất bại:", errorData.message);
                alert(`Xóa Người dùng thất bại: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Đã xảy ra lỗi khi xóa Người dùng");
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Danh Sách Người Dùng</h1>
            </div>

            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-200 text-gray-600">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Tên</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Số Điện Thoại</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Địa Chỉ</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Vai Trò</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {Array.isArray(users) && users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 border-b">{user.name}</td>
                                        <td className="px-4 py-3 border-b">{user.email}</td>
                                        <td className="px-4 py-3 border-b">{user.phone}</td>
                                        <td className="px-4 py-3 border-b">{user.address}</td>
                                        <td className="px-4 py-3 border-b">{user.role_names}</td>
                                        <td className="px-4 py-3 border-b">
                                            <div className="flex items-center space-x-3">
                                                <Link
                                                    to={`/admin/users/edit/${user.id}`}
                                                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600 transition duration-200"
                                                >
                                                    Sửa
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition duration-200"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-4">Không có người dùng nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserList;