import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Input, Button, message, Popconfirm, Pagination, Switch } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import useFetchUsers from '../../../../api/useFetchUsers';
import authClient from '../../../../api/authClient';

const UserList = () => {
    const { users, loading } = useFetchUsers();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10; // Số lượng người dùng trên mỗi trang

    // Hàm xử lý tìm kiếm
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
    };

    // Lọc người dùng dựa trên tên, email hoặc số điện thoại
    const filteredUsers = users?.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Phân trang
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers?.length / usersPerPage);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa Người dùng này?");
        if (!confirmDelete) return;

        try {
            const response = await authClient.delete(`/users/${id}`);
            if (response.status === 200) {
                message.success("Người dùng đã được xóa thành công");
                setCurrentPage(1); // Reset lại trang khi xóa thành công
            } else {
                const errorData = await response.json();
                message.error(`Xóa Người dùng thất bại: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Lỗi:", error);
            message.error("Đã xảy ra lỗi khi xóa Người dùng");
        }
    };

    // Hàm chuyển trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Cấu hình cột bảng
    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Địa Chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Vai Trò',
            dataIndex: 'role_names',
            key: 'role_names',
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (text, record) => (
                <div className="flex items-center space-x-3">
                    {/* Biểu tượng sửa */}
                    <Link
                        to={`/admin/users/edit/${record.id}`}
                        className="text-yellow-500 hover:text-yellow-600"
                    >
                        <EditOutlined />
                    </Link>

                    {/* Nút bật/tắt xóa */}
                    <Switch
                        checkedChildren={<DeleteOutlined />}
                        unCheckedChildren="Xóa"
                        onChange={(checked) => {
                            if (checked) {
                                handleDelete(record.id); // Xóa khi bật
                            }
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Danh Sách Người Dùng</h1>
            </div>

            {/* Thanh tìm kiếm */}
            <div className="mb-4">
                <Input
                    placeholder="Tìm kiếm theo tên, email hoặc số điện thoại"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full"
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                    <Table
                        columns={columns}
                        dataSource={currentUsers}
                        rowKey="id"
                        pagination={false} // Tắt phân trang trong Table
                    />
                </div>
            )}

            {/* Phân trang */}
            <div className="flex justify-center mt-4">
                <Pagination
                    current={currentPage}
                    pageSize={usersPerPage}
                    total={filteredUsers?.length}
                    onChange={handlePageChange}
                    showSizeChanger={false} // Ẩn chức năng thay đổi số lượng item trên mỗi trang
                />
            </div>
        </div>
    );
};

export default UserList;
