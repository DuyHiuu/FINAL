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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg h-[300px]">
            <Title level={4} className="mb-4 text-center">
              Tìm kiếm
            </Title>

            <div className="mb-6">
              <label htmlFor="size" className="font-semibold block mb-2">
                Chọn kích thước phòng:
              </label>
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
            </div>

            <div className="mb-6">
              <label className="font-semibold block mb-2">Giá (VNĐ):</label>
              <Slider
                range
                min={0}
                max={500000}
                step={100000}
                value={priceRange}
                onChange={handlePriceChange}
                tipFormatter={(value) => `${value.toLocaleString()} VNĐ`}
              />

              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>{priceRange[0].toLocaleString()} VNĐ</span>
                <span>{priceRange[1].toLocaleString()} VNĐ</span>
              </div>
            </div>

            <Button
              onClick={() => {
                setSizeFilter("");
                setPriceRange([0, 500000]);
              }}
              type="default"
              className="w-full"
            >
              Xóa
            </Button>
          </div>

          {/* Cột phải: Danh sách phòng */}
          <div className="col-span-3">
            <Row gutter={[16, 16]}>
              {!loadingRooms &&
                currentRooms
                  ?.filter(
                    (r) =>
                      (sizeFilter === "" || r.size_name === sizeFilter) &&
                      r.price >= priceRange[0] &&
                      r.price <= priceRange[1]
                  )
                  .map((room) => (
                    <Col key={room.id} xs={24} sm={12} md={8}>
                      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <Link to={`/detail/${room.id}`}>
                          <img
                            src={room.img_thumbnail}
                            alt={`room-${room.id}`}
                            className="w-full h-[200px] object-cover"
                          />
                          <div className="p-4">
                            <h2 className="text-lg font-semibold">{room.size_name}</h2>
                            <p className="text-gray-600">
                              Giá: {room.price.toLocaleString("vi-VN")} VNĐ
                            </p>
                            <p className="text-gray-600">
                              {room.description.length > 100
                                ? room.description.substring(0, 100) + "..."
                                : room.description}
                            </p>
                            <div
                              className={`mt-2 px-3 py-1 inline-block text-sm rounded ${room.statusroom === "Còn phòng"
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                                }`}
                            >
                              {room.statusroom}
                            </div>
                          </div>
                        </Link>
                      </div>
                    </Col>
                  ))}
            </Row>

            {/* Phân trang */}
            <Row justify="center" className="mt-6">
              <Pagination
                current={currentPage}
                pageSize={itemsPerPage}
                total={room?.length || 0}
                onChange={handlePageChange}
              />
            </Row>
          </div>
        </div>
      </div>
    </div>
  );

};

export default ListRoom;
