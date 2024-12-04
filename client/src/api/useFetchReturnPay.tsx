import React, { useEffect, useState } from "react";
const API_URL = "http://localhost:8000/api/pay_return";

const useFetchReturnPay = () => {
    const [returnPays, setReturnPays] = useState<any[]>([]); // Khởi tạo size là mảng rỗng

    useEffect(() => {
        const fetchReturnPays = async () => {
            try {
                const res = await fetch(`${API_URL}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
                }

                const responseData = await res.json(); // Phân tích phản hồi thành JSON

                if (responseData && responseData.status && responseData.data) {
                    setReturnPays(responseData.data); // Lưu danh sách size vào state
                } else {
                    throw new Error("Dữ liệu không hợp lệ");
                }
            } catch (error) {
                console.error("Lỗi:", error);
            }
        };

        fetchReturnPays();
    }, []);

    return { returnPays };
};

export default useFetchReturnPay;