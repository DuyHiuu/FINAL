import React from "react";
import { Layout, Menu, Avatar, Dropdown, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Outlet, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const user = {
  name: localStorage.getItem("name") || "Unknown User",
  email: localStorage.getItem("email") || "unknown@example.com",
};

const navigation = [
  { name: "PestSpa", href: "/", key: "home" },
  { name: "Dashboard", href: "/admin/home", key: "dashboard" },
  { name: "Quản lí phòng", href: "/admin/rooms", key: "rooms" },
  { name: "Quản lí size", href: "/admin/sizes", key: "sizes" },
  { name: "Quản lí voucher", href: "/admin/vouchers", key: "vouchers" },
  { name: "Quản lí dịch vụ", href: "/admin/services", key: "services" },
  { name: "Quản lí bài viết", href: "/admin/blogs", key: "blogs" },
  { name: "Quản lí người dùng", href: "/admin/users", key: "users" },
  { name: "Quản lí đánh giá", href: "/admin/ratings", key: "ratings" },
  { name: "Quản lí liên hệ", href: "/admin/contacts", key: "contacts" },
  { name: "Quản lí đơn hàng", href: "/admin/payments", key: "payments" },
];

const userNavigation = [{ name: "Đăng xuất", href: "#" }];

const LayoutAdmin = () => {
  const location = useLocation();

  const menu = (
    <Menu>
      {userNavigation.map((item) => (
        <Menu.Item key={item.name}>
          <a href={item.href} className="text-gray-700">
            {item.name}
          </a>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <Sider width={250} className="site-layout-background" style={{ backgroundColor: "#fff" }}>
        <div className="flex items-center justify-center py-6">
          <img className="h-12 w-auto" src="/images/logo.png" alt="Logo" />
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          className="h-full"
          style={{ backgroundColor: "#fff" }}
        >
          {navigation.map((item) => (
            <Menu.Item key={item.href} icon={null}>
              <a
                href={item.href}
                className={
                  location.pathname === item.href
                    ? "text-gray-900"
                    : "text-gray-400"
                }
              >
                {item.name}
              </a>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0, backgroundColor: "#fff" }}>
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-2xl text-gray-900 font-bold">
              <UserOutlined /> Admin {user.name}
            </h1>
            <Space size="middle">
              <Dropdown overlay={menu} trigger={["click"]}>
                <Avatar className="flex items-center space-x-2 bg-[#064749]">
                  {user.name[0]}
                </Avatar>
              </Dropdown>
            </Space>
          </div>
        </Header>

        <Content
          style={{
            padding: "0 50px",
            backgroundColor: "#fff",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
