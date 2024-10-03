import React from 'react';

const Pay1 = () => {
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
        <div className="flex flex-col lg:flex-row pb-20">
            {/* Phần thông tin thanh toán */}
            <div className="lg:w-2/3 p-4">
                <div className="text-left">
                    <strong className="text-5xl">Xác nhận thanh toán</strong>
                    <div className="flex justify-between mt-20 w-auto">
                        <div className="mr-4 sm:mr-20">
                            <p className="text-left">Giá phòng:</p>
                            <p className="text-left mt-2 mb-10">Phí dịch vụ:</p>
                            <p className="text-left font-bold mt-2">Tổng:</p>
                        </div>
                        <div className="text-right ml-4 sm:ml-20">
                            <p className="">880.000</p>
                            <p className=" mt-2 mb-10">330.000</p>
                            <p className=" font-bold mt-2">1.121.000</p>
                        </div>
                    </div>
                </div>

                <button className="mt-20 text-white px-10 py-2 rounded-full bg-[#064749]">
                    <a href="/pay2" className="block">Thanh toán</a>
                </button>
            </div>

            {/* Phần thông tin đặt phòng */}
            <div className="lg:w-1/3 p-4 mt-10 border rounded-lg shadow-lg ml-0 lg:ml-4 bg-[#F2F0F2]">
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

                <p className="font-bold mt-5 text-red-500 text-xs">Phòng chỉ có thể được hủy trước ngày check-in 48 tiếng!</p>
            </div>
        </div>
    );
}

export default Pay1;
