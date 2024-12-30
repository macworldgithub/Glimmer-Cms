import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import { Button, Layout, theme } from "antd";
import SideBar from "../components/SideBar";
import Bell from "../components/Bell";
import Profile from "../components/Profile";

const { Header, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout className="w-[100vw] h-[100vh]">
      <SideBar collapsed={collapsed} />
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "white",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={
              collapsed ? (
                <MenuUnfoldOutlined style={{ color: "#5f61e6" }} />
              ) : (
                <MenuFoldOutlined style={{ color: "#5f61e6" }} />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div className="flex items-center gap-2 pr-2">
            <Bell />
            <Profile />
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#F5F5F5",
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
