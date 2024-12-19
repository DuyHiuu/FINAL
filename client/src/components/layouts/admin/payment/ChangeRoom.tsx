import { Button, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetchRooms from "../../../../api/useFetchRooms";

const ChangeRoom = () => {
  const showUrl = "http://localhost:8000/api/payments";
  const { room, loading, error } = useFetchRooms();

  const [data, setData] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [availableQuantity, setAvailableQuantity] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${showUrl}/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }
        const data = await res.json();
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (room && room.length > 0) {
      const filteredRooms = room.filter((rooms) => rooms.size_id >= data?.payment?.room?.size?.id);
      if (filteredRooms.length > 0) {
        setSelectedRoom(filteredRooms[0].id);
      }
    }
  }, [room, data]);

  useEffect(() => {
    if (selectedRoom) {
      const fetchRoomStatus = async () => {
        try {
          const formData = new FormData();
          formData.append("room_id", selectedRoom);
          formData.append("start_date", data?.payment?.booking?.start_date);
          formData.append("end_date", data?.payment?.booking?.end_date);

          const res = await fetch(`http://localhost:8000/api/bookings/status`, {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
          }

          const responseData = await res.json();
          setAvailableQuantity(responseData.available_quantity || 0);
        } catch (error) {
          console.error(error);
        }
      };
      fetchRoomStatus();
    }
  }, [selectedRoom, data]);

  if (!data) {
    return <p>Đang tải dữ liệu...</p>;
  }

  const paymentData = data.payment;
  const sizeData = paymentData.room.size.name;

  const handleUpdateRoom = async () => {
    if (!selectedRoom) {
      message.error("Vui lòng chọn phòng!");
      return;
    }


    if (availableQuantity <= 0) {
      message.error("Phòng đã hết. Vui lòng chọn phòng khác.");
      return;
    }

    // const formData1 = new FormData();
    // formData1.append("room_id", selectedRoom);
    // formData1.append("start_date", paymentData?.booking?.start_date);
    // formData1.append("end_date", paymentData?.booking?.start_date);
    // const checkResponse = await fetch(`http://localhost:8000/api/bookings/status`, {
    //   method: "POST",
    //   body: formData1,
    // });

    // if (!checkResponse.ok) {
    //   message.error("Phòng đã hết. Vui lòng chọn phòng khác.");
    //   navigate('/danhsach');
    // } else {
    try {
      const requestBody = {
        room_id: selectedRoom,
      };

      const res = await fetch(`${showUrl}/${id}/changeStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
      }


      try {
        const requestBody = {
          room_id: selectedRoom,
        };

        const res = await fetch(`${showUrl}/${id}/changeStatus`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }


        message.success("Cập nhật phòng thành công!");
        setTimeout(() => navigate(`/admin/payments/detail/${id}`), 1500);
      } catch (error) {
        console.error(error);
        message.error("Cập nhật phòng thất bại!");
      }

      // }

    };

    const filteredRooms = room?.filter((rooms) => rooms.size_id >= paymentData.room.size_id);

    return (
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2 p-4">
          <div className="text-left">
            <strong className="text-2xl">Đổi phòng cho đơn hàng: #{paymentData.id}</strong>
            <div className="antialiased text-gray-900">
              <div className="max-w-xl py-12 divide-y md:max-w-4xl">
                <div className="max-w-md">
                  <div className="grid grid-cols-1 gap-6">
                    <form>
                      <label htmlFor="room-select">Đổi phòng</label> <br />
                      <strong>Phòng cũ: {sizeData}</strong>
                      <select
                        id="room-select"
                        value={selectedRoom || ""}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        className="block w-full mt-1 rounded-md bg-gray-100 p-2 border-2 border-black-300"
                      >
                        {filteredRooms && filteredRooms.length > 0 ? (
                          filteredRooms.map((rooms) => (
                            <option key={rooms.id} value={rooms.id}>
                              {rooms.size_name}
                            </option>
                          ))
                        ) : (
                          <option>Không có phòng phù hợp</option>
                        )}
                      </select>

                      {availableQuantity !== null && (
                        <div
                          className={`mt-2 text-sm ${availableQuantity > 0 ? "text-green-500" : "text-red-500"
                            }`}
                        >
                          {availableQuantity > 0
                            ? `Còn ${availableQuantity} phòng.`
                            : "Đã hết phòng này."}
                        </div>
                      )}

                      <Button
                        type="primary"
                        onClick={handleUpdateRoom}
                        className="mt-4 w-full"
                        disabled={availableQuantity <= 0}
                      >
                        Hoàn tất
                      </Button>
                    </form>

                    <center>
                      <Button className="text-white px-10 py-2 rounded-full bg-[#064749]">
                        <a href={`/admin/payments/detail/${paymentData?.id}`}>Quay lại</a>
                      </Button>
                    </center>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default ChangeRoom;
