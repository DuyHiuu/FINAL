import React, { useState } from "react";
import { Link } from "react-router-dom";
import useFetchPayments from "../../../../api/useFetchPayments";

const RoomList = () => {
    const { payment, loading } = useFetchPayments();
    console.log(payment);


    if (loading) return <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
    </div>;

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Danh Sách Đơn Hàng</h1>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-200 text-gray-600">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">ID Đơn Hàng</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Tên Khách Hàng</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Size Phòng</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Tổng Tiền (VND)</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Ngày Check-In</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Trạng Thái</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payment.length > 0 ? (
                            payment?.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-2">{item.id}</td>
                                    <td className="px-4 py-2">{item.user_name}</td>
                                    <td className="px-4 py-2">{item.booking?.room?.size?.name}</td>
                                    <td className="px-4 py-2">{item.total_amount.toLocaleString("vi-VN")} VND</td>
                                    <td className="px-4 py-2">{item.booking?.start_date.split("-").reverse().join("-")}</td>
                                    <td className="px-4 py-2">
                                        <span
                                            className={`px-2 py-1 rounded text-sm ${item.status_id === 1
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-green-100 text-green-800"
                                                }`}
                                        >
                                            {item.status?.status_name}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center space-x-3">
                                            <Link
                                                to={`/admin/payments/detail/${item.id}`}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600 transition duration-200"
                                            >
                                                Chi tiết
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-4 text-gray-600">
                                    Không có đơn hàng nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default RoomList;
