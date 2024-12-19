import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Button, message, Popconfirm, Checkbox } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import authClient from "../../../../api/authClient";

const RoomList = () => {
  const [room, setRoom] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sizeFilter, setSizeFilter] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/rooms/booked");
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu phòng.");
        }
        const data = await response.json();
        setRoom(data);
      } catch (err) {
        setError("Không thể lấy dữ liệu phòng.");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return <div className="text-center text-red-600 mt-5">{error}</div>;

  const handleSizeChange = (checkedValues) => {
    setSizeFilter(checkedValues);
  };

  // Hàm xóa phòng
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa phòng này?");
    if (!confirmDelete) return;

    try {
      const response = await authClient.delete(`/rooms/${id}`);
      if (response.status === 200) {
        message.success("Phòng đã được xóa thành công");
        window.location.reload();
      } else {
        message.error("Xóa phòng thất bại");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      if (error.response && error.response.status === 401) {
        message.error("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        message.error("Đã xảy ra lỗi khi xóa phòng");
      }
    }
  };

  const filteredRooms = sizeFilter.length > 0
    ? room.filter((r) => sizeFilter.includes(r.size_name))
    : room;

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Hình Ảnh",
      dataIndex: "img_thumbnail",
      key: "img_thumbnail",
      render: (text) => (
        <img src={text} alt="Room Thumbnail" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: "8px" }} />
      ),
    },
    {
      title: "Size Phòng",
      dataIndex: "size_name",
      key: "size_name",
    },
    {
      title: "Giá (VND)",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      sortDirections: ['ascend', 'descend'],
      render: (text) => `${text.toLocaleString("vi-VN")} VND`,
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: "Đang Đặt",
      dataIndex: "booked_quantity",
      key: "booked_quantity",
      sorter: (a, b) => a.booked_quantity - b.booked_quantity,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: "Trạng Thái",
      dataIndex: "statusroom",
      key: "statusroom",
      render: (text, record) => {
        const status = record.quantity - record.booked_quantity === 0 ? "Hết phòng" : "Còn phòng";
        return (
          <span
            className={`px-2 py-1 rounded text-sm ${status === "Còn phòng" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: "Hành Động",
      key: "action",
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <Link
            to={`/admin/rooms/edit/${record.id}`}
            className="text-yellow-500 hover:text-yellow-600"
          >
            <EditOutlined style={{ fontSize: 18 }} />
          </Link>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa phòng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button danger type="text" icon={<DeleteOutlined style={{ fontSize: 18 }} />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const sizeOptions = [...new Set(room.map((r) => r.size_name))];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Danh Sách Phòng</h1>
        <Link
          to="/admin/rooms/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Thêm Phòng
        </Link>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Tìm kiếm theo kích thước</h3>
        <Checkbox.Group
          options={sizeOptions}
          value={sizeFilter}
          onChange={handleSizeChange}
        />
      </div>

      {/* Bảng phòng */}
      <Table
        columns={columns}
        dataSource={filteredRooms}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default RoomList;