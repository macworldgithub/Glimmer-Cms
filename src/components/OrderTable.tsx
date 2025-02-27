import React from "react";

import { useState } from "react";
import { Table, Tag, Button } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { update_product_of_order } from "../api/order/api";
import StoreOrderModal from "./StoreOrderModal";

const allData = [
  {
    key: "1",
    order_id: "12345",
    customer_name: "John Doe",
    payment_method: "Credit Card",
    status: "delivered",
  },
  {
    key: "2",
    order_id: "67890",
    customer_name: "Jane Smith",
    payment_method: "PayPal",
    status: "inprocess",
  },
  {
    key: "3",
    order_id: "11223",
    customer_name: "Alice Brown",
    payment_method: "Credit Card",
    status: "pending",
  },
  {
    key: "4",
    order_id: "44556",
    customer_name: "Bob Williams",
    payment_method: "Debit Card",
    status: "shipped",
  },
  {
    key: "5",
    order_id: "77889",
    customer_name: "Clara Johnson",
    payment_method: "Cash",
    status: "delivered",
  },
];

const mergeOrderWithProduct = (orderData) => {
  if (!orderData || orderData.length === 0) {
    return [];
  }
  const mergedData = orderData[0]?.items?.map((item: any) => {
    // Merge parent order info with product info
    return {
      orderId: orderData[0]._id,
      customerId: orderData[0].customerId,
      paymentMethod: orderData[0].paymentMethod,
      customerEmail: orderData[0].customerEmail,
      total: orderData[0].total,
      discountedTotal: orderData[0].discountedTotal,
      status: orderData[0].status,
      createdAt: orderData[0].createdAt,
      updatedAt: orderData[0].updatedAt,
      productId: item.product._id,
      productName: item.product.name,

      productPrice: item.product.base_price,
      productDiscountedPrice: item.product.discounted_price,

      productStatus: item.product.status,
      quantity: item.quantity,
      productType: item.product.type.map((t) => (
        <span className="flex w-[40px]">{t.value}</span>
      )), // Assuming multiple types can be present
      productSize: item.product.size.map((s) => (
        <span className="flex w-[40px]">
          {s.value} {s.unit}
        </span>
      )),
      // Assuming multiple sizes can be present
    };
  });

  // Output merged data to the console
  return mergedData;
};

const OrderTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const showModal = (type, record) => {
    setActionType(type);
    setSelectedRecord(record);
    setIsModalVisible(true);

    setTimeout(() => {
      setIsModalVisible(true);
    }, 0);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const dispatch = useDispatch();

  const paginatedData = mergeOrderWithProduct(
    useSelector((state: RootState) => state.AllOrders.dashboardOrders)
  );

  const totalPages = useSelector(
    (state: RootState) => state.AllOrders.dashboardTotalPages
  );

  console.log(
    "lelo",
    paginatedData,
    useSelector((state: RootState) => state.AllOrders.dashboardOrders)
  );
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
    {
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
          <Button type="link" onClick={() => showModal("Confirmed", record)}>
            Accept
          </Button>
        </div>
      ),
    },
  ];

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
