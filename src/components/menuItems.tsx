import {
  DashboardOutlined,
  FileOutlined,
  OrderedListOutlined,
  ScissorOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";

// Define the type for Menu Items
// type MenuItem = Required<MenuProps>["items"][number];

type MenuItem = {
  key: string;
  icon?: JSX.Element;
  label: string;
  children?: MenuItem[];
  path?: string; // Add the path property
};

// Utility function to generate menu items
export const getMenuItems = (
  showEcommerce: boolean,
  showSaloon: boolean,
  showSuperAdmin: boolean
): MenuItem[] => [
  ...(showSuperAdmin
    ? [
        {
          key: "dashboard",
          icon: <DashboardOutlined />,
          label: "Dashboard",
          path: "/dashboard",
        },

        {
          key: "Create-Category",
          icon: <DashboardOutlined />,
          label: "Create Categories",
          path: "/Create_Category",
        },

        {
          key: "makestore",
          icon: <DashboardOutlined />,
          label: "Create Store",
          path: "/makestore",
        },

        {
          key: "email",
          icon: <DashboardOutlined />,
          label: "Email",
          path: "/email",
        },
        {
          key: "store",
          icon: <DashboardOutlined />,
          label: "Store",
          path: "/store",
        },
      ]
    : []),

  ...(showEcommerce
    ? [
        {
          key: "ecommerce-dashboard",
          icon: <DashboardOutlined />,
          label: "Dashboard",
          path: "/E_Dashboard",
        },

        {
          key: "ecommerce-order",
          icon: <OrderedListOutlined />,
          label: "Order",
          children: [
            {
              key: "order-list",
              label: "Order List",
              //@ts-ignore
              path: "/orderList",
            },
            {
              key: "order-details",
              label: "Order Details",
              path: "/orderDetails",
            },
          ],
        },
        {
          key: "ecommerce-products",
          icon: <FileOutlined />,
          label: "Products",
          children: [
            {
              key: "products",
              icon: <FileOutlined />,
              label: "Product List",
              path: "/Product_List",
            },

            {
              key: "add-product",
              icon: <FileOutlined />,
              label: "Add Product",
              path: "/Add_Product",
            },
            // {
            //   key: "category-list",
            //   icon: <FileOutlined />,
            //   label: "Category List",
            //   path: "/Category_List",
            // },
          ],
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
