import { Col, Divider, Row } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Text } from "recharts";
import useFetchRooms from "../../../../api/useFetchRooms";

const ChangeRoom = () => {
  const showUrl = "http://localhost:8000/api/payments";
  const { room, loading, error } = useFetchRooms(); 

  const [data, setData] = useState(null);

  const { id } = useParams();

  const updateUrl = "http://localhost:8000/api/payments";
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0); // Track the total amount after room change
  const navigate = useNavigate();

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

  // Handle room change and recalculate the total amount
  const handleRoomChange = (e) => {
    const roomId = e.target.value;
    setSelectedRoom(roomId);

    if (parseInt(roomId) <= data?.payment?.room?.id) {
      alert("Chỉ có thể thay đổi sang phòng có ID lớn hơn phòng hiện tại.");
      return;
    }

    const newRoom = room.find((room) => room.id === parseInt(roomId));
    const roomPrice = newRoom ? newRoom.price : 0;

    const startDate = moment(data?.payment?.booking?.start_date);
    const endDate = moment(data?.payment?.booking?.end_date);
    const days = endDate.diff(startDate, "days");

    const newTotal = calculateTotalAmount(roomPrice, days, data?.payment?.services);
    setTotalAmount(newTotal);
  };

  const calculateTotalAmount = (roomPrice, days, services) => {
    let subTotalService = 0;

    if (services && services.length > 0) {
      services.forEach((service) => {
        if (service.id === 2) {
          const multiplier = Math.floor(days / 3); // Special logic for service 2
          subTotalService += service.price * multiplier;
        } else {
          subTotalService += service.price;
        }
      });
    }

    const subTotalRoom = roomPrice * days;

    return subTotalRoom + subTotalService;
  };

  const handleUpdateRoom = async () => {
    if (!selectedRoom) {
      alert("Vui lòng chọn phòng!");
      return;
    }
  
    try {
   
      const requestBody = {
        room_id: selectedRoom, 
       

      };
  
      console.log("Request Body:", requestBody); 
  
      const res = await fetch(`${updateUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), 
      });
  
      if (!res.ok) {
        throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
      }
  
      const updatedData = await res.json();
      alert("Cập nhật phòng thành công!");
      navigate(`/admin/payments/detail/${id}`);
    } catch (error) {
      console.error(error);
      alert("Cập nhật phòng thất bại!");
    }
  };
  

  if (!data) {
    return <p>Đang tải dữ liệu...</p>;
  }

  const paymentData = data.payment;
  const roomData = paymentData.room;
  const servicesData = paymentData.services;
  const bookingData = paymentData.booking;
  const payMethodData = paymentData.paymentMethod;
  const sizeData = paymentData.size;
  const voucherData = paymentData.voucher;

  const startDate = moment(bookingData?.start_date);
  const endDate = moment(bookingData?.end_date);
  const days = endDate.diff(startDate, "days");

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="lg:w-1/2 p-4">
        <div className="text-left">
          <strong className="text-5xl">Chi tiết đơn hàng</strong>
          <div className="antialiased text-gray-900">
            <div className="max-w-xl py-12 divide-y md:max-w-4xl">
              <div className="max-w-md">
                <div className="grid grid-cols-1 gap-6">
                  <form>
                    <label htmlFor="">Đổi phòng</label>
                    <select
                      value={selectedRoom}
                      onChange={handleRoomChange}
                      className="block w-full mt-1 rounded-md bg-gray-100 p-2 border-2 border-black-300"
                    >
                      {room?.map((rooms) => (
                        <option key={rooms.id} value={rooms.id}>
                          {rooms.size_name}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={handleUpdateRoom}
                      className="mt-4 px-6 py-2 bg-blue-500 text-white rounded"
                    >
                      Cập nhật phòng
                    </button>
                  </form>

                  <center>
                    <button className="mt-20 text-white px-10 py-2 rounded-full bg-[#064749]">
                      <a href="/admin/payments">Quay lại</a>
                    </button>
                  </center>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-left mt-10">
          <label className="block">
            <span className="text-gray-700 text-lg">Phương thức thanh toán</span>
            <input
              readOnly
              value={payMethodData}
              className="block w-full mt-1 rounded-md bg-gray-100 p-2 border-2 border-black-300"
            />
          </label>
        </div>
      </div>

      <div className="lg:w-1/2 p-4 mt-20 border-2 rounded-lg shadow-lg ml-0 lg:ml-4 bg-[#F2F0F2] h-2/3">
        <img
          src={roomData?.img_thumbnail}
          alt="Large"
          className="w-full h-60 object-cover rounded-lg shadow mb-10"
        />
        <strong className="text-4xl font-semibold">{sizeData}</strong>

        <Row justify="space-between" className="mt-3 w-full">
          <Col span={12}>
            <Text className="font-semibold">Giá phòng:</Text>
          </Col>
          <Col span={12} className="text-right">
            <span className="font-semibold">
              {roomData?.price.toLocaleString("vi-VN")} VNĐ
            </span>
          </Col>
        </Row>

        <Row justify="space-between" className="mt-3 w-full">
          <Col span={12}>
            <Text className="font-semibold">Số ngày thuê</Text>
          </Col>
          <Col span={12} className="text-right">
            <span className="font-semibold">{days} ngày</span>
          </Col>
        </Row>

        <Row justify="space-between" className="mt-3 w-full">
          <Col span={12}>
            <Text className="font-semibold">Tổng giá phòng</Text>
          </Col>
          <Col span={12} className="text-right">
            <span className="font-semibold">
              {(roomData?.price * days).toLocaleString("vi-VN")} VNĐ
            </span>
          </Col>
        </Row>

        <Divider />
        <Row justify="space-between" className="mt-3 w-full">
          <Col span={12}>
            <Text className="font-semibold">Ngày bắt đầu</Text>
          </Col>
          <Col span={12} className="text-right">
            <span className="font-semibold">
              {moment(bookingData?.start_date).format("DD/MM/YYYY")}
            </span>
          </Col>
        </Row>

        <Row justify="space-between" className="mt-3 w-full">
          <Col span={12}>
            <Text className="font-semibold">Ngày kết thúc</Text>
          </Col>
          <Col span={12} className="text-right">
            <span className="font-semibold">
              {moment(bookingData?.end_date).format("DD/MM/YYYY")}
            </span>
          </Col>
        </Row>

        <Row justify="space-between" className="mt-3 w-full">
          <Col span={12}>
            <Text className="font-semibold">Tổng tiền</Text>
          </Col>
          <Col span={12} className="text-right">
            <span className="font-semibold">
              {totalAmount.toLocaleString("vi-VN")} VNĐ
            </span>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ChangeRoom;
