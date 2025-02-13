import { Table } from "antd";
import "antd/dist/reset.css";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../api/products/api";
import DeleteProductModal from "../../components/DeleteProductModal";
import UpdateModal from "../../components/UpdateProductModal";
import SearchBar from "../../components/SearchBar"; // Import SearchBar
import { AppDispatch, RootState } from "../../store/store";
import { getAllProductItem } from "../../api/category/api";
import dayjs from "dayjs";

interface TableData {
  name: string;
  quantity: number;
  description: string;
  base_price: number;
  discounted_price: number;
  status: "Active" | "Inactive";
  _id: string;
  category: string;
  item: string;
  created_at: string;
}

interface CategorySelection {
  category_id: string;
  category_name: string;
  sub_categories: {
    sub_category_id: string;
    name: string;
    items: {
      item_id: string;
      name: string;
    }[];
  }[];
}

const ProductTableWithHeader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const role = useSelector((state: RootState) => state.Login.role);

  const [selectedProduct, setSelectedProduct] = useState<TableData | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selections, setSelections] = useState<CategorySelection[]>([]);
  const [filters, setFilters] = useState<{
    name?: string;
    category?: string;
    created_at?: string;
  }>({});
  const pageSize = 8;

  useEffect(() => {
    const fetchSelections = async () => {
      try {
        const productItemsRes = await getAllProductItem();
        const transformedSelections = transformData(productItemsRes);
        setSelections(transformedSelections);
      } catch (error) {
        console.error("Error fetching selections:", error);
      }
    };

    fetchSelections();
  }, []);

  function transformData(data: any[]): CategorySelection[] {
    return data.map((category) => ({
      category_id: category.product_category._id,
      category_name: category.product_category.name,
      sub_categories: category.sub_categories.map((subCategory) => ({
        sub_category_id: subCategory._id,
        name: subCategory.name,
        items: subCategory.items.map((item) => ({
          item_id: item._id,
          name: item.name,
        })),
      })),
      created_at: category.product_category.created_at,
    }));
  }

  const categoryNamesWithIds = selections.map((selection) => ({
    name: selection.category_name,
    id: selection.category_id,
  }));

  useEffect(() => {
    console.log("Filters applied:", filters);
    //@ts-ignore
    dispatch(
      getAllProducts({
        page_no: currentPage,
        name: filters.name ?? "",
        category: filters.category ?? "",
        created_at: filters.created_at ?? "",
      })
    );
  }, [dispatch, currentPage, filters]);

  const rawProductList = useSelector(
    (state: RootState) => state.AllProducts.products
  );

  const getCategoryById = (data: CategorySelection[], categoryId: string) => {
    const category = data.find((cat) => cat.category_id === categoryId);
    return category
      ? { id: category.category_id, name: category.category_name }
      : null;
  };

  const transformProductData = (
    products: any[],
    selections: CategorySelection[]
  ) => {
    return products.map((product) => ({
      ...product,
      category:
        getCategoryById(selections, product.category)?.name || product.category,
    }));
  };

  const productList = useMemo(() => {
    return Array.isArray(rawProductList)
      ? {
          products: transformProductData(rawProductList, selections),
          total: rawProductList.length,
        }
      : rawProductList || { products: [], total: 0 };
  }, [rawProductList, selections]);

  console.log("111111");
  console.log(productList);
  
  const filteredProducts = productList.products.filter((product: TableData) => {
    const categoryFilter = filters.category ? filters.category.trim() : null;
    const nameFilter = filters.name ? filters.name.toLowerCase().trim() : null;
    const createdAtFilter = filters.created_at ? filters.created_at.trim() : null;
  
    const productCategory = product.category ? product.category.trim() : "";
    const productName = product.name ? product.name.toLowerCase().trim() : "";
    const productCreatedAt = product.created_at
      ? dayjs(product.created_at).format("YYYY-MM-DD")
      : "";
  
    const isCategoryMatch = !categoryFilter || productCategory === categoryFilter;
    const isNameMatch = !nameFilter || productName.includes(nameFilter);
    const isCreatedAtMatch =
      !createdAtFilter || dayjs(productCreatedAt).isSame(createdAtFilter, "day");
  
    return isCategoryMatch && isNameMatch && isCreatedAtMatch;
  });
  

  const handleUpdate = (record: TableData) => {
    setSelectedProduct(null);
    setTimeout(() => {
      setSelectedProduct(record);
      setIsModalVisible(true);
    }, 0);
  };

  const handleDelete = (record: TableData) => {
    setSelectedProduct(record);
    setIsDeleteModalVisible(true);
  };

  const handleSearch = (newFilters: {
    name?: string;
    category?: string;
    created_at?: string;
  }) => {
    console.log("11111111");
    console.log("New filters:", newFilters); 
    setFilters(newFilters);
    setCurrentPage(1); // Reset to the first page when applying new filters
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Price", dataIndex: "base_price", key: "base_price" },
    {
      title: "Discounted Price",
      dataIndex: "discounted_price",
      key: "discounted_price",
    },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Stock", dataIndex: "quantity", key: "quantity" },
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
    { title: "Created at", dataIndex: "created_at", key: "created_At" },
  ];

  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div>
      {/* Header Section */}
      <div className="p-4 text-lg font-semibold text-gray-800 border-b">
        Product List
      </div>

      {/* SearchBar */}
      <SearchBar onSearch={handleSearch} categories={categoryNamesWithIds} />

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
          dataSource={filters.name || filters.category || filters.created_at ? paginatedProducts : productList?.products}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
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
