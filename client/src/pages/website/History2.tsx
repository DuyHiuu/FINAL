import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const History2 = () => {

    const showUrl = "http://localhost:8000/api/payments";

    const [data, setData] = useState(null);

    const { id } = useParams();

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

    if (!data) {
        return <p>Đang tải dữ liệu...</p>;
    }

    const paymentData = data.payment;
    const roomData = paymentData.room;
    const servicesData = paymentData.service;
    const bookingData = paymentData.booking;
    const payMethodData = paymentData.paymentMethod;
    const sizeData = paymentData.size;

    console.log(servicesData);


    return (
        <div className="flex flex-col lg:flex-row pb-20 mt-24">
            {/* Phần thông tin đặt hàng */}
            <div className="lg:w-2/3 p-4">
                <div className="text-left">
                    <strong className="text-5xl">Thông tin đặt hàng</strong>
                    <div className="antialiased text-gray-900 px-6">
                        <div className="max-w-xl py-12 divide-y md:max-w-4xl">
                            <div className="max-w-md">
                                <div className="grid grid-cols-1 gap-6">

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Tên khách hàng</span>
                                        <input readOnly type='text' value={paymentData?.payment.user_name} className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2" />
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Email</span>
                                        <input readOnly type='text' value={paymentData?.payment.user_email} className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2" />
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Số điện thoại</span>
                                        <input readOnly type='text' value={paymentData?.payment.user_phone} className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2" />
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Địa chỉ</span>
                                        <input readOnly type='text' value={paymentData?.payment.user_address} className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2" />
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Tên thú cưng</span>
                                        <input readOnly type='text' value={paymentData?.payment.pet_name} className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2" />
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Loại thú cưng</span>
                                        <select className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2">
                                            <option value={paymentData?.payment.pet_type}>{paymentData.payment.pet_type}</option>
                                        </select>
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Mô tả chi tiết thú cưng (Màu, giống,...)</span>
                                        <textarea readOnly className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2" rows='3'>
                                            {paymentData.payment.pet_description}
                                        </textarea>
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Tình trạng sức khỏe</span>
                                        <input readOnly type='text' value={paymentData?.payment.pet_health} className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Phần phương thức thanh toán */}
                <div className="text-left mt-10">
                    <strong className="text-5xl">Phương thức thanh toán</strong>
                    <div className="antialiased text-gray-900 px-6">
                        <div className="max-w-xl py-12 divide-y md:max-w-4xl">
                            <div className="max-w-md">
                                <div className="grid grid-cols-1 gap-6">
                                    <label className="block">
                                        <input readOnly type='text' value={payMethodData} className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <center>
                    <button

                        className="mt-20 text-white px-10 py-2 rounded-full bg-[#064749]"
                    >
                        <a href="/history1">Quay lại</a>
                    </button>
                </center>

            </div>

            <div className="lg:w-1/3 p-4 mt-20 border rounded-lg shadow-lg ml-0 lg:ml-4 bg-[#F2F0F2] h-2/3">
                <img
                    src={roomData?.img_thumbnail}
                    alt="Large"
                    className="w-full h-60 object-cover rounded-lg shadow mb-10"
                />
                <strong className="text-4xl font-semibold">{sizeData}</strong>
                <div className="flex items-center mt-3 mb-3">
                    <span className="flex items-center justify-center mr-2">
                        Giá/ngày : {roomData?.price}
                    </span>
                </div>
                <p>{roomData?.description}</p>

                {/* Ngày vào và Ngày ra nằm ngang */}
                <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-4 mb-10 mt-5">
                    <label className="text-left block w-full lg:w-1/2">
                        <strong>Ngày vào</strong>
                        <input readOnly type="date" value={bookingData?.start_date} className="border p-1 w-full mt-1" />
                    </label>
                    <label className="text-left block w-full lg:w-1/2">
                        <strong>Ngày ra</strong>
                        <input readOnly type="date" value={bookingData?.end_date} className="border p-1 w-full mt-1" />
                    </label>
                </div>

                <h3 className="text-left text-2xl font-semibold mt-10">Dịch vụ kèm thêm</h3>
                <div className="mt-2">
                    {Array.isArray(servicesData) && servicesData.length > 0 ? (
                        servicesData?.map((item) => (
                            <div
                                key={item?.id}
                            >
                                <label className="flex items-center mb-2">
                                    <input readOnly
                                        type="checkbox"
                                        className="mr-2 appearance-none bg-[#064749] border rounded-full w-4 h-4 cursor-pointer"
                                    />
                                    <span>{item.name} ({item.price.toLocaleString("vi-VN")} VNĐ) x {item.pivot?.quantity}</span>
                                </label>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Không sử dụng dịch vụ.</p>
                    )}
                </div>

                <div className="flex justify-between mt-4">
                    <div>
                        <p className="text-left font-bold mt-2">Trạng thái:</p>
                    </div>
                    <div className="text-right">
                        <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-yellow-300">
                            <p className="text-yellow-800 text-sm">{paymentData.payment.status?.status_name}</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between mt-4">
                    <div>
                        <p className="text-left font-bold mt-2">Tổng:</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold mt-2">{paymentData.payment.total_amount.toLocaleString("vi-VN")} VNĐ</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default History2;
