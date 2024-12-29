import {
  DashboardOutlined,
  ShoppingOutlined,
  ScissorOutlined,
  FileOutlined,
  OrderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";

// Define the type for Menu Items
type MenuItem = Required<MenuProps>["items"][number];

// Utility function to generate menu items
export const getMenuItems = (
  showEcommerce: boolean,
  showSaloon: boolean
): MenuItem[] => [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  ...(showEcommerce
    ? [
        {
          key: "ecommerce",
          icon: <ShoppingOutlined />,
          label: "Ecommerce",
          children: [
            {
              key: "ecommerce-dashboard",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "ecommerce-order",
              icon: <OrderedListOutlined />,
              label: "Order",
            },
            {
              key: "ecommerce-products",
              icon: <FileOutlined />,
              label: "Products",
            },
            {
              key: "ecommerce-customer",
              icon: <UserOutlined />,
              label: "Customer",
            },
            {
              key: "ecommerce-reviews",
              icon: <FileOutlined />,
              label: "Managing Reviews",
            },
          ],
        },
      ]
    : []),
  ...(showSaloon
    ? [
        {
          key: "saloon",
          icon: <ScissorOutlined />,
          label: "Saloon",
          children: [
            {
              key: "saloon-dashboard",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "saloon-order",
              icon: <OrderedListOutlined />,
              label: "Order",
            },
            {
              key: "saloon-services",
              icon: <FileOutlined />,
              label: "Services",
            },
            {
              key: "saloon-customer",
              icon: <UserOutlined />,
              label: "Customer",
            },
            {
              key: "saloon-reviews",
              icon: <FileOutlined />,
              label: "Managing Reviews",
            },
          ],
        },
      ]
    : []),
];
