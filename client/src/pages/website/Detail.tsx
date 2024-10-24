import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useFetchServices from "../../api/useFetchServices";

const Detail = () => {
  const { service } = useFetchServices();
  const navigate = useNavigate();
  const API_URL = "http://localhost:8000/api";
  const { id } = useParams();

  const smallImageSrcs = [
    "/images/anh9.webp",
    "/images/anh10.webp",
    "/images/anh2.webp",
    "/images/anh11.webp",
  ];

  const [room, setRoom] = useState<any>(null);
  const [room_id, setRoom_id] = useState(id);
  const [service_ids, setService_ids] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [start_date, setStart_date] = useState<string>("");
  const [end_date, setEnd_date] = useState<string>("");
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`${API_URL}/rooms/${id}`, {
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
      } catch (error) {
        console.error("Lỗi khi lấy phòng:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_URL}/comments/${id}`);
        if (!res.ok) {
          throw new Error("Lỗi khi lấy bình luận");
        }
        const data = await res.json();
        setComments(data.comments || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      }
    };

    fetchRoom();
    fetchComments();
  }, [id]);

  const changeService = (serviceId: number) => {
    setService_ids((prevState) => {
      if (prevState.includes(serviceId)) {
        return prevState.filter((id) => id !== serviceId);
      }
      return [...prevState, serviceId];
    });
  };

  const changeQuantity = (serviceId: number, quantity: number) => {
    setQuantities((prevState) => ({
      ...prevState,
      [serviceId]: quantity,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const safeServiceIds = service_ids.length ? service_ids : [];
    const safeQuantities = service_ids.map((id) => quantities[id] || 0);

    const formData = new FormData();
    formData.append("service_ids", JSON.stringify(safeServiceIds));
    formData.append("room_id", room_id);
    formData.append("quantities", JSON.stringify(safeQuantities));
    formData.append("start_date", start_date);
    formData.append("end_date", end_date);

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const booking_id = data.booking_id;
        navigate(`/pay1/${booking_id}`);
      } else {
        console.error("Lỗi:", response.statusText);
        setMessage("Đặt phòng thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
      setMessage("Đã xảy ra lỗi khi kết nối đến máy chủ.");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const commentData = {
      content: newComment,
      room_id: room_id,
      user_id: localStorage.getItem("user_id"),
    };

    try {
      const response = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commentData),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments((prev) => [...prev, newCommentData.comment]);
        setNewComment("");
        alert('Thêm bình luận thành công!');
      } else {
        const errorResponse = await response.json();
        console.error("Error posting comment:", errorResponse);
        setMessage(`Thêm bình luận thất bại: ${errorResponse.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      setMessage("Đã xảy ra lỗi khi thêm bình luận.");
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-8 mt-24">
      <div className="flex flex-col lg:flex-row mb-8">
        <div className="lg:w-2/3 p-2 h-96">
          <img
            src={room?.img_thumbnail}
            alt="Large"
            className="w-full h-full object-cover rounded-lg shadow"
          />
        </div>
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

      <form onSubmit={handleSubmit}>
        <input
          type="hidden"
          name="room_id"
          value={room_id}
          onChange={(e) => setRoom_id(e.target.value)}
        />
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3 p-4">
            <strong className="text-5xl">{room?.size_name}</strong>
            <p className="flex items-center mt-10">{room?.statusroom}</p>

            <h3 className="text-left text-2xl font-semibold mt-10">Dịch vụ kèm thêm</h3>
            <div className="mt-2">
              {service?.map((service: any) => (
                <label className="flex items-center mb-2" key={service.id}>
                  <input
                    name="service_ids"
                    value={service.id}
                    onChange={() => changeService(service.id)}
                    type="checkbox"
                    className="mr-2 appearance-none checked:bg-[#064749] border rounded-full w-4 h-4 cursor-pointer"
                    checked={service_ids.includes(service.id)}
                  />
                  <span className="me-3">{service?.name}</span>
                  <span>
                    x
                    <input
                      className="border ms-3"
                      value={quantities[service.id] || ""}
                      onChange={(e) =>
                        changeQuantity(service.id, parseInt(e.target.value) || 0)
                      }
                      placeholder="Nhập số lượng dịch vụ"
                      type="number"
                      name={`quantities_${service.id}`}
                      id={`quantities_${service.id}`}
                    />
                  </span>
                </label>
              ))}
            </div>

            <h3 className="text-left text-2xl font-semibold mt-10">Mô tả</h3>
            <p className="text-left mt-1">{room?.description}</p>
          </div>

          <div className="lg:w-1/3 p-4 mt-10 border rounded-lg shadow-lg ml-0 lg:ml-4 bg-[#F2F0F2] h-full">
            <h2 className="text-2xl font-semibold mb-5">{room?.price}/Ngày</h2>
            <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-4 mb-4">
              <label className="text-left block w-full lg:w-1/2">
                <strong>Ngày vào</strong>
                <input
                  type="date"
                  name="start_date"
                  value={start_date}
                  className="border p-1 w-full mt-1"
                  onChange={(e) => setStart_date(e.target.value)}
                />
              </label>
              <label className="text-left block w-full lg:w-1/2">
                <strong>Ngày ra</strong>
                <input
                  type="date"
                  name="end_date"
                  value={end_date}
                  className="border p-1 w-full mt-1"
                  onChange={(e) => setEnd_date(e.target.value)}
                />
              </label>
            </div>

            <center>
              <button
                type="submit"
                className={`mt-2 text-white px-10 py-2 rounded-full bg-[#064749] ${!localStorage.getItem("token") ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!localStorage.getItem("token")}
              >
                Đặt phòng
              </button>
              {!localStorage.getItem("token") && (
                <p className="text-red-500 mt-2">
                  Vui lòng đăng nhập để đặt phòng.
                </p>
              )}
            </center>
          </div>
        </div>
      </form>

      {/* Phần bình luận */}
      <div className="mt-10">
        <h3 className="text-left text-2xl font-semibold">Bình luận</h3>
        {message && <p className="text-red-500">{message}</p>}
        <form onSubmit={handleAddComment} className="mt-4">
          <textarea
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="border w-full p-2 rounded"
            placeholder="Thêm bình luận..."
            required
          />
          <button
            type="submit"
            className="mt-2 text-white px-4 py-2 rounded bg-[#064749]"
          >
            Gửi
          </button>
        </form>

        {/* Hiển thị danh sách bình luận */}
        <div className="mt-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="border p-4 rounded mb-4">
                <p className="text-gray-700 break-words">{comment.content}</p>
                <p className="text-sm text-gray-500">
                  {`- Bởi ${comment.user?.name || "Người dùng"} vào ${new Date(comment.created_at).toLocaleString()}`}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Chưa có bình luận nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Detail;

