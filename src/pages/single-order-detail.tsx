import React, { useEffect, useState } from "react";
import { Button, Card, message, Table, Tag } from "antd";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config/server";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const OrderDetailPage = () => {
  const location = useLocation();
  //   const order = location.state?.data;
  const [order, setOrders] = useState(location.state?.data);
  const token = useSelector((state: RootState) => state.Login.token);
  const store_id = useSelector((state: RootState) => state.Login._id);
  const fetchData = async () => {
    const response = await axios.get(
      `${BACKEND_URL}/order/get_order_by_id?id=${location.state?.data._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response.data);
    setOrders(response.data[0]);
  };
  useEffect(() => {
    fetchData();
  }, [location]);
  if (!order) {
    return <p className="text-center text-lg">No order details available.</p>;
  }
  const columns = [
    {
      title: "Product Image",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <img src={text} alt="Product" className="w-16 h-16 rounded" />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Product Id",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type, record) => {
        return <p>{type?.value}</p>;
      },
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (size, record) => {
        return (
          <p>
            {size?.value} {size?.unit}
          </p>
        );
      },
    },
    {
      title: "Base Price",
      dataIndex: "base_price",
      key: "base_price",
      render: (price) => `$${price}`,
    },
    {
      title: "Discounted Price",
      dataIndex: "discounted_price",
      key: "discounted_price",
      render: (price) => <Tag color="green">${price}</Tag>,
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
      render: (price) => `$${price}`,
    },
    {
      title: "Status",
      dataIndex: "orderProductStatus",
      key: "orderProductStatus",
      render: (status) => (
        <Tag color={status === "Accepted" ? "blue" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          {record.orderProductStatus === "Pending" ? (
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
          ) : (
            <p className="text-red-500 font-bold">N/A</p>
          )}
        </>
      ),
    },
  ];
  const handleAccept = async (prodId) => {
    const response = await axios.put(
      `${BACKEND_URL}/order/updateProductStatus`,
      {
        order_id: order?._id,
        product_id: prodId,
        store_id: store_id,
        order_product_status: "Accepted",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    message.success(`Product ${prodId} has been accepted.`);
    setTimeout(() => {
      fetchData();
    }, 2000);
  };

  const handleReject = async (prodId) => {
    const response = await axios.put(
      `${BACKEND_URL}/order/updateProductStatus`,
      {
        order_id: order?._id,
        product_id: prodId,
        store_id: store_id,
        order_product_status: "Rejected",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    message.success(`Product ${prodId} has been rejected.`);
    setTimeout(() => {
      fetchData();
    }, 2000);
  };
  return (
    <div className="container mx-auto p-6">
      <Card
        key={order._id}
        title={`Order #${order._id}`}
        className="mb-6 shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold">Customer Details</h2>
            <p>
              <strong>Name:</strong> {order.customerName}
            </p>
            <p>
              <strong>Email:</strong> {order.customerEmail}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Shipping Information</h2>
            <p>
              <strong>Full Name:</strong> {order.ShippingInfo.fullName}
            </p>
            <p>
              <strong>Email:</strong> {order.ShippingInfo.email}
            </p>
            <p>
              <strong>Phone:</strong> {order.ShippingInfo.phone}
            </p>
            <div className="flex gap-6 flex-wrap">
              <p>
                <strong>Country:</strong> {order.ShippingInfo.country}
              </p>
              <p>
                <strong>City:</strong> {order.ShippingInfo.city}
              </p>
              <p>
                <strong>State:</strong> {order.ShippingInfo.state}
              </p>
              <p>
                <strong>Zip Code:</strong> {order.ShippingInfo.zip}
              </p>
            </div>
            <p>
              <strong>Address:</strong> {order.ShippingInfo.address},{" "}
              {order.ShippingInfo.city}, {order.ShippingInfo.country}
            </p>
            <p>
              <strong>Shipping Method:</strong>{" "}
              {order.ShippingInfo.shippingMethod}
            </p>
          </div>
        </div>

        <h2 className="text-lg font-semibold mt-4">Order Summary</h2>
        <Table
          columns={columns}
          dataSource={order.productList.map((item) => ({
            key: item.product._id,
            image: item.product.image1,
            name: item.product.name,
            quantity: item.quantity,
            type: item.product.type[0],
            size: item.product.size[0],
            base_price: item.product.base_price,
            discounted_price: item.product.discounted_price,
            total_price: item.total_price,
            orderProductStatus: item.orderProductStatus,
          }))}
          pagination={false}
        />
        <div className="flex justify-between mt-4">
          <p>
            <strong>Total Price:</strong> ${order.total}
          </p>
          <p>
            <strong>Discounted Total:</strong>{" "}
            <Tag color="green">${order.discountedTotal}</Tag>
          </p>
          <p>
            <strong>Payment Method:</strong> {order.paymentMethod}
          </p>
          <p>
            <strong>Order Status:</strong>{" "}
            <Tag color={order.status === "Confirmed" ? "blue" : "orange"}>
              {order.status}
            </Tag>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default OrderDetailPage;
