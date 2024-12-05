import React from 'react';
import { Row, Col, Typography, Space, Button } from 'antd';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, LinkedinOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Footer = () => {
  return (
    <div>
      <hr />
      <div className="bg-white">
        <footer className="footer">
          <div className="container mx-auto px-6 py-24">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <div className="text-center md:text-left">
                  <img className="h-20 w-auto" src="/images/logo.png" alt="Logo" />
                  <Text className="mt-2 block">Hotline: 0868403204</Text>
                  <Space className="mt-4" size="large">
                    <Button
                      icon={<FacebookOutlined />}
                      type="link"
                      size="large"
                      href="https://www.facebook.com"
                      target="_blank"
                    />
                    <Button
                      icon={<TwitterOutlined />}
                      type="link"
                      size="large"
                      href="https://twitter.com"
                      target="_blank"
                    />
                    <Button
                      icon={<InstagramOutlined />}
                      type="link"
                      size="large"
                      href="https://www.instagram.com"
                      target="_blank"
                    />
                    <Button
                      icon={<LinkedinOutlined />}
                      type="link"
                      size="large"
                      href="https://www.linkedin.com"
                      target="_blank"
                    />
                  </Space>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Title level={4}>PetSpa</Title>
                <ul>
                  <li><a href="#" className="text-black">Trang chủ</a></li>
                  <li><a href="#" className="text-black">Về Chúng tôi</a></li>
                  <li><a href="#" className="text-black">Đội ngũ của chúng tôi</a></li>
                </ul>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Title level={4}>Người dùng</Title>
                <ul>
                  <li><a href="#" className="text-black">Blog</a></li>
                  <li><a href="#" className="text-black">FAQ</a></li>
                </ul>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Title level={4}>Sự riêng tư</Title>
                <ul>
                  <li><a href="#" className="text-black">Điều khoản dịch vụ</a></li>
                  <li><a href="#" className="text-black">Chính sách bảo mật</a></li>
                </ul>
              </Col>
            </Row>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
