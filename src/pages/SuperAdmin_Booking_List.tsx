import { useEffect, useState } from "react";
import { getAdminBookings } from "../api/service/api";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { RootState, AppDispatch } from "../store/store";
import { Table, Tag } from "antd";
import DeleteBookingModal from "../components/DeleteBookingModal";
import ServiceSearchBar from "../components/ServiceSearchBar";
import SearchBar from "../components/SearchBar";

interface Booking {
  name: string;
  categoryId: string;
  subCategoryName: string;
  subSubCategoryName: string;
  requestedPrice: number;
  adminPrice: number;
  description: string;
  duration: string;
  status: "Active" | "Inactive";
  created_at: string;
}

const SuperAdmin_Booking_List = () => {
  const role = useSelector((state: RootState) => state.Login.role);
  const bookingList = useSelector(
    (state: RootState) => state.AllBooking.bookings
  );
  const totalBookings = useSelector(
    (state: RootState) => state.AllBooking.total
  );
  const dispatch = useDispatch<AppDispatch>();

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSalon, setSelectedSalon] = useState<Booking | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const pageSize = 8;

  const currentPage = Number(searchParams.get("page")) || 1;
  const categoryIdFilter = searchParams.get("categoryId") || "";
  const customerNameFilter = searchParams.get("customerName") || "";
  const serviceNameFilter = searchParams.get("serviceName") || "";
  const salonId = searchParams.get("salonId") || "";

  useEffect(() => {
    //@ts-ignore
    dispatch(
      getAdminBookings({
        page_no: currentPage,
        salonId,
        categoryId: categoryIdFilter,
        customerName: customerNameFilter,
        serviceName: serviceNameFilter,
      })
    );
  }, [
    dispatch,
    currentPage,
    salonId,
    categoryIdFilter,
    customerNameFilter,
    serviceNameFilter
  ]);

  const handleDelete = (record) => {
    setSelectedSalon(record);
    setIsDeleteModalVisible(true);
  };

  const handleSearch = (newFilters: {
    customerName?: string;
    serviceName?: string;
  }) => {
    setSearchParams({
      page: "1",
      customerName: newFilters.customerName || "",
      serviceName: newFilters.serviceName || "",
    });
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
      key: "actions",
      render: (_: any, record) => (
        <div className="flex space-x-2">
          {role === "super_admin" && (
            <button
              onClick={() => handleDelete(record)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="p-4 text-lg font-semibold text-gray-800 border-b">
        Booking List
      </div>

      {/* SearchBar */}
      <div className="mb-5">
        <SearchBar onSearch={handleSearch} showCategories={false} />
      </div>
      {selectedSalon && role === "super_admin" && (
        <DeleteBookingModal
          visible={isDeleteModalVisible}
          //@ts-ignore
          booking={selectedSalon}
          onClose={() => setIsDeleteModalVisible(false)}
          page={currentPage}
        />
      )}
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
            onChange: (page) => setSearchParams({ page: page.toString() }),
          }}
          className="border-t"
          scroll={{ x: 1000 }}
        />
      </div>
    </div>
  );
};

export default SuperAdmin_Booking_List;
