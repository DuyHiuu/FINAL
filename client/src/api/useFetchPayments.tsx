import React, { useEffect, useState } from "react";
const API_URL = "http://localhost:8000/api";

const useFetchPayments = () => {
  const [payment, setPayment] = useState<any[]>([]); 

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await fetch(`${API_URL}/payments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }

        const responseData = await res.json(); 

        
        if (responseData && responseData.status && responseData.payment) {
          setPayment(responseData.payment); 
        } else {
          throw new Error("Dữ liệu không hợp lệ");
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayment();
  }, []);

  return { payment };
};

export default useFetchPayments;
