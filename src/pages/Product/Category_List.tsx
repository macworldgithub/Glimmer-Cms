import { Table } from "antd";
import "antd/dist/reset.css";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import SearchBar from "../../components/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getAllProductItem } from "../../api/category/api";
import { getAllProducts } from "../../api/products/api";
import { Product } from "../../slices/addProductSlice";

interface TableData {
  key: string;
  category: string;
  totalProducts: number;
  totalPrice: number;
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

const CategoryTableWithHeader = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [selections, setSelections] = useState<CategorySelection[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{
    name?: string;
    category?: string;
  }>({});


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
    }));
  }

  const categoryNamesWithIds = selections.map((selection) => ({
    name: selection.category_name,
    id: selection.category_id,
  }));

  const rawProductList = useSelector(
    (state: RootState) => state.AllProducts.products
  );

  const getCategoryById = (data: CategorySelection[], categoryId: string) => {
    const category = data.find((cat) => cat.category_id === categoryId);
    return category
      ? { id: category.category_id, name: category.category_name }
      : null;
  };

  const aggregateCategoryData = (
    data: { products: any[]; total: number }, 
    selections: CategorySelection[]
  ) => {
    const categoryAggregates: { [key: string]: { totalProducts: number; totalPrice: number } } = {};

    if (!Array.isArray(data.products)) {
      console.error("Expected data.products to be an array, but got:", data.products);
      return [];
    }

    data.products.forEach((product) => {
      const categoryId = product.category;
      if (!categoryAggregates[categoryId]) {
        categoryAggregates[categoryId] = { totalProducts: 0, totalPrice: 0 };
      }
      categoryAggregates[categoryId].totalProducts += 1;
      categoryAggregates[categoryId].totalPrice += parseFloat(product.base_price);
    });

    return Object.keys(categoryAggregates).map((categoryId) => {
      const category = getCategoryById(selections, categoryId);
      return {
        key: categoryId,
        category: category ? category.name : categoryId,
        totalProducts: categoryAggregates[categoryId].totalProducts,
        totalPrice: categoryAggregates[categoryId].totalPrice,
      };
    });
  };


  const categoryList = useMemo(() => {
    return rawProductList && rawProductList as unknown as Product && selections.length > 0
      ? aggregateCategoryData(rawProductList as any, selections)
      : [];
  }, [rawProductList, selections]);

  useEffect(() => {
    dispatch(
      getAllProducts({
        page_no: currentPage,
        name: filters.name ?? "",
        category: filters.category ?? "",
      })
    );
  }, [dispatch, currentPage, filters]);

  const filteredCategories = useMemo(() => {
    return categoryList.filter((category: TableData) => {
      const categoryFilter = filters.category ? filters.category.trim() : null;
      const nameFilter = filters.name ? filters.name.toLowerCase().trim() : null;

      const categoryCategory = category.category ? category.category.trim() : "";

      const isCategoryMatch = !categoryFilter || categoryCategory === categoryFilter;
      const isNameMatch = !nameFilter || categoryCategory.toLowerCase().includes(nameFilter);

      return isCategoryMatch && isNameMatch;
    });
  }, [categoryList, filters]);

  const handleSearch = (newFilters: {
    name?: string;
    category?: string;
    created_at?: string;
  }) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const columns = [
    {
      title: "CATEGORIES",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "TOTAL PRODUCTS",
      dataIndex: "totalProducts",
      key: "totalProducts",
    },
    {
      title: "TOTAL PRICE",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text: number) => `$${text.toFixed(2)}`,
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
    alert(`Editing category: ${record.category}`);
  };

  return (
    <div>
      <div className="p-4 text-lg font-semibold text-gray-800 border-b">
        Category List
      </div>

      <SearchBar onSearch={handleSearch} categories={categoryNamesWithIds} hideName={true}
        hideCreatedAt={true} />

      <div className="overflow-x-auto bg-white border-t shadow-lg rounded-lg">
        <Table
          columns={columns}
          dataSource={categoryList}
          pagination={{
            current: currentPage,
            total: filteredCategories.length,
            onChange: (page) => setCurrentPage(page),
          }}
          scroll={{ x: 1000 }}
          className="ant-table-thead rounded-md"
        />
      </div>
    </div>
  );
};

export default CategoryTableWithHeader;

