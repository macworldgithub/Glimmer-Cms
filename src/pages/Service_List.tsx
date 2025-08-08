import { Button, Checkbox, Input, message, Modal, Table, Tooltip } from "antd";
import "antd/dist/reset.css";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProductPrices } from "../api/products/api";
import DeleteProductModal from "../components/DeleteProductModal";
import UpdateModal from "../components/UpdateProductModal";
import SearchBar from "../components/SearchBar"; // Import SearchBar
import { AppDispatch, RootState } from "../store/store";
import { useSearchParams } from "react-router-dom";
import {
  changeActivationStatus,
  getAllServicesForSalon,
  requestPriceUpdate,
  updateServiceDiscount,
  updateSingleServiceDiscount,
} from "../api/service/api";
import UpdateServiceModal from "../components/UpdateServiceModal";
import ServiceSearchBar from "../components/ServiceSearchBar";

interface TableData {
  _id: string;
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

  const [selectedSalon, setSelectedSalon] = useState<TableData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
const [checkedNames, setCheckedNames] = useState<Record<string, boolean>>({});

// State to hold header checkbox state
const [allChecked, setAllChecked] = useState(false);
  const [discount, setDiscount] = useState<number>(0);
  const [editedPrices, setEditedPrices] = useState<{ [key: string]: number }>(
    {}
  );
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedStatusRecord, setSelectedStatusRecord] =
    useState<TableData | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const pageSize = 10;

  const currentPage = Number(searchParams.get("page_no")) || 1;
  const categoryIdFilter = searchParams.get("categoryId") || "";
  const nameFilter = searchParams.get("name") || "";

  useEffect(() => {
    //@ts-ignore
    dispatch(
      getAllServicesForSalon({
        page_no: currentPage,
        categoryId: categoryIdFilter,
      })
    );
  }, [dispatch, currentPage, categoryIdFilter]);

