import React, { useState, useEffect } from "react";
import useFetchPayments from "../../api/useFetchPayments";
import { Button, DatePicker, Card, Typography, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";

const { Title, Text } = Typography;

const History1 = () => {
  const { payment, loading } = useFetchPayments();

  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);
  const [filteredPayments, setFilteredPayments] = useState(payment || []);

  const totalRoomsBooked = Array.isArray(filteredPayments)
    ? filteredPayments.length
    : 0;

  useEffect(() => {
    setFilteredPayments(payment); // Cập nhật filteredPayments khi dữ liệu payment thay đổi
  }, [payment]);

  const handleStartDateChange = (
    date: moment.Moment | null,
    dateString: string
  ) => {
    setStartDate(date); // Lưu giá trị date là đối tượng moment
  };
  console.log(startDate, endDate);

  const handleEndDateChange = (date: moment.Moment | null) => {
    setEndDate(date);
  };

  // Lọc các payment theo ngày bắt đầu và ngày kết thúc
  const handleSearch = () => {
    if (!startDate && !endDate) {
      // Nếu không có ngày bắt đầu hoặc ngày kết thúc, trả về danh sách gốc
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
        {/* Phần bên trái */}
        <div className="flex-1 w-full lg:w-1/2">
          {Array.isArray(filteredPayments) && filteredPayments.length > 0 ? (
            filteredPayments.map((item) => (
              <Card
              key={item?.id}
              className="mb-6"
              hoverable
              cover={
                <img
                  alt={`image-${item?.id}`}
                  src={item.booking?.room?.img_thumbnail}
                  style={{ width: '150px', height: '200px', objectFit: 'cover' }} // Adjust the size as needed
                />
              }
            >
              <Card.Meta
                title={`ID hóa đơn: ${item?.id}`}
                description={
                  <>
                    <div className="text-yellow-500">
                      {item.status?.status_name}
                    </div>
                    <Text>
                      Ngày:{" "}
                      {`${moment(item.booking?.start_date).format("DD-MM-YYYY")}`}{" "}
                      &#8594;{" "}
                      {`${moment(item.booking?.end_date).format("DD-MM-YYYY")}`}
                    </Text>
                    <div className="mt-2">
                      <a href={`/history2/${item.id}`} className="text-blue-500">
                        Xem chi tiết
                      </a>
                    </div>
                    <div className="mt-2 text-gray-500">
                      Tổng tiền: {item.total_amount.toLocaleString("vi-VN")} VNĐ
                    </div>
                  </>
                }
              />
            </Card>
            
            ))
          ) : (
            <Text className="text-gray-500">Không có lịch sử mua hàng.</Text>
          )}
        </div>

        {/* Phần bên phải */}
        <div className="lg:w-1/3 p-4 border rounded-lg shadow-lg ml-0 lg:ml-4 bg-white h-full">
          <div className="flex items-center justify-between mb-4">
            <Text strong>Tổng số phòng đã đặt:</Text>
            <Text>{totalRoomsBooked}</Text>
          </div>

          {/* Tìm kiếm theo ngày */}
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
