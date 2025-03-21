import { Button, Checkbox, Input, Table, Tooltip } from "antd";
import "antd/dist/reset.css";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProductPrices } from "../api/products/api";
import DeleteProductModal from "../components/DeleteProductModal";
import UpdateModal from "../components/UpdateProductModal";
import SearchBar from "../components/SearchBar"; // Import SearchBar
import { AppDispatch, RootState } from "../store/store";
import { useSearchParams } from "react-router-dom";
import { getAllServicesForSalon } from "../api/service/api";
import UpdateServiceModal from "../components/UpdateServiceModal";

interface TableData {
  name: string;
  categoryId: string;
  subCategoryName: string;
  subSubCategoryName: string;
  requestedPrice: number;
  adminPrice: number;
  description: string;
  duration: string;
  status: "Active" | "Inactive";
  created_at: string;
}

const ServiceList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const role = useSelector((state: RootState) => state.Login.role);

  const [selectedProduct, setSelectedProduct] = useState<TableData | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [checkedNames, setCheckedNames] = useState({});
  const [allChecked, setAllChecked] = useState(false);
  const [discount, setDiscount] = useState<number>(0);

  const [searchParams, setSearchParams] = useSearchParams();

  const pageSize = 8;

  const currentPage = Number(searchParams.get("page")) || 1;
  const categoryIdFilter = searchParams.get("categoryId") || "";
  const subCategoryNameFilter = searchParams.get("subCategoryName") || "";
  const subSubCategoryNameFilter = searchParams.get("subSubCategoryName") || "";

  useEffect(() => {
    //@ts-ignore
    dispatch(
      getAllServicesForSalon({
        page_no: currentPage,
        categoryId: categoryIdFilter,
        subCategoryName: subCategoryNameFilter,
        subSubCategoryName: subSubCategoryNameFilter,
      })
    );
  }, [
    dispatch,
    currentPage,
    categoryIdFilter,
    subCategoryNameFilter,
    subSubCategoryNameFilter,
  ]);

  const serviceList = useSelector((state: RootState) => state.AllSalon.salons);
  console.log("Service list: ", serviceList);
  const handleCheck = (productId) => {
    setCheckedNames((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleCheckAll = () => {
    setAllChecked(!allChecked);
  };
  const handleUpdatePrice = async () => {
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

  const salonServiceList = useMemo(() => {
    return Array.isArray(serviceList)
      ? {
          services: serviceList,
          total: serviceList.length,
        }
      : serviceList || { services: [], total: 0 };
  }, [serviceList]);

  const filteredServices = salonServiceList.services.filter((salon) => {
    const categoryId = salon.categoryId ? salon.categoryId.trim() : "";
    const subCategoryName = salon.name
      ? salon.subCategoryName.toLowerCase().trim()
      : "";
    const subSubCategoryName = salon.name
      ? salon.subSubCategoryName.toLowerCase().trim()
      : "";

    return (
      (!categoryIdFilter || categoryId === categoryIdFilter) &&
      (!subCategoryNameFilter ||
        subCategoryName.includes(subCategoryNameFilter.toLowerCase())) &&
      (!subSubCategoryNameFilter ||
        subSubCategoryName.includes(subSubCategoryNameFilter.toLowerCase()))
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
    categoryId?: string;
    subCategoryName?: string;
    subSubCategoryName?: string;
  }) => {
    setSearchParams({
      page: "1",
      categoryId: newFilters.categoryId || "",
      subCategoryName: newFilters.subCategoryName || "",
      subSubCategoryName: newFilters.subSubCategoryName || "",
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
    { title: "Category Id", dataIndex: "categoryId", key: "categoryId" },
    { title: "Sub Service", dataIndex: "subCategoryName", key: "subCategoryName" },
    { title: "Product", dataIndex: "subSubCategoryName", key: "subSubCategoryName" },
    {
      title: "Requested Price",
      dataIndex: "requestedPrice",
      key: "requestedPrice",
    },
    { title: "Admin Price", dataIndex: "adminSetPrice", key: "adminSetPrice" },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <Tooltip title={text}>
          {" "}
          <span
            className="truncate"
            style={{ maxWidth: "200px", display: "inline-block" }}
          >
            {text.length > 30 ? `${text.substring(0, 30)}...` : text}{" "}
          </span>
        </Tooltip>
      ),
    },
    { title: "Duration", dataIndex: "duration", key: "duration" },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: boolean) => (
        <span>{status ? "Active" : "Inactive"}</span>
      ),
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
    { title: "Created at", dataIndex: "createdAt", key: "createdAt" },
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="p-4 text-lg font-semibold text-gray-800 border-b">
        Service List
      </div>

      {/* SearchBar */}
      <SearchBar onSearch={handleSearch} showCategories={false} />

      {/* Modals */}
      {selectedProduct && (
        <UpdateServiceModal
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
        <Button type="primary" onClick={handleUpdatePrice}>
          Apply Discount
        </Button>
      </div>
      {/* Table Section */}
      <div className="overflow-x-auto shadow-lg">
        <Table
          columns={columns}
          //@ts-ignore
          dataSource={filteredServices}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: salonServiceList?.total,
            onChange: (page) =>
              setSearchParams({
                page: page.toString(),
                categoryId: categoryIdFilter,
                subCategoryName: subCategoryNameFilter,
                subSubCategoryName: subSubCategoryNameFilter,
              }),
          }}
          className="border-t"
          scroll={{ x: 1000 }}
        />
      </div>
    </div>
  );
};

export default ServiceList;
