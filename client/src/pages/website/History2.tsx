import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import {
  Row,
  Col,
  Card,
  Typography,
  Input,
  Button,
  DatePicker,
  Checkbox,
  Space,
  Select,
  Divider,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import moment from "moment";

const { Title, Text } = Typography;
const { Option } = Select;

const History2 = () => {
  const showUrl = "http://localhost:8000/api/payments";
  const [data, setData] = useState(null);
  const { id } = useParams();

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
  const roomData = paymentData.room;
  const servicesData = paymentData.service;
  const bookingData = paymentData.booking;
  const payMethodData = paymentData.paymentMethod;
  const sizeData = paymentData.size;

  return (
    <div className="flex flex-col lg:flex-row pb-20 mt-24">
      {/* Left side - Order Information */}
      <div className="lg:w-1/2 p-4">
        <Title level={2}>Thông tin đặt hàng</Title>
        <Card>
          <Row gutter={16}>
            <Title level={4}>Thông tin người đặt</Title>
            {/* Customer Info - One input per row */}
            <Col span={24} className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên khách hàng</label>
              <Input
                aria-label="Tên khách hàng"
                value={paymentData?.payment.user_name}
                readOnly
              />
            </Col>
            <Col span={24} className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Input
                aria-label="Email"
                value={paymentData?.payment.user_email}
                readOnly
              />
            </Col>
            <Col span={24} className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
              <Input
                aria-label="Số điện thoại"
                value={paymentData?.payment.user_phone}
                readOnly
              />
            </Col>
            <Col span={24} className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
              <Input
                aria-label="Địa chỉ"
                value={paymentData?.payment.user_address}
                readOnly
              />
            </Col>
          </Row>
        </Card>

        <Card className="mt-10">
          {/* Pet Info - One input per row */}
          <Row gutter={16}>
            <Title level={4}>Thông tin thú cưng</Title>
            <Col span={24} className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên thú cưng</label>
              <Input
                aria-label="Tên thú cưng"
                value={paymentData?.payment.pet_name}
                readOnly
              />
            </Col>
            <Col span={24} className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Chủng loại</label>
              <Input
                aria-label="Loại thú cưng"
                value={paymentData?.payment.pet_type}
                readOnly
              />
            </Col>
            <Col span={24} className="mb-3">
              <Text strong>Mô tả chi tiết thú cưng</Text>
              <Input.TextArea
                value={paymentData?.payment.pet_description}
                readOnly
                rows={3}
              />
            </Col>
            <Col span={24} className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tình trạng sức khỏe</label>
              <Input
                aria-label="Tình trạng sức khỏe"
                value={paymentData?.payment.pet_health}
                readOnly
              />
            </Col>
          </Row>
        </Card>

        {/* Payment Method Section */}
        <div className="mt-10">
          <Title level={2}>Phương thức thanh toán</Title>
          <Card>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên khách hàng</label>
            <Input
              aria-label="Phương thức thanh toán"
              value={payMethodData}
              readOnly
            />
          </Card>
        </div>

        <div className="text-center mt-10">
          <Button
            type="primary"
            size="large"
            icon={<ArrowLeftOutlined />}
            href="/history1"
          >
            Quay lại
          </Button>
        </div>
      </div>

      {/* Right side - Room Information and Services */}
      <div className="lg:w-1/2 p-4 mt-20 border rounded-lg shadow-lg ml-0 lg:ml-4 bg-[#F2F0F2] h-full">
        <Card>
          {/* Image Section with adjusted height */}
          <img
            src={roomData?.img_thumbnail}
            alt="Room Image"
            className="w-full h-[300px] object-cover rounded-lg shadow mb-10"
          />

          <Title level={3}>{sizeData}</Title>
          <Row gutter={16}>
            <Col span={24} className="mb-3">
              <Text strong>Giá/ngày:</Text> {roomData?.price} VNĐ
            </Col>
          </Row>
          <Text>{roomData?.description}</Text>

          {/* Booking Dates */}
          <Row gutter={16} className="mt-5 mb-10">
            <Col span={12}>
              <DatePicker
                value={moment(bookingData?.start_date)}
                disabled
                style={{ width: "100%" }}
              />
            </Col>
            <Col span={12}>
              <DatePicker
                value={moment(bookingData?.end_date)}
                disabled
                style={{ width: "100%" }}
              />
            </Col>
          </Row>

          <Divider />
          <h3 className="text-left text-2xl font-semibold mt-10">
            Dịch vụ kèm thêm
          </h3>
          <div className="mt-2">
            {Array.isArray(servicesData) && servicesData.length > 0 ? (
              servicesData?.map((item) => (
                <Checkbox
                  key={item?.id}
                  disabled
                  checked
                  className="block mb-2"
                >
                  {item.name} ({item.price.toLocaleString("vi-VN")} VNĐ)
                </Checkbox>
              ))
            ) : (
              <Text className="text-gray-500">Không sử dụng dịch vụ.</Text>
            )}
          </div>

          <Divider />
          <Row gutter={16} className="mt-4">
            <Col span={12}>
              <Text strong>Trạng thái:</Text>
            </Col>
            <Col span={12} className="text-right">
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-yellow-300">
                <Text className="text-yellow-800 text-sm">
                  {paymentData.payment.status?.status_name}
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
                {paymentData.payment.total_amount.toLocaleString("vi-VN")} VNĐ
              </Text>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default History2;
