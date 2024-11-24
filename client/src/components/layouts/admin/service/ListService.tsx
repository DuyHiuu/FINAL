import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input, Button, Table, Pagination, message } from "antd";
import { FaSearch } from "react-icons/fa";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import useFetchServices from "../../../../api/useFetchServices";
import authClient from "../../../../api/authClient";

const ListService = () => {
  const { service, loading, error } = useFetchServices();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 3;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setFilterBy(filter);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa dịch vụ này?"
    );
    if (!confirmDelete) return;

    try {
      const response = await authClient.delete(`/services/${id}`); 
      if (response.status === 200) {
        message.success("Dịch vụ đã được xóa thành công");
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Xóa dịch vụ thất bại:", errorData.message);
        message.error(`Xóa dịch vụ thất bại: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      message.error("Đã xảy ra lỗi khi xóa dịch vụ");
    }
  };

  const filteredServices = service?.filter((item) => {
    let fieldValue = item[filterBy];
    if (typeof fieldValue === "string") {
      return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (typeof fieldValue === "number") {
      return fieldValue.toString().includes(searchTerm);
    }
    return false;
  });

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices?.slice(
    indexOfFirstService,
    indexOfLastService
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image}
          alt="service"
          className="w-20 h-20 object-cover rounded"
        />
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString("vi-VN")} VND`,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hành Động",
      key: "action",
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <Link
            to={`/admin/services/edit/${record.id}`}
            className="text-yellow-500"
          >
            <EditOutlined />
          </Link>
          <Button
            onClick={() => handleDelete(record.id)}
            className="text-red-500"
            icon={<DeleteOutlined />}
            danger
          />
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Danh Sách Dịch Vụ</h1>
        <Link
          to="/admin/services/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Thêm Dịch Vụ
        </Link>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        {/* Thanh tìm kiếm */}
        <div className="relative flex-1">
          <Input
            prefix={<FaSearch className="text-gray-500" />}
            placeholder="Tìm kiếm dịch vụ..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
          />
        </div>

        {/* Tabs Lọc */}
        <div className="flex items-center gap-2 border-b-2 border-gray-300">
          <Button
            onClick={() => handleFilterChange("name")}
            type={filterBy === "name" ? "primary" : "text"}
          >
            Tên dịch vụ
          </Button>
          <Button
            onClick={() => handleFilterChange("price")}
            type={filterBy === "price" ? "primary" : "text"}
          >
            Giá
          </Button>
          <Button
            onClick={() => handleFilterChange("description")}
            type={filterBy === "description" ? "primary" : "text"}
          >
            Mô tả
          </Button>
        </div>
      </div>

      {/* Danh sách dịch vụ dưới dạng bảng */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <Table
          columns={columns}
          dataSource={currentServices}
          loading={loading}
          pagination={false}
          rowKey="id"
        />
      </div>

      {/* Phân trang */}
      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          total={filteredServices?.length}
          pageSize={servicesPerPage}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ListService;
