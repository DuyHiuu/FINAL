import React, { useState } from "react";
import { Form, Input, Button, Spin, Typography, message } from "antd";
import { MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PayReturn = () => {
    const [loading, setLoading] = useState(false);
    const handleSubmit = (values: any) => {
        setLoading(true);

        // Giả lập gửi yêu cầu hoàn tiền
        setTimeout(() => {
            message.success("Yêu cầu hoàn tiền đã được gửi!");
            setLoading(false); // Kết thúc loading
        }, 2000); // Giả lập thời gian gửi 2 giây
    };

    return (
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between max-w-7xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg mt-24">
            {/* Phần yêu cầu hoàn tiền bên trái */}
            <div className="w-full lg:w-1/2 p-6 flex flex-col space-y-4">
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
                        rules={[{ required: true, message: "Vui lòng nhập số tài khoản ngân hàng của bạn!" }]}
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
                            min="0"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full"
                            loading={loading} // Hiển thị trạng thái loading khi gửi
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <Spin size="small" /> {/* Ant Design Spin for loading */}
                                    <span className="ml-2">Đang gửi yêu cầu...</span>
                                </div>
                            ) : (
                                "Gửi yêu cầu hoàn tiền"
                            )}
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            {/* Phần hình ảnh bên phải */}
            <div className="w-full lg:w-1/2 p-6 mt-6 lg:mt-0">
                <img
                    src="/images/refund-img.webp"
                    alt="Hoàn tiền"
                    className="w-full h-auto lg:h-[400px] object-cover rounded-lg shadow-md"
                />
            </div>
        </div>
    );
};

export default PayReturn;