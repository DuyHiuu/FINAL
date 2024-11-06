import React, { useState } from "react";
import { Form, Input, Button, Spin, Typography, message } from "antd";
import { PulseLoader } from "react-spinners"; // Optionally use PulseLoader from react-spinners
import { MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Lienhe = () => {
  const [loading, setLoading] = useState(false); // Thêm state loading

  const handleSubmit = (values: any) => {
    setLoading(true); // Bắt đầu loading

    // Giả lập gửi dữ liệu
    setTimeout(() => {
      message.success("Tin nhắn đã được gửi!");
      setLoading(false); // Kết thúc loading
    }, 2000); // Giả lập thời gian gửi 2 giây
  };

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between max-w-7xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg mt-24">
      {/* Phần liên hệ bên trái */}
      <div className="w-full lg:w-1/2 p-6 flex flex-col space-y-4">
        <Title level={2}>Liên hệ với chúng tôi</Title>
        <Text className="text-lg">
          Chúng tôi rất mong được nghe phản hồi từ bạn. Vui lòng liên hệ qua các
          thông tin dưới đây:
        </Text>

        {/* Form liên hệ */}
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          className="flex flex-col space-y-4 mt-4"
        >
          <Form.Item
            name="name"
            label="Tên của bạn"
            rules={[{ required: true, message: "Vui lòng nhập tên của bạn!" }]}
          >
            <Input
              placeholder="Tên của bạn"
              prefix={<UserOutlined />}
              className="border border-gray-300 p-3 rounded-lg"
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email của bạn"
            rules={[{ required: true, message: "Vui lòng nhập email của bạn!" }, { type: 'email', message: "Email không hợp lệ!" }]}
          >
            <Input
              placeholder="Email của bạn"
              prefix={<MailOutlined />}
              className="border border-gray-300 p-3 rounded-lg"
            />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại của bạn"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại của bạn!" }]}
          >
            <Input
              type="number"
              placeholder="Số điện thoại của bạn"
              prefix={<PhoneOutlined />}
              className="border border-gray-300 p-3 rounded-lg"
              min="0"
            />
          </Form.Item>

          <Form.Item
            name="message"
            label="Tin nhắn của bạn"
            rules={[{ required: true, message: "Vui lòng nhập tin nhắn của bạn!" }]}
          >
            <Input.TextArea
              placeholder="Tin nhắn của bạn"
              className="border border-gray-300 p-3 rounded-lg"
              rows={4}
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
                  <span className="ml-2">Đang gửi...</span>
                </div>
              ) : (
                "Gửi tin nhắn"
              )}
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Phần hình ảnh bên phải */}
      <div className="w-full lg:w-1/2 p-6 mt-6 lg:mt-0">
        <img
          src="/images/img.webp"
          alt="Liên hệ với chúng tôi"
          className="w-full h-auto lg:h-[400px] object-cover rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default Lienhe;
