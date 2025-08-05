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
import dayjs from "dayjs"; // make sure it's imported
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
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
  const customerNameFilter = searchParams.get("customerName") || "";
  const serviceNameFilter = searchParams.get("serviceName") || "";

  useEffect(() => {
    //@ts-ignore
    dispatch(
      getSalonBookings({
        page_no: currentPage,
        customerName: customerNameFilter,
        serviceName: serviceNameFilter,
      })
    );
  }, [dispatch, currentPage, customerNameFilter, serviceNameFilter]);

  const handleSearch = (newFilters: {
    customerName?: string;
    serviceName?: string;
  }) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const updatedParams = {
      ...currentParams,
      page: "1",
      ...newFilters,
    };

    Object.keys(updatedParams).forEach((key) => {
      if (!updatedParams[key]) {
        delete updatedParams[key];
      }
    });

    setSearchParams(updatedParams);
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
      setTimeout(() => {
        window.location.reload();
      }, 1000);
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
      width: 100,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      width: 130,
    },
    {
      title: "Service Name",
      dataIndex: "serviceName",
      key: "serviceName",
      width: 130,
    },
    {
      title: "Duration",
      dataIndex: "serviceDuration",
      key: "serviceDuration",
      width: 90,
    },
    {
      title: "Price",
      dataIndex: "finalPrice",
      key: "finalPrice",
      width: 90,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 130,
    },
    {
      title: "Booking Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      width: 160,
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
                <Tag color="orange">
                  <button>Change</button>
                </Tag>
              </Dropdown>
            )}
          </>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 100,
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
    <div className="p-6 bg-white min-h-screen" style={{ minWidth: "2560px" }}>
      {/* Header Section */}
      <div className="p-4 text-lg font-semibold text-gray-800 border-b">
        Booking List and Details
      </div>

      {/* SearchBar */}
      <SearchBar onSearch={handleSearch} showCategories={false} />

      {/* Table Section */}
      <div className="overflow-x-auto w-full">
        <div style={{ width: "100%" }}>
          <Table
            columns={columns}
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
            scroll={{ x: "max-content" }} // 👈 important for horizontal scroll
          />
        </div>
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
              <Col span={12}>
                <Text strong>Booking Time:</Text>
                <p>
                  {bookingDetails.bookingTime
                    ? dayjs(bookingDetails.bookingTime, [
                        "h:mm A",
                        "HH:mm",
                      ]).format("h:mm A")
                    : "N/A"}
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
