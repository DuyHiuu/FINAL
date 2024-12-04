import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Select } from "antd";
import { EditOutlined } from "@ant-design/icons"; // Import icons
import useFetchReturnPay from "../../../../api/useFetchReturnPay";

const { Option } = Select;

const ReturnPayList = () => {
  const { returnPays } = useFetchReturnPay();
  const [searchStatus, setSearchStatus] = useState("");
  const [filteredData, setFilteredData] = useState(returnPays);

  const handleStatusChange = (value) => {
    setSearchStatus(value);
    const filtered = returnPays.filter((pay) =>
      value ? pay.status.toLowerCase() === value.toLowerCase() : true
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    setFilteredData(returnPays);
  }, [returnPays]);

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
      render: (text) => (
        <a href={`/admin/payments/detail/${text}`} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
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
            to={`/admin/returnPay/${record.pay_return_id}`}
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
        <h1 className="text-3xl font-bold text-gray-800">Danh Sách Hoàn Tiền</h1>
      </div>

      <div className="mb-4 flex space-x-4">
        <Select
          defaultValue=""
          style={{ width: 200 }}
          onChange={handleStatusChange}
          placeholder="Chọn trạng thái"
        >
          <Option value="">Tất cả</Option>
          <Option value="Đã hoàn tiền">Đã hoàn tiền</Option>
          <Option value="Chờ hoàn tiền">Chưa hoàn tiền</Option>
        </Select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default ReturnPayList;