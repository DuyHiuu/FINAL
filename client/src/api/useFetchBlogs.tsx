import React, { useEffect, useState } from "react";
const API_URL = "http://localhost:8000/api";


const useFetchBlogs = () => { //Đặt đúng tên với file
  //blog là biến ở trang index
  // setBlog để get dữ liệu
  const [blog, setBlog] = useState<any>();
  //hàm để get dữ liệu
  useEffect(() => {
    try {
      // fetBlog để get dữ liệu
      const fetBlog = async () => {
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
        setBlog(data); // Lưu dữ liệu vào state
      };
      fetBlog();
    } catch (error) {
      console.log(error);
    }
  }, []);
  return { blog };
};

export default useFetchBlogs;
