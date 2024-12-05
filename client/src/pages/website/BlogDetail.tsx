import React from "react";
import { useParams } from "react-router-dom";
import { Typography, Spin, Row, Col, Card } from "antd";
import useFetchBlogs from "../../api/useFetchBlogs";

const { Title, Text } = Typography;

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [blogDetail, setBlogDetail] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const { blog } = useFetchBlogs();
  React.useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/blogs/${id}`);
        const data = await response.json();
        setBlogDetail(data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [id]);

  const handleCardClick = (blogId: string) => {
    window.location.href = `/blog/${blogId}`;
  };

  if (loading) return <Spin tip="Đang tải chi tiết blog..." className="w-full flex justify-center my-10" />;

  if (!blogDetail) return <Text className="text-center">Không tìm thấy bài viết.</Text>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <img
          src={blogDetail.image}
          alt={blogDetail.title}
          className="w-full h-[600px] object-cover rounded-lg shadow-lg mb-4"
        />
        <Title level={1} className="mb-4">{blogDetail.title}</Title>
        <Text className="text-lg block mb-4">{blogDetail.description}</Text>
        <div className="mt-4">
          <Text>{blogDetail.content || "Nội dung đang được cập nhật..."}</Text>
        </div>
      </div>

      <div>
        <Title level={2} className="mt-10">Các bài viết liên quan</Title>
        <Row gutter={[16, 16]} className="mt-4">
          {blog?.map((relatedBlog: any) => (
            relatedBlog.id !== blogDetail.id && (
              <Col key={relatedBlog.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={relatedBlog.title}
                      src={relatedBlog.image}
                      className="h-[200px] object-cover"
                    />
                  }
                  className="shadow-md"
                  onClick={() => handleCardClick(relatedBlog.id)}
                >
                  <Title level={4} className="text-center">{relatedBlog.title}</Title>
                  <Text className="text-sm">{relatedBlog.description}</Text>
                </Card>
              </Col>
            )
          ))}
        </Row>
        {blog?.filter((b: any) => b.id !== blogDetail.id).length === 0 && (
          <Text className="text-gray-500">Không có bài viết liên quan.</Text>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
