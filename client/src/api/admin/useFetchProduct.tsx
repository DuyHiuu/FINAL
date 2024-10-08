import React, { useEffect, useState } from "react";
const API_URL = "http://localhost:8000/api";


const useFetchProduct = () => { //Đặt đúng tên với file
  //blog là biến ở trang index
  // setBlog để get dữ liệu
  const [product, setProduct] = useState<any>();
  //hàm để get dữ liệu
  useEffect(() => {
    try {
      // fetBlog để get dữ liệu
      const fetProduct = async () => {
        const res = await fetch(`${API_URL}/blogs`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json(); // Chuyển dữ liệu thành JSON
        setProduct(data); // Lưu dữ liệu vào statee
      };
      fetProduct();
    } catch (error) {
      console.log(error);
    }
  }, []);
  return { product };
};

export default useFetchProduct;
