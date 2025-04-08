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
          key: "services",
          icon: <DashboardOutlined />,
          label: "Create Services",
          path: "/services",
        },
        {
          key: "salon",
          icon: <DashboardOutlined />,
          label: "Create Salon",
          path: "/salon",
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

        {
          key: "salon",
          icon: <FileOutlined />,
          label: "Salon",
          children: [
            {
              key: "super-admin-manage-services",
              icon: <FileOutlined />,
              label: "Salon Service List",
              path: "/All_Salons_Services",
            },
            {
              key: "super-admin-booking",
              icon: <FileOutlined />,
              label: "Salon Booking List",
              path: "/All_Salons_Bookings",
            },
          ],
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
          label: "Order List and Details",
          path: "/orderList",
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
        // {
        //   key: "ecommerce-customer",
        //   icon: <UserOutlined />,
        //   label: "Customer",
        // },
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
          key: "salon-dashboard",
          icon: <DashboardOutlined />,
          label: "Dashboard",
          path: "/S_Dashboard",
        },

        {
          key: "booking",
          icon: <OrderedListOutlined />,
          label: "Booking and Details",
          path: "/booking",
        },
        {
          key: "salon-services",
          icon: <FileOutlined />,
          label: "Services",
          children: [
            {
              key: "manage-services",
              icon: <FileOutlined />,
              label: "Manage Services",
              path: "/Manage_Services",
            },

            {
              key: "add-services",
              icon: <FileOutlined />,
              label: "Add Services",
              path: "/Add_services",
            },
          ],
        },
      ]
    : []),
];
