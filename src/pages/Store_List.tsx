import { Table } from "antd";
import "antd/dist/reset.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllStores } from "../api/store/api";
import { RootState } from "../store/store";
import DeleteStoreModal from "../components/DeleteStoreModal"

interface TableData {
  store_name: string;
  description: string;
  email: string;
  _id: string;
}

const Store_List = () => {
  const dispatch = useDispatch();
  const [selectedStore, setSelectedStore] = useState<TableData | null>(null);
  // const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; 

  useEffect(() => {
    //@ts-ignore
    dispatch(getAllStores({ page_no: currentPage }));
  }, [dispatch, currentPage]);

  const storeList = useSelector((state: RootState) => state.AllStores.stores);
console.log("Store List Data:", storeList);

  const handleUpdate = (record: TableData) => {
  };

  const handleDelete = (record: TableData) => {
    setSelectedStore(record);
    setIsDeleteModalVisible(true);
  };

  // Table columns
  const columns = [
    {
      title: "  Store_name",
      dataIndex: "store_name",
      key: "store_name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: TableData) => (
        <div className="flex space-x-2">
          <button onClick={() => handleUpdate(record)} className="text-blue-500 hover:underline">
            Update
          </button>
          <button onClick={() => handleDelete(record)} className="text-red-500 hover:underline">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="p-4 text-lg font-semibold text-gray-800 border-b">
        Stores List
      </div>
      {selectedStore && (
        <DeleteStoreModal
          visible={isDeleteModalVisible}
          store={selectedStore}
          onClose={() => setIsDeleteModalVisible(false)}
          page={currentPage}
        />
      )}

      {/* Table Section */}
      <div className="overflow-x-auto shadow-lg">
        <Table
          columns={columns}
          //@ts-ignore
          // dataSource={storeList}
          dataSource={storeList || []}


          pagination={{
            current: currentPage,
            pageSize: pageSize,
            //@ts-ignore
            total: storeList?.total,
            onChange: (page) => setCurrentPage(page),
          }}
          className="border-t"
          scroll={{ x: 1000 }}
        />
      </div>
    </div>
  );
};

export default Store_List;

