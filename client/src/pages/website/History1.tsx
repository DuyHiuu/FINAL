import React, { useState, useEffect } from "react";
import useFetchPayments from "../../api/useFetchPayments";
import {
  Button,
  DatePicker,
  Card,
  Typography,
  Spin,
  Rate,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "axios";

const { Title, Text } = Typography;

const History1 = () => {
  const { payment, loading } = useFetchPayments();
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);
  const [filteredPayments, setFilteredPayments] = useState(payment || []);
  const [rating, setRating] = useState({}); // Store individual ratings for each item

  const totalRoomsBooked = Array.isArray(filteredPayments)
    ? filteredPayments.length
    : 0;

  useEffect(() => {
    setFilteredPayments(payment);
  }, [payment]);

  const handleStartDateChange = (date) => setStartDate(date);
  const handleEndDateChange = (date) => setEndDate(date);

  const handleSearch = () => {
    if (!startDate && !endDate) {
      setFilteredPayments(payment);
      return;
    }

    const filtered = payment.filter((item) => {
      const bookingStartDate = new Date(item.booking?.start_date);
      const bookingEndDate = new Date(item.booking?.end_date);
      const isAfterStart = startDate
        ? bookingStartDate >= new Date(startDate)
        : true;
      const isBeforeEnd = endDate ? bookingEndDate <= new Date(endDate) : true;
      return isAfterStart && isBeforeEnd;
    });

    setFilteredPayments(filtered);
  };

  const handleRatingChange = (value, itemId) => {
    setRating((prev) => ({ ...prev, [itemId]: value }));
  };

  const submitRating = async (itemId, roomId) => {
    console.log(roomId);

    try {
      await axios.post("http://localhost:8000/api/ratings", {
        rating: rating[itemId],
        content: "Great stay!",
        room_id: roomId,
      });
      message.success("Đánh giá đã được lưu thành công!");
    } catch (error) {
      message.error("Xảy ra lỗi khi lưu đánh giá.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mt-32">
      <Title level={2} className="ms-10">
        Lịch sử mua hàng
      </Title>
      <div className="container mx-auto p-4 lg:p-8 flex flex-col lg:flex-row">
        <div className="flex-1 w-full lg:w-1/2">
          {Array.isArray(filteredPayments) && filteredPayments.length > 0 ? (
            filteredPayments.map((item) => (
              <Card key={item?.id} className="mb-6" hoverable>
                <div className="flex items-start">
                  <img
                    alt={`image-${item?.id}`}
                    src={item.booking?.room?.img_thumbnail}
                    style={{
                      width: "300px",
                      height: "200px",
                      objectFit: "cover",
                    }}
                    className="me-32"
                  />
                  <div className="ml-4 flex-1">
                    <Card.Meta
                      title={`ID hóa đơn: ${item?.id}`}
                      description={
                        <>
                          <div className="text-yellow-500">
                            {item.status?.status_name}
                          </div>
                          <Text>
                            Ngày:{" "}
                            {`${moment(item.booking?.start_date).format(
                              "DD-MM-YYYY"
                            )}`}{" "}
                            &#8594;{" "}
                            {`${moment(item.booking?.end_date).format(
                              "DD-MM-YYYY"
                            )}`}
                          </Text>
                          <div className="mt-2">
                            <a
                              href={`/history2/${item.id}`}
                              className="text-blue-500"
                            >
                              Xem chi tiết
                            </a>
                          </div>
                          <div className="mt-2 text-gray-500">
                            Tổng tiền:{" "}
                            {item.total_amount.toLocaleString("vi-VN")} VNĐ
                          </div>

                          {/* Star Rating Feature */}
                          {item.status?.status_name === "Đã xác nhận" && (
                            <div className="mt-2">
                              <Rate
                                value={rating[item.id] || 0}
                                onChange={(value) =>
                                  handleRatingChange(value, item.id)
                                }
                              />
                              <Button
                                type="primary"
                                size="small"
                                onClick={() =>
                                  submitRating(item.id, item.booking.room.id)
                                }
                                disabled={!rating[item.id]}
                                className="ml-2"
                              >
                                Đánh giá
                              </Button>
                            </div>
                          )}
                        </>
                      }
                    />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Text className="text-gray-500">Không có lịch sử mua hàng.</Text>
          )}
        </div>

        <div className="lg:w-1/3 p-4 border rounded-lg shadow-lg ml-0 lg:ml-4 bg-white h-full">
          <div className="flex items-center justify-between mb-4">
            <Text strong>Tổng số phòng đã đặt:</Text>
            <Text>{totalRoomsBooked}</Text>
          </div>

          <div className="mb-4">
            <DatePicker
              value={startDate}
              onChange={handleStartDateChange}
              placeholder="Ngày bắt đầu"
              style={{ width: "100%", marginBottom: 8 }}
            />
            <DatePicker
              value={endDate}
              onChange={handleEndDateChange}
              placeholder="Ngày kết thúc"
              style={{ width: "100%" }}
            />
          </div>

          <Button
            type="primary"
            onClick={handleSearch}
            icon={<SearchOutlined />}
            block
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default History1;
