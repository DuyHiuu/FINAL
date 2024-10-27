import React, { useEffect, useState } from "react";
const API_URL = "http://localhost:8000/api/payments/list";

const useFetchPayments = () => {
  const [payment, setPayment] = useState<any[]>([]);
  const [user_id, setUser_id] = useState("");

  useEffect(() => {
    const user_idFromStorage = localStorage.getItem("user_id");
    setUser_id(user_idFromStorage || "");
  }, []);

  useEffect(() => {
    const fetchPayment = async () => {
      if (!user_id) return;

      try {
        const res = await fetch(`${API_URL}/${user_id}`, {
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
      }
    };

    fetchPayment();
  }, [user_id]);


  return { payment };
};

export default useFetchPayments;
