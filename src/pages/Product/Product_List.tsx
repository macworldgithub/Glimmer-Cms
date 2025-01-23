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
  console.log(useSelector(state=>state))

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
        //@ts-ignore
          columns={columns}
          // dataSource={productList}
          //@ts-ignore
          pagination={true}
          className="border-t"
          scroll={{ x: 1000 }}
        />
      </div>
    </div>
  );
};

export default ProductTableWithHeader;



// import { Table } from "antd";
// import "antd/dist/reset.css";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import DeleteProductModal from "../../components/DeleteProductModal";
// import UpdateModal from "../../components/UpdateProductModal";
// import { RootState } from "../../store/store";

// interface TableData {
//   name: string;
//   quantity: number;
//   description: string;
//   base_price: number;
//   discounted_price: number;
//   status: "Active" | "Inactive";
//   store: string;
//   _id: string;
//   actions?: string;
// }

// const ProductTableWithHeader = () => {
//   const dispatch = useDispatch();
//   const [selectedProduct, setSelectedProduct] = useState<TableData | null>(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
//   const [productList, setProductList] = useState<TableData[]>([]); // State for storing fetched products
//   const [loading, setLoading] = useState(false); // Loader for API calls
//   const [id, setId] = useState(""); // Store ID dynamically
//   const [category, setCategory] = useState("skin Care"); // Default category
//   const [subCategory, setSubCategory] = useState("Cleanser"); // Default sub-category

//   // Access the token from the Redux state
//   const token = useSelector((state: RootState) => state.Login.token);

//   // Fetch products using API
//   const fetchProducts = async () => {
//     if (!id || !category || !subCategory) {
//       console.error("Please provide all required parameters.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:3000/product/get_all_store_products`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Pass the token as Bearer token
//           },
//           params: {
//             page_no: 1,
//             category,
//             sub_category: subCategory,
//           },
//         }
//       );

//       setProductList(response.data.products || []); // Assuming `products` is the key in response
//     } catch (error: any) {
//       console.error(error.response?.data || "An error occurred while fetching products.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts(); // Fetch products on initial load or whenever parameters change
//   }, [id, category, subCategory]);

//   const handleUpdate = (record: TableData) => {
//     setSelectedProduct(record);
//     setIsModalVisible(true);
//   };

//   const handleDelete = (record: TableData) => {
//     setSelectedProduct(record);
//     setIsDeleteModalVisible(true);
//   };

//   const columns = [
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//     },
//     {
//       title: "Price",
//       dataIndex: "base_price",
//       key: "base_price",
//     },
//     {
//       title: "Discounted Price",
//       dataIndex: "discounted_price",
//       key: "discounted_price",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//     },
//     {
//       title: "Stock",
//       dataIndex: "quantity",
//       key: "quantity",
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: any, record: TableData) => (
//         <div className="flex space-x-2">
//           <button
//             onClick={() => handleUpdate(record)}
//             className="text-blue-500 hover:underline"
//           >
//             Update
//           </button>
//           <button
//             onClick={() => handleDelete(record)}
//             className="text-red-500 hover:underline"
//           >
//             Delete
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <div className="p-4 text-lg font-semibold text-gray-800 border-b">Filter</div>
//       <div className="p-4">
//         <input
//           type="text"
//           placeholder="Enter ID"
//           value={id}
//           onChange={(e) => setId(e.target.value)}
//           className="border p-2 rounded mb-2"
//         />
//         <input
//           type="text"
//           placeholder="Enter Category"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           className="border p-2 rounded mb-2 ml-2"
//         />
//         <input
//           type="text"
//           placeholder="Enter Sub-Category"
//           value={subCategory}
//           onChange={(e) => setSubCategory(e.target.value)}
//           className="border p-2 rounded mb-2 ml-2"
//         />
//       </div>
//       {selectedProduct && (
//         <UpdateModal
//           visible={isModalVisible}
//           //@ts-ignore
//           product={selectedProduct}
//           onClose={() => setIsModalVisible(false)}
//           onSave={() => setIsModalVisible(false)}
//           page={1}
//         />
//       )}
//       {selectedProduct && (
//         <DeleteProductModal
//           visible={isDeleteModalVisible}
//           //@ts-ignore
//           product={selectedProduct}
//           onClose={() => setIsDeleteModalVisible(false)}
//           page={1}
//         />
//       )}
//       <div className="overflow-x-auto shadow-lg">
//         <Table
//           columns={columns}
//           dataSource={productList} // Dynamically loaded data
//           loading={loading} // Display loading spinner
//           pagination={{ pageSize: 10 }}
//           rowKey={(record) => record._id}
//           className="border-t"
//           scroll={{ x: 1000 }}
//         />
//       </div>
//     </div>
//   );
// };

// export default ProductTableWithHeader;

