import React, { useEffect, useState } from "react";
import { Form, Input, Button, Spin, Typography, message, Card, Row, Col, DatePicker, Divider } from "antd";
import { useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { ArrowLeftOutlined } from "@ant-design/icons";
import moment from "moment";

const { Title, Text } = Typography;

const PayReturn = () => {
    const showUrl = "http://localhost:8000/api/payments";
    const [data, setData] = useState(null);
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${showUrl}/${id}`, {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!res.ok) {
                    throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
                }
                const data = await res.json();
                setData(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [id]);

    if (!data) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white fixed top-0 left-0 w-full h-full z-50">
                <PulseLoader color="#33CCFF" size={15} margin={2} />
            </div>
        );
    }

    const paymentData = data.payment;
    const servicesData = paymentData.service;
    const bookingData = paymentData.booking;
    const sizeData = paymentData.size;
    const voucherData = paymentData.voucher;


    const handleSubmit = async (values: any) => {
        setLoading(true);

        const requestData = {
            bank_name: values.bank_name,
            bank_type_name: values.bank_type_name,
            bank_seri: values.bank_seri,
            payment_id: id,
            amount: paymentData?.payment?.total_amount,
        };

        try {
            const response = await fetch(`${showUrl}/return_pay`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Có lỗi xảy ra!");
            }

            const url = `/history2/${id}`;

            window.location.href = url;

        } catch (error) {
            message.error("Đã có lỗi xảy ra. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between max-w-7xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg mt-24">
            <div className="w-full lg:w-1/2 p-6 flex flex-col space-y-4 mx-auto">
                <Title level={2}>Yêu cầu hoàn tiền</Title>
                <Text className="text-lg" style={{ color: 'red' }}>
                    Vui lòng điền đầy đủ thông tin vào mẫu dưới đây:
                </Text>

                <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="flex flex-col space-y-4 mt-4"
                >
                    <Form.Item
                        name="bank_name"
                        label="Tên chủ tài khoản"
                        rules={[{ required: true, message: "Vui lòng nhập tên chủ tài khoản!" }]}
                    >
                        <Input
                            placeholder="NGUYEN VAN A"
                            className="border border-gray-300 p-3 rounded-lg"
                        />
                    </Form.Item>
                    <Form.Item
                        name="bank_seri"
                        label="Số tài khoản ngân hàng"
                        rules={[{ required: true, message: "Vui lòng nhập số tài khoản ngân hàng của bạn!" },
                        { pattern: /^[0-9]+$/, message: "Số tài khoản phải là số!" }
                        ]}
                    >
                        <Input
                            placeholder="0123456789"
                            className="border border-gray-300 p-3 rounded-lg"
                        />
                    </Form.Item>
                    <Form.Item
                        name="bank_type_name"
                        label="Ngân hàng của bạn"
                        rules={[{ required: true, message: "Vui lòng nhập ngân hàng của bạn!" }]}
                    >
                        <Input
                            placeholder="MB"
                            className="border border-gray-300 p-3 rounded-lg"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <Spin size="small" />
                                </div>
                            ) : (
                                "Gửi"
                            )}
                        </Button>

                    </Form.Item>
                </Form>
                <Button
                    type="primary"
                    style={{ width: '100px' }}
                    icon={<ArrowLeftOutlined />}
                    href={`/history2/${id}`}
                    className="bg-[#064749]"
                >
                    Quay lại
                </Button>
            </div>

            <div className="lg:w-1/3 p-4 mt-20 border rounded-lg shadow-lg mx-auto bg-white h-full">
                <Card>

                    <Title level={4}>Thông tin đơn hàng</Title>

                    <Divider />

                    <Row gutter={16}>
                        <span className="font-semibold">{sizeData}</span>
                    </Row>

                    <Divider />

                    <Row gutter={16}>
                        <Col span={12}>
                            <label htmlFor="">Ngày check-in</label>
                            <DatePicker
                                value={moment(bookingData?.start_date)}
                                disabled
                                style={{ width: "100%", marginTop: '5px' }}
                            />
                        </Col>
                        <Col span={12}>
                            <label htmlFor="">Ngày check-out</label>
                            <DatePicker
                                value={moment(bookingData?.end_date)}
                                disabled
                                style={{ width: "100%", marginTop: '5px' }}
                            />
                        </Col>
                    </Row>

                    <Divider />
                    <h3 className="text-left font-semibold">
                        Dịch vụ kèm thêm
                    </h3>
                    <div className="mt-2">
                        {Array.isArray(servicesData) && servicesData.length > 0 ? (
                            servicesData?.map((item) => (
                                <div
                                    key={item?.id}
                                >
                                    <label className="flex items-center mb-2">
                                        <input readOnly
                                            type="checkbox"
                                            className="mr-2 appearance-none bg-[#064749] border-2 rounded-full w-4 h-4 cursor-pointer"
                                        />
                                        <span>{item.name} ({item.price.toLocaleString("vi-VN")} VNĐ)
                                            {item.id === 2
                                                ? `x ${Math.floor(
                                                    moment(bookingData?.end_date).diff(
                                                        moment(bookingData?.start_date),
                                                        'days'
                                                    ) / 3
                                                )}`
                                                : ""}
                                        </span>
                                    </label>
                                </div>
                            ))
                        ) : (
                            <Text className="text-gray-500">Không sử dụng dịch vụ.</Text>
                        )}
                    </div>

                    <Divider />

                    <h3 className="text-left font-semibold">
                        Voucher
                    </h3>
                    {voucherData ? (
                        <div className="mt-2">
                            <label className="flex items-center mb-2">
                                <input
                                    readOnly
                                    type="checkbox"
                                    className="mr-2 appearance-none bg-[#064749] border-2 rounded-full w-4 h-4 cursor-pointer"
                                />
                                <span>
                                    {voucherData.code} - {voucherData.name}
                                </span>
                            </label>
                        </div>
                    ) : (
                        <div className="mt-2">
                            <span>Không sử dụng voucher</span>
                        </div>
                    )}


                    <Divider />
                    <Row gutter={16} className="mt-4">
                        <Col span={12}>
                            <Text strong>Trạng thái:</Text>
                        </Col>
                        <Col span={12} className="text-right">
                            <div
                                className="inline-flex items-center px-2 py-3 rounded-full"
                                style={{
                                    backgroundColor:
                                        paymentData.payment?.status?.id === 1 ? "#fcd34d" :
                                            paymentData.payment?.status?.id === 2 ? "#10b981" :
                                                paymentData.payment?.status?.id === 4 ? "#10b981" :
                                                    paymentData.payment?.status?.id === 5 ? "#5F9EA0" :
                                                        paymentData.payment?.status?.id === 6 ? "#0000FF" :
                                                            paymentData.payment?.status?.id === 7 ? "#FF0000" : "#e5e7eb",
                                }}
                            >
                                <Text
                                    className="text-sm"
                                    style={{
                                        color: "#fff",
                                    }}
                                >
                                    {paymentData.payment?.status?.status_name}
                                </Text>
                            </div>

                        </Col>
                    </Row>

                    <Row gutter={16} className="mt-4">
                        <Col span={12}>
                            <Text strong>Tổng:</Text>
                        </Col>
                        <Col span={12} className="text-right">
                            <Text className="font-bold">
                                {Math.trunc(paymentData.payment.total_amount).toLocaleString("vi-VN")} VNĐ
                            </Text>
                        </Col>
                    </Row>

                </Card>
            </div>
        </div>
    );
};

export default PayReturn;