import React, { useState, useEffect } from "react";
import { Table, Input, Button, Pagination, Modal, Select } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const RatingList = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("rating");
  const [currentPage, setCurrentPage] = useState(1);
  const ratingsPerPage = 6;

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/api/ratings/list");
        setRatings(response.data.ratings);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError("Đã xảy ra lỗi khi lấy dữ liệu.");
      }
    };

    fetchRatings();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setFilterBy(filter);
  };

  const filterRating = (rating) => {
    let fieldValue = rating[filterBy];

    if (filterBy === "room") {
      fieldValue = rating.room ? rating.room.description : "";
    }

    if (typeof fieldValue === "string") {
      return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
    }

    if (filterBy === "rating" && typeof fieldValue === "number") {
      return fieldValue.toString().includes(searchTerm);
    }

    return false;
  };

  const filteredRatings = ratings
    ? ratings
      .filter(filterRating)
      .slice((currentPage - 1) * ratingsPerPage, currentPage * ratingsPerPage)
    : [];

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa đánh giá này?",
      onOk: async () => {
        try {
          const response = await axios.delete(`http://localhost:8000/api/ratings/${id}`);
          if (response.status === 200) {
            alert("Đánh giá đã được xóa thành công");
            setRatings(ratings.filter((rating) => rating.id !== id));
          }
        } catch (error) {
          alert("Đã xảy ra lỗi khi xóa đánh giá");
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
      title: "Phòng",
      dataIndex: ["room", "size", "name"],
      key: "room",
    },
    {
      title: "Sao",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <div>
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={index < rating ? "text-yellow-400" : "text-gray-300"}>
              ★
            </span>
          ))}
        </div>
      ),
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
        <h1 className="text-3xl font-bold text-gray-800">Danh Sách Đánh Giá</h1>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Input
          placeholder="Tìm kiếm theo sao, phòng hoặc nội dung..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: "100%", maxWidth: "300px" }}
        />

        <div className="flex items-center gap-2">
          <Button
            type={filterBy === "rating" ? "primary" : "default"}
            onClick={() => handleFilterChange("rating")}
          >
            Sao
          </Button>
          <Button
            type={filterBy === "room" ? "primary" : "default"}
            onClick={() => handleFilterChange("room")}
          >
            Phòng
          </Button>
          <Button
            type={filterBy === "content" ? "primary" : "default"}
            onClick={() => handleFilterChange("content")}
          >
            Nội dung
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredRatings}
        pagination={false}
        loading={loading}
        rowKey="id"
        bordered
      />

      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          pageSize={ratingsPerPage}
          total={ratings ? ratings.length : 0}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>

      {error && <div className="text-center text-red-600 mt-5">{error}</div>}
    </div>
  );
};

export default RatingList;