import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Table, Input, Button, Pagination, Modal, Spin } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import useFetchBlogs from "../../../../api/useFetchBlogs";
import authClient from "../../../../api/authClient";

const BlogList = () => {
  const { blog, loading } = useFetchBlogs(); // Sử dụng useFetchBlogs
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setFilterBy(filter);
  };

  const filterBlog = (item) => {
    let fieldValue = item[filterBy];
    if (typeof fieldValue === "string") {
      return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  };

  const filteredBlogs = blog ? blog.filter(filterBlog) : [];

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa bài viết này?",
      onOk: async () => {
        try {
          const response = await authClient.delete(`/blogs/${id}`);
          if (response.status === 200) {
            alert("Bài viết đã được xóa thành công");
            window.location.reload();
          } else {
            const errorData = await response.json();
            alert(`Xóa bài viết thất bại: ${errorData.message}`);
          }
        } catch (error) {
          alert("Đã xảy ra lỗi khi xóa bài viết");
        }
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? <img src={image} alt="blog thumbnail" className="w-20 h-20 object-cover rounded" /> : null,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Link to={`/admin/blogs/edit/${record.id}`}>
            <Button icon={<EditOutlined style={{ color: "#1890ff" }} />} />
          </Link>
          <Button
            icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
            danger
            onClick={() => handleDelete(record.id)}
          />
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Danh Sách Blog</h1>
        <Link to="/admin/blogs/add">
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm Bài Viết
          </Button>
        </Link>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        {/* Thanh tìm kiếm */}
        <Input
          placeholder="Tìm kiếm blog..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: "100%", maxWidth: "300px" }}
        />

        {/* Tabs Lọc */}
        <div className="flex items-center gap-2">
          <Button
            type={filterBy === "title" ? "primary" : "default"}
            onClick={() => handleFilterChange("title")}
          >
            Tiêu đề
          </Button>
          <Button
            type={filterBy === "description" ? "primary" : "default"}
            onClick={() => handleFilterChange("description")}
          >
            Mô tả
          </Button>
        </div>
      </div>

      {/* Bảng blog */}
      <Table
        columns={columns}
        dataSource={filteredBlogs.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage)}
        pagination={false}
        rowKey="id"
        bordered
      />

      {/* Phân trang */}
      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          pageSize={blogsPerPage}
          total={filteredBlogs.length}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default BlogList;
