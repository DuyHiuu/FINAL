import React, { useState } from "react";
import useFetchRooms from "../../api/useFetchRooms";
import useFetchSize from "../../api/useFetchSize";
import { Select, Button, Spin, Pagination } from "antd";
import { Link } from "react-router-dom";

const { Option } = Select;

const ListRoom = () => {
  const [sizeFilter, setSizeFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Lấy dữ liệu phòng và kích thước từ API
  const { room, loading: loadingRooms, error: errorRooms } = useFetchRooms("", sizeFilter);
  const { sizes, loading: loadingSizes, error: errorSizes } = useFetchSize();

  // Hàm thay đổi filter size
  const handleSizeChange = (value: string) => {
    setSizeFilter(value);
    setCurrentPage(1); // Reset trang khi thay đổi filter
  };

  // Tính toán các chỉ số cho phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = room?.slice(indexOfFirstItem, indexOfLastItem);

  // Hàm xử lý chuyển trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col items-center mb-10 mt-24">
      {/* Banner Image */}
      <img
        className="w-full h-auto max-h-[450px] sm:max-h-[350px] md:max-h-[450px] lg:max-h-[600px] object-cover"
        src="/images/img.webp"
        alt="PetSpa"
      />

      {/* Filter Form */}
      <div className="mt-4 mb-6 w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg border">
          <div className="flex items-center space-x-2">
            <label htmlFor="size" className="font-semibold">
              Size:
            </label>
            <Select
              id="size"
              value={sizeFilter}
              onChange={handleSizeChange}
              style={{ width: 200 }}
              placeholder="Chọn size"
              loading={loadingSizes}
              disabled={loadingSizes || errorSizes}
            >
              <Option value="">Chọn size</Option>
              {sizes?.map((size) => (
                <Option key={size.id} value={size.name}>
                  {size.name}
                </Option>
              ))}
            </Select>
          </div>
          <Button
            onClick={() => setSizeFilter("")}
            type="default"
            style={{ backgroundColor: "#FF4D4F", color: "#fff" }}
          >
            Quay lại
          </Button>
        </div>
      </div>

      {/* Room List */}
      <div className="container mx-auto p-4 lg:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {!loadingRooms &&
  currentRooms
    ?.filter((r) => sizeFilter === "" || r.size_name === sizeFilter)
    .map((room) => (
      <div key={room.id} className="flex flex-col items-center mb-6 p-4 bg-white shadow rounded-lg">
        {room.statusroom === "Còn phòng" ? (
          // Nếu là "Còn phòng", cho phép bấm vào liên kết
          <Link to={`/detail/${room.id}`} className="text-center">
            <div className="flex-shrink-0 mb-4 mx-auto">
              <img
                src={room.img_thumbnail}
                alt={`image-${room.id}`}
                className="w-full h-[250px] rounded-md"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{room.description}</h1>
              <div className="flex justify-center items-center mt-1">
                <p className="text-gray-600">Size: {room.size_name}</p>
              </div>
              <p className="text-gray-600 mt-2">{room.description}</p>
              <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full
                ${room.statusroom === "Còn phòng" ? "bg-[#064749] text-green-800" : "bg-[#FF0000] text-red-800"}`}>
                <p className="text-white text-sm">{room.statusroom}</p>
              </div>
              <span className="ml-2 text-gray-500">
                Giá: {room.price.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
          </Link>
        ) : (
          // Nếu là "Hết phòng", không cho phép bấm vào
          <div className="text-center cursor-not-allowed opacity-70">
            <div className="flex-shrink-0 mb-4 mx-auto">
              <img
                src={room.img_thumbnail}
                alt={`image-${room.id}`}
                className="w-full h-[250px] rounded-md"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{room.description}</h1>
              <div className="flex justify-center items-center mt-1">
                <p className="text-gray-600">Size: {room.size_name}</p>
              </div>
              <p className="text-gray-600 mt-2">{room.description}</p>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-[#FF0000] text-red-800">
                <p className="text-white text-sm">{room.statusroom}</p>
              </div>
              <span className="ml-2 text-gray-500">
                Giá: {room.price.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
          </div>
        )}
      </div>
    ))}

      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={room?.length || 0}
          onChange={handlePageChange}
          showSizeChanger={false}
          showQuickJumper
          className="pagination"
        />
      </div>
    </div>
  );
};

export default ListRoom;
