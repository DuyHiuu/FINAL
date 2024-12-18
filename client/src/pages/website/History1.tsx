import React, { useState, useEffect } from "react";
import useFetchPayments from "../../api/useFetchPayments";
import useFetchRatings from "../../api/useFetchRatings";
import {
  Button,
  DatePicker,
  Card,
  Typography,
  Spin,
  Rate,
  Input,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "axios";
import { useRevalidator } from "react-router-dom";

const { Title, Text } = Typography;

const History1 = () => {
  const { payment, loading } = useFetchPayments();
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);
  const [filteredPayments, setFilteredPayments] = useState(payment || []);
  const [rating, setRating] = useState<{ [key: string]: number }>({});
  const [ratingContent, setRatingContent] = useState<{ [key: string]: string }>(
    {}
  );
  const [hasRated, setHasRated] = useState<{ [key: string]: boolean }>({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const totalRoomsBooked = Array.isArray(filteredPayments)
    ? filteredPayments.length
    : 0;

  const userID = localStorage.getItem("user_id");

  console.log(payment);

  useEffect(() => {
    const storedRatings = JSON.parse(localStorage.getItem("ratings") || "{}");
    setHasRated(storedRatings);

    setFilteredPayments(payment);
  }, [payment]);

  const handleStartDateChange = (date: moment.Moment | null) =>
    setStartDate(date);
  const handleEndDateChange = (date: moment.Moment | null) => setEndDate(date);

  const handleSearch = () => {
    if (!startDate && !endDate && !selectedStatus) {
      setFilteredPayments(payment);
      return;
    }

    const filtered = payment.filter((item) => {
      const bookingStartDate = new Date(item.booking?.start_date);
      const bookingEndDate = new Date(item.booking?.end_date);

      const isStartDateEqual = startDate
        ? bookingStartDate.toDateString() === new Date(startDate).toDateString()
        : true;
      const isEndDateEqual = endDate
        ? bookingEndDate.toDateString() === new Date(endDate).toDateString()
        : true;

      const matchesStatus =
        !selectedStatus || String(item.status?.id) === selectedStatus;

      const matchesDate =
        startDate && !endDate
          ? isStartDateEqual
          : endDate && !startDate
          ? isEndDateEqual
          : isStartDateEqual && isEndDateEqual;

      return matchesDate && matchesStatus;
    });

    setFilteredPayments(filtered);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedStatus("");

    handleSearch();
  };

  const handleRatingChange = (value: number, itemId: string) => {
    setRating((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    itemId: string
  ) => {
    setRatingContent((prev) => ({ ...prev, [itemId]: e.target.value }));
  };

  const submitRating = async (
    itemId: string,
    roomId: number,
    paymentId: number
  ) => {
    const token = `Bearer ${localStorage.getItem("auth_token")}`;

    if (!token) {
      message.error("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
      return;
    }

    if (!rating[itemId] || !ratingContent[itemId]) {
      message.warning("Vui lòng nhập đầy đủ nội dung và đánh giá sao.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/ratings",
        {
          rating: rating[itemId],
          content: ratingContent[itemId],
          room_id: roomId,
          user_id: userID,
          payment_id: paymentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      message.success("Đánh giá đã được lưu thành công!");
      const updatedRatings = { ...hasRated, [itemId]: true };
      setHasRated(updatedRatings);
      localStorage.setItem("ratings", JSON.stringify(updatedRatings));
    } catch (error) {
      console.error(error.response?.data || error.message);
      message.error("Xảy ra lỗi khi lưu đánh giá.");
    }
  };

  const convertIdToCustomString = (id: number) => {
    const prefix = "PETHOUSE-";
    const strId = String(id);
    let encodedId = "";

    for (let i = 0; i < strId.length; i++) {
      const digit = parseInt(strId[i]);
      encodedId += String.fromCharCode(65 + digit);
    }

    return `${prefix}${encodedId}`;
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
            filteredPayments.map((item) => {
              const formattedId = convertIdToCustomString(item?.id);
              return (
                <Card
                  key={item?.id}
                  className="mb-6 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  hoverable
                >
                  <div className="flex items-start">
                    <img
                      alt={`image-${formattedId}`}
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
                        title={`ID: ${formattedId}`}
                        description={
                          <>
                            <div
                              className="inline-flex items-center px-3 py-1 rounded-full mb-3"
                              style={{
                                backgroundColor:
                                  item.status?.id === 1
                                    ? "#fcd34d"
                                    : item.status?.id === 2
                                    ? "#10b981"
                                    : item.status?.id === 4
                                    ? "#10b981"
                                    : item.status?.id === 5
                                    ? "#5F9EA0"
                                    : item.status?.id === 6
                                    ? "#0000FF"
                                    : item.status?.id === 7
                                    ? "#FF0000"
                                    : "#e5e7eb",
                              }}
                            >
                              <Text
                                className="text-sm"
                                style={{
                                  color: "#fff",
                                }}
                              >
                                {item.status?.status_name}
                              </Text>
                            </div>
                            <div>
                              <div className="text-black font-semibold">
                                Phòng: {item.booking?.room?.size?.name}{" "}
                              </div>
                            </div>
                            <div>
                              <div className="text-black font-semibold">
                                Ngày Check-in:{" "}
                                {`${moment(item.booking?.start_date).format(
                                  "DD-MM-YYYY"
                                )}`}{" "}
                              </div>
                            </div>
                            <div>
                              <div className="text-black font-semibold">
                                Ngày Check-out:{" "}
                                {`${moment(item.booking?.end_date).format(
                                  "DD-MM-YYYY"
                                )}`}{" "}
                              </div>
                            </div>
                            <div>
                              <div className="text-black font-semibold">
                                Phương thức thanh toán: {item.pay_method?.name}{" "}
                              </div>
                            </div>
                            <div className="mt-2 font-semibold text-black">
                              Tổng tiền:{" "}
                              {Math.trunc(item.total_amount).toLocaleString(
                                "vi-VN"
                              )}{" "}
                              VNĐ
                            </div>
                            <div className="mt-2">
                              <a
                                href={`/history2/${item.id}`}
                                className="inline-block px-2 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
                              >
                                Xem chi tiết
                              </a>
                            </div>
                            {item.status?.id === 6 && !hasRated[item.id] && (
                              <div className="mt-2">
                                <Rate
                                  value={rating[item.id] || 0}
                                  onChange={(value) =>
                                    handleRatingChange(value, item.id)
                                  }
                                />
                                <Input.TextArea
                                  rows={3}
                                  placeholder="Nhập nội dung đánh giá"
                                  value={ratingContent[item.id] || ""}
                                  onChange={(e) =>
                                    handleContentChange(e, item.id)
                                  }
                                  className="mt-2"
                                />
                                <Button
                                  type="primary"
                                  size="small"
                                  onClick={() =>
                                    submitRating(
                                      item.id,
                                      item.booking.room.id,
                                      item.id
                                    )
                                  }
                                  disabled={
                                    !rating[item.id] || !ratingContent[item.id]
                                  }
                                  className="mt-2"
                                >
                                  Đánh giá
                                </Button>
                              </div>
                            )}
                            {hasRated[item.id] && (
                              <div className="mt-2 text-green-500">
                                Bạn đã đánh giá phòng này.
                              </div>
                            )}{" "}
                          </>
                        }
                      />
                    </div>
                  </div>
                </Card>
              );
            })
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
              className="mb-3"
              value={startDate}
              onChange={handleStartDateChange}
              placeholder="Ngày Check-in"
              style={{ width: "100%" }}
            />
            <DatePicker
              value={endDate}
              onChange={handleEndDateChange}
              placeholder="Ngày Check-out"
              style={{ width: "100%" }}
            />
          </div>
          <div className="mb-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="1">Chờ xác nhận</option>
              <option value="2">Đã xác nhận</option>
              <option value="4">Thanh toán thành công</option>
              <option value="6">Đã check-out</option>
              <option value="5">Đã check-in</option>
              <option value="7">Đã hủy</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button
              type="primary"
              onClick={handleSearch}
              icon={<SearchOutlined />}
              block
            >
              Tìm kiếm
            </Button>

            <Button type="default" onClick={handleReset} block>
              Xóa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History1;
