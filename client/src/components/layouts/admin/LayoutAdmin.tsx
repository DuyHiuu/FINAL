import React from "react";
import { Layout, Menu, Avatar, Dropdown, Badge, Space } from "antd";
import { BellOutlined, LogoutOutlined } from "@ant-design/icons";
import { Outlet } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const user = {
  name: localStorage.getItem("name") || "Unknown User", // Lấy tên người dùng từ localStorage
  email: localStorage.getItem("email") || "unknown@example.com", // Lấy email từ localStorage
  imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const navigation = [
  { name: "PestSpa", href: "/", current: true },
  { name: "Danh sách phòng", href: "/admin/rooms", current: false },
  { name: "Danh sách size", href: "/admin/sizes", current: false },
  { name: "Danh sách voucher", href: "/admin/vouchers", current: false },
  { name: "Danh sách dịch vụ", href: "/admin/services", current: false },
  { name: "Danh sách bài viết", href: "/admin/blogs", current: false },
  { name: "Danh sách người dùng", href: "/admin/users", current: false },
  { name: "Danh sách bình luận", href: "/admin/comments", current: false },
  { name: "Danh sách liên hệ", href: "/admin/contacts", current: false },
  { name: "Quản lí đơn hàng", href: "/admin/payments", current: false },
  { name: "Biểu đồ", href: "/admin/chart", current: false },
];

const userNavigation = [
  { name: "Đăng xuất", href: "#" },
];

const LayoutAdmin = () => {
  // Menu dropdown for user
  const menu = (
    <Menu>
      {userNavigation.map((item) => (
        <Menu.Item key={item.name}>
          <a href={item.href} className="text-gray-700">{item.name}</a>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      {/* Sidebar */}
      <Sider width={250} className="site-layout-background" style={{ backgroundColor: "#fff" }}>
        <div className="flex items-center justify-center py-6">
          <img className="h-12 w-auto" src="/images/logo.png" alt="Logo" />
        </div>
        <Menu
          theme="light"  // Changed theme to light to match the white background
          mode="inline"
          defaultSelectedKeys={["1"]}
          className="h-full"
          style={{ backgroundColor: "#fff" }} // Make the sidebar background white
        >
          {navigation.map((item, index) => (
            <Menu.Item key={index} icon={null}>
              <a href={item.href} className={item.current ? "text-gray-900" : "text-gray-400"}>
                {item.name}
              </a>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      {/* Main content */}
      <Layout className="site-layout">
        {/* Header */}
        <Header className="site-layout-background" style={{ padding: 0, backgroundColor: "#fff" }}>
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-3xl text-gray-900 font-bold">Admin {user.name}</h1>
            <Space size="middle">
              <Badge count={5} showZero>
                <BellOutlined className="text-xl text-gray-600" />
              </Badge>
              <Dropdown overlay={menu} trigger={['click']}>
                <Avatar size="large" src={user.imageUrl} />
              </Dropdown>
            </Space>
          </div>
        </Header>

        {/* Content */}
        <Content
          style={{
            padding: "0 50px",
            marginTop: 24,
            backgroundColor: "#fff", // Changed background color to white for content
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
