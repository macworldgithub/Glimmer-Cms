"use client";
import {
  Modal,
  Button,
  Divider,
  Typography,
  Row,
  Col,
  Tag,
  Space,
  Table,
  message,
  Dropdown,
  Menu,
} from "antd";
import "antd/dist/reset.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "../components/SearchBar";
import { AppDispatch, RootState } from "../store/store";
import { useSearchParams } from "react-router-dom";
import {
  getBookingDetailsById,
  getSalonBookings,
  updateApprovedBookingStatus,
} from "../api/service/api";
const { Text } = Typography;
const booking = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const bookingList = useSelector(
    (state: RootState) => state.AllBooking.bookings
  );
  const totalBookings = useSelector(
    (state: RootState) => state.AllBooking.total
  );
  const bookingDetails = useSelector(
    (state: RootState) => state.AllBooking.details
  );

  const pageSize = 8;

  const currentPage = Number(searchParams.get("page")) || 1;
  const categoryIdFilter = searchParams.get("categoryId") || "";
  const subCategoryNameFilter = searchParams.get("subCategoryName") || "";
  const subSubCategoryNameFilter = searchParams.get("subSubCategoryName") || "";

  useEffect(() => {
    //@ts-ignore
    dispatch(
      getSalonBookings({
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

  const handleSearch = (newFilters: {
    categoryId?: string;
    subCategoryName?: string;
    subSubCategoryName?: string;
  }) => {
    setSearchParams({
      page: "1",
      categoryId: newFilters.categoryId || "",
      subCategoryName: newFilters.subCategoryName || "",
      subSubCategoryName: newFilters.subSubCategoryName || "",
    });
  };

  const handleViewDetails = async (bookingId: string) => {
    setIsModalOpen(true);
    await dispatch(getBookingDetailsById({ bookingId }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    const resultAction = await dispatch(
      updateApprovedBookingStatus({ bookingId, bookingStatus: newStatus })
    );

    if (updateApprovedBookingStatus.fulfilled.match(resultAction)) {
      message.success(`Booking status updated to ${newStatus}`);
    } else {
      alert(
        "A booking can only be marked as 'Completed' if the payment was made via 'Prepaid (Card)'. This booking uses 'Pay at Counter'."
      );
    }
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
      render: (status: string, record: any) => {
        let color = "blue";
        if (status === "Approved") color = "green";
        if (status === "Rejected") color = "red";
        if (status === "Confirmed") color = "blue";

        return (
          <>
            <Tag color={color}>{status}</Tag>
            {status === "Approved" && (
              <Dropdown
                overlay={
                  <Menu onClick={(e) => handleUpdateStatus(record._id, e.key)}>
                    <Menu.Item key="Completed">Completed</Menu.Item>
                    <Menu.Item key="Completed And Paid">
                      Completed and Paid
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button size="small" style={{ marginTop: 10 }}>
                  Change Status
                </Button>
              </Dropdown>
            )}
          </>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleViewDetails(record._id)}>
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="p-4 text-lg font-semibold text-gray-800 border-b">
        Booking List and Details
      </div>

      {/* SearchBar */}
      <SearchBar onSearch={handleSearch} showCategories={false} />

      {/* Table Section */}
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
                page: page.toString(),
                categoryId: categoryIdFilter,
                subCategoryName: subCategoryNameFilter,
                subSubCategoryName: subSubCategoryNameFilter,
              }),
          }}
          className="border-t"
          scroll={{ x: 1000 }}
        />
      </div>
      {/* Booking Details Modal */}
      <Modal
        title="Booking Details"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal} type="primary">
            Close
          </Button>,
        ]}
        width={600} // You can adjust this based on your needs
        bodyStyle={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
        }}
        style={{ top: 20 }}
      >
        {bookingDetails ? (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Salon ID:</Text>
                <p>{bookingDetails.salonId}</p>
              </Col>
              <Col span={12}>
                <Text strong>Customer Name:</Text>
                <p>{bookingDetails.customerName}</p>
              </Col>
              <Col span={12}>
                <Text strong>Service Name:</Text>
                <p>{bookingDetails.serviceName}</p>
              </Col>
              <Col span={12}>
                <Text strong>Duration:</Text>
                <p>{bookingDetails.serviceDuration} mins</p>
              </Col>
              <Col span={12}>
                <Text strong>Price:</Text>
                <p>{bookingDetails.finalPrice} PKR</p>
              </Col>
              <Col span={12}>
                <Text strong>Payment Method:</Text>
                <p>{bookingDetails.paymentMethod}</p>
              </Col>
              <Col span={12}>
                <Text strong>Booking Date:</Text>
                <p>
                  {new Date(bookingDetails.bookingDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Status:</Text>
                <p>{bookingDetails.bookingStatus}</p>
              </Col>
            </Row>
          </div>
        ) : (
          <Text>Loading...</Text>
        )}
      </Modal>
    </div>
  );
};

export default booking;
