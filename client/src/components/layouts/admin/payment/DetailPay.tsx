import { Divider } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DetailPay = () => {

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

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await fetch(`${updateUrl}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status_id: selectedStatus }),
            });
            if (!res.ok) {
                throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
            }
            navigate('/admin/payments');
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
    const filteredStatus = status_pay.filter((item) => {
        const currentStatus = paymentData.payment.status_id;

        if (item.id === 7 || item.id === 3 || item.id === 4) {
            return false;
        }

        if (currentStatus === 7) {
            return false;
        }

        if (currentStatus === 2) {
            return item.id !== 1;
        } else if (currentStatus === 3) {
            return item.id !== 1 && item.id !== 2;
        } else if (currentStatus === 4) {
            return item.id !== 1 && item.id !== 2 && item.id !== 3;
        } else if (currentStatus === 5) {
            return item.id !== 1 && item.id !== 2 && item.id !== 3 && item.id !== 4;
        } else if (currentStatus === 6) {
            return item.id !== 1 && item.id !== 2 && item.id !== 3 && item.id !== 4 && item.id !== 5;
        }

        return true;
    });

    return (
        <div className="flex flex-col lg:flex-row">
            {/* Phần thông tin đặt hàng */}
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
                <div className="flex items-center mt-3 mb-3">
                    <p>{roomData?.description}</p>
                </div>

                {/* Ngày vào và Ngày ra nằm ngang */}
                <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-4 mb-10 mt-5">
                    <label className="text-left block w-full lg:w-1/2">
                        <strong>Ngày vào</strong>
                        <input readOnly type="date" value={bookingData?.start_date} className="border-2 p-1 w-full mt-1" />
                    </label>
                    <label className="text-left block w-full lg:w-1/2">
                        <strong>Ngày ra</strong>
                        <input readOnly type="date" value={bookingData?.end_date} className="border-2 p-1 w-full mt-1" />
                    </label>
                </div>

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
                                        {item.id === 2
                                            ? `x ${Math.floor(
                                                moment(bookingData?.end_date).diff(
                                                    moment(bookingData?.start_date),
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

                <h3 className="text-left text-2xl font-semibold mt-10">
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


                <Divider />

                <div className="flex justify-between mt-4">
                    <div>
                        <p className="text-left font-bold mt-2">Trạng thái:</p>
                    </div>
                    <div className="text-right">
                        <form onSubmit={handleSubmit} className="flex items-center">
                            <select
                                name="status_id"
                                id="status_id"
                                value={selectedStatus || paymentData?.payment?.status_id}
                                onChange={handleStatusChange}
                                className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                            >
                                {filteredStatus?.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                        disabled={
                                            (item.id === 7 || item.id === 3 || item.id === 4) || // Lọc các trạng thái không muốn hiển thị trong dropdown
                                            item.id === paymentData.payment.status_id // Disable trạng thái hiện tại
                                        }
                                    >
                                        {item.status_name}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                className="ml-2 bg-[#064749] hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Cập nhật
                            </button>
                        </form>
                    </div>
                </div>

                <div className="flex justify-between mt-4">
                    <div>
                        <p className="text-left font-bold mt-2">Tổng:</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold mt-2">{paymentData.payment?.total_amount.toLocaleString("vi-VN")} VNĐ</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default DetailPay;
