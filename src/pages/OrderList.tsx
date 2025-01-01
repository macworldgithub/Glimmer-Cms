import React from "react";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  RollbackOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { Table, Tag, Button } from "antd";

const allData = [
  {
    key: "1",
    order: "12345",
    date: "2024-12-29",
    customer: "John Doe",
    payment: "$100.00",
    status: "Completed",
    method: "Credit Card",
  },
  {
    key: "2",
    order: "67890",
    date: "2024-12-28",
    customer: "Jane Smith",
    payment: "$50.00",
    status: "Pending",
    method: "PayPal",
  },
  {
    key: "3",
    order: "11223",
    date: "2024-12-27",
    customer: "Alice Brown",
    payment: "$150.00",
    status: "Failed",
    method: "Debit Card",
  },
  {
    key: "4",
    order: "44556",
    date: "2024-12-26",
    customer: "Bob Williams",
    payment: "$120.00",
    status: "Completed",
    method: "Cash",
  },
  {
    key: "5",
    order: "77889",
    date: "2024-12-25",
    customer: "Clara Johnson",
    payment: "$80.00",
    status: "Pending",
    method: "Bank Transfer",
  },
  {
    key: "6",
    order: "99001",
    date: "2024-12-24",
    customer: "Emily White",
    payment: "$60.00",
    status: "Completed",
    method: "Crypto",
  },
  {
    key: "7",
    order: "22334",
    date: "2024-12-23",
    customer: "Frank Martin",
    payment: "$40.00",
    status: "Failed",
    method: "Credit Card",
  },
  {
    key: "8",
    order: "55678",
    date: "2024-12-22",
    customer: "Grace Kim",
    payment: "$110.00",
    status: "Completed",
    method: "PayPal",
  },
  {
    key: "9",
    order: "33445",
    date: "2024-12-21",
    customer: "Henry Lee",
    payment: "$30.00",
    status: "Pending",
    method: "Debit Card",
  },
  {
    key: "10",
    order: "66789",
    date: "2024-12-20",
    customer: "Irene Brown",
    payment: "$90.00",
    status: "Completed",
    method: "Credit Card",
  },
  {
    key: "11",
    order: "11234",
    date: "2024-12-19",
    customer: "John Davis",
    payment: "$70.00",
    status: "Pending",
    method: "Bank Transfer",
  },
  {
    key: "12",
    order: "44567",
    date: "2024-12-18",
    customer: "Liam Wilson",
    payment: "$200.00",
    status: "Completed",
    method: "Crypto",
  },
];

const OrderList = () => {
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
      title: "Order",
      dataIndex: "order",
      key: "order",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Payment",
      dataIndex: "payment",
      key: "payment",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "blue";
        if (status === "Completed") color = "green";
        if (status === "Pending") color = "orange";
        if (status === "Failed") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
    },
    {
      title: "Actions",
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
    <div className=" w-[100%] h-[100%] flex flex-col  items-center  p-2 gap-2 ">
      <div className="w-[100%] h-max  border flex py-5 rounded-lg shadow-lg justify-around flex-wrap bg-white">
        {paymentData.map((item, index) => (
          <div key={index} className="flex flex-col w-[200px] h-max">
            <div className="flex w-[100%] justify-between">
              <p className="font-medium text-[24px]">{item.count}</p>
              {item.icon}
            </div>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
      <Table
        columns={columns}
        dataSource={paginatedData}
        style={{ width: "100%" }}
        className=" shadow-lg max-sm:overflow-x-auto"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: allData.length,
          onChange: (page) => setCurrentPage(page),
        }}
      />
      ;
    </div>
  );
};

export default OrderList;