const { salons: serviceList, total, allServices } = useSelector(
  (state: RootState) => state.AllSalon
);

  const handleUpdateDiscount = async () => {
    const selectedProductIds = Object.keys(checkedNames).filter(
      (id) => checkedNames[id]
    );
    if (selectedProductIds.length === 0) {
      alert("Please select at least one service to update.");
      return;
    }

    if (discount <= 0) {
      alert("Please enter a valid discount greater than 0.");
      return;
    }

    try {
      if (selectedProductIds.length === 1) {
        await dispatch(
          updateSingleServiceDiscount({
            discountPercentage: discount,
            id: selectedProductIds[0],
          })
        ).unwrap();
        alert("Discount updated successfully for the selected service!");
      } else {
        await dispatch(
          updateServiceDiscount({
            discountPercentage: discount,
            id: selectedProductIds,
          })
        ).unwrap();
        alert("Services discount updated successfully!");
      }
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

  useEffect(() => {
    if (!Array.isArray(serviceList)) return;

setCheckedNames((prev) => {
  const newCheckedState = { ...prev };
  serviceList.forEach((salon) => {
    // Sirf un items ko false karo jo naye hain
    if (!(salon._id in newCheckedState)) {
      newCheckedState[salon._id] = false;
    }
  });
  return newCheckedState;
});

  }, [serviceList]);
const handleCheck = (serviceId: string) => {
  setCheckedNames((prev) => {
    const newChecked = { ...prev, [serviceId]: !prev[serviceId] };

    // Check if all are selected after this toggle
    const services = Array.isArray(allServices) ? allServices : [];
    const allSelected = services.length > 0 && services.every(s => newChecked[s._id]);

    setAllChecked(allSelected);

    return newChecked;
  });
};

const handleCheckAll = () => {
  const newChecked = !allChecked;

  const services = Array.isArray(allServices) ? allServices : [];

  const updatedChecked = services.reduce((acc, service) => {
    acc[service._id] = newChecked;
    return acc;
  }, {} as Record<string, boolean>);

  setCheckedNames(updatedChecked);
  setAllChecked(newChecked);
};

useEffect(() => {
  const services = Array.isArray(allServices) ? allServices : [];
  if (services.length === 0) {
    setAllChecked(false);
    return;
  }
    const allSelected = services.every((service) => checkedNames[service._id]);
  setAllChecked(allSelected);
}, [checkedNames, allServices]);


  const filteredServices = salonServiceList.services.filter((salon) => {
    console.log(salon);
    const categoryId = salon.categoryId ? salon.categoryId.trim() : "";
    const name = salon.name ? salon.name.toLowerCase().trim() : "";

    return (
      (!categoryIdFilter || categoryId === categoryIdFilter) &&
      (!nameFilter || name.includes(nameFilter.toLowerCase()))
    );
  });

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

  const handleSearch = (newFilters: { categoryId?: string; name?: string }) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const updatedParams = {
      ...currentParams,
      page_no: "1",
      ...newFilters,
    };

    Object.keys(updatedParams).forEach((key) => {
      if (!updatedParams[key]) {
        delete updatedParams[key];
      }
    });

    setSearchParams(updatedParams);
  };

  const handlePriceChange = (id: string, value: string) => {
    setEditedPrices((prev) => ({ ...prev, [id]: Number(value) }));
  };

  const handlePriceUpdate = (id: string) => {
    const newPrice = editedPrices[id];
    if (!newPrice) return;

    dispatch(requestPriceUpdate({ requestedPrice: newPrice, id }));
    alert("Price has been requested for approval");
  };

  const handleStatusToggle = async () => {
    if (!selectedStatusRecord) return;

    try {
      const resultAction = await dispatch(
        changeActivationStatus({ id: selectedStatusRecord._id })
      );

      if (changeActivationStatus.fulfilled.match(resultAction)) {
        message.success(
          `Service marked as ${
            selectedStatusRecord.status ? "Inactive" : "Active"
          }`
        );
        setConfirmVisible(false);
        setSelectedStatusRecord(null);
        alert("Status has been updated");
        window.location.reload(); // or trigger a refetch instead
      } else {
        message.error("Failed to change status.");
      }
    } catch (error) {
      message.error("Something went wrong.");
    }
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
      render: (_: any, record: any) => {
        return (
          <Checkbox
            onChange={() => handleCheck(record._id)}
            checked={checkedNames[record._id] || false}
          >
            {record.name}
          </Checkbox>
        );
      },
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
      render: (text, record) => (
        <div className="flex items-center space-x-2">
          <input
            type="number"
            className="border p-1 w-20"
            value={editedPrices[record._id] ?? text}
            onChange={(e) => handlePriceChange(record._id, e.target.value)}
          />
          <button
            onClick={() => handlePriceUpdate(record._id)}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Request
          </button>
        </div>
      ),
    },
    { title: "Admin Price", dataIndex: "adminSetPrice", key: "adminSetPrice" },
    {
      title: "Admin Discounted Price",
      dataIndex: "discountPercentage",
      key: "finalPrice",
      render: (discountPercentage, record) => {
        const adminPrice = record.adminSetPrice || 0;
        const discount = discountPercentage || 0;
        const finalPrice = adminPrice - (adminPrice * discount) / 100;

        return <span>{finalPrice.toFixed(2)}</span>;
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
      render: (status: boolean, record: TableData) => (
        <span
          className={`cursor-pointer font-medium ${
            status ? "text-green-600" : "text-red-600"
          }`}
          onClick={() => {
            setSelectedStatusRecord(record);
            setConfirmVisible(true);
          }}
        >
          {status ? "Active" : "Inactive"}
        </span>
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
    // <div>
     <div className="p-6 bg-white min-h-screen" style={{ minWidth: '2560px' }}>
      {/* Header Section */}
      <div className="p-4 text-lg font-semibold text-gray-800 border-b">
        Service List 
      </div>
      {/* SearchBar */}
      <ServiceSearchBar onSearch={handleSearch} />

      {/* Modals */}
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

      <Modal
        visible={confirmVisible}
        title="Confirm Status Change"
        onOk={handleStatusToggle}
        onCancel={() => {
          setConfirmVisible(false);
          setSelectedStatusRecord(null);
        }}
        okText="Yes"
        cancelText="No"
        closable
      >
        <p>
          Are you sure you want to{" "}
          <strong>
            {selectedStatusRecord?.status ? "deactivate" : "activate"}
          </strong>{" "}
          this service?
        </p>
      </Modal>
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
      {/* <div className=""> */}
  <div className="overflow-x-auto w-full" style={{ width: '100%' }}>
                <Table
                    columns={columns}
                    dataSource={filteredServices}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: total,
                        onChange:  (page) =>
              setSearchParams({
                page_no: page.toString(),
                categoryId: categoryIdFilter,
                name: nameFilter,
                    }),
            }}
                    className="border-t"
                />
            </div>
    </div>
  );
};

export default ServiceList;
