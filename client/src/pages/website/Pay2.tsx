import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Button, Card, Spin, Typography, message, DatePicker, Modal, Checkbox, Row, Col, Divider, TimePicker } from 'antd';
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

    const [isLoading, setIsLoading] = useState(false);

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
    const [healthIssue, setHealthIssue] = useState("");
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
    const [user_nameError, setUser_nameError] = useState("");
    const [user_emailError, setUser_emailError] = useState("");
    const [user_phoneError, setUser_phoneError] = useState("");
    const [user_addressError, setUser_addressError] = useState("");
    const [pet_nameError, setPet_nameError] = useState("");
    const [pet_descriptionError, setPet_descriptionError] = useState("");

    const validateForm = () => {
        let valid = true;

        if (!user_name.trim()) {
            setUser_nameError("Tên khách hàng không được bỏ trống!");
            valid = false;
        } else {
            setUser_nameError("");
        }

        if (!user_email.trim()) {
            setUser_emailError("Email không được bỏ trống!");
            valid = false;
        } else {
            setUser_emailError("");
        }

        if (!user_phone.trim()) {
            setUser_phoneError("Số điện thoại không được bỏ trống!");
            valid = false;
        } else {
            setUser_phoneError("");
        }

        if (!user_address.trim()) {
            setUser_addressError("Địa chỉ không được bỏ trống!");
            valid = false;
        } else {
            setUser_addressError("");
        }

        if (!pet_name.trim()) {
            setPet_nameError("Tên thú cưng không được bỏ trống!");
            valid = false;
        } else {
            setPet_nameError("");
        }

        if (!pet_description.trim()) {
            setPet_descriptionError("Mô tả thú cưng không được bỏ trống!");
            valid = false;
        } else {
            setPet_descriptionError("");
        }

        return valid;
    };

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
    const servicesData = booking?.booking?.services;

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

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append("booking_id", id);
        formData.append("pet_name", pet_name);
        formData.append("pet_type", pet_type);
        formData.append("pet_description", pet_description);
        formData.append("pet_health", pet_health);
        formData.append("healthIssue", healthIssue);
        formData.append("user_name", user_name);
        formData.append("user_address", user_address);
        formData.append("user_email", user_email);
        formData.append("user_phone", user_phone);
        formData.append("user_id", user_id);
        formData.append("paymethod_id", paymethod_id.toString());
        formData.append("total_amount", total_amount.toString());

        if (selectedVoucher && selectedVoucher.id) {
            formData.append("voucher_id", selectedVoucher.id.toString());
        }

        try {

            const formData1 = new FormData();
            formData1.append("room_id", booking?.room_id);
            formData1.append("start_date", booking?.start_date);
            formData1.append("end_date", booking?.end_date);
            const checkResponse = await fetch(`http://localhost:8000/api/bookings/status`, {
                method: "POST",
                body: formData1,
            });

            if (!checkResponse.ok) {
                message.error("Phòng đã hết. Vui lòng chọn phòng khác.");
                navigate('/danhsach');
            } else {
                const response = await fetch(`${addPay}/vn_pay`, {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    setIsLoading(false);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                if (result.status === "success") {
                    const vnpUrl = result.vnp_Url;
                    setIsLoading(false);
                    window.location.href = vnpUrl;
                } else {
                    alert("Thanh toán không thành công, vui lòng thử lại.");
                    setIsLoading(false);
                }
            }

        } catch (error) {
            console.error("API connection error:", error);
            setIsLoading(false);
        }
    };


    let finalAmount = total_amount;

    if (selectedVoucher) {
        if (selectedVoucher.type === '%') {
            let discount = (total_amount * selectedVoucher.discount) / 100;

            if (selectedVoucher.max_total_amount && discount > selectedVoucher.max_total_amount) {
                discount = selectedVoucher.max_total_amount;
            }

            finalAmount -= discount;
        } else {
            finalAmount -= selectedVoucher.discount;
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

            {isLoading ? (
                <div className="loading-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <form onSubmitCapture={handleSubmit} className="lg:w-1/2 p-4 mx-auto">
                        <Title level={2}>Thông tin khách hàng</Title>

                        <Card>
                            <Row gutter={16}>
                                <Col span={24} className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên khách hàng</label>
                                    <Input
                                        value={user_name}
                                        onChange={(e) => {
                                            setUser_name(e.target.value);
                                            setUser_nameError("");
                                        }}
                                    />
                                    {user_nameError && <p className="text-red-500 text-sm mt-1">{user_nameError}</p>}
                                </Col>

                                <Col span={24} className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <Input
                                        value={user_email}
                                        onChange={(e) => {
                                            setUser_email(e.target.value);
                                            setUser_emailError("");
                                        }}
                                    />
                                    {user_emailError && <p className="text-red-500 text-sm mt-1">{user_emailError}</p>}
                                </Col>

                                <Col span={24} className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                                    <Input
                                        value={user_phone}
                                        onChange={(e) => {
                                            setUser_phone(e.target.value);
                                            setUser_phoneError("");
                                        }}
                                    />
                                    {user_phoneError && <p className="text-red-500 text-sm mt-1">{user_phoneError}</p>}
                                </Col>

                                <Col span={24} className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                                    <Input
                                        value={user_address}
                                        onChange={(e) => {
                                            setUser_address(e.target.value);
                                            setUser_addressError("");
                                        }}
                                    />
                                    {user_addressError && <p className="text-red-500 text-sm mt-1">{user_addressError}</p>}
                                </Col>
                            </Row>
                        </Card>

                        <div className="mt-5">
                            <Title level={2}>Thông tin thú cưng</Title>
                            <Card>
                                <Row gutter={16}>
                                    <Col span={24} className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tên thú cưng</label>
                                        <Input
                                            value={pet_name}
                                            onChange={(e) => {
                                                setPet_name(e.target.value);
                                                setPet_nameError("");
                                            }}
                                        />
                                        {pet_nameError && <p className="text-red-500 text-sm mt-1">{pet_nameError}</p>}
                                    </Col>

                                    <Col span={24} className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Loại thú cưng</label>
                                        <Select
                                            value={pet_type}
                                            onChange={(value) => setPet_type(value)}
                                        >
                                            <Select.Option value="Chó">Chó</Select.Option>
                                            <Select.Option value="Mèo">Mèo</Select.Option>
                                        </Select>
                                    </Col>

                                    <Col span={24} className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết thú cưng (Màu, giống, ...)</label>
                                        <Input.TextArea
                                            value={pet_description}
                                            onChange={(e) => {
                                                setPet_description(e.target.value);
                                                setPet_descriptionError("");
                                            }}
                                            rows={3}
                                        />
                                        {pet_descriptionError && <p className="text-red-500 text-sm mt-1">{pet_descriptionError}</p>}
                                    </Col>

                                    <Col span={24} className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tình trạng sức khỏe</label>
                                        <Select
                                            value={pet_health}
                                            onChange={(value) => setPet_health(value)}
                                        >
                                            <Select.Option value="Khỏe mạnh">Khỏe mạnh</Select.Option>
                                            <Select.Option value="Có vấn đề về sức khỏe">Có vấn đề về sức khỏe</Select.Option>
                                        </Select>
                                    </Col>
                                    {pet_health === "Có vấn đề về sức khỏe" && (
                                        <Col span={24} className="mb-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mô tả vấn đề sức khỏe
                                            </label>
                                            <Input.TextArea
                                                value={healthIssue}
                                                onChange={(e) => setHealthIssue(e.target.value)}
                                                placeholder="Nhập mô tả vấn đề sức khỏe của thú cưng..."
                                                rows={4}
                                            />
                                        </Col>
                                    )}
                                </Row>
                            </Card>
                        </div>

                        <div className="mt-4">
                            <label className="block text-black text-sm font-bold">Chọn voucher</label>
                            <Button onClick={openVoucherPopUp} className="w-full mt-1 text-sm">
                                <TagOutlined />
                                <span>{selectedVoucher ? selectedVoucher.code : "Voucher"}</span>
                            </Button>
                        </div>

                        <Modal
                            title="Các voucher dành cho bạn"
                            open={voucherPopUp}
                            onCancel={closeVoucherPopUp}
                            footer={null}
                        >
                            <div className="space-y-2">
                                {vouchers
                                    .filter((voucher) => {
                                        const checkEnd_date = new Date(voucher.end_date) < new Date();
                                        const checkStart_date = new Date(voucher.start_date) > new Date();
                                        const checkQuantity = voucher.quantity <= 0;

                                        return !checkEnd_date && !checkStart_date && !checkQuantity;
                                    })
                                    .map((voucher) => {
                                        const minAmount = voucher.min_total_amount ?? 0;
                                        const checkMin = total_amount < minAmount;

                                        return (
                                            <div key={voucher.id} className="flex items-center space-x-3">
                                                <Checkbox
                                                    checked={selectedVoucher?.id === voucher.id}
                                                    onChange={() => !checkMin && handleVoucherSelect(voucher)}
                                                    disabled={checkMin}
                                                >
                                                    {voucher.name}
                                                </Checkbox>
                                                {checkMin && (
                                                    <div className="flex flex-col text-red-500 text-sm ml-2">
                                                        <div className="flex items-center space-x-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                                                                <path d="M8 1a7 7 0 1 0 7 7 7 7 0 0 0-7-7zm0 13a6 6 0 1 1 6-6 6 6 0 0 1-6 6zM7.646 5.646a.5.5 0 0 1 .708 0L8 6.293l.646-.647a.5.5 0 0 1 .708.708L8.707 7l.647.646a.5.5 0 0 1-.708.708L8 7.707l-.646.647a.5.5 0 0 1-.708-.708L7.293 7 6.646 6.354a.5.5 0 0 1 0-.708z" />
                                                            </svg>
                                                            <span>
                                                                Yêu cầu tối thiểu: {minAmount.toLocaleString()} VNĐ
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })




                                }
                            </div>
                        </Modal>

                        <div className="mt-10">
                            <p className="block text-black text-sm font-bold">Phương thức thanh toán</p>
                            <Form.Item>
                                <p>Thanh toán bằng VNPAY</p>
                            </Form.Item>
                        </div>

                        <div className="text-center">
                            <Button type="primary" htmlType="submit" className="mt-20 bg-[#064749]">
                                Xác nhận
                            </Button>
                        </div>
                    </form>


                    <div className="lg:w-1/3 p-4 mt-8 border rounded-lg shadow-md mx-auto bg-white h-full">
                        <Card
                            cover={
                                <img
                                    src={room?.img_thumbnail}
                                    alt={room?.size_name}
                                    className="w-full object-cover rounded-lg shadow-sm"
                                    style={{ height: '250px' }}
                                />
                            }
                        >
                            <Divider />
                            <Title level={4} className="text-center text-[#333]">{room?.size_name}</Title>

                            <Row justify="space-between" className="mt-3 w-full">
                                <Col span={12}>
                                    <Text className='font-semibold'>Giá phòng:</Text>
                                </Col>
                                <Col span={12} className="text-right">
                                    <Text className='font-semibold'>{room?.price.toLocaleString("vi-VN")} VNĐ</Text>
                                </Col>
                            </Row>

                            <Row justify="space-between" className="w-full">
                                <Col span={12}>
                                    <Text className='font-semibold'>Số ngày thuê:</Text>
                                    <div className="my-2" />
                                </Col>
                                <Col span={12} className="text-right">
                                    <Text className='font-semibold'>{moment(booking?.booking?.end_date).diff(moment(booking?.booking?.start_date), 'days')} ngày</Text>
                                    <div className="my-2" />
                                </Col>
                            </Row>

                            <Row justify="space-between" className="w-full">
                                <Col span={12}>
                                    <Text className='font-semibold'>Tổng giá phòng:</Text>
                                </Col>
                                <Col span={12} className="text-right">
                                    <Text className='font-semibold'>{booking?.subTotal_room?.toLocaleString("vi-VN")} VNĐ</Text>
                                    <div className="my-2" />
                                </Col>
                            </Row>

                            <Divider />

                            <Row gutter={16} className="mb-8">
                                <Col span={12}>
                                    <strong>Giờ check-in</strong>
                                    <TimePicker
                                        value={booking?.booking?.start_hour ? moment(booking?.booking?.start_hour, "HH:mm:ss") : null}
                                        disabled
                                        style={{ width: '100%' }}
                                    />
                                </Col>
                                <Col span={12}>
                                    <strong>Giờ check-out</strong>
                                    <TimePicker
                                        value={booking?.booking?.end_hour ? moment(booking?.booking?.end_hour, "HH:mm:ss") : null}
                                        disabled
                                        style={{ width: '100%' }}
                                    />
                                </Col>
                            </Row>

                            <Row gutter={16} className="mb-8">
                                <Col span={12}>
                                    <strong>Ngày check-in</strong>
                                    <DatePicker
                                        value={booking?.start_date ? moment(booking?.start_date) : null}
                                        disabled
                                        style={{ width: '100%' }}
                                    />
                                </Col>
                                <Col span={12}>
                                    <strong>Ngày check-out</strong>
                                    <DatePicker
                                        value={booking?.end_date ? moment(booking?.end_date) : null}
                                        disabled
                                        style={{ width: '100%' }}
                                    />
                                </Col>
                            </Row>

                            <Divider />

                            <h3 className="text-left text-2xl font-semibold mt-10">
                                Dịch vụ kèm thêm
                            </h3>

                            <div className="mt-2">
                                {Array.isArray(servicesData) && servicesData.length > 0 ? (
                                    servicesData?.map((item) => (
                                        <div
                                            key={item?.id}
                                        >
                                            <label className="flex items-center mb-2">
                                                <input readOnly
                                                    type="checkbox"
                                                    className="mr-2 appearance-none bg-[#064749] border-2 rounded-full w-4 h-4 cursor-pointer"
                                                />
                                                <span>{item.name} ({item.price.toLocaleString("vi-VN")} VNĐ)
                                                    {item.id === 2 && moment(booking?.booking?.end_date).diff(moment(booking?.booking?.start_date), 'days') >= 3
                                                        ? `x ${Math.floor(
                                                            moment(booking?.booking?.end_date).diff(
                                                                moment(booking?.booking?.start_date),
                                                                'days'
                                                            ) / 3
                                                        )}`
                                                        : ""}

                                                </span>
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <Text className="text-gray-500">Không sử dụng dịch vụ.</Text>
                                )}
                            </div>

                            <Row justify="space-between" className="mt-4 w-full">
                                <Col span={12} className="text-left">
                                    <Text className='font-semibold'>Tổng phí dịch vụ:</Text>
                                </Col>
                                <Col span={12} className="text-right">
                                    <Text className='font-semibold'>{booking?.subTotal_service === 0 ? "0" : booking?.subTotal_service.toLocaleString("vi-VN")} VNĐ</Text>
                                </Col>
                            </Row>
                            <Row justify="space-between" className="mt-4 w-full">
                                <Col span={12} className="text-left">
                                    <Text className='font-semibold'>Giảm giá:</Text>
                                </Col>
                                <Col span={12} className="text-right">
                                    <Text className='font-semibold text-500'>
                                        {selectedVoucher
                                            ? `- ${finalAmount !== total_amount ? (total_amount - finalAmount).toLocaleString("vi-VN") : '0'} VNĐ`
                                            : "0 VNĐ"
                                        }
                                    </Text>
                                </Col>
                            </Row>

                            <Divider />

                            <Text className="text-gray-600 mb-4">Mọi chi phí đã được tính tổng</Text>

                            <Row justify="space-between" className="mt-4">
                                <Col span={12}>
                                    <Text className="font-semibold text-[#064749]">Tổng:</Text>
                                </Col>
                                <Col span={12} style={{ textAlign: 'right' }}>
                                    <Text className="font-semibold text-[#064749]">{finalAmount.toLocaleString("vi-VN")} VNĐ</Text>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
};

export default Pay2;