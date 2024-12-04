import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Table, Input, Button, message, Pagination, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"; // Import icons
import useFetchReturnPay from "../../../../api/useFetchReturnPay";

const ReturnPayList = () => {
  const { returnPays } = useFetchReturnPay();
  const [searchTerm, setSearchTerm] = useState("");

  console.log(returnPays);

  const columns = [
    {
      title: "ID",
      dataIndex: "pay_return_id",
      key: "pay_return_id",
    },
    {
      title: "ID Đơn Hàng",
      dataIndex: ["payment", "payment_id"],
      key: ["payment", "payment_id"],
    },
    {
      title: "Tên khách hàng",
      dataIndex: ["payment", "user", "name"],
      key: ["payment", "user", "name"],
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      render: (text) => `${parseInt(text, 10).toLocaleString("vi-VN")} VNĐ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="">
          <Link
            to={`/admin//${record.id}`}
            className="text-yellow-500 hover:text-yellow-600"
          >
            <EditOutlined style={{ fontSize: 20 }} />
          </Link>
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
          className="w-full"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <Table
          columns={columns}
          dataSource={returnPays}
          rowKey="id"
          pagination={false} // Tắt phân trang trong Table
        />
      </div>
    </div>
  );
};

export default ReturnPayList;