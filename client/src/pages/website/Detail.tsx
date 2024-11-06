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
  Tooltip,
} from "antd";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const missingQuantities = service_ids.filter(
      (id) => !quantities[id] || quantities[id] <= 0
    );
    if (missingQuantities.length > 0) {
      setMessage("Vui lòng nhập số lượng cho tất cả các dịch vụ đã chọn.");
      return;
    }

    const uncheckedQuantities = Object.keys(quantities).filter((id) => {
      return (
        quantities[parseInt(id)] > 0 && !service_ids.includes(parseInt(id))
      );
    });
    if (uncheckedQuantities.length > 0) {
      setMessage("Vui lòng chọn dịch vụ cho số lượng đã nhập.");
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
        alert("Thêm bình luận thành công!");
      } else {
        const errorResponse = await response.json();
        console.error("Error posting comment:", errorResponse);
        setMessage(
          `Thêm bình luận thất bại: ${
            errorResponse.message || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      setMessage("Đã xảy ra lỗi khi thêm bình luận.");
    }
  };

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];
  const maxDate = new Date(today.setMonth(today.getMonth() + 2))
    .toISOString()
    .split("T")[0];

  const [openServiceId, setOpenServiceId] = useState(null);
  const toggleDescription = (id) => {
    setOpenServiceId(openServiceId === id ? null : id);
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
<Row gutter={0}>
  {/* Phần 1: Ảnh chính chiếm 50% chiều rộng */}
  <Col span={12}> {/* Chiếm 50% chiều rộng */}
    <Card
      hoverable
      cover={
        <img
          alt="Room"
          src={room?.img_thumbnail}
          style={{
            width: "100%",  // Chiếm toàn bộ chiều rộng của Col
            height: "500px",  // Chiều cao của ảnh chính bằng tổng chiều cao của 4 ảnh phụ
            objectFit: "cover",  // Đảm bảo ảnh không bị méo, đầy khung
            borderRadius: "8px", // Cải thiện viền ảnh
          }}
        />
      }
    >
      <strong className="text-2xl">{room?.size_name}</strong>
      <p>{room?.statusroom}</p>
    </Card>
  </Col>

  {/* Phần 2: Ảnh phụ chiếm 50% chiều rộng */}
  <Col span={12}> {/* Chiếm 50% chiều rộng */}
    <Row gutter={8} style={{ marginTop: "8px" }}>
      {/* Ảnh đầu tiên, chiếm 1/2 chiều rộng */}
      <Col span={12}>
        <img
          src="/images/anh9.webp"
          alt="Small"
          className="w-full object-cover rounded-md"
          style={{ height: "250px", objectFit: "cover", borderRadius: "8px" }}
        />
      </Col>
      {/* Ảnh thứ hai, chiếm 1/2 chiều rộng */}
      <Col span={12}>
        <img
          src="/images/anh10.webp"
          alt="Small"
          className="w-full object-cover rounded-md"
          style={{ height: "250px", objectFit: "cover", borderRadius: "8px" }}
        />
      </Col>
    </Row>

    <Row gutter={8} style={{ marginTop: "8px" }}>
      {/* Ảnh thứ ba, chiếm 1/2 chiều rộng */}
      <Col span={12}>
        <img
          src="/images/anh2.webp"
          alt="Small"
          className="w-full object-cover rounded-md"
          style={{ height: "250px", objectFit: "cover", borderRadius: "8px" }}
        />
      </Col>
      {/* Ảnh thứ tư, chiếm 1/2 chiều rộng */}
      <Col span={12}>
        <img
          src="/images/anh11.webp"
          alt="Small"
          className="w-full object-cover rounded-md"
          style={{ height: "250px", objectFit: "cover", borderRadius: "8px" }}
        />
      </Col>
    </Row>
  </Col>
</Row>



      <form onSubmit={handleSubmit}>
        <div className="mt-8">
          <h3 className="text-xl font-semibold">Dịch vụ kèm theo</h3>
          <div>
            {service?.map((service: any) => (
              <div key={service.id} className="flex items-center">
                <Checkbox
                  checked={service_ids.includes(service.id)}
                  onChange={() => changeService(service.id)}
                >
                  {service?.name}
                </Checkbox>
                <Tooltip title={service?.description}>
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
                  />
                </Tooltip>
                {openServiceId === service.id && (
                  <div className="mt-2 text-sm text-gray-600">
                    {service?.description}
                  </div>
                )}
                {service_ids.includes(service.id) && (
                  <Input
                    type="number"
                    min={1}
                    value={quantities[service.id] || ""}
                    onChange={(e) => {
                      setQuantities({
                        ...quantities,
                        [service.id]: parseInt(e.target.value) || 0,
                      });
                    }}
                    style={{ width: "100px", marginLeft: "10px" }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold">Thời gian đặt phòng</h3>
            <Row gutter={16}>
              <Col span={12}>
                <DatePicker
                  value={start_date ? moment(start_date) : null}
                  onChange={(date) =>
                    setStart_date(date?.format("YYYY-MM-DD") || "")
                  }
                  placeholder="Ngày bắt đầu"
                  style={{ width: "100%" }}
                  disabledDate={(current) =>
                    current && current < moment().endOf("day")
                  }
                />
              </Col>
              <Col span={12}>
                <DatePicker
                  value={end_date ? moment(end_date) : null}
                  onChange={(date) =>
                    setEnd_date(date?.format("YYYY-MM-DD") || "")
                  }
                  placeholder="Ngày kết thúc"
                  style={{ width: "100%" }}
                  disabledDate={(current) =>
                    current && current < moment().endOf("day")
                  }
                />
              </Col>
            </Row>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold">Bình luận</h3>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border p-4 rounded-md shadow-sm">
                <p>{comment.content}</p>
                <p className="text-gray-500 text-sm">{comment.user_name}</p>
              </div>
            ))}
          </div>
          <TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Thêm bình luận..."
            rows={4}
            style={{ marginTop: "16px" }}
          />
          <Button
            type="primary"
            onClick={handleAddComment}
            style={{ marginTop: "8px" }}
            disabled={!newComment.trim()}
          >
            Thêm Bình luận
          </Button>
        </div>

        <div className="mt-8">
          <Button type="primary" htmlType="submit" size="large" block>
            Xác nhận đặt phòng
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Detail;
