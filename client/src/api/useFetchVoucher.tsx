import React, { useEffect, useState } from "react";
const API_URL = "http://localhost:8000/api";

const useFetchVoucher = () => {
  const [vouchers, setVouchers] = useState<any[]>([]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await fetch(`${API_URL}/vouchers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }

        const responseData = await res.json();

        // In phản hồi ra console để kiểm tra
        console.log("API Response:", responseData);

        // Kiểm tra phản hồi trả về có phải là mảng không
        if (Array.isArray(responseData)) {
          setVouchers(responseData); // Nếu là mảng thì set trực tiếp
        } 
        // Nếu API trả về đối tượng với trường "data", set data từ đó
        else if (responseData && responseData.data) {
          setVouchers(responseData.data);
        } else {
          throw new Error("Dữ liệu không hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi khi fetch voucher:", error);
      }
    };

    fetchVouchers();
  }, []);

  return { vouchers, setVouchers };
};

export default useFetchVoucher;
