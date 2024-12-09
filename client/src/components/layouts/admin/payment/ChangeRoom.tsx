import { Col, Divider, Row } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Text } from "recharts";
import useFetchRooms from "../../../../api/useFetchRooms";

const ChangeRoom = () => {
  const showUrl = "http://localhost:8000/api/payments";
  const { room, loading, error } = useFetchRooms();

  const [data, setData] = useState(null);

  const { id } = useParams();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const navigate = useNavigate();

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

  const handleUpdateRoom = async () => {
    if (!selectedRoom) {
      alert("Vui lòng chọn phòng!");
      return;
    }

    try {

      const requestBody = {
        room_id: selectedRoom,
      };

      console.log(selectedRoom);


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

      alert("Cập nhật phòng thành công!");
      navigate(`/admin/payments/detail/${id}`);
    } catch (error) {
      console.error(error);
      alert("Cập nhật phòng thất bại!");
    }
  };


  if (!data) {
    return <p>Đang tải dữ liệu...</p>;
  }

  const paymentData = data.payment;
  const sizeData = paymentData.size;

  const filteredRooms = room?.filter((rooms) => rooms.size_id >= paymentData?.room?.size?.id);


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
