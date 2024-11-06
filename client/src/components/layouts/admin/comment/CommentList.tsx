import React, { useState } from "react";
import { Table, Input, Button, Pagination, Modal } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import useFetchComments from "../../../../api/useFetchComments";

const CommentList = () => {
  const { comments, loading, error } = useFetchComments();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("content");
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 6;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setFilterBy(filter);
  };

  const filterComment = (comment) => {
    let fieldValue = comment[filterBy];

    if (filterBy === "user") {
      fieldValue = comment.user ? comment.user.name : "";
    }

    if (filterBy === "created_at") {
      const date = new Date(comment.created_at);
      fieldValue = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    }

    if (typeof fieldValue === "string") {
      return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
    }

    return false;
  };

  const filteredComments = comments
    ? comments
        .filter(filterComment)
        .slice((currentPage - 1) * commentsPerPage, currentPage * commentsPerPage)
    : [];

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa bình luận này?",
      onOk: async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/comments/${id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            alert("Bình luận đã được xóa thành công");
            window.location.reload();
          } else {
            const errorData = await response.json();
            alert(`Xóa bình luận thất bại: ${errorData.message}`);
          }
        } catch (error) {
          alert("Đã xảy ra lỗi khi xóa bình luận");
        }
      },
    });
  };

  const columns = [
    {
      title: "Người dùng",
      dataIndex: ["user", "name"],
      key: "user",
      render: (text) => text || "Ẩn danh",
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
    },
    {
      title: "Loại phòng",
      dataIndex: ["room", "description"],
      key: "room",
      render: (text) => text || "Không có phòng",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => new Date(text).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
          onClick={() => handleDelete(record.id)}
          danger
        />
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Danh Sách Bình Luận</h1>
      </div>

      {/* Thanh tìm kiếm và lọc */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        {/* Thanh tìm kiếm */}
        <Input
          placeholder="Tìm kiếm bình luận..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: "100%", maxWidth: "300px" }}
        />

        {/* Nút lọc */}
        <div className="flex items-center gap-2">
          <Button
            type={filterBy === "content" ? "primary" : "default"}
            onClick={() => handleFilterChange("content")}
          >
            Nội dung
          </Button>
          <Button
            type={filterBy === "user" ? "primary" : "default"}
            onClick={() => handleFilterChange("user")}
          >
            Người dùng
          </Button>
          <Button
            type={filterBy === "created_at" ? "primary" : "default"}
            onClick={() => handleFilterChange("created_at")}
          >
            Ngày tạo
          </Button>
        </div>
      </div>

      {/* Bảng danh sách bình luận */}
      <Table
        columns={columns}
        dataSource={filteredComments}
        pagination={false}
        loading={loading}
        rowKey="id"
        bordered
      />

      {/* Phân trang */}
      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          pageSize={commentsPerPage}
          total={comments ? comments.length : 0}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>

      {error && <div className="text-center text-red-600 mt-5">{error}</div>}
    </div>
  );
};

export default CommentList;
