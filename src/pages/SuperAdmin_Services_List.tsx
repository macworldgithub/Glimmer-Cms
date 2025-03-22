import React, { useEffect, useMemo, useState } from 'react'
import { getAllServicesForAdmin } from '../api/service/api';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { Checkbox, Table, Tooltip } from 'antd';
import DeleteProductModal from '../components/DeleteProductModal';
import UpdateServiceModal from '../components/UpdateServiceModal';

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

  // const [data, setData] = useState(null);
  const [allChecked, setAllChecked] = useState(false);
  const [checkedNames, setCheckedNames] = useState({});
  const [selectedSalon, setSelectedSalon] = useState<TableData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const pageSize = 8;

  const currentPage = Number(searchParams.get("page")) || 1;
  const categoryIdFilter = searchParams.get("categoryId") || "";
  const subCategoryNameFilter = searchParams.get("subCategoryName") || "";
  const subSubCategoryNameFilter = searchParams.get("subSubCategoryName") || "";

  useEffect(() => {
    //@ts-ignore
    dispatch(
      getAllServicesForAdmin({
        page_no: currentPage,
        // categoryId: categoryIdFilter,
        // subCategoryName: subCategoryNameFilter,
        // subSubCategoryName: subSubCategoryNameFilter,
      })
    );
  }, [
    dispatch,
    currentPage,
    categoryIdFilter,
    subCategoryNameFilter,
    subSubCategoryNameFilter,
  ]);

  const handleCheckAll = () => {
      setAllChecked(!allChecked);
    };
  
    const handleCheck = (productId) => {
      setCheckedNames((prev) => ({ ...prev, [productId]: !prev[productId] }));
    };
  
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
        <DeleteProductModal
          visible={isDeleteModalVisible}
          //@ts-ignore
          product={selectedProduct}
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
  )
}

export default SuperAdmin_Services_List;