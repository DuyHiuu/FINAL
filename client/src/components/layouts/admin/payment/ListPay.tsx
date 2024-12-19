import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Typography, Button, Badge, Spin, Input, Select, DatePicker, Row, Col, Modal, message } from "antd";
import moment from "moment";
import useFetchPay from "../../../../api/admin/useFetchPay";
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ListPay = () => {
    const { payment, loading } = useFetchPay();

    const [searchSize, setSearchSize] = useState("");
    const [searchDate, setSearchDate] = useState([]);
    const [searchStatus, setSearchStatus] = useState("");
    const [searchOrderId, setSearchOrderId] = useState("");
    const [searchPaymentMethod, setSearchPaymentMethod] = useState("");
    const [searchUser, setSearchUser] = useState("");
    const [changedRoomHistory, setChangedRoomHistory] = useState([]);

    const filteredPayments = payment?.filter((item) => {
        const matchesOrderId = searchOrderId
            ? item?.id.toString().includes(searchOrderId)
            : true;

        const matchesSize = searchSize
            ? item?.booking.room.size.id === parseInt(searchSize)
            : true;

        const matchesDate = searchDate[0] && searchDate[1]
            ? moment(item?.booking.start_date).isSame(moment(searchDate[0]), "day")
            || moment(item?.booking.end_date).isSame(moment(searchDate[1]), "day")
            : true;

        const matchesStatus = searchStatus
            ? item?.status_id === parseInt(searchStatus)
            : true;

        const matchesPaymentMethod = searchPaymentMethod
            ? item?.paymethod_id === parseInt(searchPaymentMethod)
            : true;

        const matchesUser = searchUser
            ? item?.user_name.toLowerCase().includes(searchUser.toLowerCase())
            : true;

        return matchesOrderId && matchesSize && matchesDate && matchesStatus && matchesPaymentMethod && matchesUser;
    });

    const handleOrderIdChange = (e) => {
        setSearchOrderId(e.target.value);
    };

    const handleSizeChange = (value) => {
        setSearchSize(value);
    };

    const handleStartDateChange = (date) => {
        if (date) {
            setSearchDate([date.format("YYYY-MM-DD"), searchDate[1]]);
        } else {
            setSearchDate([null, searchDate[1]]);
        }
    };

    const handleEndDateChange = (date) => {
        if (date) {
            setSearchDate([searchDate[0], date.format("YYYY-MM-DD")]);
        } else {
            setSearchDate([searchDate[0], null]);
        }
    };

    const handleStatusChange = (value) => {
        setSearchStatus(value);
    };

    const handlePaymentMethodChange = (value) => {
        setSearchPaymentMethod(value);
    };

    const handleUserChange = (e) => {
        setSearchUser(e.target.value);
    };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const showModal = (payment_id) => {
        setSelectedPaymentId(payment_id);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        const fetchChangedRoomHistory = async (payment_id) => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/api/payments/room_history/${payment_id}`);
                const data1 = await response.json();
                setChangedRoomHistory(data1);
                console.log(data1);

            } catch (error) {
                message.error("Lỗi: " + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (selectedPaymentId) {
            fetchChangedRoomHistory(selectedPaymentId);
        }
    }, [selectedPaymentId]);

    const statusOptions = [
        { id: 2, name: "Đã đặt phòng" },
        { id: 4, name: "Thanh toán thành công" },
        { id: 5, name: "Đã check-in" },
        { id: 6, name: "Đã check-out" },
        { id: 7, name: "Đã hủy" },
    ];

    const paymentMethodOptions = [
        { id: 2, name: "Thanh toán tại cửa hàng" },
        { id: 1, name: "Thanh toán online" },
    ];

    const columns = [
        {
            title: "ID Đơn Hàng",
            dataIndex: "id",
            key: "id",
            render: (text) => `Order-${text.toString()}`,
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
            render: (text, record) => (
                <div>
                    {text}
                    {record.changed_room == 1 && (
                        <div className="relative group" onClick={() => showModal(record?.id)}>
                            <div className="w-3 h-3 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold cursor-pointer">
                                !
                            </div>
                            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-max px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Đã đổi phòng
                            </div>
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "Tổng Tiền (VND)",
            dataIndex: "total_amount",
            key: "total_amount",
            render: (text) => `${parseInt(text, 10).toLocaleString("vi-VN")} VND`,
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
                        record.status_id === 1
                            ? "#fcd34d"
                            : record.status_id === 2
                                ? "#10b981"
                                : record.status_id === 4
                                    ? "#10b981"
                                    : record.status_id === 5
                                        ? "#5F9EA0"
                                        : record.status_id === 6
                                            ? "#0000FF"
                                            : record.status_id === 7
                                                ? "#FF0000"
                                                : "gray"
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

            <Row gutter={[16, 16]} style={{ marginBottom: "1.5rem" }}>
                <Col xs={24} sm={12} lg={6}>
                    <Input
                        placeholder="Tìm kiếm theo ID đơn hàng"
                        value={searchOrderId}
                        onChange={handleOrderIdChange}
                    />
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Select
                        placeholder="Tìm kiếm theo size phòng"
                        style={{ width: "100%" }}
                        onChange={handleSizeChange}
                        allowClear
                    >
                        <Option value="1">Size S</Option>
                        <Option value="2">Size M</Option>
                        <Option value="3">Size L</Option>
                        <Option value="4">Size XL</Option>
                    </Select>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <DatePicker
                        style={{ width: "100%" }}
                        format="YYYY-MM-DD"
                        value={searchDate[0] ? moment(searchDate[0]) : null}
                        onChange={handleStartDateChange}
                        placeholder="Chọn ngày bắt đầu"
                    />
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <DatePicker
                        style={{ width: "100%" }}
                        format="YYYY-MM-DD"
                        value={searchDate[1] ? moment(searchDate[1]) : null}
                        onChange={handleEndDateChange}
                        placeholder="Chọn ngày kết thúc"
                    />
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Select
                        placeholder="Lọc theo trạng thái"
                        style={{ width: "100%" }}
                        onChange={handleStatusChange}
                        allowClear
                    >
                        {statusOptions.map((status) => (
                            <Option key={status.id} value={status.id}>
                                {status.name}
                            </Option>
                        ))}
                    </Select>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Select
                        placeholder="Tìm kiếm theo phương thức thanh toán"
                        style={{ width: "100%" }}
                        onChange={handlePaymentMethodChange}
                        allowClear
                    >
                        {paymentMethodOptions.map((method) => (
                            <Option key={method.id} value={method.id}>
                                {method.name}
                            </Option>
                        ))}
                    </Select>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Input
                        placeholder="Tìm kiếm theo tên người dùng"
                        value={searchUser}
                        onChange={handleUserChange}
                    />
                </Col>
            </Row>

            <a href="/admin/add_pay_ad" className="text-blue-500">
                Tạo hóa đơn cho khách đặt phòng trực tiếp tại cửa hàng</a>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", minHeight: "70vh", alignItems: "center" }}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <Table
                        dataSource={filteredPayments}
                        columns={columns}
                        rowKey="id"
                        bordered
                        pagination={{ pageSize: 10 }}
                        style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "8px" }}
                    />

                    <Modal
                        title="Lịch sử đổi phòng"
                        visible={isModalVisible}
                        onOk={handleOk}
                    >
                        {isLoading ? (
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Spin size="large" />
                            </div>
                        ) : (
                            <>
                                <p>Phòng cũ: {changedRoomHistory?.history?.oldRoomId}</p>
                                <p>Phòng mới: {changedRoomHistory?.history?.newRoomId}</p>
                                <p>Số tiền phải trả thêm: {parseInt(changedRoomHistory?.history?.difference, 10).toLocaleString("vi-VN")} VND
                                </p>
                            </>
                        )}
                    </Modal>
                </>

            )}
        </div>
    );
};

export default ListPay;