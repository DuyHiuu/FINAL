import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";

const Pay1 = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    window.scrollTo(0, 0);
  }, []);


  const showBooking = "http://localhost:8000/api/bookings";
  const showRoom = "http://localhost:8000/api/rooms";

  const [booking, setBooking] = useState<any>();
  const [room, setRoom] = useState<any>();

  useEffect(() => {
    try {

      const fetBooking = async () => {
        const res = await fetch(`${showBooking}/${id}`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        setBooking(data);
      };
      fetBooking();
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (booking?.room_id) {
      try {

        const fetRoom = async () => {
          const res = await fetch(`${showRoom}/${booking?.room_id}`, {
            method: "get",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!res.ok) {
            throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
          }

          const data = await res.json();
          setRoom(data);
        };
        fetRoom();
      } catch (error) {
        console.log(error);
      }
    }

  }, [booking?.room_id]);

  console.log(booking?.room_id);

  const toPay = () => {
    navigate(`/pay2/${id}`);
  };;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white fixed top-0 left-0 w-full h-full z-50">
        <PulseLoader color="#33CCFF" size={15} margin={2} />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row pb-20 mt-24">
      {/* Phần thông tin thanh toán */}
      <div className="lg:w-2/3 p-4">
        <div className="text-left">
          <strong className="text-5xl">Xác nhận thanh toán</strong>
          <div className="flex justify-between mt-20 w-auto">
            <div className="mr-4 sm:mr-20">
              <p className="text-left">Giá phòng:</p>
              <p className="text-left mt-2 mb-10">Phí dịch vụ:</p>
              <p className="text-left font-bold mt-2">Tổng:</p>
            </div>
            <div className="text-right ml-4 sm:ml-20">
              <p>{booking?.subTotal_room}</p>
              <p className="mt-2 mb-10">
                {booking?.subTotal_service === 0 ? "Không sử dụng dịch vụ" : booking?.subTotal_service}
              </p>
              <p className=" font-bold mt-2">{booking?.total_amount}</p>
            </div>
          </div>
        </div>

        <button className="mt-20 text-white px-10 py-2 rounded-full bg-[#064749]">
          <button onClick={toPay} className='block'>Thanh Toán</button>
        </button>
      </div>

      {/* Phần thông tin đặt phòng */}
      <div className="lg:w-1/3 p-4 mt-10 border rounded-lg shadow-lg ml-0 lg:ml-4 bg-[#F2F0F2]">
        <img
          src={room?.img_thumbnail}
          alt={room?.size_name}
          className="w-full h-60 object-cover rounded-lg shadow mb-10"
        />
        <strong className="text-4xl font-semibold">{room?.size_name}</strong>
        <div className="flex items-center mt-3 mb-3">
          <span className="flex items-center justify-center mr-2">
            {/* Icon cho phòng */}
          </span>
          <p className="flex items-center">{room?.description}</p>
        </div>
        {/* <p>Vị trí {room?.location}</p> */}

        {/* Ngày vào và Ngày ra */}
        <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-4 mb-10 mt-10">
          <label className="text-left block w-full lg:w-1/2">
            <strong>Ngày vào</strong>
            <input type="date" value={booking?.start_date} readOnly className="border p-1 w-full mt-1" />
          </label>
          <label className="text-left block w-full lg:w-1/2">
            <strong>Ngày ra</strong>
            <input type="date" value={booking?.end_date} readOnly className="border p-1 w-full mt-1" />
          </label>
        </div>

        <p className="text-left mt-4">Mọi chi phí đã được tính tổng</p>

        {/* Chi phí */}
        <div className="flex justify-between mt-4">
          <div>
            <p className="text-left font-bold mt-2">Tổng:</p>
          </div>
          <div className="text-right">
            <p className="font-bold mt-2">{booking?.total_amount}</p>
          </div>
        </div>

        <p className="font-bold mt-5 text-red-500 text-xs">Phòng chỉ có thể được hủy trước ngày check-in 48 tiếng!</p>
      </div>
    </div>
  );
};

export default Pay1;
