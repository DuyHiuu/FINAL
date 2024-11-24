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
  const [ratingContent, setRatingContent] = useState<{ [key: string]: string }>({});
  const [hasRated, setHasRated] = useState<{ [key: string]: boolean }>({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const totalRoomsBooked = Array.isArray(filteredPayments)
    ? filteredPayments.length
    : 0;

  const userID = localStorage.getItem("user_id");

  useEffect(() => {
    const storedRatings = JSON.parse(localStorage.getItem("ratings") || "{}");
    setHasRated(storedRatings);

    setFilteredPayments(payment);
  }, [payment]);

  const handleStartDateChange = (date: moment.Moment | null) => setStartDate(date);
  const handleEndDateChange = (date: moment.Moment | null) => setEndDate(date);

  const handleSearch = () => {
    if (!startDate && !endDate && !selectedStatus) {
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

      const matchesStatus =
        !selectedStatus || String(item.status?.id) === selectedStatus;

      return isAfterStart && isBeforeEnd && matchesStatus;
    });

    setFilteredPayments(filtered);
  };

  const handleRatingChange = (value: number, itemId: string) => {
    setRating((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>, itemId: string) => {
    setRatingContent((prev) => ({ ...prev, [itemId]: e.target.value }));
  };

  const submitRating = async (itemId: string, roomId: number) => {
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
                <Card key={item?.id}
                  className="mb-6 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  hoverable>
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
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-300">
                              <Text className="text-yellow-800 text-sm">
                                {item.status?.status_name}
                              </Text>
                            </div>
                            <div>
                              <Text>
                                Ngày:{" "}
                                {`${moment(item.booking?.start_date).format("DD-MM-YYYY"
                                )}`}{" "}
                                &#8594;{" "}
                                {`${moment(item.booking?.end_date).format(
                                  "DD-MM-YYYY"
                                )}`}
                              </Text>
                            </div>
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
                            {item.status?.status_name === "Đã xác nhận" && !hasRated[item.id] && (
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
                                    submitRating(item.id, item.booking.room.id)
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
                              <div className="mt-2 text-green-500">Bạn đã đánh giá phòng này.</div>
                            )} </>
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
              value={startDate}
              onChange={handleStartDateChange}
              placeholder="Ngày bắt đầu"
              style={{ width: "100%" }}
            />
            <DatePicker
              value={endDate}
              onChange={handleEndDateChange}
              placeholder="Ngày kết thúc"
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
              <option value="6">Đã check-out</option>
              <option value="5">Đã check-in</option>
              <option value="7">Đã hủy</option>
            </select>
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