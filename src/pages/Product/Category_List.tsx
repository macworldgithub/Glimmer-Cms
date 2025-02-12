import { Table } from "antd";
import "antd/dist/reset.css";
import { useState } from "react";
import dayjs from "dayjs";
import SearchBar from "../../components/SearchBar";

interface TableData {
  key: string;
  products: number;
  categories: string;
  earning: string;
  created_at: string;
}

const ProductTableWithHeader = () => {
  const [filters, setFilters] = useState<{ category?: string; created_at?: string }>({});
  const [data, setData] = useState<TableData[]>([
    {
      key: "1",
      categories: "Electronics",
      products: 150,
      earning: "$20,000",
      created_at: "2024-02-01",
    },
    {
      key: "2",
      categories: "Clothing",
      products: 300,
      earning: "$50,000",
      created_at: "2024-02-05",
    },
    {
      key: "3",
      categories: "Home Appliances",
      products: 100,
      earning: "$10,000",
      created_at: "2024-02-10",
    },
  ]);

  const filteredData = data.filter((product) => {
    const categoryFilter = filters.category ? filters.category.trim() : null;
    const createdAtFilter = filters.created_at ? filters.created_at.trim() : null;

    const isCategoryMatch = !categoryFilter || product.categories === categoryFilter;
    const isCreatedAtMatch = !createdAtFilter || dayjs(product.created_at).isSame(dayjs(createdAtFilter), "day");

    return isCategoryMatch && isCreatedAtMatch;
  });

  const columns = [
    {
      title: "CATEGORIES",
      dataIndex: "categories",
      key: "categories",
    },
    {
      title: "TOTAL PRODUCTS",
      dataIndex: "products",
      key: "products",
    },
    {
      title: "TOTAL EARNING",
      dataIndex: "earning",
      key: "earning",
    },
    {
      title: "CREATED AT",
      dataIndex: "created_at",
      key: "created_at",
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
    alert(`Editing products: ${record.products}`);
  };

  return (
    <div>
      <div className="p-4 text-lg font-semibold text-gray-800 border-b">
        Product List
      </div>

      <SearchBar onSearch={setFilters} categories={data.map((item) => ({ name: item.categories, id: item.categories }))} />

      <div className="overflow-x-auto bg-white border-t shadow-lg rounded-lg">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={false}
          scroll={{ x: 1000 }}
          className="ant-table-thead rounded-md"
        />
      </div>
    </div>
  );
};

export default ProductTableWithHeader;