// useFetchBlogs.ts
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8000/api";

const useFetchBlogs = () => {
  const [blog, setBlog] = useState<any>([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetBlog = async () => {
      try {
        setLoading(true); // Start loading
        const res = await fetch(`${API_URL}/blogs`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        setBlog(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false); // Stop loading after fetch completes
      }
    };

    fetBlog();
  }, []);

  return { blog, loading }; // Return loading state
};

export default useFetchBlogs;
