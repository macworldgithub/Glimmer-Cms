import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout } from "antd";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Bell from "../components/Bell";
import Profile from "../components/Profile";
import SideBar from "../components/SideBar";
import UpdateStoreModal from "../components/UpdateStore";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

import { Navigate } from "react-router-dom";
import SalonProfile from "../components/SalonProfile";
import UpdateSalonModal from "../components/UpdateSalon";

const { Header, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const role = useSelector((state: RootState) => state.Login.role);
  const [profile, setProfile] = useState<boolean>(false);
  // const {
  //   token: { colorBgContainer, borderRadiusLG },
  // } = theme.useToken();

  return (
    <Layout>
      <SideBar collapsed={collapsed} />
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "white",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
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
            {(role === "store" || role === "super_admin") && (
              <Profile profile={profile} setProfile={setProfile} />
            )}
            {role === "salon" && (
              <SalonProfile profile={profile} setProfile={setProfile} />
            )}
          </div>
        </Header>
        <Content
          style={{
            margin: "10px 16px",

            minHeight: 280,

            background: "#F5F5F5",
            overflowY: "auto", // Enables vertical scrolling
            height: "60vh", // Full height minus the header height (adjust as needed)
          }}
        >
          {(role === "store" || role === "super_admin") && (
            <UpdateStoreModal profile={profile} setProfile={setProfile} />
          )}
          {role === "salon" && (
            <UpdateSalonModal profile={profile} setProfile={setProfile} />
          )}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
