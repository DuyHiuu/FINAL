import React, { useState } from "react";
import { Input, Row, Col, Modal, Typography, Card } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import useFetchBlogs from "../../api/useFetchBlogs";

const { Title, Text } = Typography;

const Blog = () => {
  const { blog } = useFetchBlogs(); 
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState(false); 
  const [selectedBlog, setSelectedBlog] = useState<any>(null); 

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredBlogs = blog?.filter((blog: any) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showBlogModal = (blog: any) => {
    setSelectedBlog(blog); 
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);  
    setSelectedBlog(null); 
  };

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
                cover={
                  <img
                    alt={blog.title}
                    src={blog.image}
                    className="h-[200px] object-cover"
                  />
                }
                className="bg-[#F2F0F2] shadow-lg"
                onClick={() => showBlogModal(blog)} // Gọi Modal khi click
              >
                <div className="p-4">
                  <Title level={4}>{blog.title}</Title>
                  <Text className="text-sm text-center">{blog.description}</Text>
                  <Text className="text-sm text-center block mt-2">
                    Mô tả thêm về dịch vụ này.
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
          {filteredBlogs?.length === 0 && (
            <Text className="text-gray-500">Không tìm thấy bài viết nào.</Text>
          )}
        </Row>
      </div>

      <Modal
        open={visible}
        footer={null}
        onCancel={closeModal} 
        centered
        bodyStyle={{ padding: 0 }}
      >
        {selectedBlog && (
          <div className="p-4">
            <img
              src={selectedBlog.image}
              alt={selectedBlog.title}
              className="w-full h-auto object-cover"
            />
            <div className="p-4">
              <Title level={2}>{selectedBlog.title}</Title>
              <Text>{selectedBlog.description}</Text>
              <div className="mt-4">
                <Text>Mô tả chi tiết: {selectedBlog.content || "Đang cập nhật..."}</Text>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Blog;
