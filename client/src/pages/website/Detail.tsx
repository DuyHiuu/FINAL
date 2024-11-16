import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useFetchServices from "../../api/useFetchServices";
import { PulseLoader } from "react-spinners";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { TagOutlined } from "@ant-design/icons";
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
  Modal
} from "antd";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";
import useFetchVoucher from "../../api/useFetchVoucher";

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

  const { vouchers } = useFetchVoucher();

  const [voucherPopUp, setVoucherPopUp] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const openVoucherPopUp = () => setVoucherPopUp(true);
  const closeVoucherPopUp = () => setVoucherPopUp(false);

  const handleVoucherSelect = (voucher) => {
    if (voucher && voucher.id) {
      if (selectedVoucher?.id === voucher.id) {
        setSelectedVoucher(null);
      } else {
        setSelectedVoucher(voucher);
      }
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    if (selectedVoucher && selectedVoucher.id) {
      formData.append("voucher_id", selectedVoucher.id ? selectedVoucher.id.toString() : "");
    }

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
        <Col span={12}>
          <Card
            hoverable
            cover={
              <img
                alt="Room"
                src={room?.img_thumbnail}
                style={{
                  width: "100%",
                  height: "500px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            }
          ></Card>
        </Col>

        <Col span={12}>
          <Row gutter={8} style={{ marginTop: "8px" }}>
            {room?.room_images?.slice(0, 2).map((image: string, index: number) => (
              <Col key={index} span={12}>
                <img
                  src={image}
                  alt={`Small ${index + 1}`}
                  className="w-full object-cover rounded-md"
                  style={{ height: "250px", objectFit: "cover", borderRadius: "8px" }}
                />
              </Col>
            ))}
          </Row>

          <Row gutter={8} style={{ marginTop: "8px" }}>
            {room?.room_images?.slice(2, 4).map((image: string, index: number) => (
              <Col key={index + 2} span={12}>
                <img
                  src={image}
                  alt={`Small ${index + 3}`}
                  className="w-full object-cover rounded-md"
                  style={{ height: "250px", objectFit: "cover", borderRadius: "8px" }}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>


      <form onSubmit={handleSubmit}>
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
                        {service?.name} ({service?.price?.toLocaleString("vi-VN")} VNĐ)
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
                      <div className="mt-2 text-sm text-blue-600 pl-6">
                        {service?.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>

            <div>
              <h3 className="text-xl font-semibold">Mô tả</h3>
              <p className="text-gray-700">
                {room?.description}
              </p>
            </div>
          </div>

          {/* Phần đặt phòng */}
          <div className="bg-gray-50 p-6 rounded-md shadow-md max-w-md mx-auto h-[250px]">
            <h2 className="text-xl font-semibold text-gray-800">
              {room?.price?.toLocaleString("vi-VN")} VNĐ / ngày
            </h2>

            <div className="mt-4 flex justify-between items-center space-x-3">
              <div className="w-1/2">
                <label className="block text-black text-sm font-bold">Ngày check-in</label>
                <DatePicker
                  value={start_date ? moment(start_date) : null}
                  onChange={(date) => setStart_date(date?.format("YYYY-MM-DD") || "")}
                  placeholder="Ngày check-in"
                  className="w-full mt-1 text-sm"
                  disabledDate={(current) => current && current < moment().endOf("day")}
                />
              </div>
              <div className="w-1/2">
                <label className="block text-black text-sm font-bold">Ngày check-out</label>
                <DatePicker
                  value={end_date ? moment(end_date) : null}
                  onChange={(date) => setEnd_date(date?.format("YYYY-MM-DD") || "")}
                  placeholder="Ngày check-out"
                  className="w-full mt-1 text-sm"
                  disabledDate={(current) => current && current < moment().endOf("day")}
                />
              </div>
            </div>

            {/* Voucher Selection */}
            <div className="mt-4">
              <label className="block text-black text-sm font-bold">Chọn voucher</label>
              <Button onClick={openVoucherPopUp} className="w-full mt-1 text-sm">
                <TagOutlined />
                <span>{selectedVoucher ? selectedVoucher.name : "Voucher"}</span>
              </Button>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              className="w-full py-2 mt-4 text-sm font-medium rounded-md bg-[#064749]"
            >
              Đặt phòng
            </Button>

            {/* Voucher Modal */}
            <Modal
              title="Các voucher dành cho bạn"
              open={voucherPopUp}
              onCancel={closeVoucherPopUp}
              footer={null}
            >
              <div className="space-y-2">
                {vouchers.map((voucher) => (
                  <div key={voucher.id} className="flex items-center">
                    <Checkbox
                      checked={selectedVoucher?.id === voucher.id}
                      onChange={() => handleVoucherSelect(voucher)}
                    >
                      {voucher.name}
                    </Checkbox>
                  </div>
                ))}
              </div>
            </Modal>
          </div>

        </div>
      </form>

      <div className="mt-6 ">
        <h3 className="text-lg font-semibold text-gray-700">Bình luận</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
          {comments.map((comment) => (
            <div key={comment.id} className="border p-3 rounded-lg shadow-sm bg-white">
              <p className="text-gray-800 text-sm">{comment.content}</p>
              <p className="text-gray-400 text-xs mt-2">
                Bình luận bởi: <span className="text-gray-600">{comment.user?.name}</span> - ngày:{" "}
                {new Date(comment.created_at).toLocaleDateString("vi-VN")}
              </p>
            </div>
          ))}
        </div>
        <TextArea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Thêm bình luận..."
          rows={3}
          className="w-[350px] mt-4 p-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary block"
        />

        <Button
          type="primary"
          onClick={handleAddComment}
          className="w-[350px] mt-3 py-2 text-sm font-medium rounded-md block"
          disabled={!newComment.trim()}
        >
          Thêm Bình luận
        </Button>

      </div>


    </div>
  );
};

export default Detail;
