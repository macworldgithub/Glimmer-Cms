
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Button, Table, Tag } from "antd";
// import axios from "axios";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { RootState } from "../store/store";
// import { BACKEND_URL } from "../config/server";
// import OrderSearchBar from "../components/OrderSearchBar";

// const OrderList = () => {
//   const [orders, setOrders] = useState([]);
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [filters, setFilters] = useState<{ order_id?: string; customerEmail?: string }>({});
//   const token = useSelector((state: RootState) => state.Login.token);
//   const store_id = useSelector((state: RootState) => state.Login._id);
//   const role = useSelector((state: RootState) => state.Login.role); 
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const pageSize = 10;
//   const currentPage = Number(searchParams.get("page")) || 1;
//   const storeId = searchParams.get("store") || "";

//   const fetchData = async (customFilters = filters) => {
//     try {
//       const queryParams = new URLSearchParams({
//         page_no: currentPage.toString(),
//         page_size: pageSize.toString(),
//         store_id: store_id || storeId,
//       });

//       if (customFilters.order_id) queryParams.append("order_id", customFilters.order_id);
//       if (customFilters.customerEmail) queryParams.append("customerEmail", customFilters.customerEmail);

//       const response = await axios.get(
//         `${BACKEND_URL}/order/get_all_store_orders?${queryParams.toString()}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setOrders(response.data.orders);
//       setTotalOrders(response.data.totalCount);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [currentPage]);

//   const handleSearch = (newFilters: { order_id?: string; customerEmail?: string }) => {
//     setFilters(newFilters);
//     fetchData(newFilters);
//   };

//   const handleTransferToPostEx = async (orderId: string) => {
//     try {
//       const response = await axios.post(
//         `${BACKEND_URL}/postex/order`,
//         { orderId: orderId }, // Explicitly match PostexOrderDto structure
//         {
//           headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         }
//       );
//       if (response.data.statusCode === "200") {
//         fetchData(); // Refresh order list to reflect new status
//       }
//     } catch (error) {
//       console.error("Error transferring order to PostEx:", error.response?.data || error.message);
//     }
//   };

//   // const handleUpdateStatus = async (orderId: string, deliverToPostEx: boolean) => {
//   //   try {
//   //     const response = await axios.patch(
//   //       `${BACKEND_URL}/postex/update-delivery-status`,
//   //       { id: orderId, deliver_to_postex: deliverToPostEx },
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }
//   //     );
//   //     if (response.data.message) {
//   //       fetchData(); // Refresh order list to reflect updated status
//   //     }
//   //   } catch (error) {
//   //     console.error("Error updating delivery status:", error);
//   //   }
//   // };

//   // const handleDeleteOrder = async (orderId: string) => {
//   //   try {
//   //     const response = await axios.put(
//   //       `${BACKEND_URL}/postex/cancel-order`,
//   //       { trackingNumber: orderId }, // Assuming _id can be used as trackingNumber for cancellation
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }
//   //     );
//   //     if (response.data.message) {
//   //       fetchData(); // Refresh order list to reflect cancellation
//   //     }
//   //   } catch (error) {
//   //     console.error("Error deleting order:", error);
//   //   }
//   // };

