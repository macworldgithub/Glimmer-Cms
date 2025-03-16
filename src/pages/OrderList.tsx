import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table, Tag } from "antd";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RootState } from "../store/store";
import { BACKEND_URL } from "../config/server";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const token = useSelector((state: RootState) => state.Login.token);
  const store_id = useSelector((state: RootState) => state.Login._id);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageSize = 10;
  const currentPage = Number(searchParams.get("page")) || 1;

  const fetchData = async () => {
    try {
      console.log(`Fetching orders for page ${currentPage}`)
      const response = await axios.get(
        `${BACKEND_URL}/order/get_all_store_orders?page_no=${currentPage}&page_size=${pageSize}&store_id=${store_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data); // Debugging API Response
      setOrders(response.data.orders);
      setTotalOrders(response.data.totalCount); // FIX: Use totalCount instead of totalOrders
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

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
      render: (_, record) => <p>{record.productList.length}</p>,
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
    },
    {
      title: "ORDER STATUS",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "blue";
        if (status === "Pending") color = "orange";
        if (status === "shipped") color = "green";
        if (status === "Confirmed") color = "blue";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() =>
            navigate(`/order-details/${record._id}`, {
              state: { data: record },
            })
          }
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center p-2 gap-2">
      <Table
        columns={columns}
        dataSource={orders}
        className="shadow-lg w-full"
        scroll={{ x: 1000 }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalOrders, // Now correctly using totalCount
          onChange: (page) => setSearchParams({ page: page.toString() }),
          showSizeChanger: false,
          // showTotal: (total) => `Total ${total} Orders`,
        }}
      />
    </div>
  );
};

export default OrderList;
