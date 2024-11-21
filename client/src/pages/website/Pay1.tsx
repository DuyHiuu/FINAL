import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PulseLoader } from "react-spinners";
import { Card, Button, Row, Col, Typography, DatePicker } from 'antd';
import moment from 'moment';

const { Title, Text } = Typography;

const Pay1 = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    window.scrollTo(0, 0);
  }, []);

  const showBooking = "http://localhost:8000/api/bookings";
  const showRoom = "http://localhost:8000/api/rooms";

  const [booking, setBooking] = useState<any>();
  const [room, setRoom] = useState<any>();

  useEffect(() => {
    try {
      const fetBooking = async () => {
        const res = await fetch(`${showBooking}/${id}`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        setBooking(data);
      };
      fetBooking();
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (booking?.room_id) {
      try {
        const fetRoom = async () => {
          const res = await fetch(`${showRoom}/${booking?.room_id}`, {
            method: "get",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!res.ok) {
            throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
          }

          const data = await res.json();
          setRoom(data);
        };
        fetRoom();
      } catch (error) {
        console.log(error);
      }
    }
  }, [booking?.room_id]);

  const toPay = () => {
    navigate(`/pay2/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white fixed top-0 left-0 w-full h-full z-50">
        <PulseLoader color="#33CCFF" size={15} margin={2} />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row pb-20 mt-32">
      <div className="lg:w-1/2 p-4 mx-auto">
        <div className="text-left">
          <Title level={1}>Xác nhận thanh toán</Title>
          <Row justify="space-between" className="mt-20 w-auto">
            <Col span={12}>
              <Text>Giá phòng:</Text>
              <div style={{ marginTop: '10px' }} />
              <Text className="d-block mt-2">Phí dịch vụ:</Text>
              <div style={{ marginTop: '10px' }} />
              <Text className="d-block mt-2 font-bold">Tổng:</Text>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Text>{booking?.subTotal_room?.toLocaleString("vi-VN")} VNĐ</Text>
              <div style={{ marginTop: '10px' }} />
              <Text className="d-block mt-2 mb-10">
                {booking?.subTotal_service === 0 ? "0" : booking?.subTotal_service.toLocaleString("vi-VN")} VNĐ
              </Text>
              <div style={{ marginTop: '10px' }} />
              <Text className="font-bold">{booking?.total_amount?.toLocaleString("vi-VN")} VNĐ</Text>
            </Col>
          </Row>
        </div>

        <Button
          type="primary"
          size="large"
          onClick={toPay}
          style={{ marginTop: '20px', width: '150px', backgroundColor: '#064749' }}
        >
          Thanh Toán
        </Button>
      </div>

      <div className="lg:w-1/3 p-4 mt-8 border rounded-lg shadow-md mx-auto bg-white">
        <Card
          cover={
            <img
              src={room?.img_thumbnail}
              alt={room?.size_name}
              className="w-full object-cover rounded-lg shadow-sm"
              style={{ height: '250px' }}
            />
          }
        >
          <Title level={4} className="text-center text-[#333]">{room?.size_name}</Title>
          <div className="flex items-center mt-3 mb-3">
            <p className="text-gray-700">{room?.description}</p>
          </div>

          <Row gutter={16} className="mb-8">
            <Col span={12}>
              <strong>Ngày check-in</strong>
              <DatePicker
                value={booking?.start_date ? moment(booking?.start_date) : null}
                disabled
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={12}>
              <strong>Ngày check-out</strong>
              <DatePicker
                value={booking?.end_date ? moment(booking?.end_date) : null}
                disabled
                style={{ width: '100%' }}
              />
            </Col>
          </Row>

          <Text className="text-gray-600 mb-4">Mọi chi phí đã được tính tổng</Text>

          <Row justify="space-between" className="mt-4">
            <Col span={12}>
              <Text className="font-semibold text-[#064749]">Tổng:</Text>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Text className="font-semibold text-[#064749]">{booking?.total_amount?.toLocaleString("vi-VN")} VNĐ</Text>
            </Col>
          </Row>
        </Card>
      </div>

    </div>

  );
};

export default Pay1;
