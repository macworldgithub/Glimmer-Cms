import React, { useState, useEffect } from "react";

import Logo from "../assets/Logo/logo.png";
import { getMenuItems } from "./menuItems";

import { useNavigate } from "react-router-dom";

import { Layout, Menu } from "antd";

import { useLocation } from "react-router-dom";

interface SideBarProps {
  collapsed: boolean;
  // setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBar: React.FC<SideBarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const [showEcommerce, setShowEcommerce] = useState(true);
  const [showSaloon, setShowSaloon] = useState(true);

  const menuItems = getMenuItems(showEcommerce, showSaloon);

  const { Sider } = Layout;

  const findParentKeys = (path: string, items: any[]): string[] => {
    for (let item of items) {
      if (item.path === path) return [item.key];
      if (item.children) {
        const childKeys = findParentKeys(path, item.children);
        if (childKeys.length) return [item.key, ...childKeys];
      }
    }
    return [];
  };
  const location = useLocation();

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // Recursive function to find keys for the current route
  const findKeysForPath = (
    path: string,
    items: any[]
  ): { selected: string; open: string[] } => {
    for (const item of items) {
      if (item.path === path) return { selected: item.key, open: [] };

      if (item.children) {
        const childKeys = findKeysForPath(path, item.children);
        if (childKeys.selected) {
          return {
            selected: childKeys.selected,
            open: [item.key, ...childKeys.open],
          };
        }
      }
    }
    return { selected: "", open: [] };
  };

  useEffect(() => {
    // Get the selected and open keys based on the current URL
    const { selected, open } = findKeysForPath(location.pathname, menuItems);
    setSelectedKeys([selected]);
    setOpenKeys(open);
  }, [location.pathname]);

  const handleMenuClick = ({ key }: { key: string }) => {
    // Find the path for the clicked key
    const findPath = (items: any[], key: string): string | undefined => {
      for (const item of items) {
        if (item.key === key) return item.path;
        if (item.children) {
          const childPath = findPath(item.children, key);
          if (childPath) return childPath;
        }
      }
      return undefined;
    };

    const path = findPath(menuItems, key);
    if (path) {
      navigate(path); // Navigate to the corresponding path
    } else {
      console.warn(`No path found for menu key: ${key}`);
    }
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        backgroundColor: "white",
        height: "100vh",
      }}
      width={"180px"}
    >
      <div className="demo-logo-vertical p-1" />
      <img src={Logo} className="mb-4" />
      <Menu
        mode="inline"
        items={menuItems}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={(keys) => setOpenKeys(keys)} // Sync open keys on expand/collapse
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default SideBar;
