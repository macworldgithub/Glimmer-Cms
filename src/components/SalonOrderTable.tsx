import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table, Tag, Space } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RootState } from "../store/store";
import { BACKEND_URL } from "../config/server";
import axios from "axios";

const SalonOrderTable = () => {
  const bookingList = useSelector(
    (state: RootState) => state.AllBooking.bookings
  );
  const totalBookings = useSelector(
      (state: RootState) => state.AllBooking.total
    );
  const token = useSelector((state: RootState) => state.Login.token);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageSize = 10;
  const currentPage = Number(searchParams.get("page")) || 1;
  const categoryIdFilter = searchParams.get("categoryId") || "";
  const subCategoryNameFilter = searchParams.get("subCategoryName") || "";
  const subSubCategoryNameFilter = searchParams.get("subSubCategoryName") || "";

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/salon-service-bookings/getAllSalonBooking?page_no=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      title: "Salon ID",
      dataIndex: "salonId",
      key: "salonId",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    { title: "Service Name", dataIndex: "serviceName", key: "serviceName" },
    {
      title: "Duration",
      dataIndex: "serviceDuration",
      key: "serviceDuration",
    },
    {
      title: "Price",
      dataIndex: "finalPrice",
      key: "finalPrice",
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Booking Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      render: (status: string) => {
        let color = "blue";
        if (status === "Pending") color = "orange";
        if (status === "Shipped") color = "green";
        if (status === "Confirmed") color = "blue";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) =>
        record.bookingStatus === "Pending" && (
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
        dataSource={bookingList.map((booking) => ({
          ...booking,
          key: booking._id,
        }))}
        className="shadow-lg w-full"
        scroll={{ x: 1000 }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalBookings,
          onChange: (page) =>
            setSearchParams({
              page_no: page.toString(),
              categoryId: categoryIdFilter,
              subCategoryName: subCategoryNameFilter,
              subSubCategoryName: subSubCategoryNameFilter,
            }),
          showSizeChanger: false,
        }}
      />
    </div>
  );
};

export default SalonOrderTable;
