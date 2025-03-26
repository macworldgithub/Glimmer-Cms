import { useEffect } from "react";
import { getAdminBookings } from "../api/service/api";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { RootState, AppDispatch } from "../store/store";
import { Table, Tag } from "antd";

const SuperAdmin_Booking_List = () => {
  const bookingList = useSelector(
    (state: RootState) => state.AllBooking.bookings
  );
  const totalBookings = useSelector(
    (state: RootState) => state.AllBooking.total
  );
  const dispatch = useDispatch<AppDispatch>();

  const [searchParams, setSearchParams] = useSearchParams();

  const pageSize = 8;

  const currentPage = Number(searchParams.get("page")) || 1;
  const categoryIdFilter = searchParams.get("categoryId") || "";
  const subCategoryNameFilter = searchParams.get("subCategoryName") || "";
  const subSubCategoryNameFilter = searchParams.get("subSubCategoryName") || "";

  useEffect(() => {
    //@ts-ignore
    dispatch(
      getAdminBookings({
        page_no: currentPage,
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
  ];
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="overflow-x-auto shadow-lg">
        <Table
          columns={columns}
          //@ts-ignore
          dataSource={bookingList.map((booking) => ({
            ...booking,
            key: booking._id,
          }))}
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
          }}
          className="border-t"
          scroll={{ x: 1000 }}
        />
      </div>
    </div>
  );
};

export default SuperAdmin_Booking_List;
