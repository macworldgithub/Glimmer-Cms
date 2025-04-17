import { Table, Modal, InputNumber, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { deleteRecommendedProductOfSalon, getAllRecommendedProducts } from '../api/service/api';
import { updateRateOfSalon } from '../api/service/api';

interface TableData {
  _id: string;
  rate: number;
  productId: string;
  soldUnits: number;
  quantity: number | string;
  price: number | string;
  salonCut: number | string;
}

const pageSize = 10;

const Recommemded_Products = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.Login.role);

  const page = parseInt(new URLSearchParams(location.search).get('page_no') || '1');
  const salonId = new URLSearchParams(location.search).get('salonId') || '';

  const [data, setData] = useState<TableData[]>([]);
  const [total, setTotal] = useState(0);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSalonId, setSelectedSalonId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [newRate, setNewRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res: any = await dispatch(getAllRecommendedProducts(salonId));
      if (res.payload) {
        const flattened = res.payload.flatMap((entry: any) =>
          entry.productList.map((product: any) => {
            const firstSale = product.saleRecords[0] || {};
            return {
              rate: entry.rate,
              productId: product.productId,
              soldUnits: product.soldUnits,
              quantity: firstSale.quantity || '-',
              price: firstSale.price || '-',
              salonCut: firstSale.salonCut || '-',
            };
          })
        );
        setData(flattened);
        setTotal(flattened.length);
      }
    };
    fetchData();
  }, [dispatch, salonId]);

  const handlePageChange = (newPage: number) => {
    navigate(`?page_no=${newPage}`);
  };

  const handleUpdate = (record: TableData) => {
    setSelectedSalonId(salonId);
    setIsModalOpen(true);
  };

  const handleDelete = (productId: string) => {
    console.log(salonId);
    console.log(productId)
    setSelectedSalonId(salonId);
    setSelectedProductId(productId);
    setIsModalVisible(true); // Open the modal
  };

  const handleModalOk = async () => {
    console.log("111")
    if (selectedSalonId && selectedProductId) {
      console.log("222")
      try {
        await deleteRecommendedProductOfSalon(selectedSalonId, selectedProductId);
        message.success('Product deleted successfully!');
        setIsModalVisible(false);
        window.location.reload();
      } catch (error: any) {
        message.error(`Failed to delete product: ${error.message}`);
        setIsModalVisible(false);
      }
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmitRateUpdate = async () => {
    if (!selectedSalonId || newRate <= 0) {
      message.error("Please enter a valid rate.");
      return;
    }

    const res = await dispatch(updateRateOfSalon({ salonId: selectedSalonId, newRate }));
    if (res.meta.requestStatus === 'fulfilled') {
      message.success("Rate updated successfully.");
      setIsModalOpen(false);
      window.location.reload();
    } else {
      message.error("Failed to update rate.");
    }
  };

  const columns = useMemo(() => [
    {
      title: 'Product Id',
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: 'Sold Units',
      dataIndex: 'soldUnits',
      key: 'soldUnits',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total Revenue',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
    },
    {
      title: 'Salon Commission (%)',
      dataIndex: 'salonCut',
      key: 'salonCut',
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: TableData) => (
        <div className="flex space-x-2">
          <button onClick={() => handleUpdate(record)} className="text-blue-500 hover:underline">
            Update
          </button>
          {role === "super_admin" && (
            <button
              onClick={() => {
                console.log('Delete button clicked for record:', record); 
                handleDelete(record.productId); 
              }}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      ),      
    },
  ], [role]);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">All Recommended Products</h1>

      <div className="overflow-x-auto shadow-lg">
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.productId}
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: handlePageChange,
          }}
          className="border-t"
          scroll={{ x: 1000 }}
        />
      </div>

      <Modal
        title="Update Salon Rate"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmitRateUpdate}
        okText="Submit"
      >
        <label className="block mb-2 font-semibold">Enter New Rate:</label>
        <InputNumber
          style={{ width: '100%' }}
          value={newRate}
          onChange={(value) => setNewRate(value)}
        />
      </Modal>
       <Modal
        title="Confirm Deletion"
        visible={isModalVisible}
        onOk={handleModalOk} 
        onCancel={handleModalCancel} 
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this recommended product for this salon?</p>
      </Modal>
    </div>
  );
};

export default Recommemded_Products;
