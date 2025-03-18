import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table, Tag, Space } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RootState } from "../store/store";
import { BACKEND_URL } from "../config/server";
import axios from "axios";

const SalonOrderTable = () => {
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
  const handleAccept = async (bookingId) => {
    console.log(bookingId);
  };

  const handleReject = async (bookingId) => {
    console.log(bookingId);
  };
  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const columns = [
    {
      title: "BOOKING ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "SERVICE NAME",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "DATE AND TIME",
      dataIndex: "dateAndTime",
      key: "dateAndTime",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "blue";
        if (status === "Pending") color = "orange";
        if (status === "Approved") color = "green";
        if (status === "Confirmed") color = "blue";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.orderProductStatus === "Pending" && (
          <div className="space-x-5">
            <Button
              className="bg-green-500 text-white"
              onClick={() => handleAccept(record.key)}
            >
              Accept
            </Button>
            <Button
              className="bg-red-500 text-white"
              onClick={() => handleReject(record.key)}
            >
              Reject
            </Button>
          </div>
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
          total: totalOrders,
          onChange: (page) => setSearchParams({ page: page.toString() }),
          showSizeChanger: false,
        }}
      />
    </div>
  );
};

export default SalonOrderTable;
