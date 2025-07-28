import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Tag, Space } from "antd";
import { useSearchParams } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import {
  approveBooking,
  getSalonBookings,
  rejectBooking,
} from "../api/service/api";

const SalonOrderTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const bookingList = useSelector(
    (state: RootState) => state.AllBooking.bookings
  );
  const totalBookings = useSelector(
    (state: RootState) => state.AllBooking.total
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const pageSize = 10;
  const currentPage = Number(searchParams.get("page")) || 1;
  const categoryIdFilter = searchParams.get("categoryId") || "";
  const subCategoryNameFilter = searchParams.get("subCategoryName") || "";
  const subSubCategoryNameFilter = searchParams.get("subSubCategoryName") || "";

  useEffect(() => {
    //@ts-ignore
    dispatch(
      getSalonBookings({
        page_no: currentPage,
        status: "Pending",
        categoryId: categoryIdFilter,
        subCategoryName: subCategoryNameFilter,
        subSubCategoryName: subSubCategoryNameFilter,
      })
    );
  }, [
    dispatch,
    currentPage,
    categoryIdFilter,
    subCategoryNameFilter,
    subSubCategoryNameFilter,
  ]);

  const handleAccept = async (bookingId) => {
    await dispatch(approveBooking({ bookingId }));
    alert("Order has been approved.");
  };

  const handleReject = async (bookingId) => {
    await dispatch(rejectBooking({ bookingId }));
    alert("Order has been rejected.");
  };

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
    <div className="overflow-x-auto w-full">
      <div style={{ width: '100%' }}>
        <Table
          columns={columns}
          dataSource={bookingList.map((booking) => ({
            ...booking,
            key: booking._id,
          }))}
          className="shadow-lg w-full"
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
    </div>
  );
};

export default SalonOrderTable;
