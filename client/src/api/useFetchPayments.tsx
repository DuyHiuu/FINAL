import React, { useEffect, useState } from "react";
const API_URL = "http://localhost:8000/api";

const useFetchPayments = () => {
  const [paymethod, setPaymethod] = useState<any[]>([]); 

  useEffect(() => {
    const fetchpaymethod = async () => {
      try {
        const res = await fetch(`${API_URL}/paymethods`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }

        const responseData = await res.json(); 

        if (responseData && responseData.status && responseData.data) {
          setPaymethod(responseData.data); 
        } else {
          throw new Error("Dữ liệu không hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi khi fetch size:", error);
      }
    };

    fetchpaymethod();
  }, []);

  return { paymethod };
};

export default useFetchPayments;