//   const columns = [
//     {
//       title: "ORDER ID",
//       dataIndex: "_id",
//       key: "_id",
//     },
//     {
//       title: "CUSTOMER EMAIL",
//       dataIndex: "customerEmail",
//       key: "customerEmail",
//     },
//     {
//       title: "Product Quantity",
//       dataIndex: "quantity",
//       key: "quantity",
//       render: (_, record) => <p>{record.productList.length}</p>,
//     },
//     {
//       title: "PAYMENT METHOD",
//       dataIndex: "paymentMethod",
//       key: "paymentMethod",
//     },
//     {
//       title: "Total (PKR)",
//       dataIndex: "discountedTotal",
//       key: "discountedTotal",
//     },
//     {
//       title: "ORDER STATUS",
//       dataIndex: "status",
//       key: "status",
//       render: (status: string) => {
//         let color = "blue";
//         const statusMap: Record<string, string> = {
//           Unbooked: "orange",
//           Booked: "blue",
//           "PostEx WareHouse": "green",
//           "Out For Delivery": "green",
//           Delivered: "green",
//           Returned: "red",
//           "Un-Assigned By Me": "gray",
//           Expired: "red",
//           "Delivery Under Review": "orange",
//           "Picked By PostEx": "green",
//           "Out For Return": "yellow",
//           Attempted: "orange",
//           "En-Route to PostEx warehouse": "green",
//           Confirmed: "blue",
//           Cancelled: "red",
//           Pending: "orange",
//           shipped: "green",
//         };
//         color = statusMap[status] || "blue";
//         return <Tag color={color}>{status}</Tag>;
//       },
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: (_, record) => (
//         <div className="space-x-2">
//           {role === "super_admin" && !record.trackingNumber && (
//             <Button
//               type="primary"
//               onClick={() => handleTransferToPostEx(record._id)}
//             >
//               Transfer to PostEx
//             </Button>
//           )}
//           {/* {record.status !== "Delivered" && record.status !== "Cancelled" && (
//             <Button
//               type="primary"
//               onClick={() => handleUpdateStatus(record._id, true)}
//             >
//               Update Status
//             </Button>
//           )}
//           {record.status !== "Delivered" && (
//             <Button
//               type="danger"
//               onClick={() => handleDeleteOrder(record._id)}
//             >
//               Delete Order
//             </Button>
//           )} */}
//           <Button
//             type="primary"
//             onClick={() =>
//               navigate(`/order-details/${record._id}?store=${storeId}`, {
//                 state: { data: record },
//               })
//             }
//           >
//             View Details
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <div className="p-4 text-lg font-semibold text-gray-800 border-b">
//         Order List
//         <OrderSearchBar onSearch={handleSearch} />
//       </div>
//       <div className="w-full h-full flex flex-col items-center p-2 gap-2">
//         <Table
//           columns={columns}
//           dataSource={orders}
//           className="shadow-lg w-full"
//           scroll={{ x: 1000 }}
//           pagination={{
//             current: currentPage,
//             pageSize: pageSize,
//             total: totalOrders,
//             onChange: (page) => setSearchParams({ page: page.toString() }),
//             showSizeChanger: false,
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default OrderList;
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table, Tag, message } from "antd";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RootState } from "../store/store";
import { BACKEND_URL } from "../config/server";
import OrderSearchBar from "../components/OrderSearchBar";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [filters, setFilters] = useState<{ order_id?: string; customerEmail?: string }>({});
  const token = useSelector((state: RootState) => state.Login.token);
  const store_id = useSelector((state: RootState) => state.Login._id);
  const role = useSelector((state: RootState) => state.Login.role);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageSize = 10;
  const currentPage = Number(searchParams.get("page")) || 1;
  const storeId = searchParams.get("store") || "";

  const fetchData = async (customFilters = filters) => {
    // For super_admin, require storeId to be present
    if (role === "super_admin" && !storeId && !store_id) {
      message.error("Please select a store to view orders.");
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        page_no: currentPage.toString(),
        page_size: pageSize.toString(),
        store_id: store_id || storeId,
      });

      if (customFilters.order_id) queryParams.append("order_id", customFilters.order_id);
      if (customFilters.customerEmail) queryParams.append("customerEmail", customFilters.customerEmail);

      console.log("Fetching orders with params:", queryParams.toString()); // Debug log

      const response = await axios.get(
        `${BACKEND_URL}/order/get_all_store_orders?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.orders);
      setTotalOrders(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Failed to fetch orders.");
    }
  };

  useEffect(() => {
    // Set default store parameter for super_admin if missing
    if (role === "super_admin" && !storeId && store_id) {
      setSearchParams({ page: "1", store: store_id });
    }
    fetchData();
  }, [currentPage, storeId, role, store_id]);

  const handleSearch = (newFilters: { order_id?: string; customerEmail?: string }) => {
    setFilters(newFilters);
    // Only set page and store in URL
    setSearchParams({
      page: "1",
      store: storeId || store_id || "",
    });
    fetchData(newFilters);
  };

  const handleTransferToPostEx = async (orderId: string) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/postex/order`,
        { orderId: orderId },
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );
      if (response.data.statusCode === 200) {
        message.success("Order transferred to PostEx.");
        window.location.reload(); 
        fetchData();
      }
    } catch (error) {
      console.error("Error transferring order to PostEx:", error.response?.data || error.message);
      message.error("Failed to transfer order to PostEx.");
    }
  };

  const columns = [
    {
      title: "ORDER ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "CUSTOMER EMAIL",
      dataIndex: "customerEmail",
      key: "customerEmail",
    },
    {
      title: "Product Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => <p>{record.productList?.length || 0}</p>,
    },
    {
      title: "PAYMENT METHOD",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Total (PKR)",
      dataIndex: "discountedTotal",
      key: "discountedTotal",
      render: (total) => `${total || 0}`,
    },
    {
      title: "ORDER STATUS",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "blue";
        const statusMap: Record<string, string> = {
          Unbooked: "orange",
          Booked: "blue",
          "PostEx WareHouse": "green",
          "Out For Delivery": "green",
          Delivered: "green",
          Returned: "red",
          "Un-Assigned By Me": "gray",
          Expired: "red",
          "Delivery Under Review": "orange",
          "Picked By PostEx": "green",
          "Out For Return": "yellow",
          Attempted: "orange",
          "En-Route to PostEx warehouse": "green",
          Confirmed: "blue",
          Cancelled: "red",
          Pending: "orange",
          shipped: "green",
        };
        color = statusMap[status] || "blue";
        return <Tag color={color}>{status || "N/A"}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="space-x-2">
          {role === "super_admin" && !record.trackingNumber && (
            <Button
              type="primary"
              onClick={() => handleTransferToPostEx(record._id)}
            >
              Transfer to PostEx
            </Button>
          )}
          <Button
            type="primary"
            onClick={() =>
              navigate(`/order-details/${record._id}?store=${storeId || store_id || ""}`, {
                state: { data: record },
              })
            }
          >
            View Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {role === "super_admin" && !storeId && !store_id && (
        <p className="text-center text-red-500">Please select a store to view orders.</p>
      )}
      <div className="p-4 text-lg font-semibold text-gray-800 border-b">
        Order List
        <OrderSearchBar onSearch={handleSearch} />
      </div>
      <div className="w-full h-full flex flex-col items-center p-2 gap-2">
        <Table
          columns={columns}
          dataSource={orders}
          className="shadow-lg w-full"
          scroll={{ x: 1000 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalOrders,
            onChange: (page) => {
              // Only set page and store in URL
              setSearchParams({
                page: page.toString(),
                store: storeId || store_id || "",
              });
            },
            showSizeChanger: false,
          }}
        />
      </div>
    </div>
  );
};

export default OrderList;