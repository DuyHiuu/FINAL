import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetchPayMethod from '../../api/useFetchPayMethod';
import { PulseLoader } from "react-spinners";

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


    const [booking_id, setBooking_id] = useState(id);
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

    const [status_id, setStatus_id] = useState(1);
    const { paymethod } = useFetchPayMethod();

    useEffect(() => {
        const user_idFromStorage = localStorage.getItem("user_id");
        setUser_id(user_idFromStorage || "");
    }, []);


    const showUserUrl = "http://localhost:8000/api/users";
    const [user_name, setUser_name] = useState("");
    const [user_address, setUser_address] = useState("");
    const [user_email, setUser_email] = useState("");
    const [user_phone, setUser_phone] = useState("");

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
                        console.log("Lỗi khi lấy thông tin người dùng");
                    }
                } catch (error) {
                    console.log("Lỗi kết nối:", error);
                }
            };
            fetchUser();
        }
    }, [user_id]);



    const addPay = "http://localhost:8000/api/payments";


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("booking_id", booking_id);
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
        formData.append("status_id", status_id);

        console.log({
            booking_id,
            pet_name,
            pet_type,
            pet_description,
            pet_health,
            user_name,
            user_address,
            user_email,
            user_phone,
            user_id,
            paymethod_id,
            total_amount,
            status_id,
        });


        try {
            const response = await fetch(`${addPay}`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                navigate("/history1");
            } else {
                console.error("Lỗi:", response.statusText);
            }
        } catch (error) {
            console.error("Lỗi kết nối API:", error);
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
            {/* Phần thông tin khách hàng */}
            <form className="lg:w-2/3 p-4" onSubmit={handleSubmit}>

                <input
                    type="hidden"
                    name="booking_id"
                    value={booking_id}

                />

                <input
                    type="hidden"
                    name="total_amount"
                    value={total_amount}

                />

                <input
                    type="hidden"
                    name="status_id"
                    value={status_id}
                />

                <div className="text-left">
                    <strong className="text-5xl">Thông tin khách hàng</strong>
                    <div className="antialiased text-gray-900 px-6">
                        <div className="max-w-xl py-12 divide-y md:max-w-4xl">
                            <div className="max-w-md">
                                <div className="grid grid-cols-1 gap-6">

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Tên khách hàng</span>
                                        <input type='text' value={user_name} onChange={(e) => setUser_name(e.target.value)}
                                            className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2">
                                        </input>
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Email</span>
                                        <input type='text' value={user_email} onChange={(e) => setUser_email(e.target.value)}
                                            className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2">
                                        </input>
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Số điện thoại</span>
                                        <input type='text' value={user_phone} onChange={(e) => setUser_phone(e.target.value)}
                                            className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2">
                                        </input>
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Địa chỉ</span>
                                        <input type='text' value={user_address} onChange={(e) => setUser_address(e.target.value)}
                                            className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2">
                                        </input>
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Tên thú cưng</span>
                                        <input type='text' value={pet_name} onChange={(e) => setPet_name(e.target.value)} required
                                            className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2">
                                        </input>
                                    </label>

                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Loại thú cưng</span>
                                        <select onChange={(e) => setPet_type(e.target.value)}
                                            className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2">
                                            <option selected value={"Chó"}>Chó</option>
                                            <option value={"Mèo"}>Mèo</option>
                                        </select>
                                    </label>
                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Mô tả chi tiết thú cưng (Màu, giống,...)</span>
                                        <textarea value={pet_description} onChange={(e) => setPet_description(e.target.value)} required
                                            className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2" rows='3'>
                                            Màu nâu, giống chó Alaska, 40kg
                                        </textarea>
                                    </label>
                                    <label className="block">
                                        <span className="text-gray-700 text-lg">Tình trạng sức khỏe</span>
                                        <select value={pet_health} onChange={(e) => setPet_health(e.target.value)}
                                            className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2 mb-5">
                                            <option selected value={"Khỏe mạnh"}>Khỏe mạnh</option>
                                            <option value={"Có vấn đề về sức khỏe"}>Có vấn đề về sức khỏe</option>
                                        </select>
                                        {/* <textarea className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2" rows='3' placeholder='Mô tả chi tiết tình trạng của bé gặp phải (Nếu có)'></textarea> */}
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
                                        <select
                                            id="paymethod_id"
                                            value={paymethod_id}
                                            onChange={(e) => setPaymethod_id(e.target.value)}
                                            className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2"
                                        >
                                            {paymethod?.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <center>
                    <button
                        type='submit'
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
