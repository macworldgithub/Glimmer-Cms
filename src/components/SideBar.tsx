import React, { useState } from "react";

import Logo from "../assets/Logo/logo.png";
import { getMenuItems } from "./menuItems";

import { Layout, Menu } from "antd";

interface SideBarProps {
  collapsed: boolean;
  // setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBar: React.FC<SideBarProps> = ({ collapsed }) => {
  const [showEcommerce, setShowEcommerce] = useState(true);
  const [showSaloon, setShowSaloon] = useState(true);

  const menuItems = getMenuItems(showEcommerce, showSaloon);

  const { Sider } = Layout;

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{ backgroundColor: "white" }}
      width={"15%"}
    >
      <div className="demo-logo-vertical p-1" />
      <img src={Logo} className="mb-4" />
      <Menu
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        items={menuItems}
      />
    </Sider>
  );
};

export default SideBar;
