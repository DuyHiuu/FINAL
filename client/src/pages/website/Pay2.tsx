import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Button, Card, Spin, Typography, DatePicker, Modal, Checkbox } from 'antd';
import useFetchPayMethod from '../../api/useFetchPayMethod';
import { PulseLoader } from 'react-spinners';
import moment from 'moment';
import useFetchVoucher from '../../api/useFetchVoucher';
import { TagOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Pay2 = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const showBooking = "http://localhost:8000/api/bookings";
    const showRoom = "http://localhost:8000/api/rooms";

    const [booking, setBooking] = useState<any>();
    const [room, setRoom] = useState<any>();

    useEffect(() => {
        const fetBooking = async () => {
            try {
                const res = await fetch(`${showBooking}/${id}`);
                if (!res.ok) throw new Error(`Error: ${res.status} - ${res.statusText}`);
                const data = await res.json();
                setBooking(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetBooking();
    }, [id]);

    useEffect(() => {
        if (booking?.room_id) {
            const fetRoom = async () => {
                try {
                    const res = await fetch(`${showRoom}/${booking?.room_id}`);
                    if (!res.ok) throw new Error(`Error: ${res.status} - ${res.statusText}`);
                    const data = await res.json();
                    setRoom(data);
                } catch (error) {
                    console.error(error);
                }
            };
            fetRoom();
        }
    }, [booking?.room_id]);

    const [pet_name, setPet_name] = useState("");
    const [pet_type, setPet_type] = useState("Chó");
    const [pet_description, setPet_description] = useState("");
    const [pet_health, setPet_health] = useState("Khỏe mạnh");
    const [user_id, setUser_id] = useState("");
    const [paymethod_id, setPaymethod_id] = useState(1);
    const [total_amount, setTotal_amount] = useState(0);

    useEffect(() => {
        if (booking?.total_amount) {
            setTotal_amount(booking.total_amount);
        }
    }, [booking]);

    const { paymethod } = useFetchPayMethod();
    const showUserUrl = "http://localhost:8000/api/users";
    const [user_name, setUser_name] = useState("");
    const [user_address, setUser_address] = useState("");
    const [user_email, setUser_email] = useState("");
    const [user_phone, setUser_phone] = useState("");
    const [voucher_id, setVoucher_id] = useState<number[]>([]);

    useEffect(() => {
        const user_idFromStorage = localStorage.getItem("user_id");
        setUser_id(user_idFromStorage || "");
    }, []);

    useEffect(() => {
        if (user_id) {
            const fetchUser = async () => {
                try {
                    const res = await fetch(`${showUserUrl}/${user_id}`);
                    if (res.ok) {
                        const user = await res.json();
                        setUser_name(user.name || "N/A");
                        setUser_email(user.email || "N/A");
                        setUser_phone(user.phone || "N/A");
                        setUser_address(user.address || "N/A");
                    } else {
                        console.log("Error fetching user data");
                    }
                } catch (error) {
                    console.log("Connection error:", error);
                }
            };
            fetchUser();
        }
    }, [user_id]);

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

    const addPay = "http://localhost:8000/api/payments";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("booking_id", id);
        formData.append("pet_name", pet_name);
        formData.append("pet_type", pet_type);
        formData.append("pet_description", pet_description);
        formData.append("pet_health", pet_health);
        formData.append("user_name", user_name);
        formData.append("user_address", user_address);
        formData.append("user_email", user_email);
        formData.append("user_phone", user_phone);
        formData.append("user_id", user_id);
        formData.append("paymethod_id", paymethod_id);
        formData.append("total_amount", total_amount);

        if (selectedVoucher && selectedVoucher.id) {
            formData.append("voucher_id", selectedVoucher.id ? selectedVoucher.id.toString() : "");
        }

        try {
            const response = await fetch(`${addPay}`, {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                navigate("/history1");
            } else {
                console.error("Error:", response.statusText);
            }
        } catch (error) {
            console.error("API connection error:", error);
        }
    };

    let finalAmount = total_amount;

    if (selectedVoucher) {
        if (selectedVoucher.type === 'amount') {
            // Giảm giá theo số tiền cố định
            finalAmount -= selectedVoucher.discount;
        } else if (selectedVoucher.type === '%') {
            // Giảm giá theo phần trăm
            finalAmount -= (total_amount * selectedVoucher.discount) / 100;
        }
    }

    if (finalAmount < 0) {
        finalAmount = 0;
    }

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 500);
        window.scrollTo(0, 0);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white fixed top-0 left-0 w-full h-full z-50">
                <PulseLoader color="#33CCFF" size={15} margin={2} />
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row pb-20 mt-24">
            {/* Customer Information */}
            <Form className="lg:w-1/2 p-4" onSubmitCapture={handleSubmit}>
                <Title level={2}>Thông tin khách hàng</Title>

                <Form.Item label="Tên khách hàng">
                    <Input value={user_name} onChange={(e) => setUser_name(e.target.value)} />
                </Form.Item>

                <Form.Item label="Email">
                    <Input value={user_email} onChange={(e) => setUser_email(e.target.value)} />
                </Form.Item>

                <Form.Item label="Số điện thoại">
                    <Input value={user_phone} onChange={(e) => setUser_phone(e.target.value)} />
                </Form.Item>

                <Form.Item label="Địa chỉ">
                    <Input value={user_address} onChange={(e) => setUser_address(e.target.value)} />
                </Form.Item>

                <Form.Item label="Tên thú cưng">
                    <Input value={pet_name} onChange={(e) => setPet_name(e.target.value)} required />
                </Form.Item>

                <Form.Item label="Loại thú cưng">
                    <Select value={pet_type} onChange={(value) => setPet_type(value)}>
                        <Select.Option value="Chó">Chó</Select.Option>
                        <Select.Option value="Mèo">Mèo</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Mô tả chi tiết thú cưng (Màu, giống,...)">
                    <Input.TextArea
                        value={pet_description}
                        onChange={(e) => setPet_description(e.target.value)}
                        rows={3}
                        required
                    />
                </Form.Item>

                <Form.Item label="Tình trạng sức khỏe">
                    <Select value={pet_health} onChange={(value) => setPet_health(value)}>
                        <Select.Option value="Khỏe mạnh">Khỏe mạnh</Select.Option>
                        <Select.Option value="Có vấn đề về sức khỏe">Có vấn đề về sức khỏe</Select.Option>
                    </Select>
                </Form.Item>

                {/* Voucher Selection */}
                <div className="mt-4">
                    <label className="block text-black text-sm font-bold">Chọn voucher</label>
                    <Button onClick={openVoucherPopUp} className="w-full mt-1 text-sm">
                        <TagOutlined />
                        <span>{selectedVoucher ? selectedVoucher.code : "Voucher"}</span>
                    </Button>
                </div>

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

                {/* Payment Method */}
                <div className="mt-10">
                    <p className='block text-black text-sm font-bold'>Phương thức thanh toán</p>
                    <Form.Item>
                        <Select
                            value={paymethod_id}
                            onChange={(value) => setPaymethod_id(value)}
                        >
                            {paymethod?.map((item) => (
                                <Select.Option key={item.id} value={item.id}>
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                <div className="text-center">
                    <Button type="primary" htmlType="submit" className="mt-20 bg-[#064749]">
                        Xác nhận
                    </Button>
                </div>
            </Form>

            {/* Room Information */}
            <div className="lg:w-1/2 p-4 mt-20 border rounded-lg shadow-lg ml-0 lg:ml-4 bg-[#F2F0F2] h-2/3">
                <Card
                    cover={
                        <img
                            src={room?.img_thumbnail}
                            alt={room?.size_name}
                            className="w-full h-[300px] object-cover rounded-lg shadow mb-10"
                        />
                    }
                >
                    <Title level={3}>{room?.size_name}</Title>
                    <Text>{room?.description}</Text>

                    <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-4 mb-10 mt-10">
                        <div className="w-full lg:w-1/2">
                            <strong>Ngày check-in</strong>
                            <DatePicker
                                value={booking?.start_date ? moment(booking?.start_date) : null}
                                disabled
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div className="w-full lg:w-1/2">
                            <strong>Ngày check-out</strong>
                            <DatePicker
                                value={booking?.end_date ? moment(booking?.end_date) : null}
                                disabled
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>

                    <div className="text-right">
                        <Text strong>Tổng tiền: </Text>
                        <Text className="font-bold">{finalAmount.toLocaleString()} VNĐ</Text>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Pay2;
