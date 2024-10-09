import React, { useState } from 'react';

const History2 = () => {
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
                                    {/* Các trường thông tin khách hàng */}
                                    {['Tên', 'Địa chỉ', 'Email', 'Số điện thoại', 'Tên thú cưng'].map((label, index) => (
                                        <label key={index} className="block">
                                            <span className="text-gray-700 text-lg">{label}</span>
                                            <input
                                                type={label === 'Email' ? 'email' : 'text'}
                                                className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 p-2"
                                                value={label === 'Tên' ? 'Nguyễn Văn Nam' : label === 'Địa chỉ' ? 'Trịnh Văn Bô, Nam Từ Liêm, Hà Nội' : label === 'Email' ? 'nguyenvannam@gmail.com' : label === 'Số điện thoại' ? '0966456789' : 'Cali'}
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
                
                    className="mt-20 text-white px-10 py-2 rounded-full bg-[#064749]"
                >
                    <a href="/history1">Quay lại</a>
                </button>
                </center>

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

                <h3 className="text-left text-2xl font-semibold mt-10">Dịch vụ kèm thêm</h3>
          <div className="mt-2">
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                className="mr-2 appearance-none bg-[#064749] border rounded-full w-4 h-4 cursor-pointer"
              />
              <span>Tắm</span>
            </label>
          </div>

                {/* Chi phí chia dọc hai bên */}
                <div className="flex justify-between mt-4">
                    <div>
                        <p className="text-left font-bold mt-2">Tổng:</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold mt-2">1.121.000</p>
                    </div>
                </div>
            
            </div>
        </div>
    );
}

export default History2;
