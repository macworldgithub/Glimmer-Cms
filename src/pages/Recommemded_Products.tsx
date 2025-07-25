// import { Table, Modal, InputNumber, message, Space, Button, Row, Col } from 'antd';
// import { useEffect, useMemo, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../store/store';
// import { deleteRecommendedProductOfSalon, getAllRecommendedProducts } from '../api/service/api';
// import { updateRateOfSalon } from '../api/service/api';

// interface TableData {
//   _id: string;
//   rate: number;
//   productId: string;
//   soldUnits: number;
//   quantity: number | string;
//   price: number | string;
//   salonCut: number | string;
//   saleRecords: { soldAt: string, quantity: number, price: number, salonCut: number }[]; // Add saleRecords to store sales data
// }

// const pageSize = 10;

// const Recommemded_Products = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const role = useSelector((state: RootState) => state.Login.role);

//   const page = parseInt(new URLSearchParams(location.search).get('page_no') || '1');
//   const salonId = new URLSearchParams(location.search).get('salonId') || '';

//   const [data, setData] = useState<TableData[]>([]);
//   const [total, setTotal] = useState(0);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedSalonId, setSelectedSalonId] = useState<string | null>(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
//   const [newRate, setNewRate] = useState<number | null>(null);

//   const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
//   const [selectedSaleRecords, setSelectedSaleRecords] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (salonId) {
//         const res: any = await dispatch(getAllRecommendedProducts(salonId));
//         if (res.payload) {
//           const flattened = res.payload.flatMap((entry: any) =>
//             entry.productList.map((product: any) => {
//               const firstSale = product.saleRecords[0] || {};
//               return {
//                 productId: product.productId,
//                 productName: product.productName,
//                 rate: product.rate,
//                 soldUnits: product.soldUnits,
//                 quantity: firstSale.quantity || '-',
//                 price: firstSale.price || '-',
//                 salonCut: firstSale.salonCut || '-',
//                 saleRecords: product.saleRecords || []  // Store the saleRecords for later use
//               };
//             })
//           );
//           setData(flattened);
//           setTotal(flattened.length);
//         }
//       }
//     };
//     fetchData();
//   }, [dispatch, salonId]);

//   const handlePageChange = (newPage: number) => {
//     navigate(`?page_no=${newPage}`);
//   };

//   const handleUpdate = (record: TableData) => {
//     setSelectedSalonId(salonId);
//     setSelectedProductId(record.productId);
//     setIsModalOpen(true);
//   };

//   const handleDelete = (productId: string) => {
//     setSelectedSalonId(salonId);
//     setSelectedProductId(productId);
//     setIsModalVisible(true); // Open the modal
//   };

//   const handleModalOk = async () => {
//     if (selectedSalonId && selectedProductId) {
//       try {
//         await deleteRecommendedProductOfSalon(selectedSalonId, selectedProductId);
//         message.success('Product deleted successfully!');
//         setIsModalVisible(false);
//         window.location.reload();
//       } catch (error: any) {
//         message.error(`Failed to delete product: ${error.message}`);
//         setIsModalVisible(false);
//       }
//     }
//   };

//   const handleModalCancel = () => {
//     setIsModalVisible(false);
//   };

//   const handleSubmitRateUpdate = async () => {
//     if (!selectedSalonId || newRate <= 0) {
//       message.error("Please enter a valid rate.");
//       return;
//     }

//     const res = await dispatch(updateRateOfSalon({ salonId: selectedSalonId, productId: selectedProductId, newRate }));
//     if (res.meta.requestStatus === 'fulfilled') {
//       message.success("Rate updated successfully.");
//       setIsModalOpen(false);
//       window.location.reload();
//     } else {
//       message.error("Failed to update rate.");
//     }
//   };

//   const handleViewDetails = (record: TableData) => {
//     setSelectedSaleRecords(record.saleRecords);
//     setIsDetailsModalVisible(true);
//   };

//   const handleDetailsModalCancel = () => {
//     setIsDetailsModalVisible(false);
//   };

