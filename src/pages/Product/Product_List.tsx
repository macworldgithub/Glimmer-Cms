import { Table } from "antd";
import "antd/dist/reset.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllProducts } from "../../api/products/api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import UpdateModal from "../../components/UpdateProductModal";
import DeleteProductModal from "../../components/DeleteProductModal";

interface TableData {
  name: string;
  quantity: number;
  description: string;
  images: string[];
  base_price: number;
  discounted_price: number;
  status: "Active" | "Inactive";
  store: string;
  _id: string;
  actions: string;
}

const ProductTableWithHeader = () => {
  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState<TableData | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    //@ts-ignore
    dispatch(getAllProducts({ page_no: 1 }));
  }, []);

  const handleUpdate = (record: any) => {
    console.log("Updating:", record);
    setSelectedProduct(record);
    setIsModalVisible(true);
    // Your update logic here
  };

  const handleDelete = (record: any) => {
    setSelectedProduct(record);
    setIsDeleteModalVisible(true);
    // Your delete logic here
  };

  const productList = useSelector(
    (state: RootState) => state.AllProducts.products
  );

  // Table columns
  const columns = [
    {
      title: "name",
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

    ,
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
      title: "ACTIONS",
      dataIndex: "actions", // not from the interface—this is custom for rendering
      key: "actions",
      render: (text: string, record: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleUpdate(record)}
            className="text-blue-500 hover:underline"
          >
            Update
          </button>
          <button
            onClick={() => handleDelete(record)}
            className="text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleSave = () => {
    // ?setProducts(products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
    setIsModalVisible(false);
  };
  return (
    <div>
      {/* Header Section */}
      <div className="p-4 text-lg font-semibold text-gray-800 border-b">
        Filter
      </div>

      {/* Table Section */}
      {selectedProduct && (
        <UpdateModal
          visible={isModalVisible}
          product={selectedProduct}
          onClose={() => setIsModalVisible(false)}
          onSave={handleSave}
          page={1}
        />
      )}

      {selectedProduct && (
        <DeleteProductModal
          visible={isDeleteModalVisible}
          product={selectedProduct}
          onClose={() => setIsDeleteModalVisible(false)}
          page={1}
        />
      )}

      <div className="overflow-x-auto shadow-lg">
        <Table
          columns={columns}
          dataSource={productList}
          pagination={true}
          className="border-t"
          scroll={{ x: 1000 }}
        />
      </div>
    </div>
  );
};

export default ProductTableWithHeader;
