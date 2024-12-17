import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetchRooms from "../../../../api/useFetchRooms";

const ChangeRoom = () => {
  const showUrl = "http://localhost:8000/api/payments";
  const { room, loading, error } = useFetchRooms();

  const [data, setData] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${showUrl}/${id}`, {
          method: "get",
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
        console.log(error);
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

  const handleUpdateRoom = async () => {
    if (!selectedRoom) {
      message.error("Vui lòng chọn phòng!");
      return;
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
  };

  if (!data) {
    return <p>Đang tải dữ liệu...</p>;
  }

  const paymentData = data.payment;
  const sizeData = paymentData.size;

  const filteredRooms = room?.filter((rooms) => rooms.size_id > paymentData?.room?.size?.id);

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="lg:w-1/2 p-4">
        <div className="text-left">
          <strong className="text-2xl">Đổi phòng cho đơn hàng : #{paymentData?.payment?.id}</strong>
          <div className="antialiased text-gray-900">
            <div className="max-w-xl py-12 divide-y md:max-w-4xl">
              <div className="max-w-md">
                <div className="grid grid-cols-1 gap-6">
                  <form>
                    <label htmlFor="">Đổi phòng</label> <br />
                    <strong>Phòng cũ: {sizeData}</strong>
                    <select
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

                    <button
                      type="button"
                      onClick={handleUpdateRoom}
                      className="mt-4 px-6 py-2 bg-blue-500 text-white rounded"
                    >
                      Hoàn tất
                    </button>
                  </form>

                  <center>
                    <button className="text-white px-10 py-2 rounded-full bg-[#064749]">
                      <a href={`/admin/payments/detail/${paymentData?.payment?.id}`}>Quay lại</a>
                    </button>
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