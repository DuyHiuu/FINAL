import axios from "axios";
const API_URL = "http://localhost:8000/api";
export const fetchBlogs = async () => {
  const response = await axios.get(`${API_URL}/blogs`);
  console.log(response);
  return response.data;
};
export const createBlog = async (blogData: {
  title: string;

  description: string;
  image: string;
}) => {
  const response = await axios.post(`${API_URL}/blogs`, blogData);
  return response.data;
};
