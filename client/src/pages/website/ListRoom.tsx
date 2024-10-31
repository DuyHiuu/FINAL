import React, { useState, useEffect } from "react";
import useFetchRooms from "../../api/useFetchRooms";
import useFetchSize from "../../api/useFetchSize";

const ListRoom = () => {
  const [sizeFilter, setSizeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const { room, loading: loadingRooms, error: errorRooms } = useFetchRooms("", sizeFilter);
  const { sizes, loading: loadingSizes, error: errorSizes } = useFetchSize();

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSizeFilter(e.target.value);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = room?.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (indexOfLastItem < room.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col items-center mb-10 mt-24">
      {/* Banner Image */}
      <img
        className="w-full h-auto max-h-[450px] sm:max-h-[350px] md:max-h-[450px] lg:max-h-[600px] object-cover"
        src="/images/img.webp"
        alt="PetSpa"
      />

      {/* Filter Form - Closer to Banner */}
      <form className="mt-4 mb-6 w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg border">
          <div className="flex items-center space-x-2">
            <label htmlFor="size" className="font-semibold">
              Size:
            </label>
            <select
              id="size"
              name="size"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sizeFilter}
              onChange={handleSizeChange}
            >
              <option value="">Chọn size</option>
              {loadingSizes && <option>Đang tải...</option>}
              {errorSizes && <option>Lỗi khi tải size</option>}
              {!loadingSizes && !errorSizes &&
                sizes.map((size) => (
                  <option key={size.id} value={size.name}>
                    {size.name}
                  </option>
                ))
              }
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300"
              onClick={() => setSizeFilter("")}
            >
              Quay lại
            </button>
          </div>
        </div>
      </form>

      {/* Room List */}
      <div className="container mx-auto p-4 lg:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingRooms &&
          <div className="flex justify-center items-center min-h-screen bg-white fixed top-0 left-0 w-full h-full z-50">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>}
        {errorRooms && <p>Đã xảy ra lỗi: {errorRooms}</p>}
        {!loadingRooms &&
          currentRooms
            ?.filter((r: any) => sizeFilter === "" || r.size_name === sizeFilter)
            .map((room: any) => (
              <div key={room.id} className="flex flex-col items-center mb-6 p-4 bg-white shadow rounded-lg">
                <a href={`detail/${room.id}`} className="text-center">
                  <div className="flex-shrink-0 mb-4 mx-auto">
                    <img
                      src={room.img_thumbnail}
                      alt={`image-${room.id}`}
                      className="w-24 h-24 rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900">{room.description}</h1>
                    <div className="flex justify-center items-center mt-1">
                      <p className="text-gray-600">Size: {room.size_name}</p>
                    </div>
                    <p className="text-gray-600 mt-2">{room.description}</p>
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-[#064749]">
                      <p className="text-white text-sm">{room.statusroom}</p>
                    </div>
                    <span className="ml-2 text-gray-500">Giá: {room.price}</span>
                  </div>
                </a>
              </div>
            ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-gray-200 rounded-lg ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
        >
          Quay lại
        </button>
        <button
          onClick={handleNextPage}
          disabled={indexOfLastItem >= room.length}
          className={`px-4 py-2 bg-gray-200 rounded-lg ${indexOfLastItem >= room.length ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
        >
          Tiếp
        </button>
      </div>
    </div>
  );
};

export default ListRoom;
