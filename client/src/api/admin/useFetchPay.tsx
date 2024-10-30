import React, { useEffect, useState } from "react";
const API_URL = "http://localhost:8000/api/payments";

const useFetchPay = () => {
  const [payment, setPayment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPay = async () => {
      setLoading(true);

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

        const responseData = await res.json();
        console.log("Dữ liệu từ API:", responseData); // Kiểm tra dữ liệu từ API

        if (responseData && responseData.status && responseData.data && Array.isArray(responseData.data.payment)) {
          setPayment(responseData.data.payment);
        } else {
          throw new Error("Dữ liệu không hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPay();
  }, []);


  return { payment, loading };
};

export default useFetchPay;
