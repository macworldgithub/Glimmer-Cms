import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table, Tag } from "antd";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RootState } from "../store/store";
import { BACKEND_URL } from "../config/server";
import OrderSearchBar from "../components/OrderSearchBar";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [filters, setFilters] = useState<{ order_id?: string; customerEmail?: string }>({});
  const token = useSelector((state: RootState) => state.Login.token);
  const store_id = useSelector((state: RootState) => state.Login._id);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageSize = 10;
  const currentPage = Number(searchParams.get("page")) || 1;
  const storeId = searchParams.get("store") || "";

  const fetchData = async (customFilters = filters) => {
    try {
      const queryParams = new URLSearchParams({
        page_no: currentPage.toString(),
        page_size: pageSize.toString(),
        store_id: store_id || storeId,
      });

      if (customFilters.order_id) queryParams.append("order_id", customFilters.order_id);
      if (customFilters.customerEmail) queryParams.append("customerEmail", customFilters.customerEmail);

      const response = await axios.get(
        `${BACKEND_URL}/order/get_all_store_orders?${queryParams.toString()}`,
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

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleSearch = (newFilters: { order_id?: string; customerEmail?: string }) => {
    setFilters(newFilters);
    fetchData(newFilters);
  };

  const columns = [
    {
      title: "ORDER ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "CUSTOMER EMAIL",
      dataIndex: "customerEmail",
      key: "customerEmail",
    },
    {
      title: "Product Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => <p>{record.productList.length}</p>,
    },
    {
      title: "PAYMENT METHOD",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Total (PKR)",
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
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() =>
            navigate(`/order-details/${record._id}?store=${storeId}`, {
              state: { data: record },
            })
          }
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div>


      <div className="p-4 text-lg font-semibold text-gray-800 border-b">
        Order List
        <OrderSearchBar onSearch={handleSearch} />
      </div>
      <div className="w-full h-full flex flex-col items-center p-2 gap-2">

        {/* SearchBar */}

        <Table
          columns={columns}
          dataSource={orders}
          className="shadow-lg w-full"
          scroll={{ x: 1000 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalOrders, // Now correctly using totalCount
            onChange: (page) => setSearchParams({ page: page.toString() }),
            showSizeChanger: false,
            // showTotal: (total) => `Total ${total} Orders`,
          }}
        />
      </div>
    </div>
  );
};

export default OrderList;
