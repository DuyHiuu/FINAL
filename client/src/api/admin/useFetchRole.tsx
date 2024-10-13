import React, { useEffect, useState } from "react";
const API_URL = "http://localhost:8000/api";


const useFetchRole = () => { 

  const [role, setRole] = useState<any>();
 
  useEffect(() => {
    try {
      
      const fetRole = async () => {
        const res = await fetch(`${API_URL}/roles`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json(); 
        setRole(data); 
      };
      fetRole();
    } catch (error) {
      console.log(error);
    }
  }, []);
  return { role };
};

export default useFetchRole;
