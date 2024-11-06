import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Table, Input, Button, message, Pagination, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"; // Import icons
import useFetchSize from "../../../../api/useFetchSize";

const SizeList = () => {
  const { sizes, loading } = useFetchSize();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sizesPerPage] = useState(5); // Số lượng size trên mỗi trang

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  // Hàm lọc size dựa trên tên và miêu tả
  const filteredSizes = sizes?.filter(
    (size) =>
      size.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      size.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const indexOfLastSize = currentPage * sizesPerPage;
  const indexOfFirstSize = indexOfLastSize - sizesPerPage;
  const currentSizes = filteredSizes?.slice(indexOfFirstSize, indexOfLastSize);

  const totalPages = Math.ceil(filteredSizes?.length / sizesPerPage);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa size này?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/sizes/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        message.success("Size đã được xóa thành công");
        setCurrentPage(1); // Reset lại trang khi xóa thành công
      } else {
        const errorData = await response.json();
        console.error("Xóa size thất bại:", errorData.message);
        message.error(`Xóa size thất bại: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      message.error("Đã xảy ra lỗi khi xóa size");
    }
  };

  // Hàm chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Cấu hình cột bảng
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => indexOfFirstSize + index + 1, // Tính số thứ tự
    },
    {
      title: "Tên size",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Miêu tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          {/* Sửa size */}
          <Link
            to={`/admin/sizes/${record.id}`}
            className="text-yellow-500 hover:text-yellow-600"
          >
            <EditOutlined style={{ fontSize: 20 }} />
          </Link>

          {/* Xóa size */}
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa size này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              style={{ border: "none" }}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Danh Sách Size</h1>
        <Link
          to="/admin/sizes/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Thêm Size
        </Link>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="mb-4">
        <Input
          placeholder="Tìm kiếm theo tên hoặc miêu tả"
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
            dataSource={currentSizes}
            rowKey="id"
            pagination={false} // Tắt phân trang trong Table
          />
        </div>
      )}

      {/* Phân trang */}
      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          pageSize={sizesPerPage}
          total={filteredSizes?.length}
          onChange={handlePageChange}
          showSizeChanger={false} // Ẩn chức năng thay đổi số lượng item trên mỗi trang
        />
      </div>
    </div>
  );
};

export default SizeList;
