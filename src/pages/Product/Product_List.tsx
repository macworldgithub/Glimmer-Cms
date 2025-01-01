import { Table } from "antd";
import "antd/dist/reset.css";
import { useState } from "react";

interface TableData {
  key: string;
  product: string;
  category: string;
  stock: string;
  sku: string;
  price: string;
  qty: string;
  status: string;
  actions: string;
}

const ProductTableWithHeader = () => {
  // Sample data
  const [data, setData] = useState<TableData[]>([
    {
      key: "1",
      product: "Product A",
      category: "Category 1",
      stock: "In Stock",
      sku: "SKU001",
      price: "$10",
      qty: "100",
      status: "Available",
      actions: "Edit",
    },
    {
      key: "2",
      product: "Product B",
      category: "Category 2",
      stock: "Out of Stock",
      sku: "SKU002",
      price: "$20",
      qty: "0",
      status: "Unavailable",
      actions: "Edit",
    },
    {
      key: "3",
      product: "Product C",
      category: "Category 3",
      stock: "In Stock",
      sku: "SKU003",
      price: "$30",
      qty: "50",
      status: "Available",
      actions: "Edit",
    },
  ]);

  // Table columns
  const columns = [
    {
      title: "PRODUCT",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "STOCK",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "PRICE",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "QTY",
      dataIndex: "qty",
      key: "qty",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "ACTIONS",
      dataIndex: "actions",
      key: "actions",
      render: (text: string) => <button className="text-blue-500">{text}</button>,
    },
  ];

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      {/* Header Section */}
      <div className="p-4 text-lg font-semibold text-gray-800 border-b">
        Filter
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          className="border-t"
          scroll={{ x: 1000 }} 
        />
      </div>
    </div>
  );
};

export default ProductTableWithHeader;
