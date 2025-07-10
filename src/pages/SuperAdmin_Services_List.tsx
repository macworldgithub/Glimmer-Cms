import React, { useEffect, useMemo, useState } from "react";
import {
  approvePriceUpdate,
  getAllServicesForAdmin,
  updateServiceDiscount,
  updateSingleServiceDiscount,
} from "../api/service/api";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { RootState, AppDispatch } from "../store/store";
import { Button, Checkbox, Input, Table, Tooltip } from "antd";
import UpdateServiceModal from "../components/UpdateServiceModal";
import DeleteServiceModal from "../components/DeleteServiceModal";
import SearchBar from "../components/SearchBar";
import ServiceSearchBar from "../components/ServiceSearchBar";

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
  const { salons: serviceList, total } = useSelector(
    (state: RootState) => state.AllSalon
  );

  const dispatch = useDispatch<AppDispatch>();

  const [selectedSalon, setSelectedSalon] = useState<TableData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editedPrices, setEditedPrices] = useState<{ [key: string]: number }>(
    {}
  );

  const [checkedNames, setCheckedNames] = useState({});
  const [allChecked, setAllChecked] = useState(false);
  const [discount, setDiscount] = useState<number>(0);

  const [searchParams, setSearchParams] = useSearchParams();

  const pageSize = 10;

  const currentPage = Number(searchParams.get("page_no")) || 1;
  const categoryIdFilter = searchParams.get("categoryId") || "";
  const nameFilter = searchParams.get("name") || "";
  const salonId = searchParams.get("salonId") || "";

  useEffect(() => {
    //@ts-ignore
    dispatch(
      getAllServicesForAdmin({
        page_no: currentPage,
        categoryId: categoryIdFilter,
        name: nameFilter,
        salonId,
      })
    );
  }, [dispatch, currentPage, categoryIdFilter, nameFilter, salonId]);

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

  const handleUpdateDiscount = async () => {
    const selectedProductIds = Object.keys(checkedNames).filter(
      (id) => checkedNames[id]
    );
    if (selectedProductIds.length === 0) {
      alert("Please select at least one service to update.");
      return;
    }

    if (discount < 0) {
      alert("Please enter a valid discount greater or equal to 0.");
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
        if (!(salon._id in newCheckedState)) {
          newCheckedState[salon._id] = false;
        }
      });
      return newCheckedState;
    });
  }, [serviceList]);

  const handleCheck = (serviceId) => {
    setCheckedNames((prev) => ({ ...prev, [serviceId]: !prev[serviceId] }));
  };

  const handleCheckAll = () => {
    const newChecked = !allChecked;
    setAllChecked(newChecked);

    const services = salonServiceList.services || [];

    setCheckedNames((prev) => {
      const updatedChecked = { ...prev };
      services.forEach((salon) => {
        updatedChecked[salon._id] = newChecked;
      });
      return updatedChecked;
    });
  };

  const filteredServices = salonServiceList.services.filter((salon) => {
    const categoryId = salon.categoryId ? salon.categoryId.trim() : "";
    const name = salon.name ? salon.name.toLowerCase().trim() : "";

    return (
      (!categoryIdFilter || categoryId === categoryIdFilter) &&
      (!nameFilter || name.includes(nameFilter.toLowerCase()))
    );
  });

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
    const record = filteredServices.find((item) => item._id === id);
    if (!record) return;

    const editedPrice = editedPrices[id];

    const finalPrice =
      editedPrice !== undefined && editedPrice !== 0
        ? editedPrice
        : record.requestedPrice;

    dispatch(approvePriceUpdate({ adminSetPrice: finalPrice, id }));
    alert("Requested Price is set by Admin successfully");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleBulkPriceUpdate = () => {
    const selectedIds = Object.keys(checkedNames).filter(
      (id) => checkedNames[id]
    );

    if (selectedIds.length === 0) {
      alert("Please select at least one service.");
      return;
    }

    selectedIds.forEach((id) => {
      const record = filteredServices.find((item) => item._id === id);
      if (!record) return;

      const editedPrice = editedPrices[id];

      const finalPrice =
        editedPrice !== undefined && editedPrice !== 0
          ? editedPrice
          : record.requestedPrice;

      dispatch(approvePriceUpdate({ adminSetPrice: finalPrice, id }));
    });

    alert("Prices updated for selected services.");

    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
            value={
              editedPrices[record._id] !== undefined
                ? editedPrices[record._id]
                : text || ""
            }
            onChange={(e) => handlePriceChange(record._id, e.target.value)}
          />
          <button
            onClick={() => handlePriceUpdate(record._id)}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Approve
          </button>
          <Button type="primary" onClick={handleBulkPriceUpdate}>
            Approve Selected Prices
          </Button>
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
      {/* Header Section */}
      <div className="p-4 text-lg font-semibold text-gray-800 border-b">
        Salon Service List
      </div>

      {/* SearchBar */}
      <ServiceSearchBar onSearch={handleSearch} />
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
            total: total,
            onChange: (page) =>
              setSearchParams({
                page_no: page.toString(),
                categoryId: categoryIdFilter,
                name: nameFilter,
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