//   const columns = useMemo(() => [
//     {
//       title: 'Product Id',
//       dataIndex: 'productId',
//       key: 'productId',
//     },
//     {
//       title: 'Product Name',
//       dataIndex: 'productName',
//       key: 'productName',
//     },
//     {
//       title: 'Price',
//       dataIndex: 'price',
//       key: 'price',
//     },
//     {
//       title: 'Commission Rate',
//       dataIndex: 'rate',
//       key: 'rate',
//     },
//     {
//       title: 'Salon Commission in PKR',
//       dataIndex: 'salonCut',
//       key: 'salonCut',
//     },
//     {
//       title: 'Unit Sold',
//       dataIndex: 'soldUnits',
//       key: 'soldUnits',
//     },
//     {
//       title: 'Total Earning',
//       key: 'totalEarning',
//       render: (_: any, record: any) => {
//         const salonCut = parseFloat(record.salonCut);
//         const soldUnits = parseFloat(record.soldUnits);
//         const total = isNaN(salonCut) || isNaN(soldUnits) ? '-' : (salonCut * soldUnits).toFixed(2);
//         return `${total}`;
//       }
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: any, record: TableData) => (
//         <Space>
//           <Button type="primary" onClick={() => handleViewDetails(record)}>
//             View Details
//           </Button>
//           {role === "super_admin" && (
//             <><Button onClick={() => handleUpdate(record)} className="text-blue-500 hover:underline">
//               Update
//             </Button><Button
//               onClick={() => handleDelete(record.productId)}
//               className="text-red-500 hover:underline"
//             >
//                 Delete
//               </Button></>
//           )}
//         </Space>
//       ),
//     },
//   ], [role]);

//   return (
//     <div className="p-6 bg-white min-h-screen">
//       <h1 className="text-2xl font-bold mb-4">All Recommended Products</h1>

//       <div className="overflow-x-auto shadow-lg">
//         <Table
//           columns={columns}
//           dataSource={data}
//           rowKey={(record) => record.productId}
//           pagination={{
//             current: page,
//             pageSize,
//             total,
//             onChange: handlePageChange,
//           }}
//           className="border-t"
//           scroll={{ x: 1000 }}
//         />
//       </div>

//       <Modal
//         title="Update Salon Rate"
//         open={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         onOk={handleSubmitRateUpdate}
//         okText="Submit"
//       >
//         <label className="block mb-2 font-semibold">Enter New Rate:</label>
//         <InputNumber
//           style={{ width: '100%' }}
//           value={newRate}
//           onChange={(value) => setNewRate(value)}
//         />
//       </Modal>

//       <Modal
//         title="Confirm Deletion"
//         visible={isModalVisible}
//         onOk={handleModalOk}
//         onCancel={handleModalCancel}
//         okText="Yes"
//         cancelText="No"
//       >
//         <p>Are you sure you want to delete this recommended product for this salon?</p>
//       </Modal>

//       {/* Modal for Viewing Sale Records */}
//       <Modal
//         title="Sale Records"
//         visible={isDetailsModalVisible}
//         onCancel={handleDetailsModalCancel}
//         footer={null}
//         width={800}
//       >
//         <div className="space-y-4">
//           <Row gutter={[16, 16]} className="border-b pb-2 mb-2">
//             <Col span={6}><strong>Sold At</strong></Col>
//             <Col span={6}><strong>Quantity</strong></Col>
//             <Col span={6}><strong>Price</strong></Col>
//             <Col span={6}><strong>Salon Cut</strong></Col>
//           </Row>

//           {selectedSaleRecords.length > 0 ? (
//             selectedSaleRecords.map((record, index) => (
//               <div
//                 key={index}
//                 className="p-4 rounded-lg border border-gray-200 hover:shadow transition duration-200"
//                 style={{ backgroundColor: "#fafafa" }}
//               >
//                 <Row gutter={[16, 16]}>
//                   <Col span={6}>
//                     <div className="text-gray-700">{new Date(record.soldAt).toLocaleString()}</div>
//                   </Col>
//                   <Col span={6}>
//                     <div className="text-gray-700">{record.quantity}</div>
//                   </Col>
//                   <Col span={6}>
//                     <div className="text-gray-700">{record.price}</div>
//                   </Col>
//                   <Col span={6}>
//                     <div className="text-gray-700">{record.salonCut}%</div>
//                   </Col>
//                 </Row>
//               </div>
//             ))
//           ) : (
//             <div className="text-gray-500 italic">No records found for this product.</div>
//           )}
//         </div>

//       </Modal>
//     </div>
//   );
// };

// export default Recommemded_Products;

import { Table, Modal, InputNumber, message, Space, Button, Row, Col } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { deleteRecommendedProductOfSalon, getAllRecommendedProducts, getRecommendedProducts} from '../api/service/api';
import { updateRateOfSalon } from '../api/service/api';

interface TableData {
  _id: string;
  rate: number;
  productId: string;
  productName: string;
  soldUnits: number;
  quantity: number | string;
  price: number | string;
  salonCut: number | string;
  saleRecords: { soldAt: string, quantity: number, price: number, salonCut: number }[];
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

  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedSaleRecords, setSelectedSaleRecords] = useState<any[]>([]);

 useEffect(() => {
    const fetchData = async () => {
      if (salonId) {
        const res: any = await dispatch(getRecommendedProducts(salonId));
        if (res.payload) {
          const products = res.payload.flatMap((entry: any) =>
            entry.productList.map((product: any) => {
              const price = product.price || 0;
              const rate = product.rate || 0;
              const salonCut = price * (rate / 100); // Calculate commission in PKR
              return {
                _id: product._id || product.productId,
                productId: product.productId,
                productName: product.productName,
                rate: rate,
                soldUnits: product.soldUnits,
                quantity: product.quantity || '-',
                price: price || '-',
                salonCut: salonCut || '-',
                saleRecords: product.saleRecords || [],
              };
            })
          );
          setData(products);
          setTotal(products.length);
        }
      }
    };
    fetchData();
  }, [dispatch, salonId]);

  const handlePageChange = (newPage: number) => {
    navigate(`?page_no=${newPage}`);
  };

  const handleUpdate = (record: TableData) => {
    setSelectedSalonId(salonId);
    setSelectedProductId(record.productId);
    setIsModalOpen(true);
  };

  const handleDelete = (productId: string) => {
    setSelectedSalonId(salonId);
    setSelectedProductId(productId);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    if (selectedSalonId && selectedProductId) {
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
    if (!selectedSalonId || newRate === null || newRate <= 0) {
      message.error("Please enter a valid rate.");
      return;
    }

    const res = await dispatch(updateRateOfSalon({ salonId: selectedSalonId, productId: selectedProductId, newRate }));
    if (res.meta.requestStatus === 'fulfilled') {
      message.success("Rate updated successfully.");
      setIsModalOpen(false);
      window.location.reload();
    } else {
      message.error("Failed to update rate.");
    }
  };

  const handleViewDetails = (record: TableData) => {
    setSelectedSaleRecords(record.saleRecords);
    setIsDetailsModalVisible(true);
  };

  const handleDetailsModalCancel = () => {
    setIsDetailsModalVisible(false);
  };

  const columns = useMemo(() => [
    {
      title: 'Product Id',
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number | string) => (price === '-' ? '-' : `${price}`),
    },
    {
      title: 'Commission Rate',
      dataIndex: 'rate',
      key: 'rate',
    },
    {
      title: 'Salon Commission in PKR',
      dataIndex: 'salonCut',
      key: 'salonCut',
      render: (salonCut: number | string) => (salonCut === '-' ? '-' : `PKR ${salonCut}`),
    },
    {
      title: 'Unit Sold',
      dataIndex: 'soldUnits',
      key: 'soldUnits',
    },
    {
      title: 'Total Earning',
      key: 'totalEarning',
      render: (_: any, record: TableData) => {
        const salonCut = parseFloat(String(record.salonCut));
        const soldUnits = parseFloat(String(record.soldUnits));
        const total = isNaN(salonCut) || isNaN(soldUnits) ? '-' : (salonCut * soldUnits).toFixed(2);
        return `PKR ${total}`;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: TableData) => (
        <Space>
          <Button type="primary" onClick={() => handleViewDetails(record)}>
            View Details
          </Button>
          {role === "super_admin" && (
            <>
              <Button onClick={() => handleUpdate(record)} className="text-blue-500 hover:underline">
                Update
              </Button>
              <Button
                onClick={() => handleDelete(record.productId)}
                className="text-red-500 hover:underline"
              >
                Delete
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ], [role]);

  return (
    // <div className="p-6 bg-white min-h-screen">
    //   <h1 className="text-2xl font-bold mb-4">All Recommended Products</h1>

    //   <div className="overflow-x-auto shadow-lg">
    //     <Table
    //       columns={columns}
    //       dataSource={data}
    //       rowKey={(record) => record.productId}
    //       pagination={{
    //         current: page,
    //         pageSize,
    //         total,
    //         onChange: handlePageChange,
    //       }}
    //       className="border-t"
    //       scroll={{ x: 1000 }}
    //     />
    //   </div>
      <div className="p-6 bg-white min-h-screen" style={{ minWidth: '1000px' }}>
            <h1 className="text-2xl font-bold mb-4">All Recommended Products</h1>
            <div className="overflow-x-auto md:overflow-x-hidden lg:overflow-x-auto" style={{ width: '100%' }}>
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
                    scroll={{ x: 'max-content' }}
                    className="border-t"
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

      <Modal
        title="Sale Records"
        visible={isDetailsModalVisible}
        onCancel={handleDetailsModalCancel}
        footer={null}
        width={800}
      >
        <div className="space-y-4">
          <Row gutter={[16, 16]} className="border-b pb-2 mb-2">
            <Col span={6}><strong>Sold At</strong></Col>
            <Col span={6}><strong>Quantity</strong></Col>
            <Col span={6}><strong>Price</strong></Col>
            <Col span={6}><strong>Salon Cut</strong></Col>
          </Row>

          {selectedSaleRecords.length > 0 ? (
            selectedSaleRecords.map((record, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 hover:shadow transition duration-200"
                style={{ backgroundColor: "#fafafa" }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={6}>
                    <div className="text-gray-700">{new Date(record.soldAt).toLocaleString()}</div>
                  </Col>
                  <Col span={6}>
                    <div className="text-gray-700">{record.quantity}</div>
                  </Col>
                  <Col span={6}>
                    <div className="text-gray-700">{record.price === '-' ? '-' : `${record.price}`}</div>
                  </Col>
                  <Col span={6}>
                    <div className="text-gray-700">{record.salonCut === '-' ? '-' : `${record.salonCut}%`}</div>
                  </Col>
                </Row>
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">No records found for this product.</div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Recommemded_Products;