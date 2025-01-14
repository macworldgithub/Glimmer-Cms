import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { Button,Table, Tag } from "antd";
import "antd/dist/reset.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../api/order/api";
import { RootState } from "../store/store";

interface TableData {
  order: string;
  date: number;
  customer: string;
  payment: number;
  status: "Completed" | "Pending";
  method: string;
  store: string;
  _id: string;
  actions: string;
}

const OrderList = () => {
  // const [currentPage, setCurrentPage] = useState(1);
  // const pageSize = 8;

  // const paginatedData = allData.slice(
  //   (currentPage - 1) * pageSize,
  //   currentPage * pageSize
  // );
  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState<TableData | null>(
    null
  );

  useEffect(() => {
    //@ts-ignore
    dispatch(getAllOrders({ page_no: 1 }));
  }, []);

  const viewOrder = (record: any) => {
    console.log("Updating:", record);
    setSelectedOrder(record);
    // Your update logic here
  };

  const deleteOrder  = (record: any) => {
    setSelectedOrder(record);
    // Your delete logic here
  };

  const orderList = useSelector(
    (state: RootState) => state.Orders.orders
  );
  console.log(useSelector(state=>state))
  // Table columns
  const columns = [
        {
          title: "Order_id",
          dataIndex: "_id",
          key: "order",
        },
        {
          title: "Created_at",
          dataIndex: "created_at",
          key: "date",
        },
        {
          title: "Customer",
          dataIndex: "customer",
          key: "customer",
        },
        {
          title: "Payment",
          dataIndex: "payment",
          key: "payment",
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          render: (status: string) => {
            let color = "blue";
            if (status === "Completed") color = "green";
            if (status === "Pending") color = "orange";
            if (status === "Failed") color = "red";
            return <Tag color={color}>{status}</Tag>;
          },
        },
        {
          title: "Method",
          dataIndex: "method",
          key: "method",
        },

    {
      title: "ACTIONS",
      dataIndex: "actions", // not from the interface—this is custom for rendering
      key: "actions",
      render: (text: string, record: any) => (
         <div>
      <Button type="link" onClick={() => viewOrder(record.order)}>
      View
    </Button>
    <Button type="link" danger onClick={() => deleteOrder(record.order)}>
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
<div className=" w-[100%] h-[100%] flex flex-col  items-center  p-2 gap-2 ">
      <div className="w-[100%] h-max  border flex py-5 rounded-lg shadow-lg justify-around flex-wrap bg-white">
        {paymentData.map((item, index) => (
          <div key={index} className="flex flex-col w-[200px] h-max">
            <div className="flex w-[100%] justify-between">
              <p className="font-medium text-[24px]">{item.count}</p>
              {item.icon}
            </div>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
      <Table
        columns={columns}
        dataSource={orderList}
        style={{ width: "100%" }}
        className=" shadow-lg max-sm:overflow-x-auto"
        scroll={{ x: 1000 }}
        pagination={true}
        // pagination={{
        //   current: currentPage,
        //   pageSize: pageSize,
        //   total: allData.length,
        //   onChange: (page) => setCurrentPage(page),
        // }}
      />
      
    </div>
  )}


export default OrderList;
