import React,{ useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetchServices from "../../api/useFetchServices";

const Detail = () => {

  const {service} = useFetchServices();

  const smallImageSrcs = [
    "/images/anh9.webp", // Đường dẫn ảnh nhỏ 1
    "/images/anh10.webp", // Đường dẫn ảnh nhỏ 2
    "/images/anh2.webp", // Đường dẫn ảnh nhỏ 3
    "/images/anh11.webp", // Đường dẫn ảnh nhỏ 4
  ];
  const row = [
    {
      icon: (
        <img
          src="/images/icon1.jpg" // Đường dẫn icon chó mèo
          alt="dog-cat-icon"
          className="h-8 w-8"
        />
      ),
    },
  ];

  const API_URL = "http://localhost:8000/api";

  const {id} = useParams();

  const [room, setRoom] = useState<any>();
  //hàm để get dữ liệu
  useEffect(() => {
    try {
      // fetroom để get dữ liệu
      const fetroom = async () => {
        const res = await fetch(`${API_URL}/rooms/${id}`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json(); // Chuyển dữ liệu thành JSON
        setRoom(data); // Lưu dữ liệu vào state
      };
      fetroom();
    } catch (error) {
      console.log(error);
    }
  }, []);
  
  return (
    <div className="container mx-auto p-4 lg:p-8 mt-24">
      {/* Phần hình ảnh */}
      <div className="flex flex-col lg:flex-row mb-8">
        {/* Hình ảnh lớn bên trái */}
        <div className="lg:w-2/3 p-2 h-96">
          <img
            src={room?.img_thumbnail}
            alt="Large"
            className="w-full h-full object-cover rounded-lg shadow"
          />
        </div>

        {/* Hình ảnh nhỏ bên phải */}
        <div className="lg:w-1/3 p-2 flex flex-col">
          <div className="flex mb-2 h-48">
            <img
              src={smallImageSrcs[0]}
              alt="Small 1"
              className="w-1/2 h-full object-cover rounded-lg shadow mr-1"
            />
            <img
              src={smallImageSrcs[1]}
              alt="Small 2"
              className="w-1/2 h-full object-cover rounded-lg shadow ml-1"
            />
          </div>
          <div className="flex h-40">
            <img
              src={smallImageSrcs[2]}
              alt="Small 3"
              className="w-1/2 h-full object-cover rounded-lg shadow mr-1"
            />
            <img
              src={smallImageSrcs[3]}
              alt="Small 4"
              className="w-1/2 h-full object-cover rounded-lg shadow ml-1"
            />
          </div>
        </div>
      </div>

      {/* Phần thông tin */}
      <div className="flex flex-col lg:flex-row">
        {/* Phần thông tin phòng */}
        <div className="lg:w-2/3 p-4">
          <div className="text-left">
            <strong className="text-5xl">{room?.size_name}</strong>
            <div className="flex items-center mt-10">
              <p className="flex items-center">{room?.statusroom}</p>
            </div>
          </div>
          <h3 className="text-left text-2xl font-semibold mt-10">Dịch vụ kèm thêm</h3>
          <div className="mt-2">
          {service?.map((service:any) => (
            <label className="flex items-center mb-2">
              <div key={service.id}>
              <input
              type="checkbox"
              className="mr-2 appearance-none checked:bg-[#064749] border rounded-full w-4 h-4 cursor-pointer"
            />
            <span>{service?.name}</span>
              </div>

          </label>
          ))}

          </div>

          <h3 className="text-left text-2xl font-semibold mt-10">Mô tả</h3>
          <p className="text-left mt-1">
            {room?.description}
          </p>
        </div>

        {/* Phần thông tin đặt phòngg */}
        <div className="lg:w-1/3 p-4 mt-10 border rounded-lg shadow-lg ml-0 lg:ml-4 bg-[#F2F0F2] h-auto lg:h-96">
          <h2 className="text-2xl font-semibold mb-5">{room?.price}/Ngày</h2>

          {/* Ngày vào và Ngày ra nằm ngang */}
          <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-4 mb-4">
            <label className="text-left block w-full lg:w-1/2">
              <strong>Ngày vào</strong>
              <input type="date" className="border p-1 w-full mt-1" />
            </label>
            <label className="text-left block w-full lg:w-1/2">
              <strong>Ngày ra</strong>
              <input type="date" className="border p-1 w-full mt-1" />
            </label>
          </div>

          {/* Số lượng thú cưng */}
          <div className="flex items-center mt-1">
              <p className="flex items-center">{room?.size_name}</p>
            </div>
          <p className="text-left mt-4">Mọi chi phí đã được tính tổng</p>

          {/* Chi phí chia dọc hai bên */}
          <div className="flex justify-between mt-4">
            <div>
              <p className="text-left">Giá phòng:</p>
              <p className="text-left mt-2">Phí dịch vụ:</p>
              <p className="text-left font-bold mt-2">Tổng:</p>
            </div>
            <div className="text-right">
              <p>880.000</p>
              <p className="mt-2">330.000</p>
              <p className="font-bold mt-2">1.121.000</p>
            </div>
          </div>

          <center>
          <button className="mt-2 text-white px-10 py-2 rounded-full bg-[#064749]">
            <a href="/pay1">Đặt phòng</a>
          </button>
          </center>

        </div>
      </div>
    </div>
  );
};

export default Detail;
