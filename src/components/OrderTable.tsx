import React from "react";

import { useState } from "react";
import { Table, Tag, Button } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import StoreOrderModal from "./StoreOrderModal";

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
  // return orderData.flatMap((order: any) => {
  //   console.log(order);
  //   if (!order || !Array.isArray(order.productList)) {
  //     return []; // Return empty array if no products exist
  //   }
  //   return order.productList.map((product: any) => ({
  //     orderId: order._id,
  //     customerId: order.customerId,
  //     customerEmail: order.customerEmail,
  //     customerName: order.customerName,
  //     paymentMethod: order.paymentMethod,
  //     total: order.total,
  //     discountedTotal: order.discountedTotal,
  //     status: order.status,
  //     createdAt: order.createdAt,
  //     updatedAt: order.updatedAt,
  //     productId: product._id,
  //     productName: product.name,
  //     productPrice: product.base_price,
  //     productDiscountedPrice: product.discounted_price,
  //     productStatus: product.status,
  //     quantity: product.quantity,
  //     productType: product.type?.map((t) => (
  //       <span className="flex w-[40px]">{t.value}</span>
  //     )),
  //     productSize: product.size?.map((s) => (
  //       <span className="flex w-[40px]">{s.value} {s.unit}</span>
  //     )),
  //   }));
  // });
};

const OrderTable = ({ currentPage, setCurrentPage, showActions }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const pageSize = 8;

  const showModal = (type, record) => {
    setActionType(type);
    setSelectedRecord(record);
    setIsModalVisible(true);

    setTimeout(() => {
      setIsModalVisible(true);
    }, 0);
  };

  const allOrders = useSelector(
    (state: RootState) => state.AllOrders.allOrders
  );
  console.log(allOrders);
  const totalPages = useSelector(
    (state: RootState) => state.AllOrders.dashboardTotalPages
  );
  const paginatedData = mergeOrderWithProduct(allOrders);

  const viewOrder = (orderId: string) => {
    console.log("Viewing order:", orderId);
    // Add logic to view the order
  };

  const deleteOrder = (orderId: string) => {
    console.log("Deleting order:", orderId);
    // Add logic to delete the order
  };

  const columns = [
    {
      title: "ORDER ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "CUSTOMER EMAIL",
      dataIndex: "customerEmail",
      key: "customerEmail",
    },
    {
      title: "PRODUCT ID",
      dataIndex: "productId",
      key: "productId",
    },
    {
      title: "Size",
      dataIndex: "productSize",
      key: "productSize",
    },
    {
      title: "Type",
      dataIndex: "productType",
      key: "productType",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "PAYMENT METHOD",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "PKR",
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
      title: "PRODUCT STATUS",
      dataIndex: "productStatus",
      key: "productStatus",
      render: (status: string) => {
        let color = "blue";
        if (status === "Pending") color = "orange";
        if (status === "shipped") color = "green";
        if (status === "Confirmed") color = "blue";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    showActions && {
      title: "ACTIONS",
      key: "actions",
      render: (_: any, record: any) => (
        <div>
          <Button
            type="link"
            danger
            onClick={() => showModal("Rejected", record)}
          >
            Reject
          </Button>
          <Button type="link" onClick={() => showModal("Accepted", record)}>
            Accept
          </Button>
        </div>
      ),
    },
  ].filter(Boolean);

  return (
    <div className="w-full overflow-x-hidden">
      <StoreOrderModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        actionType={actionType}
        record={selectedRecord}
        setRecord={setSelectedRecord}
      />
      <Table
        columns={columns}
        dataSource={paginatedData}
        className=" shadow-lg w-full"
        scroll={{ x: 1000 }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalPages * pageSize,
          onChange: (page) => setCurrentPage(page),
        }}
      />
    </div>
  );
};

export default OrderTable;
