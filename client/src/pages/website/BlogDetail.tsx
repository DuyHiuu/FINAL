import React from "react";
import { useParams } from "react-router-dom";
import { Typography, Spin } from "antd";

const { Title, Text } = Typography;

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [blogDetail, setBlogDetail] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

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

  if (loading) return <Spin tip="Đang tải chi tiết blog..." />;

  if (!blogDetail) return <Text>Không tìm thấy bài viết.</Text>;

  return (
    <div className="container mx-auto px-4 py-8">
      <img
        src={blogDetail.image}
        alt={blogDetail.title}
        className="w-full h-[700px] mb-4 object-cover rounded-lg shadow"
      />

      <Title level={1}>{blogDetail.title}</Title>
      <Text className="text-lg">{blogDetail.description}</Text>
      <div className="mt-4">
        <Text>{blogDetail.content || "Nội dung đang được cập nhật..."}</Text>
      </div>
    </div>
  );
};

export default BlogDetail;
