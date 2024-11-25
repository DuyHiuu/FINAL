import React from "react";
import { Link } from "react-router-dom";
import { Table, Typography, Button, Badge, Spin } from "antd";
import useFetchPayments from "../../../../api/useFetchPayments";

const { Title } = Typography;

const RoomList = () => {
    const { payment, loading } = useFetchPayments();

    const columns = [
        {
            title: "ID Đơn Hàng",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Tên Khách Hàng",
            dataIndex: "user_name",
            key: "user_name",
        },
        {
            title: "Size Phòng",
            dataIndex: ["booking", "room", "size", "name"],
            key: "room_size",
        },
        {
            title: "Tổng Tiền (VND)",
            dataIndex: "total_amount",
            key: "total_amount",
            render: (text) => `${text.toLocaleString("vi-VN")} VND`,
        },
        {
            title: "Ngày Check-In",
            dataIndex: ["booking", "start_date"],
            key: "checkin_date",
            render: (text) => text.split("-").reverse().join("-"),
        },
        {
            title: "Trạng Thái",
            dataIndex: ["status", "status_name"],
            key: "status",
            render: (status, record) => (
                <Badge
                    color={
                        record.status_id === 1 ? "#fcd34d" :
                        record.status_id === 2 ? "#10b981" :
                        record.status_id === 4 ? "#10b981" :
                        record.status_id === 5 ? "#5F9EA0" :
                        record.status_id === 6 ? "#0000FF" :
                        record.status_id === 7 ? "#FF0000" : "gray"
                    }
                    text={status}
                />

            ),
        },
        {
            title: "Hành Động",
            key: "action",
            render: (_, record) => (
                <Link to={`/admin/payments/detail/${record.id}`}>
                    <Button type="primary">Chi tiết</Button>
                </Link>
            ),
        },
    ];

    return (
        <div className="container mx-auto p-6">
            <Title level={2} style={{ marginBottom: "1.5rem" }}>
                Danh Sách Đơn Hàng
            </Title>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", minHeight: "70vh", alignItems: "center" }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Table
                    dataSource={payment}
                    columns={columns}
                    rowKey="id"
                    bordered
                    pagination={{ pageSize: 10 }}
                    style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "8px" }}
                />
            )}
        </div>
    );
};

export default RoomList;
