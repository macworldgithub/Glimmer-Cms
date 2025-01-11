import React from "react";

import { useState } from "react";
import { Table, Tag, Button } from "antd";

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

const OrderTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const paginatedData = allData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
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
      dataIndex: "order_id",
      key: "order_id",
    },
    {
        title: "CUSTOMER NAME",
        dataIndex: "customer_name",
        key: "customer_name",
      },
    {
      title: "PAYMENT METHOD",
      dataIndex: "payment_method",
      key: "payment method",
    },
    {
      title: "ORDER STATUS",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "blue";
        if (status === "pending") color = "red";
        if (status === "inprocess") color = "orange"
        if (status === "shipped") color = "green";
        if (status === "delivered") color = "blue";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "ACTIONS",
      key: "actions",
      render: (_:any, record:any) => (
        <div>
          <Button type="link" onClick={() => viewOrder(record.order)}>
            View
          </Button>
          <Button type="link" danger onClick={() => deleteOrder(record.order)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

 
  return (
    <div className=" w-[100%] h-[100%] flex flex-col  items-center  p-2 gap-2 ">
     
      <Table
        columns={columns}
        dataSource={paginatedData}
        style={{ width: "100%" }}
        className=" shadow-lg max-sm:overflow-x-auto"
        scroll={{ x: 1000 }} 
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: allData.length,
          onChange: (page) => setCurrentPage(page),
        }}
      />
    </div>
  );
};

export default OrderTable;
