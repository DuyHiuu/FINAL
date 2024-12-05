import React, { useEffect, useState } from "react";
import useFetchRooms from "../../api/useFetchRooms";
import useFetchSize from "../../api/useFetchSize";
import { Select, Button, Slider, Pagination, Row, Col, Typography } from "antd";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const { Option } = Select;
const { Title } = Typography;

const ListRoom = () => {
  const [sizeFilter, setSizeFilter] = useState<string>("");
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const { room, loading: loadingRooms, error: errorRooms } = useFetchRooms("", sizeFilter);
  const { sizes, loading: loadingSizes, error: errorSizes } = useFetchSize();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleSizeChange = (value: string) => {
    setSizeFilter(value);
    setCurrentPage(1);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = room?.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-8 mt-32" data-aos="fade-up">
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <Title level={3} className="text-center mb-4">Tìm phòng</Title>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={8} md={6}>
              <label htmlFor="size" className="font-semibold">Chọn kích thước phòng:</label>
              <Select
                id="size"
                value={sizeFilter}
                onChange={handleSizeChange}
                style={{ width: "100%" }}
                placeholder="Chọn kích thước phòng"
                loading={loadingSizes}
                disabled={loadingSizes || errorSizes}
              >
                <Option value="">Tất cả</Option>
                {sizes?.map((size) => (
                  <Option key={size.id} value={size.name}>
                    {size.name}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={8} md={6}>
              <label className="font-semibold">Giá (VNĐ):</label>
              <Slider
                range
                min={0}
                max={500000}
                step={100000}
                value={priceRange}
                onChange={handlePriceChange}
                tipFormatter={(value) => `${value.toLocaleString()} VNĐ`}
                trackStyle={{
                  backgroundColor: "#064749",
                }}
                railStyle={{
                  backgroundColor: "#ddd",
                }}
                handleStyle={{
                  borderColor: "#064749",
                  backgroundColor: "#064749",
                }}
              />
            </Col>
          </Row>
          <Row justify="center" className="mt-4">
            <Button
              onClick={() => {
                setSizeFilter("");
                setPriceRange([0, 500000]);
              }}
              type="default"
              style={{
                backgroundColor: "#FF4D4F",
                color: "#fff",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
              }}
              className="hover:bg-red-600 hover:scale-105"
            >
              Xóa
            </Button>
          </Row>
        </div>

        <Row gutter={[16, 16]} data-aos="fade-up">
          <Col span={24}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {!loadingRooms &&
                currentRooms
                  ?.filter(
                    (r) =>
                      (sizeFilter === "" || r.size_name === sizeFilter) &&
                      r.price >= priceRange[0] &&
                      r.price <= priceRange[1]
                  )
                  .map((room) => (
                    <div
                      key={room.id}
                      className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105 hover:shadow-xl hover:opacity-90"
                    >
                      {room.statusroom === "Còn phòng" ? (
                        <Link
                          to={`/detail/${room.id}`}
                          className="w-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                        >
                          <div className="flex-shrink-0 mb-4 mx-auto overflow-hidden rounded-lg">
                            <img
                              src={room.img_thumbnail}
                              alt={`image-${room.id}`}
                              className="w-full h-[200px] object-cover transform transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                          <div className="flex-1 p-3">
                            <h1 className="text-lg font-semibold text-gray-800 hover:text-[#064749] transition-colors">
                              {room.size_name}
                            </h1>

                            <p className="text-sm font-semibold text-[#064749] mt-2">
                              <span className="text-sm font-semibold text-gray-800">Kích thước:</span> {room.size_name}
                            </p>

                            <p className="text-sm text-gray-600 mt-2">
                              <span className="font-semibold text-gray-800">Mô tả:</span>
                              {room.description.length > 100 ? room.description.substring(0, 100) + '...' : room.description}
                            </p>

                            <div
                              className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${room.statusroom === "Còn phòng" ? "bg-[#064749] text-white" : "bg-red-500 text-white"
                                }`}
                            >
                              {room.statusroom}
                            </div>
                            <div className="mt-4 text-lg font-semibold text-gray-800">
                              Giá: {room.price.toLocaleString("vi-VN")} VNĐ
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div className="w-full cursor-not-allowed opacity-50">
                          <div className="flex-shrink-0 mb-4 mx-auto overflow-hidden rounded-lg opacity-50">
                            <img
                              src={room.img_thumbnail}
                              alt={`image-${room.id}`}
                              className="w-full h-[200px] object-cover"
                            />
                          </div>
                          <div className="flex-1 p-3 opacity-50">
                            <h1 className="text-lg font-semibold text-gray-800">{room.description}</h1>
                            <p className="text-sm font-semibold text-[#FF4D4F] mt-2">Kích thước: {room.size_name}</p>
                            <p className="text-sm text-gray-600 mt-2">{room.description}</p>
                            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500 text-white">
                              {room.statusroom}
                            </div>
                            <div className="mt-4 text-lg font-semibold text-gray-800">
                              Giá: {room.price.toLocaleString("vi-VN")} VNĐ
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          </Col>
        </Row>

        <Row justify="center" className="mt-6">
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={room?.length || 0}
            onChange={handlePageChange}
            className="transition-all duration-300 transform hover:scale-105"
          />
        </Row>
      </div>
    </div>
  );

};

export default ListRoom;
