import axios from "axios";

// Khởi tạo một instance của axios
const authClient = axios.create({
  baseURL: "http://localhost:8000/api", // Đặt URL của API của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để tự động gửi token khi có token trong localStorage
authClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Thêm token vào header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authClient;