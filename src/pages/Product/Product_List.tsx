import { Button, Checkbox, Input, Table } from "antd";
import "antd/dist/reset.css";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, updateProductPrices } from "../../api/products/api";
import DeleteProductModal from "../../components/DeleteProductModal";
import UpdateModal from "../../components/UpdateProductModal";
import SearchBar from "../../components/SearchBar"; // Import SearchBar
import { AppDispatch, RootState } from "../../store/store";
import { getAllProductItem } from "../../api/category/api";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";

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
  const [selections, setSelections] = useState<CategorySelection[]>([]);
  const [checkedNames, setCheckedNames] = useState({});
  const [allChecked, setAllChecked] = useState(false);
  const [discount, setDiscount] = useState<number>(0);

  const [searchParams, setSearchParams] = useSearchParams();

  const pageSize = 8;

  const currentPage = Number(searchParams.get("page")) || 1;
  const nameFilter = searchParams.get("name") || "";
  const categoryFilter = searchParams.get("category") || "";
  const createdAtFilter = searchParams.get("created_at") || "";
  const storeId = searchParams.get("store") || "";
  console.log(storeId);

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
    //@ts-ignore
    dispatch(
      getAllProducts({
        page_no: currentPage,
        name: nameFilter,
        category: categoryFilter,
        created_at: createdAtFilter,
        storeId,
      })
    );
  }, [dispatch, currentPage, nameFilter, categoryFilter, createdAtFilter, storeId]);

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

  useEffect(() => {
    setCheckedNames((prev) => {
      const newCheckedState = { ...prev };
      productList.products.forEach((product) => {
        if (!(product._id in newCheckedState)) {
          newCheckedState[product._id] = false;
        }
      });
      return newCheckedState;
    });
  }, [productList.products]);

  useEffect(() => {
    const allCheckedState = {};
    productList.products.forEach((product) => {
      allCheckedState[product._id] = allChecked;
    });
    setCheckedNames(allCheckedState);
  }, [allChecked, productList.products]);

  const handleCheck = (productId) => {
    setCheckedNames((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleCheckAll = () => {
    setAllChecked(!allChecked);
  };
  const handleUpdateDiscount = async () => {
    console.log(checkedNames);
    const selectedProductIds = Object.keys(checkedNames).filter(
      (id) => checkedNames[id]
    );

    if (selectedProductIds.length === 0) {
      alert("Please select at least one product to update.");
      return;
    }

    if (discount <= 0) {
      alert("Please enter a valid discount greater than 0.");
      return;
    }

    try {
      await dispatch(
        updateProductPrices({ discount, productIds: selectedProductIds })
      ).unwrap();
      alert("Product prices updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating prices:", error);
      alert("Failed to update product prices.");
    }
  };
  const filteredProducts = productList.products.filter((product: TableData) => {
    const productCategory = product.category ? product.category.trim() : "";
    const productName = product.name ? product.name.toLowerCase().trim() : "";
    const productCreatedAt = product.created_at
      ? dayjs(product.created_at).format("YYYY-MM-DD")
      : "";

    return (
      (!categoryFilter || productCategory === categoryFilter) &&
      (!nameFilter || productName.includes(nameFilter.toLowerCase())) &&
      (!createdAtFilter ||
        dayjs(productCreatedAt).isSame(createdAtFilter, "day"))
    );
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
    setSearchParams({
      page: "1",
      name: newFilters.name || "",
      category: newFilters.category || "",
      created_at: newFilters.created_at || "",
    });
  };
  const columns = [
    {
      title: (
        <Checkbox onChange={handleCheckAll} checked={allChecked}>
          Name
        </Checkbox>
      ),
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <Checkbox
            onChange={() => handleCheck(record._id)}
            checked={checkedNames[record._id] || false}
          />
          <span className="ml-2">{text}</span>
        </div>
      ),
    },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Price",
      dataIndex: "base_price",
      key: "base_price",
      render: (text: number) => {
        return text.toFixed(2);
      },
    },
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

  return (
    <div>
      {/* Header Section */}
      <div className="p-4 text-lg font-semibold text-gray-800 border-b">
        Product List
      </div>

      {/* SearchBar */}
      <SearchBar onSearch={handleSearch} categories={categoryNamesWithIds} showServices={false}/>

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

      <div className="flex flex-wrap gap-4 py-4">
        <Input
          id="discount"
          type="number"
          placeholder="Flat Discount"
          onChange={(e) => setDiscount(parseFloat(e.target.value))}
          className="w-1/3"
        />
        <Button type="primary" onClick={handleUpdateDiscount}>
          Apply Discount
        </Button>
      </div>
      {/* Table Section */}
      <div className="overflow-x-auto shadow-lg">
        <Table
          columns={columns}
          //@ts-ignore
          dataSource={filteredProducts}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: productList?.total,
            onChange: (page) =>
              setSearchParams({
                page: page.toString(),
                name: nameFilter,
                category: categoryFilter,
                created_at: createdAtFilter,
              }),
          }}
          className="border-t"
          scroll={{ x: 1000 }}
        />
      </div>
    </div>
  );
};

export default ProductTableWithHeader;
