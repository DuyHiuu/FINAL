import React, { useState } from "react";
import { Input, Row, Col, Typography, Card } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useFetchBlogs from "../../api/useFetchBlogs";

const { Title, Text } = Typography;

const Blog = () => {
  const { blog } = useFetchBlogs(); 
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredBlogs = blog?.filter((b: any) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (id: string) => {
    navigate(`/blog/${id}`);
  };

  return (
    <div className="flex flex-col items-center mb-10 mt-24">
      <img
        className="w-full h-auto max-h-[450px] object-cover"
        src="/images/img.webp"
        alt="PetSpa"
      />

      <div className="flex justify-center mt-10">
        <div className="relative w-full max-w-md">
          <Input
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={handleSearch}
            prefix={<SearchOutlined />}
            className="w-full py-2 pl-10 pr-4 border rounded-lg"
          />
        </div>
      </div>

      <div className="flex flex-col items-center mt-10">
        <Title level={1}>Blog</Title>

        <Row gutter={[16, 16]} justify="center" className="w-full px-4">
          {filteredBlogs?.map((blog: any) => (
            <Col key={blog.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt={blog.title}
                    src={blog.image}
                    className="h-[200px] object-cover"
                  />
                }
                className="bg-[#F2F0F2] shadow-lg"
                onClick={() => handleCardClick(blog.id)}
              >
                <div className="p-4">
                  <Title level={4}>{blog.title}</Title>
                  <Text className="text-sm text-center">{blog.description}</Text>
                </div>
              </Card>
            </Col>
          ))}
          {filteredBlogs?.length === 0 && (
            <Text className="text-gray-500">Không tìm thấy bài viết nào.</Text>
          )}
        </Row>
      </div>
    </div>
  );
};

export default Blog;
