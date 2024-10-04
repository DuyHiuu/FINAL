import React from "react";
import useFetchRooms from "../../api/useFetchRooms";

const ListRoom = () => {

  const { room } = useFetchRooms();
  console.log(room);


  return (
    <div>
      <form action="">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg border">

          <div className="flex items-center space-x-2">
            <label htmlFor="price" className='font-semibold'>Giá:</label>
            <select id="price" name="price" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">100-200</option>
              <option value="">200-300</option>
              <option value="">300-400</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="size" className='font-semibold'>Size:</label>
            <select id="size" name="size" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Tìm</button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300">Xóa</button>
          </div>
        </div>
      </form>


      <div className="container mx-auto p-4 lg:p-8 flex flex-col lg:flex-row">

        {/* Phần danh sách dịch vụ bên trái */}
        <div className="flex-1 w-full lg:w-1/2">
          <a href="detail">
            {room?.map((room: any) => (
              <div
                key={room.id}
                className="flex flex-col lg:flex-row items-center mb-6 p-4 bg-white shadow rounded-lg"
              >
                {/* Hình ảnh bên trái */}
                <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mr-4">
                  <img
                    src={room.image}
                    alt={`image-${room.id}`}
                    className="w-24 h-24 rounded-md"
                  />
                </div>

                {/* Nội dung bên phải */}
                <div className="flex-1 text-center lg:text-left">
                  {/* Tiêu đề */}
                  <h1 className="text-xl font-bold text-gray-900">{room.description}</h1>
                  {/* Icon và Chữ nằm cạnh nhau, căn giữa */}
                  <div className="flex justify-center lg:justify-start items-center mt-1">
                    <p className="text-gray-600">Size: {room.size_name}</p>
                  </div>
                  {/* Mô tả và thông tin bổ sung */}
                  <p className="text-gray-600 mt-2">{room.description}</p>
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-[#064749]">
                    <p className="text-white text-sm">{room.statusroom}</p>
                  </div>
                  <span className="ml-2 text-gray-500">Giá: {room.price}</span>
                </div>
              </div>
            ))}
          </a>
        </div>

        {/* Phần Google Maps bên phảii */}
        <div className="w-full lg:w-1/2 mt-6 lg:mt-0 lg:ml-8">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.3332506192323!2d105.79762327508054!3d21.019347780627584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab5c0ce45feb%3A0x5c370d2686dbfca!2zMTQyIFAuIFbFqSBQaOG6oW0gSMOgbSwgWcOqbiBIb8OgLCBD4bqndSBHaeG6pXksIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1727451838418!5m2!1svi!2s"
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>

  );
};

export default ListRoom;
