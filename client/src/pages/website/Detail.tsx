import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useFetchServices from "../../api/useFetchServices";
import { PulseLoader } from "react-spinners";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Tooltip,
  Modal,
} from "antd";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";
import { message } from "antd";


const Detail = () => {
  const { service } = useFetchServices();
  const navigate = useNavigate();
  const API_URL = "http://localhost:8000/api";
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    window.scrollTo(0, 0);
  }, []);

  const smallImageSrcs = [
    "/images/anh9.webp",
    "/images/anh10.webp",
    "/images/anh2.webp",
    "/images/anh11.webp",
  ];

  const [room, setRoom] = useState<any>(null);
  const [room_id, setRoom_id] = useState(id);
  const [service_ids, setService_ids] = useState<number[]>([]);
  const [start_date, setStart_date] = useState<string>("");
  const [end_date, setEnd_date] = useState<string>("");
  const [comments, setComments] = useState<any[]>([]);
  const [voucher_id, setVoucher_id] = useState<number[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(4);

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
      const res = await fetch(`${API_URL}/comments/${id}`);
      const data = await res.json();
      setComments(data.comments || []);
    };

    fetchRoom();
    fetchComments();
  }, [id]);
  const handleShowMoreComments = () => {
    setVisibleCommentsCount((prev) => prev + 4); // Tăng thêm 4 bình luận
  };
  const changeService = (serviceId: number) => {
    setService_ids((prevState) => {
      if (prevState.includes(serviceId)) {
        return prevState.filter((id) => id !== serviceId);
      }
      return [...prevState, serviceId];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra nếu ngày chưa được chọn
    if (!start_date || !end_date) {
      setMessage("Vui lòng chọn ngày check-in và check-out trước khi đặt phòng.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const safeServiceIds = service_ids.length ? service_ids : [];

    const formData = new FormData();
    formData.append("service_ids", JSON.stringify(safeServiceIds));
    formData.append("room_id", room_id);
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
        alert("Thêm bình luận thành công!");
      } else {
        const errorResponse = await response.json();
        console.error("Error posting comment:", errorResponse);
        setMessage(
          `Thêm bình luận thất bại: ${errorResponse.message || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      setMessage("Đã xảy ra lỗi khi thêm bình luận.");
    }
  };

  const [openServiceId, setOpenServiceId] = useState(null);
  const toggleDescription = (id) => {
    setOpenServiceId(openServiceId === id ? null : id);
  };

  const [roomImages, setRoomImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchRoomImages = async () => {
      try {
        const res = await fetch(`${API_URL}/roomImages/${id}`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }
        const jsonResponse = await res.json();
        const images = jsonResponse.data.map((item: any) => {
          return item.image_url.replace("http://localhost:8000/storage/", "");
        });

        setRoomImages(images);
      } catch (error) {
        console.error("Lỗi khi lấy phòng:", error);
      }
    };

    fetchRoomImages();
  }, [id]);

  const [popupImage, setPopupImage] = useState(null);

  const openPopup = (image) => {
    setPopupImage(image);
  };

  const closePopup = () => {
    setPopupImage(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white fixed top-0 left-0 w-full h-full z-50">
        <PulseLoader color="#33CCFF" size={15} margin={2} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8 mt-24">
      <Row gutter={16}>
        <Col span={12}>
          <Card
            hoverable
            cover={
              <div
                className="relative overflow-hidden rounded-lg h-[500px]"
                onClick={() => openPopup(room?.img_thumbnail)}
              >
                <img
                  alt="Room"
                  src={room?.img_thumbnail}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                />
              </div>
            }
            style={{ height: "500px", borderRadius: "8px" }}
          ></Card>
        </Col>

        <Col span={12}>
          <Row gutter={[8, 8]} style={{ height: "500px" }}>
            {roomImages.slice(0, 4).map((image, index) => (
              <Col key={index} span={12} style={{ height: "50%" }}>
                <div
                  className="relative overflow-hidden rounded-lg h-full"
                  onClick={() => openPopup(image)}
                >
                  <img
                    src={image}
                    alt={`Room ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {popupImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={popupImage}
              alt="Popup"
              className="w-[600px] h-[600px] rounded-lg"
            />
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-white text-xl bg-black bg-opacity-50 rounded-full p-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8">
        {message && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded-md mb-4">
            {message}
          </div>
        )}
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{room?.size_name}</h1>
            <p className="text-green-500">{room?.statusroom}</p>

            <div>
              <h3 className="text-xl font-semibold">Dịch vụ kèm theo</h3>
              <div className="space-y-2">
                {service?.map((service: any) => (
                  <div key={service.id} className="py-2">
                    <div className="flex items-center">
                      <Checkbox
                        checked={service_ids.includes(service.id)}
                        onChange={() => changeService(service.id)}
                        className="mr-2"
                      >
                        {service?.name} (
                        {service?.price?.toLocaleString("vi-VN")} VNĐ)
                      </Checkbox>
                      <Button
                        type="link"
                        icon={
                          openServiceId === service.id ? (
                            <ChevronUpIcon className="h-5 w-5" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5" />
                          )
                        }
                        onClick={() => toggleDescription(service.id)}
                        className="ml-2"
                      />
                    </div>

                    {openServiceId === service.id && (
                      <div className="mt-2 text-sm text-[#064749] pl-6">
                        {service?.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Mô tả</h3>
              <p className="text-gray-700">{room?.description}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-md shadow-md max-w-md mx-auto h-[200px]">
            <h2 className="text-xl font-semibold text-gray-800">
              {room?.price?.toLocaleString("vi-VN")} VNĐ / ngày
            </h2>

            <div className="mt-4 flex justify-between items-center space-x-3">
              <div className="w-1/2">
                <label className="block text-black text-sm font-bold">
                  Ngày check-in
                </label>
                <DatePicker
                  value={start_date ? moment(start_date) : null}
                  onChange={(date) =>
                    setStart_date(date?.format("YYYY-MM-DD") || "")
                  }
                  placeholder="Ngày check-in"
                  className="w-full mt-1 text-sm"
                  disabledDate={(current) =>
                    current && current < moment().endOf("day")
                  }
                />
              </div>
              <div className="w-1/2">
                <label className="block text-black text-sm font-bold">
                  Ngày check-out
                </label>
                <DatePicker
                  value={end_date ? moment(end_date) : null}
                  onChange={(date) =>
                    setEnd_date(date?.format("YYYY-MM-DD") || "")
                  }
                  placeholder="Ngày check-out"
                  className="w-full mt-1 text-sm"
                  disabledDate={(current) =>
                    (current && current < moment().endOf("day")) ||
                    (current && current < moment(start_date).endOf("day"))
                  }
                />
              </div>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              className="w-full py-2 mt-4 text-sm font-medium rounded-md bg-[#064749]"
            >
              Đặt phòng
            </Button>
          </div>
        </div>
      </form>

      <div className="mt-8 max-w-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Bình luận</h3>
        <div className="space-y-4">
          {comments.slice(0, visibleCommentsCount).map((comment) => (
            <div
              key={comment.id}
              className="bg-white p-4 rounded-md border border-gray-200 w-full"
            >
              <p className="text-gray-700 text-sm">{comment.content}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <div className="font-medium">{comment.user?.name}</div>
                <span>{new Date(comment.created_at).toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
          ))}
        </div>

        {comments.length > visibleCommentsCount && (
          <div className="mt-4 text-center">
            <Button
              type="link"
              onClick={handleShowMoreComments}
              className="text-blue-500"
            >
              Xem thêm
            </Button>
          </div>
        )}

        <div className="mt-6 max-w-md w-full">
          <TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Thêm bình luận..."
            rows={3}
            className="p-3 text-sm rounded-md border border-gray-300 w-full"
          />
          <Button
            type="primary"
            onClick={handleAddComment}
            className="mt-4 py-2 text-sm font-medium rounded-md bg-blue-500 w-full text-white hover:bg-blue-600 disabled:bg-gray-300"
            disabled={!newComment.trim()}
          >
            Thêm Bình luận
          </Button>
        </div>
      </div>


    </div>
  );
};

export default Detail;
