import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Pay2 = () => {

    const { id } = useParams();
    const navigate = useNavigate();


    const showBooking = "http://localhost:8000/api/bookings";
    const showRoom = "http://localhost:8000/api/rooms";

    const [booking, setBooking] = useState<any>();
    const [room, setRoom] = useState<any>();

    useEffect(() => {
        try {

            const fetBooking = async () => {
                const res = await fetch(`${showBooking}/${id}`, {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!res.ok) {
                    throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
                }

                const data = await res.json();
                setBooking(data);
            };
            fetBooking();
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        if (booking?.room_id) {
            try {

                const fetRoom = async () => {
                    const res = await fetch(`${showRoom}/${booking?.room_id}`, {
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
                };
                fetRoom();
            } catch (error) {
                console.log(error);
            }
        }

    }, [booking?.room_id]);

    // const [booking_id, setBooking_id] = useState(id);
    // const [pet_name, setPet_name] = useState("");
    // const [pet_type, setPet_type] = useState("");
    // const [pet_description, setPet_description] = useState("");
    // const [pet_health, setPet_health] = useState("");
    // const [user_name, setUser_name] = useState("");
    // const [user_address, setUser_address] = useState("");
    // const [user_email, setUser_email] = useState("");
    // const [user_phone, setUser_phone] = useState("");


    return (

        <div className="flex flex-col lg:flex-row pb-20 mt-24">
            {/* Phần thông tin khách hàng */}
            <form className="lg:w-2/3 p-4">
                <div className="text-left">
                    <strong className="text-5xl">Thông tin khách hàng</strong>
                    <div className="antialiased text-gray-900 px-6">
                        <div className="max-w-xl py-12 divide-y md:max-w-4xl">
                            <div className="max-w-md">
                                <div className="grid grid-cols-1 gap-6">
                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Tên khách hàng</span>
                                        <input type='text'
                                            className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2">
                                        </input>
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Email</span>
                                        <input type='text'
                                            className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2">
                                        </input>
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Số điện thoại</span>
                                        <input type='text'
                                            className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2">
                                        </input>
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Địa chỉ</span>
                                        <input type='text'
                                            className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2">
                                        </input>
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Tên thú cưng</span>
                                        <input type='text'
                                            className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2">
                                        </input>
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Loại thú cưng</span>
                                        <select className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2">
                                            <option>Chó</option>
                                            <option>Mèo</option>
                                        </select>
                                    </label>
                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Mô tả chi tiết thú cưng (Màu, giống,...)</span>
                                        <textarea className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2" rows='3'>
                                            Màu nâu, giống chó Alaska, 40kg
                                        </textarea>
                                    </label>
                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Tình trạng sức khỏe</span>
                                        <select className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2 mb-5">
                                            <option>Khỏe mạnh</option>
                                            <option>Có vấn đề về sức khỏe</option>
                                        </select>
                                        <textarea className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2" rows='3' placeholder='Mô tả chi tiết tình trạng của bé gặp phải (Nếu có)'></textarea>
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
                                        <select className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2">
                                            <option>Thanh toán trực tiếp</option>
                                            <option>Chuyển khoản ngân hàng</option>
                                        </select>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <center>
                    <button
                        onClick={open}
                        className="mt-20 text-white px-10 py-2 rounded-full bg-[#064749]"
                    >
                        Xác nhận
                    </button>
                </center>
            </form>

            {/* Phần thông tin đặt phòng */}
            <div className="lg:w-1/3 p-4 mt-20 border rounded-lg shadow-lg ml-0 lg:ml-4 bg-[#F2F0F2] h-2/3">
                <img
                    src={room?.img_thumbnail}
                    alt={room?.size_name}
                    className="w-full h-60 object-cover rounded-lg shadow mb-10"
                />
                <strong className="text-4xl font-semibold">{room?.size_name}</strong>
                <div className="flex items-center mt-3 mb-3">
                    <p className="flex items-center">{room?.price}</p>
                </div>
                <p>{room?.description}</p>

                {/* Ngày vào và Ngày ra nằm ngang */}
                <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-4 mb-10 mt-10">
                    <label className="text-left block w-full lg:w-1/2">
                        <strong>Ngày vào</strong>
                        <input type="date" value={booking?.start_date} readOnly className="border p-1 w-full mt-1" />
                    </label>
                    <label className="text-left block w-full lg:w-1/2">
                        <strong>Ngày ra</strong>
                        <input type="date" value={booking?.end_date} readOnly className="border p-1 w-full mt-1" />
                    </label>
                </div>

                <p className="text-left mt-4">Mọi chi phí đã được tính tổng</p>

                {/* Chi phí chia dọc hai bên */}
                <div className="flex justify-between mt-4">
                    <div>
                        <p className="text-left font-bold mt-2">Tổng:</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold mt-2">{booking?.total_amount}</p>
                    </div>
                </div>

                <p className="font-bold mt-5 text-red-500 text-xs">Phòng chỉ có thể được hủy trước ngày check-in 48 tiếng !</p>
            </div>
        </div>
    );
}

export default Pay2;
