import React, { useState } from 'react';

const Pay2 = () => {
    const row = [
        {
            icon: (
                <img
                    src="/images/icon1.jpg" // Đường dẫn icon chó mèo
                    alt="dog-cat-icon"
                    className="h-8 w-8"
                />
            ),
        },
    ];

    const image = "/images/anh8.webp"; // Đường dẫn ảnh lớn

    const [openPopUp, setOpenPopUp] = useState(false);
    const [openPopUp1, setOpenPopUp1] = useState(false);

    const open = () => {
        setOpenPopUp(true);
    };

    const close = () => {
        setOpenPopUp(false);
    };

    const confirm = () => {
        close(); // Đóng pop-up xác nhận
        setOpenPopUp1(true); // Mở pop-up cảm ơn
    };

    return (
        <div className="flex flex-col lg:flex-row pb-20">
            {/* Phần thông tin khách hàng */}
            <div className="lg:w-2/3 p-4">
                <div className="text-left">
                    <strong className="text-5xl">Thông tin khách hàng</strong>
                    <div className="antialiased text-gray-900 px-6">
                        <div className="max-w-xl py-12 divide-y md:max-w-4xl">
                            <div className="max-w-md">
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Các trường thông tin khách hàng */}
                                    {['Tên', 'Địa chỉ', 'Email', 'Số điện thoại', 'Tên thú cưng'].map((label, index) => (
                                        <label key={index} className="block">
                                            <span className="text-gray-700 text-lg">{label}</span>
                                            <input
                                                type={label === 'Email' ? 'email' : 'text'}
                                                className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2"
                                                placeholder={label === 'Tên' ? 'Nguyễn Văn Nam' : label === 'Địa chỉ' ? 'Trịnh Văn Bô, Nam Từ Liêm, Hà Nội' : label === 'Email' ? 'nguyenvannam@gmail.com' : label === 'Số điện thoại' ? '0966456789' : 'Cali'}
                                            />
                                        </label>
                                    ))}
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

                <button 
                    onClick={open}
                    className="mt-20 text-white px-10 py-2 rounded-full bg-[#064749]"
                >
                    Xác nhận
                </button>

                {/* Pop-up xác nhận thông tin */}
                {openPopUp && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                            <h2 className="text-2xl font-bold mb-4">Xác nhận thông tin</h2>
                            <p className="mb-4">Bạn có chắc chắn muốn xác nhận thông tin đặt phòng này?</p>
                            <div className="flex justify-end">
                                <button onClick={close} className="px-4 py-2 text-white bg-red-600 rounded-lg mr-2">Hủy</button>
                                <button onClick={confirm} className="px-4 py-2 text-white bg-green-600 rounded-lg">Xác nhận</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pop-up cảm ơn */}
                {openPopUp1 && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">    
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                            <h2 className="text-2xl font-bold mb-4">
                                Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của Petspa
                            </h2>
                            <center>
                                <button className="text-white px-10 py-2 rounded-full bg-[#064749]">
                                    <a href="/history1">Lịch sử đặt phòng</a>
                                </button>
                            </center>
                        </div>
                    </div>
                )}
            </div>

            {/* Phần thông tin đặt phòng */}
            <div className="lg:w-1/3 p-4 mt-20 border rounded-lg shadow-lg ml-0 lg:ml-4 bg-[#F2F0F2] h-2/3">
                <img
                    src={image}
                    alt="Large"
                    className="w-full h-60 object-cover rounded-lg shadow mb-10"
                />
                <strong className="text-4xl font-semibold">P.100</strong>
                <div className="flex items-center mt-3 mb-3">
                    <span className="flex items-center justify-center mr-2">
                        {row[0].icon}
                    </span>
                    <p className="flex items-center">1 thú cưng</p>
                </div>
                <p>Vị trí 01 | Tầng 1 | Phòng bé</p>

                {/* Ngày vào và Ngày ra nằm ngang */}
                <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-4 mb-10 mt-10">
                    <label className="text-left block w-full lg:w-1/2">
                        <strong>Ngày vào</strong>
                        <input type="date" className="border p-1 w-full mt-1" />
                    </label>
                    <label className="text-left block w-full lg:w-1/2">
                        <strong>Ngày ra</strong>
                        <input type="date" className="border p-1 w-full mt-1" />
                    </label>
                </div>

                <p className="text-left mt-4">Mọi chi phí đã được tính tổng</p>

                {/* Chi phí chia dọc hai bên */}
                <div className="flex justify-between mt-4">
                    <div>
                        <p className="text-left font-bold mt-2">Tổng:</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold mt-2">1.121.000</p>
                    </div>
                </div>
                
                <p className="font-bold mt-5 text-red-500 text-xs">Phòng chỉ có thể được hủy trước ngày check-in 48 tiếng !</p>
            </div>
        </div>
    );
}

export default Pay2;
