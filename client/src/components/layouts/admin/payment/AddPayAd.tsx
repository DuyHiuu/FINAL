import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Card, Spin, Typography, message, DatePicker, Modal, Checkbox, Row, Col, Divider, TimePicker } from 'antd';
import { PulseLoader } from 'react-spinners';
import moment from 'moment';
import useFetchPayMethod from '../../../../api/useFetchPayMethod';
import useFetchServices from '../../../../api/useFetchServices';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import useFetchRooms from '../../../../api/useFetchRooms';

const { Title, Text } = Typography;

const AddPayAd = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [pet_name, setPet_name] = useState("");
    const [pet_type, setPet_type] = useState("Chó");
    const [pet_description, setPet_description] = useState("");
    const [pet_health, setPet_health] = useState("Khỏe mạnh");
    const [healthIssue, setHealthIssue] = useState("");
    const [paymethod_id, setPaymethod_id] = useState(1);
    const { paymethod } = useFetchPayMethod();
    const [user_name, setUser_name] = useState("");
    const [user_address, setUser_address] = useState("");
    const [user_email, setUser_email] = useState("");
    const [user_phone, setUser_phone] = useState("");
    const [user_nameError, setUser_nameError] = useState("");
    const [user_emailError, setUser_emailError] = useState("");
    const [user_phoneError, setUser_phoneError] = useState("");
    const [user_addressError, setUser_addressError] = useState("");
    const [pet_nameError, setPet_nameError] = useState("");
    const [pet_descriptionError, setPet_descriptionError] = useState("");

    // const validateForm = () => {
    //     let valid = true;

    //     if (!user_name.trim()) {
    //         setUser_nameError("Tên khách hàng không được bỏ trống!");
    //         valid = false;
    //     } else {
    //         setUser_nameError("");
    //     }

    //     if (!user_email.trim()) {
    //         setUser_emailError("Email không được bỏ trống!");
    //         valid = false;
    //     } else {
    //         setUser_emailError("");
    //     }

    //     if (!user_phone.trim()) {
    //         setUser_phoneError("Số điện thoại không được bỏ trống!");
    //         valid = false;
    //     } else {
    //         setUser_phoneError("");
    //     }

    //     if (!user_address.trim()) {
    //         setUser_addressError("Địa chỉ không được bỏ trống!");
    //         valid = false;
    //     } else {
    //         setUser_addressError("");
    //     }

    //     if (!pet_name.trim()) {
    //         setPet_nameError("Tên thú cưng không được bỏ trống!");
    //         valid = false;
    //     } else {
    //         setPet_nameError("");
    //     }

    //     if (!pet_description.trim()) {
    //         setPet_descriptionError("Mô tả thú cưng không được bỏ trống!");
    //         valid = false;
    //     } else {
    //         setPet_descriptionError("");
    //     }

    //     return valid;
    // };

    const { service } = useFetchServices();

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 500);
        window.scrollTo(0, 0);
    }, []);

    const { room } = useFetchRooms();
    const [room_id, setRoom_id] = useState("");
    const [service_ids, setService_ids] = useState<number[]>([]);
    const [start_date, setStart_date] = useState<string>("");
    const [end_date, setEnd_date] = useState<string>("");
    const [start_hour, setStart_hour] = useState("");

    const changeService = (serviceId: number) => {
        setService_ids((prevState) => {
            if (prevState.includes(serviceId)) {
                return prevState.filter((id) => id !== serviceId);
            }
            return [...prevState, serviceId];
        });
    };
    const [openServiceId, setOpenServiceId] = useState(null);
    const toggleDescription = (id) => {
        setOpenServiceId(openServiceId === id ? null : id);
    };

    const maxEndDate = moment(start_date).add(30, "days").startOf("day");

    const addPayAd = "http://localhost:8000/api/bookings/ad_add";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // if (!validateForm()) {
        //     return;
        // }

        setIsLoading(true);

        const safeServiceIds = service_ids.length ? service_ids : [];
        

        const formData = new FormData();

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        
        formData.append("pet_name", pet_name);
        formData.append("pet_type", pet_type);
        formData.append("pet_description", pet_description);
        formData.append("pet_health", pet_health);
        formData.append("healthIssue", healthIssue);
        formData.append("user_name", user_name);
        formData.append("user_address", user_address);
        formData.append("user_email", user_email);
        formData.append("user_phone", user_phone);
        formData.append("paymethod_id", paymethod_id.toString());
        formData.append("service_ids", JSON.stringify(safeServiceIds));
        formData.append("room_id", room_id);
        formData.append("start_date", start_date);
        formData.append("end_date", end_date);
        formData.append("start_hour", start_hour);

        console.log(formData);


        try {
            const response = await fetch(`${addPayAd}`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                setIsLoading(false);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === "success") {
                message.success("Đặt phòng thành công");
            } else {
                message.error("Đặt phòng không thành công, vui lòng thử lại.");
                setIsLoading(false);
            }

        } catch (error) {
            console.error("API connection error:", error);
            setIsLoading(false);
        }
    };


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

                        <div className="mt-10">
                            <p className="block text-black text-sm font-bold">Phương thức thanh toán</p>
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

                        <div className="mt-10">
                            <p className="block text-black text-sm font-bold">Chọn phòng</p>
                            <Form.Item>
                                <Select
                                    value={room_id}
                                    onChange={(value) => setRoom_id(value)}
                                >
                                    {room?.map((item) => {
                                        const checkQuantity = item.quantity - item.is_booked === 0;

                                        return (
                                            <Select.Option
                                                key={item.id}
                                                value={item.id}
                                                disabled={checkQuantity}
                                            >
                                                <span>
                                                    {item.size_name}
                                                    {checkQuantity && <span style={{ color: 'red', marginLeft: '10px' }}>Đã hết phòng</span>}
                                                </span>
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </div>

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

                        <div className="mt-4">
                            <label className="block text-black text-sm font-bold">
                                Giờ check-in
                            </label>
                            <TimePicker
                                value={start_hour ? moment(start_hour, "HH:mm") : null}
                                onChange={(time) => setStart_hour(time?.format("HH:mm") || "")}
                                placeholder="Chọn giờ check-in"
                                className="w-full mt-1 text-sm"
                                format="HH:mm"
                                disabledHours={() => {
                                    const allowedHours = [9, 14];
                                    return Array.from({ length: 24 }, (_, i) => i).filter(
                                        (hour) => !allowedHours.includes(hour)
                                    );
                                }}
                                disabledMinutes={() => {
                                    return Array.from({ length: 60 }, (_, i) => i).filter(
                                        (minute) => minute !== 0
                                    );
                                }}
                                showNow={false}
                            />
                        </div>
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

                        <div className="text-center">
                            <Button type="primary" htmlType="submit" className="mt-20 bg-[#064749]">
                                Xác nhận
                            </Button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default AddPayAd;