import { Table } from "antd";
import "antd/dist/reset.css";
import { useState } from "react";

interface TableData {
  key: string;
  products: number;
  categories: string;
  earning: string;
  
}

const ProductTableWithHeader = () => {
  // Sample data
  const [data, setData] = useState<TableData[]>([
    {
        key: "1",
        categories: "Electronics",
        products: 150,
        earning: "$20,000",
    },
    {
        key: "2",
        categories: "Clothing",
        products: 300,
        earning: "$50,000",
    },
    {
        key: "3",
        categories: "Home Appliances",
    products: 100,
        earning: "$10,000",
    },
  ]);

  // Table columns
  const columns = [
    {
      title: "CATEGORIES",
      dataIndex: "categories",
      key: "categories",
    },
    {
      title: "TOTALPRODUCTS",
      dataIndex: "products",
      key: "products",
    },
    {
      title: "TOTALEARNING",
      dataIndex: "earning",
      key: "earning",
    },
    {
      title: "ACTIONS",
      key: "actions",
      render: (_: any, record: TableData) => (
        <button
          onClick={() => handleEdit(record)}
          className="px-2 py-1 text-blue-500 rounded hover:underline"
        >
          Edit
        </button>
      ),
    },
  ];

  
  const handleEdit = (record: TableData) => {
    alert(`Editing products0.
        
        : ${record.products}`);
  };

  return (
   
      <div className="overflow-x-auto bg-white border-t shadow-lg rounded-lg">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ x: 1000 }}
          className="ant-table-thead rounded-md"
        />
      </div>
   
  );
};

export default ProductTableWithHeader;
