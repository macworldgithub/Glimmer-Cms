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
import { RootState } from "../store/store";
import { getAllUpdatedOrders } from "../api/order/api";

const { Title, Text } = Typography;

const mergeOrderWithProduct = (orderData) => {
  console.log("Order Data:", orderData);
  return orderData.map((order: any) => ({
    orderId: order._id,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    productId: order.productList[0].product._id,
    productSize: order.productList[0].product.size[0].value,
    productType: order.productList[0].product.size[0].value,
    quantity: order.productList[0].quantity,
    productStatus: order.productList[0].orderProductStatus,
    storeId: order.productList[0].storeId,
    paymentMethod: order.paymentMethod,
    total: order.total,
    discountedTotal: order.discountedTotal,
    status: order.productList[0].orderProductStatus,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }));
};

const OrderList = () => {
  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    //@ts-ignore
    dispatch(getAllUpdatedOrders({ page_no: currentPage }));
  }, [currentPage]);

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };
  const allOrders = useSelector(
    (state: RootState) => state.AllOrders.orderList
  );
  console.log(allOrders);
  const totalPages = useSelector(
    (state: RootState) => state.AllOrders.dashboardTotalPages
  );
  const paginatedData = mergeOrderWithProduct(allOrders);

  const columns = [
    {
      title: "ORDER ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "CUSTOMER EMAIL",
      dataIndex: "customerEmail",
      key: "customerEmail",
    },
    {
      title: "PRODUCT ID",
      dataIndex: "productId",
      key: "productId",
    },
    {
      title: "Size",
      dataIndex: "productSize",
      key: "productSize",
    },
    {
      title: "Type",
      dataIndex: "productType",
      key: "productType",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "PAYMENT METHOD",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "PKR",
      dataIndex: "discountedTotal",
      key: "discountedTotal",
    },
    {
      title: "ORDER STATUS",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "blue";
        if (status === "Pending") color = "orange";
        if (status === "shipped") color = "green";
        if (status === "Confirmed") color = "blue";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "PRODUCT STATUS",
      dataIndex: "productStatus",
      key: "productStatus",
      render: (status: string) => {
        let color = "blue";
        if (status === "Pending") color = "orange";
        if (status === "shipped") color = "green";
        if (status === "Confirmed") color = "blue";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ].filter(Boolean);
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
        dataSource={paginatedData}
        className=" shadow-lg w-full"
        scroll={{ x: 1000 }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalPages * pageSize,
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
