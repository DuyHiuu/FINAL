import React, { useState, useEffect } from "react";
import useFetchPayments from "../../api/useFetchPayments";

const History1 = () => {
  const { payment, loading } = useFetchPayments();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredPayments, setFilteredPayments] = useState(payment || []);

  const totalRoomsBooked = Array.isArray(filteredPayments) ? filteredPayments.length : 0;

  useEffect(() => {
    setFilteredPayments(payment);  // Cập nhật filteredPayments khi dữ liệu payment thay đổi
  }, [payment]);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
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

      const isAfterStart = startDate ? bookingStartDate >= new Date(startDate) : true;
      const isBeforeEnd = endDate ? bookingEndDate <= new Date(endDate) : true;

      return isAfterStart && isBeforeEnd;
    });

    setFilteredPayments(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mt-32">
      <strong className="ms-10 text-4xl font-semibold">Lịch sử mua hàng</strong>
      <div className="container mx-auto p-4 lg:p-8 flex flex-col lg:flex-row">
        {/* Phần bên trái */}
        <div className="flex-1 w-full lg:w-1/2">
          {Array.isArray(filteredPayments) && filteredPayments.length > 0 ? (
            filteredPayments.map((item) => (
              <div
                key={item?.id}
                className="flex flex-col lg:flex-row items-center mb-6 p-4 bg-white shadow rounded-lg"
              >
                {/* Hình ảnh bên trái */}
                <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mr-4">
                  <img
                    src={item.booking?.room?.img_thumbnail}
                    alt={`image-${item?.id}`}
                    className="w-24 h-24 rounded-md"
                  />
                </div>

                {/* Nội dung bên phải */}
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-xl font-bold text-gray-900">ID hóa đơn: {item?.id}</h1>
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-yellow-300">
                    <p className="text-yellow-800 text-sm">{item.status?.status_name}</p>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Ngày : {`${item.booking?.start_date.split("-").reverse().join("-")}`} &#8594; {`${item.booking?.end_date.split("-").reverse().join("-")}`}
                  </p>

                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-[#064749]">
                    <p className="text-white text-sm"><a href={`/history2/${item.id}`}>Xem chi tiết</a></p>
                  </div>
                  <span className="ml-2 text-gray-500">Tổng tiền: {item.total_amount.toLocaleString("vi-VN")} VNĐ</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Không có lịch sử mua hàng.</p>
          )}
        </div>

        {/* Phần bên phải */}
        <div className="lg:w-1/3 p-4 border rounded-lg shadow-lg ml-0 lg:ml-4 bg-white h-full">
          <div className="flex items-center">
            <div className="mr-4 sm:mr-20">
              <p className="text-left font-bold mt-2">Tổng số phòng đã đặt:</p>
            </div>
            <div className="text-right ml-4 sm:ml-20">
              <p className="font-bold mt-2">{totalRoomsBooked}</p>
            </div>
          </div>

          {/* Chi phí chia dọc hai bên */}
          <div className="flex justify-between mt-4"></div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                placeholder="Ngày bắt đầu"
              />
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ngày kết thúc"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="mt-5 text-white px-10 py-2 rounded-full bg-[#2563eb]"
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>
  );
};

export default History1;
