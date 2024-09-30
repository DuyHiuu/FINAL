import React, { useEffect, useState } from "react";

const useFetchBlogs = () => {
  const [blog, setBlog] = useState<any>();
  useEffect(() => {
    try {
      const fetBlog = async () => {
        const res = await fetch("http://localhost:8000/api/blogs", {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
            throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
          }
  
          const data = await res.json(); // Phân tích phản hồi thành JSON
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
