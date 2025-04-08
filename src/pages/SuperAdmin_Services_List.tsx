import React, { useEffect, useMemo, useState } from "react";
import { approvePriceUpdate, getAllServicesForAdmin } from "../api/service/api";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { RootState, AppDispatch } from "../store/store";
import { Table, Tooltip } from "antd";
import UpdateServiceModal from "../components/UpdateServiceModal";
import DeleteServiceModal from "../components/DeleteServiceModal";

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

const SuperAdmin_Services_List = () => {
  const role = useSelector((state: RootState) => state.Login.role);
  const serviceList = useSelector((state: RootState) => state.AllSalon.salons);

  const dispatch = useDispatch<AppDispatch>();

  const [selectedSalon, setSelectedSalon] = useState<TableData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editedPrices, setEditedPrices] = useState<{ [key: string]: number }>(
    {}
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const pageSize = 8;

  const currentPage = Number(searchParams.get("page")) || 1;
  const categoryIdFilter = searchParams.get("categoryId") || "";
  const subCategoryNameFilter = searchParams.get("subCategoryName") || "";
  const subSubCategoryNameFilter = searchParams.get("subSubCategoryName") || "";
  const salonId = searchParams.get("salonId") || "";

  useEffect(() => {
    //@ts-ignore
    dispatch(
      getAllServicesForAdmin({
        page_no: currentPage,
        salonId,
        // categoryId: categoryIdFilter,
        // subCategoryName: subCategoryNameFilter,
        // subSubCategoryName: subSubCategoryNameFilter,
      })
    );
  }, [
    dispatch,
    currentPage,
    salonId,
    categoryIdFilter,
    subCategoryNameFilter,
    subSubCategoryNameFilter,
  ]);

  const handleUpdate = (record: TableData) => {
    setSelectedSalon(null);
    setTimeout(() => {
      setSelectedSalon(record);
      setIsModalVisible(true);
    }, 0);
  };

  const handleDelete = (record: TableData) => {
    setSelectedSalon(record);
    setIsDeleteModalVisible(true);
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
    const subCategoryName = salon.subCategoryName
      ? salon.subCategoryName.toLowerCase().trim()
      : "";
    const subSubCategoryName = salon.subSubCategoryName
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

  const handlePriceChange = (id: string, value: string) => {
    setEditedPrices((prev) => ({ ...prev, [id]: Number(value) }));
  };

  const handlePriceUpdate = (id: string) => {
    const newPrice = editedPrices[id];
    if (!newPrice) return;

    dispatch(approvePriceUpdate({ adminSetPrice: newPrice, id }));
    alert("Requested Price is set by Admin successfully");
    setTimeout(() => {
      window.location.reload();
    }, 1000); 
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    { title: "Category Id", dataIndex: "categoryId", key: "categoryId" },
    {
      title: "Sub Service",
      dataIndex: "subCategoryName",
      key: "subCategoryName",
    },
    {
      title: "Product",
      dataIndex: "subSubCategoryName",
      key: "subSubCategoryName",
    },
    {
      title: "Requested Price",
      dataIndex: "requestedPrice",
      key: "requestedPrice",
    },
    {
      title: "Admin Price",
      dataIndex: "adminSetPrice",
      key: "adminSetPrice",
      render: (text, record) => (
        <div className="flex items-center space-x-2">
          <input
            type="number"
            className="border p-1 w-20"
            value={editedPrices[record._id] !== undefined ? editedPrices[record._id] : (text || "")}
            onChange={(e) => handlePriceChange(record._id, e.target.value)}
          />
          <button
            onClick={() => handlePriceUpdate(record._id)}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Approve
          </button>
        </div>
      ),
    },
    {
      title: "Admin Discounted Price",
      dataIndex: "discountPercentage",
      key: "finalPrice",
      render: (discountPercentage, record) => {
        const adminPrice = record.adminSetPrice || 0;
        const discount = discountPercentage || 0;
        const finalPrice = adminPrice - (adminPrice * discount) / 100;

        return <span>{finalPrice}</span>;
      },
    },
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
    <div className="p-6 bg-gray-100 min-h-screen">
      {selectedSalon && (
        <UpdateServiceModal
          visible={isModalVisible}
          //@ts-ignore
          salon={{ ...selectedSalon, id: selectedSalon._id }}
          onClose={() => setIsModalVisible(false)}
          page={currentPage}
        />
      )}

      {selectedSalon && role === "super_admin" && (
        <DeleteServiceModal
          visible={isDeleteModalVisible}
          //@ts-ignore
          service={selectedSalon}
          onClose={() => setIsDeleteModalVisible(false)}
          page={currentPage}
        />
      )}
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

export default SuperAdmin_Services_List;
