import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Tag, Modal, Row, Col, Typography } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
// import { getAllStoreOrders } from "../api/order/api";
import { RootState } from "../store/store";
import { getAllUpdatedOrders } from "../api/order/api";
import { BACKEND_URL } from "../config/server";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const mergeOrderWithProduct = (orderData) => {
  return orderData.map((order: any) => ({
    orderId: order._id,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    productId: order.productList[0].product._id,
    productSize: order.productList[0].product.size
      .map((s) => s.value)
      .join(", "),
    productType: order.productList[0].product.type
      .map((t) => t.value)
      .join(", "),
    quantity: order.productList[0].quantity,
    productStatus: order.productList[0].orderProductStatus,
    storeId: order.productList[0].storeId,
    paymentMethod: order.paymentMethod,
    total: order.total,
    discountedTotal: order.discountedTotal,
    status: order.productList[0].orderProductStatus,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }));
};

const OrderList = () => {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const token = useSelector((state: RootState) => state.Login.token);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const fetchData = async () => {
    const response = await axios.get(
      `${BACKEND_URL}/order/get_all_store_orders?page_no=${currentPage}&store_id=${"677651fd872afc44dec1c2db"}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    setOrders(response.data.orders);
    setTotalOrders(response.data.totalOrders);
    setTotalPages(response.data.totalPages);
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
    // {
    //   title: "PRODUCT STATUS",
    //   dataIndex: "productStatus",
    //   key: "productStatus",
    //   render: (status: string) => {
    //     let color = "blue";
    //     if (status === "Pending") color = "orange";
    //     if (status === "shipped") color = "green";
    //     if (status === "Confirmed") color = "blue";
    //     return <Tag color={color}>{status}</Tag>;
    //   },
    // },
  ].filter(Boolean);
  const paymentData = [
    {
      count: 56,
      label: "Pending Payment",
      icon: (
        <ClockCircleOutlined
          style={{ fontSize: "30px", color: "yellowgreen" }}
        />
      ),
    },
    {
      count: 156852,
      label: "Completed Payment",
      icon: (
        <CheckCircleOutlined
          style={{ fontSize: "30px", color: "greenyellow" }}
        />
      ),
    },
    {
      count: 156,
      label: "Refunded",
      icon: (
        <RollbackOutlined
          style={{ fontSize: "30px", color: "rebeccapurple" }}
        />
      ),
    },
    {
      count: 156,
      label: "Failed",
      icon: <CloseCircleOutlined style={{ fontSize: "30px", color: "red" }} />,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center p-2 gap-2">
      <div className="w-full h-max border flex py-5 rounded-lg shadow-lg justify-around flex-wrap bg-white">
        {paymentData.map((item, index) => (
          <div key={index} className="flex flex-col w-[200px] h-max">
            <div className="flex w-full justify-between">
              <p className="font-medium text-[24px]">{item.count}</p>
              {item.icon}
            </div>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
      <Table
        columns={columns}
        dataSource={orders}
        className=" shadow-lg w-full"
        scroll={{ x: 1000 }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalPages,
          onChange: (page) => setCurrentPage(page),
        }}
      />
    </div>
  );
};

export default OrderList;
