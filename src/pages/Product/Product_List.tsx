import { Table } from "antd";
import "antd/dist/reset.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../api/products/api";
import DeleteProductModal from "../../components/DeleteProductModal";
import UpdateModal from "../../components/UpdateProductModal";
import { RootState } from "../../store/store";

interface TableData {
  name: string;
  quantity: number;
  description: string;
  base_price: number;
  discounted_price: number;
  status: "Active" | "Inactive";
  _id: string;
}

const ProductTableWithHeader = () => {
  const dispatch = useDispatch();
  const role = useSelector((state: RootState) => state.Login.role);

  useEffect(() => {
    console.log("looo", role);
  }, []);

  const [selectedProduct, setSelectedProduct] = useState<TableData | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    //@ts-ignore
    dispatch(getAllProducts({ page_no: currentPage }));
  }, [dispatch, currentPage]);

  const productList = useSelector(
    (state: RootState) => state.AllProducts.products
  );

  const handleUpdate = (record: TableData) => {
    setSelectedProduct(null); // Reset before setting a new product
    setTimeout(() => {
      setSelectedProduct(record);
      setIsModalVisible(true);
    }, 0); // Ensure React updates the state before rendering the modal
  };

  const handleDelete = (record: TableData) => {
    setSelectedProduct(record);
    setIsDeleteModalVisible(true);
  };

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "base_price",
      key: "base_price",
    },
    {
      title: "Discounted Price",
      dataIndex: "discounted_price",
      key: "discounted_price",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Stock",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: TableData) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleUpdate(record)}
            className="text-blue-500 hover:underline"
          >
            Update
          </button>
          {role === "super_admin" && (
            <button
              onClick={() => handleDelete(record)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="p-4 text-lg font-semibold text-gray-800 border-b">
        Filter
      </div>

      {/* Modals */}
      {selectedProduct && (
        <UpdateModal
          visible={isModalVisible}
          //@ts-ignore
          product={selectedProduct}
          onClose={() => setIsModalVisible(false)}
          page={currentPage}
        />
      )}

      {selectedProduct && role === "super_admin" && (
        <DeleteProductModal
          visible={isDeleteModalVisible}
          //@ts-ignore
          product={selectedProduct}
          onClose={() => setIsDeleteModalVisible(false)}
          page={currentPage}
        />
      )}

      {/* Table Section */}
      <div className="overflow-x-auto shadow-lg">
        <Table
          columns={columns}
          //@ts-ignore
          dataSource={productList?.products}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            //@ts-ignore
            total: productList?.total,
            onChange: (page) => setCurrentPage(page),
          }}
          className="border-t"
          scroll={{ x: 1000 }}
        />
      </div>
    </div>
  );
};

export default ProductTableWithHeader;
