import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Tag, Modal, Row, Col, Typography } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
// import { getAllStoreOrders } from "../api/order/api";
import { AppDispatch, RootState } from "../store/store";

const { Title, Text } = Typography;

const OrderList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [filters, setFilters] = useState<{
    customerEmail?: string;
    created_at?: string;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    console.log("Filters applied:", filters);
    // dispatch(getAllStoreOrders());
  }, [dispatch, currentPage, filters]);

  const orderList = useSelector((state: RootState) => state.AllOrders.orders);

  const viewOrder = (record: any) => {
    console.log("View Order:", record);
    setSelectedOrder(record);
    setIsModalVisible(true);
  };

  const deleteOrder = (record: any) => {
    console.log("Delete Order:", record);
    setSelectedOrder(record);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Customer Email",
      dataIndex: "customerEmail",
      key: "customerEmail",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color =
          status === "Completed"
            ? "green"
            : status === "Pending"
            ? "orange"
            : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: any) => (
        <div>
          <Button type="link" onClick={() => viewOrder(record)}>
            View
          </Button>
          <Button type="link" danger onClick={() => deleteOrder(record)}>
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
    <div className="w-full h-full flex flex-col items-center p-2 gap-2">
      <div className="w-full h-max border flex py-5 rounded-lg shadow-lg justify-around flex-wrap bg-white">
        {paymentData.map((item, index) => (
          <div key={index} className="flex flex-col w-[200px] h-max">
            <div className="flex w-full justify-between">
              <p className="font-medium text-[24px]">{item.count}</p>
              {item.icon}
            </div>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
      <Table
        columns={columns}
        dataSource={orderList ? orderList : []}
        rowKey="_id"
        style={{ width: "100%" }}
        pagination={{
          pageSize: 10,
          current: currentPage,
          onChange: (page) => setCurrentPage(page),
        }}
      />

      {/* Modal to view order details */}
      <Modal
        title={`Order Details - ${selectedOrder?._id}`}
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Title level={5}>Customer Email</Title>
                <Text>{selectedOrder?.customerEmail}</Text>
              </Col>
              <Col span={12}>
                <Title level={5}>Order Status</Title>
                <Tag
                  color={
                    selectedOrder?.status === "Confirmed" ? "green" : "red"
                  }
                >
                  {selectedOrder?.status}
                </Tag>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Title level={5}>Total</Title>
                <Text>{selectedOrder?.total}</Text>
              </Col>
              <Col span={12}>
                <Title level={5}>Discounted Total</Title>
                <Text>{selectedOrder?.discountedTotal}</Text>
              </Col>
            </Row>

            <Title level={4}>Items:</Title>
            {selectedOrder?.items?.map((item: any, index: number) => (
              <Row gutter={[16, 16]} key={index}>
                <Col span={12}>
                  <Title level={5}>Product Name</Title>
                  <Text>{item.product.name}</Text>
                </Col>
                <Col span={12}>
                  <Title level={5}>Quantity</Title>
                  <Text>{item.quantity}</Text>
                </Col>
              </Row>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderList;
