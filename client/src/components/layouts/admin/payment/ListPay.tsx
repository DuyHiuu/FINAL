import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Table, Typography, Button, Badge, Spin, Input, Select, DatePicker, Row, Col } from "antd";
import useFetchPayments from "../../../../api/useFetchPayments";
import moment from "moment";

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const RoomList = () => {
    const { payment, loading } = useFetchPayments();

    // State lưu trữ giá trị tìm kiếm
    const [searchSize, setSearchSize] = useState("");
    const [searchDate, setSearchDate] = useState([]);
    const [searchStatus, setSearchStatus] = useState("");

    // Lọc dữ liệu
    const filteredPayments = payment?.filter((item) => {
        // Lọc theo size
        const matchesSize = searchSize
            ? item.booking.room.size.name?.toLowerCase().includes(searchSize.toLowerCase())
            : true;

        // Lọc theo ngày check-in
        const matchesDate = searchDate.length
            ? moment(item.booking.start_date).isBetween(searchDate[0], searchDate[1], "day", "[]")
            : true;

        // Lọc theo trạng thái
        const matchesStatus = searchStatus
            ? item.status.status_name === searchStatus
            : true;

        return matchesSize && matchesDate && matchesStatus;
    });

    const handleSizeChange = (e) => {
        setSearchSize(e.target.value);
    };

    const handleDateChange = (dates) => {
        setSearchDate(dates ? [dates[0].startOf("day"), dates[1].endOf("day")] : []);
    };

    const handleStatusChange = (value) => {
        setSearchStatus(value);
    };

    const statusOptions = [
        { id: 1, name: "Chờ xác nhận" },
        { id: 2, name: "Đã xác nhận" },
        { id: 4, name: "Đã check-in" },
        { id: 5, name: "Đã check-out" },
       
    ];

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

            {/* Thanh tìm kiếm */}
            <Row gutter={[16, 16]} style={{ marginBottom: "1.5rem" }}>
                {/* Tìm kiếm theo Size */}
                <Col xs={24} sm={12} lg={6}>
                    <Input
                        placeholder="Tìm kiếm theo size phòng"
                        value={searchSize}
                        onChange={handleSizeChange}
                    />
                </Col>

                {/* Tìm kiếm theo ngày check-in */}
                <Col xs={24} sm={12} lg={8}>
                    <RangePicker
                        style={{ width: "100%" }}
                        format="YYYY-MM-DD"
                        onChange={handleDateChange}
                    />
                </Col>

                {/* Tìm kiếm theo trạng thái */}
                <Col xs={24} sm={12} lg={6}>
                    <Select
                        placeholder="Lọc theo trạng thái"
                        style={{ width: "100%" }}
                        onChange={handleStatusChange}
                        allowClear
                    >
                        {statusOptions.map((status) => (
                            <Option key={status.id} value={status.name}>
                                {status.name}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </Row>

            {/* Bảng hiển thị */}
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", minHeight: "70vh", alignItems: "center" }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Table
                    dataSource={filteredPayments}
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
