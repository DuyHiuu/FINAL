import React, { useState, useEffect } from "react";
import useFetchPayments from "../../api/useFetchPayments";
import {
  Button,
  DatePicker,
  Card,
  Typography,
  Spin,
  Rate,
  Input,
  message,
  Pagination,
  Select,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "axios";
import AOS from 'aos';
import 'aos/dist/aos.css';

const { Title, Text } = Typography;
const { Option } = Select;

const History1 = () => {
  const { payment, loading } = useFetchPayments();
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);
  const [filteredPayments, setFilteredPayments] = useState(payment || []);
  const [rating, setRating] = useState({});
  const [ratingContent, setRatingContent] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("newest");
  const pageSize = 5;

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  const totalRoomsBooked = Array.isArray(filteredPayments)
    ? filteredPayments.length
    : 0;

  const userID = localStorage.getItem("user_id"); // Lấy user_id từ localStorage hoặc từ auth token

  useEffect(() => {
    setFilteredPayments(payment);
  }, [payment]);

  const handleStartDateChange = (date: moment.Moment | null) => setStartDate(date);
  const handleEndDateChange = (date: moment.Moment | null) => setEndDate(date);

  const handleSearch = () => {
    let filtered = payment;

    if (startDate || endDate) {
      filtered = payment.filter((item) => {
        const bookingStartDate = new Date(item.booking?.start_date);
        const bookingEndDate = new Date(item.booking?.end_date);
        const isAfterStart = startDate
          ? bookingStartDate >= new Date(startDate)
          : true;
        const isBeforeEnd = endDate ? bookingEndDate <= new Date(endDate) : true;
        return isAfterStart && isBeforeEnd;
      });
    }

    if (sortOrder === "newest") {
      filtered = filtered.sort((a, b) => {
        return new Date(b.booking?.start_date) - new Date(a.booking?.start_date);
      });
    } else if (sortOrder === "oldest") {
      filtered = filtered.sort((a, b) => {
        return new Date(a.booking?.start_date) - new Date(b.booking?.start_date);
      });
    }

    setFilteredPayments(filtered);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    handleSearch(); // Reapply search with new sort order
  };

  const handleRatingChange = (value, itemId) => {
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
          user_id: userID, // Gửi user_id cùng với đánh giá
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      message.success("Đánh giá đã được lưu thành công!");
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastPayment = currentPage * pageSize;
  const indexOfFirstPayment = indexOfLastPayment - pageSize;
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mt-32 mb-32">
      <Title level={2} className="ms-10" data-aos="fade-up">
        Lịch sử mua hàng
      </Title>
      <div className="container mx-auto p-4 lg:p-8 flex flex-col lg:flex-row">
        <div className="flex-1 w-full lg:w-1/2">
          {Array.isArray(currentPayments) && currentPayments.length > 0 ? (
            currentPayments.map((item) => {
              const formattedId = convertIdToCustomString(item?.id);
              return (
                <Card
                  key={item?.id}
                  className="mb-6 transition-all transform hover:scale-105 hover:shadow-2xl"
                  hoverable
                  data-aos="fade-up"
                  style={{
                    borderRadius: '15px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div className="flex items-start">
                    <img
                      alt={`image-${formattedId}`}
                      src={item.booking?.room?.img_thumbnail}
                      style={{
                        width: '300px',
                        height: '200px',
                        objectFit: 'cover',
                      }}
                      className="me-8 rounded-lg transition-transform duration-300 transform hover:scale-105"
                      data-aos="zoom-in"
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
                                {`${moment(item.booking?.start_date).format(
                                  'DD-MM-YYYY'
                                )}`}{" "}
                                &#8594;{" "}
                                {`${moment(item.booking?.end_date).format(
                                  'DD-MM-YYYY'
                                )}`}
                              </Text>
                            </div>
                            <div className="mt-2">
                              <a
                                href={`/history2/${item.id}`}
                                className="text-blue-500 hover:text-blue-700 transition-all"
                                data-aos="fade-left"
                              >
                                Xem chi tiết
                              </a>
                            </div>
                            <div className="mt-2 text-gray-500">
                              Tổng tiền:{" "}
                              {item.total_amount.toLocaleString('vi-VN')} VNĐ
                            </div>

                            {/* Star Rating Feature */}
                            {item.status?.status_name === 'Đã xác nhận' && (
                              <div className="mt-2" data-aos="fade-up">
                                <Rate
                                  value={rating[item.id] || 0}
                                  onChange={(value) =>
                                    handleRatingChange(value, item.id)
                                  }
                                />
                                <Input.TextArea
                                  rows={3}
                                  placeholder="Nhập nội dung đánh giá"
                                  value={ratingContent[item.id] || ''}
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
                                  className="mt-2 transition-all transform hover:scale-105"
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
              );
            })
          ) : (
            <Text className="text-gray-500">Không có lịch sử mua hàng.</Text>
          )}
        </div>

        <div
          className="lg:w-1/3 p-4 border rounded-lg shadow-lg ml-0 lg:ml-4 bg-white h-full transition-transform transform hover:scale-105 hover:shadow-xl"
          data-aos="fade-right"
        >
          <div className="flex items-center justify-between mb-4">
            <Text strong>Tổng số phòng đã đặt:</Text>
            <Text>{totalRoomsBooked}</Text>
          </div>
          <div className="mb-4">
            <DatePicker
              value={startDate}
              onChange={handleStartDateChange}
              placeholder="Ngày bắt đầu"
              style={{ width: '100%', marginBottom: 8 }}
              data-aos="fade-up"
            />
            <DatePicker
              value={endDate}
              onChange={handleEndDateChange}
              placeholder="Ngày kết thúc"
              style={{ width: '100%' }}
              data-aos="fade-up"
            />
          </div>

          <div className="mb-4">
            <Select
              value={sortOrder}
              onChange={handleSortChange}
              style={{ width: '100%' }}
              placeholder="Chọn thứ tự sắp xếp"
            >
              <Option value="newest">Mới nhất đến cũ nhất</Option>
              <Option value="oldest">Cũ nhất đến mới nhất</Option>
            </Select>
          </div>

          <Button
            type="primary"
            onClick={handleSearch}
            icon={<SearchOutlined />}
            block
            className="transition-all transform hover:scale-105"
            data-aos="fade-up"
          >
            Tìm kiếm
          </Button>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          total={filteredPayments.length}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default History1;
