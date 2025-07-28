import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table, Tag, Space } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RootState } from "../store/store";
import { BACKEND_URL } from "../config/server";
import axios from "axios";

const OrderTable = () => {
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
      const response = await axios.get(
        `${BACKEND_URL}/order/get_all_store_orders?page_no=${currentPage}&page_size=${pageSize}&store_id=${store_id}&status=Pending`,
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
        if (status === "Shipped") color = "green";
        if (status === "Confirmed") color = "blue";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
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
        </Space>
      ),
    },
  ];

  return (
  <div className="overflow-x-auto md:overflow-x-hidden lg:overflow-x-auto" style={{ width: '100%' }}>
      <Table
        columns={columns}
        dataSource={orders}
        className="shadow-lg w-full"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalOrders,
          onChange: (page) => setSearchParams({ page: page.toString() }),
          showSizeChanger: false,
        }}
      />
    </div>
  );
};

export default OrderTable;
