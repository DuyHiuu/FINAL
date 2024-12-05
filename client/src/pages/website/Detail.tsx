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
  notification
} from "antd";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";
import { message } from "antd";
import { StarFilled } from "@ant-design/icons";

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

  const [room, setRoom] = useState<any>(null);
  const [room_id, setRoom_id] = useState(id);
  const [service_ids, setService_ids] = useState<number[]>([]);
  const [start_date, setStart_date] = useState<string>("");
  const [end_date, setEnd_date] = useState<string>("");
  const [voucher_id, setVoucher_id] = useState<number[]>([]);
  const [message, setMessage] = useState<string>("");
  const [ratings, setRatings] = useState<any[]>([]);
  const [filterRating, setFilterRating] = useState<number | null>(null);

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
    const fetchRating = async () => {
      try {
        const ratingsRes = await fetch(`${API_URL}/ratings/${id}`);
        if (!ratingsRes.ok) {
          throw new Error("Lỗi khi lấy đánh giá");
        }
        const ratingsData = await ratingsRes.json();

        setRatings(ratingsData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRating();
    fetchRoom();
  }, [id]);

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

  const maxEndDate = moment(start_date).add(30, "days").startOf("day");

  const averageRating = ratings.length
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  const [showPopup, setShowPopup] = useState(false);

  const openPopup1 = () => setShowPopup(true);
  const closePopup1 = () => setShowPopup(false);

  const filteredRatings = filterRating
    ? ratings.filter(rating => rating.rating === filterRating)
    : ratings;

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

      <div className="mt-8 max-w-md">
        <h1 className="text-3xl font-bold">{room?.size_name}</h1>
        <p className="text-green-500">{room?.statusroom}</p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 text-yellow-500">
            <StarFilled className="text-2xl" />
            <span className="text-xl font-semibold text-gray-800">
              {averageRating.toFixed(1)} / 5
            </span>
            <span className="text-gray-500 text-sm">
              ({ratings.length} lượt đánh giá)
            </span>
          </div>
          <button
            onClick={openPopup1}
            className="px-4 py-2 text-sm rounded-lg border bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Xem đánh giá
          </button>
        </div>

        <Modal
          title="Chi tiết đánh giá"
          visible={showPopup}
          onCancel={closePopup1}
          footer={null}
          width={600}
          className="rounded-lg"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFilterRating(star)}
                  className={`px-2 py-1 rounded-full ${filterRating === star ? 'bg-gray-300 text-white' : 'border text-gray-700'
                    }`}
                >
                  {Array(star)
                    .fill(null)
                    .map((_, i) => (
                      <StarFilled key={i} className="text-yellow-500 text-sm" />
                    ))}
                </button>
              ))}
              <button
                onClick={() => setFilterRating(null)}
                className="text-sm text-blue-500"
              >
                Tất cả đánh giá
              </button>
            </div>

            {filteredRatings.length === 0 ? (
              <p className="text-gray-600 text-center">Chưa có đánh giá nào.</p>
            ) : (
              filteredRatings.map((rating) => (
                <div
                  key={rating.id}
                  className="bg-gray-100 p-4 rounded-lg shadow-md border border-gray-300"
                >
                  {/* Header đánh giá */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">
                      {rating.user.name}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(rating.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {/* Số sao */}
                  <div className="mt-1 flex items-center text-yellow-500">
                    {Array(rating.rating)
                      .fill(null)
                      .map((_, i) => (
                        <StarFilled key={i} />
                      ))}
                    <span className="text-gray-500 text-sm ml-2">
                      ({rating.rating} sao)
                    </span>
                  </div>
                  {/* Nội dung đánh giá */}
                  <p className="mt-2 text-gray-600">{rating.content}</p>
                </div>
              ))
            )}
          </div>
        </Modal>
      </div>

      <form onSubmit={handleSubmit}>
        {message && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded-md mb-4">
            {message}
          </div>
        )}
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div className="space-y-6">
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
                    (current && current < moment(start_date).endOf("day")) ||
                    (current && current >= maxEndDate)
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
    </div>
  );
};

export default Detail;
