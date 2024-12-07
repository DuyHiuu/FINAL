import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PulseLoader } from "react-spinners";
import { Card, Button, Row, Col, Typography, DatePicker, Divider } from 'antd';
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

  console.log(booking?.booking?.end_date);

  const servicesData = booking?.booking?.services;


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
          <Row justify="space-between" className="mt-8 w-full">
            <Col span={12}>
              <Text className='font-semibold'>Giá phòng:</Text>
              <div className="my-2" />
            </Col>
            <Col span={12} className="text-right">
              <Text className='font-semibold'>{booking?.subTotal_room?.toLocaleString("vi-VN")} VNĐ</Text>
              <div className="my-2" />
            </Col>
          </Row>

          <Row justify="space-between" className="w-full">
            <Col span={12}>
              <Text className='font-semibold'>Số ngày thuê:</Text>
              <div className="my-2" />
            </Col>
            <Col span={12} className="text-right">
              <Text className='font-semibold'>{moment(booking?.booking?.end_date).diff(moment(booking?.booking?.start_date), 'days')} ngày</Text>
              <div className="my-2" />
            </Col>
          </Row>

          <Row justify="space-between" className="mt-4 w-full">
            <Col span={12} className="text-left">
              <Text className='font-semibold'>Dịch vụ sử dụng:</Text>
            </Col>
            <Col span={12} className="text-right">
              {Array.isArray(servicesData) && servicesData.length > 0 ? (
                servicesData.map((item) => (
                  <div key={item?.id} className='font-semibold'>
                    <label>
                      <span>- {item.name} ({item.price.toLocaleString("vi-VN")} VNĐ)
                        {item.id === 2 && moment(booking?.booking?.end_date).diff(moment(booking?.booking?.start_date), 'days') >= 3
                          ? `x ${Math.floor(
                            moment(booking?.booking?.end_date).diff(
                              moment(booking?.booking?.start_date),
                              'days'
                            ) / 3
                          )}` : ""}
                      </span>
                    </label>
                  </div>
                ))
              ) : (
                <Text className='font-semibold'>Không sử dụng dịch vụ.</Text>
              )}
            </Col>
          </Row>

          <Row justify="space-between" className="mt-4 w-full">
            <Col span={12} className="text-left">
              <Text className='font-semibold'>Tổng phí dịch vụ:</Text>
            </Col>
            <Col span={12} className="text-right">
              <Text className='font-semibold'>{booking?.subTotal_service === 0 ? "0" : booking?.subTotal_service.toLocaleString("vi-VN")} VNĐ</Text>
            </Col>
          </Row>

          <Row justify="space-between" className="mt-4 w-full">
            <Col span={12}>
              <Text className="font-bold">Tổng:</Text>
            </Col>
            <Col span={12} className="text-right">
              <Text className="font-bold text-xl">{booking?.total_amount?.toLocaleString("vi-VN")} VNĐ</Text>
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

          <h3 className="text-left text-2xl font-semibold mt-10">
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
                      {item.id === 2 && moment(booking?.booking?.end_date).diff(moment(booking?.booking?.start_date), 'days') >= 3
                        ? `x ${Math.floor(
                          moment(booking?.booking?.end_date).diff(
                            moment(booking?.booking?.start_date),
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
