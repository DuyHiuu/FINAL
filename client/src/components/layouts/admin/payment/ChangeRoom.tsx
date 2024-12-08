import { Col, Divider, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Text } from 'recharts';

const ChangeRoom = () => {

    const showUrl = "http://localhost:8000/api/payments";

    const [data, setData] = useState(null);

    const { id } = useParams();

    const updateUrl = "http://localhost:8000/api/payments";
    const [selectedStatus, setSelectedStatus] = useState(null);
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

    const handleStatusUpdate = async (statusId) => {
        try {
            const res = await fetch(`${updateUrl}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status_id: statusId }),
            });
            if (!res.ok) {
                throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (!data) {
        return <p>Đang tải dữ liệu...</p>;
    }

    const paymentData = data.payment;
    const roomData = paymentData.room;
    const servicesData = paymentData.service;
    const bookingData = paymentData.booking;
    const payMethodData = paymentData.paymentMethod;
    const sizeData = paymentData.size;
    const status_pay = paymentData.status_pay;
    const voucherData = paymentData.voucher;

    console.log(paymentData.payment?.status_id);


    const status_id = paymentData.payment?.status_id;

    let availableStatuses = [];
    if (status_id === 1) {
        availableStatuses = [2];
    } else if (status_id === 2 || status_id === 4) {
        availableStatuses = [5];
    } else if (status_id === 5) {
        availableStatuses = [6];
    }

    const totalServicePrice = servicesData?.reduce((total, item) => {
        if (item.id === 2 && moment(bookingData?.end_date).diff(moment(bookingData?.start_date), 'days') >= 3) {
            const multiplier = Math.floor(
                moment(bookingData?.end_date).diff(
                    moment(bookingData?.start_date),
                    'days'
                ) / 3
            );
            return total + item.price * multiplier;
        }
        return total + item.price;
    }, 0);

    return (
        <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-4">
                <div className="text-left">
                    <strong className="text-5xl">Chi tiết đơn hàng</strong>
                    <div className="antialiased text-gray-900">
                        <div className="max-w-xl py-12 divide-y md:max-w-4xl">
                            <div className="max-w-md">
                                <div className="grid grid-cols-1 gap-6">

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Tên khách hàng</span>
                                        <input readOnly type="text" value={paymentData?.payment?.user_name} className="block w-full mt-1 rounded-md bg-gray-100 p-2 border-2 border-black-300" />
                                    </label>


                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Email</span>
                                        <input readOnly type='text' value={paymentData?.payment?.user_email} className="block w-full mt-1 rounded-md bg-gray-100 p-2 border-2 border-black-300" />
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Số điện thoại</span>
                                        <input readOnly type='text' value={paymentData?.payment?.user_phone} className="block w-full mt-1 rounded-md bg-gray-100 p-2 border-2 border-black-300" />
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Địa chỉ</span>
                                        <input readOnly type='text' value={paymentData?.payment?.user_address} className="block w-full mt-1 rounded-md bg-gray-100 p-2 border-2 border-black-300" />
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Tên thú cưng</span>
                                        <input readOnly type='text' value={paymentData?.payment?.pet_name} className="block w-full mt-1 rounded-md bg-gray-100 p-2 border-2 border-black-300" />
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Loại thú cưng</span>
                                        <select className="block w-full mt-1 rounded-md bg-gray-100 p-2 border-2 border-black-300">
                                            <option value={paymentData?.payment?.pet_type}>{paymentData.payment?.pet_type}</option>
                                        </select>
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Mô tả chi tiết thú cưng (Màu, giống,...)</span>
                                        <textarea readOnly className="mt-1 block w-full rounded-md border-2 border-black-300 bg-gray-100 p-2" rows='3'>
                                            {paymentData.payment?.pet_description}
                                        </textarea>
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Tình trạng sức khỏe</span>
                                        <input readOnly type='text' value={paymentData?.payment?.pet_health} className="block w-full mt-1 rounded-md bg-gray-100 p-2 border-2 border-black-300" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-left mt-10">
                    <label className="block">
                        <span className="text-gray-700 text-lg">Phương thức thanh toán</span>
                        <input readOnly value={payMethodData} className="block w-full mt-1 rounded-md bg-gray-100 p-2 border-2 border-black-300" />
                    </label>
                </div>

                <center>
                    <button

                        className="mt-20 text-white px-10 py-2 rounded-full bg-[#064749]"
                    >
                        <a href="/admin/payments">Quay lại</a>
                    </button>
                </center>

            </div>

            <div className="lg:w-1/2 p-4 mt-20 border-2 rounded-lg shadow-lg ml-0 lg:ml-4 bg-[#F2F0F2] h-2/3">
                <img
                    src={roomData?.img_thumbnail}
                    alt="Large"
                    className="w-full h-60 object-cover rounded-lg shadow mb-10"
                />
                <strong className="text-4xl font-semibold">{sizeData}</strong>
                <Row justify="space-between" className="mt-3 w-full">
                    <Col span={12}>
                        <Text className='font-semibold'>Giá phòng:</Text>
                    </Col>
                    <Col span={12} className="text-right">
                        <text className='font-semibold'>{roomData?.price.toLocaleString("vi-VN")} VNĐ</text>
                    </Col>
                </Row>

                <Row justify="space-between" className="w-full">
                    <Col span={12}>
                        <Text className='font-semibold'>Số ngày thuê:</Text>
                        <div className="my-2" />
                    </Col>
                    <Col span={12} className="text-right">
                        <text className='font-semibold'>{moment(bookingData?.end_date).diff(moment(bookingData?.start_date), 'days')} ngày</text>
                        <div className="my-2" />
                    </Col>
                </Row>

                <Row justify="space-between" className="w-full">
                    <Col span={12}>
                        <Text className='font-semibold'>Tổng giá phòng:</Text>
                    </Col>
                    <Col span={12} className="text-right">
                        <text className='font-semibold'>{(roomData?.price * moment(bookingData?.end_date).diff(moment(bookingData?.start_date), 'days')).toLocaleString("vi-VN")} VNĐ</text>
                        <div className="my-2" />
                    </Col>
                </Row>

                <Divider />

                <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-4 mb-10 mt-5">
                    <label className="text-left block w-full lg:w-1/2">
                        <strong>Ngày check-in</strong>
                        <input readOnly type="date" value={bookingData?.start_date} className="border-2 p-1 w-full mt-1" />
                    </label>
                    <label className="text-left block w-full lg:w-1/2">
                        <strong>Ngày check-out</strong>
                        <input readOnly type="date" value={bookingData?.end_date} className="border-2 p-1 w-full mt-1" />
                    </label>
                </div>

                <Divider />

                <h3 className="text-left text-2xl font-semibold">
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
                                        {item.id === 2 && moment(bookingData?.end_date).diff(moment(bookingData?.start_date), 'days') >= 3
                                            ? `x ${Math.floor(
                                                moment(bookingData?.end_date).diff(
                                                    moment(bookingData?.start_date),
                                                    'days'
                                                ) / 3
                                            )}` : ""}
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
                        <text className='font-semibold'> {totalServicePrice.toLocaleString("vi-VN")} VNĐ</text>
                    </Col>
                </Row>

                <Divider />

                <h3 className="text-left text-2xl font-semibold">
                    Voucher
                </h3>
                {voucherData ? (
                    <div className="mt-2">
                        <label className="flex items-center mb-2">
                            <input
                                readOnly
                                type="checkbox"
                                className="mr-2 appearance-none bg-[#064749] border-2 rounded-full w-4 h-4 cursor-pointer"
                            />
                            <span>
                                {voucherData.code} - {voucherData.name}
                            </span>
                        </label>
                    </div>
                ) : (
                    <div className="mt-2">
                        <span>Không sử dụng voucher</span>
                    </div>
                )}

                <Row justify="space-between" className="mt-4 w-full">
                    <Col span={12} className="text-left">
                        <Text className='font-semibold'>Giảm giá:</Text>
                    </Col>
                    <Col span={12} className="text-right">
                        <text className='font-semibold'> {(roomData?.price * moment(bookingData?.end_date).diff(moment(bookingData?.start_date), 'days')
                            + totalServicePrice - (paymentData.payment.total_amount)).toLocaleString("vi-VN")} VNĐ</text>
                    </Col>
                </Row>


                <Divider />

                <div className=" mt-4">
                    <div>
                        <p className="text-left font-bold mt-2">Trạng thái:</p>
                        <input readOnly value={paymentData?.status} className="block mt-1 rounded-md bg-gray-100 p-2 border-2 border-black-300" />
                    </div>
                    <div className="mt-4">
                        {availableStatuses.length > 0 ? (
                            availableStatuses.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusUpdate(status)}
                                    className="bg-[#064749] text-white font-bold py-2 px-4 rounded mr-2"
                                >
                                    {status_id === 1 ? "Xác nhận" :
                                        status_id === 2 || status_id === 4 ? "Check-in" :
                                            status_id === 5 ? "Check-out" : "Cập nhật"}
                                </button>
                            ))
                        ) : (
                            <p className="text-gray-500">Không thể cập nhật trạng thái.</p>
                        )}

                        <div className="flex items-center mt-3">
                            <button className="bg-[#064749] text-white font-bold py-2 px-4 rounded">
                                <a href="/admin/change_room">Đổi phòng</a>
                            </button>
                            <div className="relative group ml-2">
                                <div className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold cursor-pointer">
                                    !
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-max px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    Đổi phòng dành cho thú cưng lớn hơn kích cỡ quy định
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between mt-4">
                    <div>
                        <p className="text-left font-bold mt-2">Tổng:</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold mt-2">{Math.trunc(paymentData.payment.total_amount).toLocaleString("vi-VN")} VNĐ</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ChangeRoom;