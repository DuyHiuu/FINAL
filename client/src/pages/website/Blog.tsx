import React, { useEffect, useState } from "react";
import { Input, Row, Col, Spin, Typography, Card } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import useFetchBlogs from "../../api/useFetchBlogs";

const { Title, Text } = Typography;

const Blog = () => {
  const { blog } = useFetchBlogs(); // Xóa loading từ hook
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredBlogs = blog?.filter((blog: any) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white fixed top-0 left-0 w-full h-full z-50">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mb-10 mt-24">
      <img
        className="w-full h-auto max-h-[450px] sm:max-h-[350px] md:max-h-[450px] lg:max-h-[600px] object-cover"
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
                cover={<img alt={blog.title} src={blog.image} className="h-[200px] object-cover" />}
                className="bg-[#F2F0F2] shadow-lg"
              >
                <div className="p-4">
                  <Title level={4}>{blog.title}</Title>
                  <Text className="text-sm text-center">{blog.description}</Text>
                  <Text className="text-sm text-center block mt-2">Mô tả thêm về dịch vụ này.</Text>
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
