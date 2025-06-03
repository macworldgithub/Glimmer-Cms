// import { useState, useEffect, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Button, Table, message, Modal, InputNumber, Form } from 'antd';
// import { AppDispatch, RootState } from '../store/store';
// import { getAllProducts, getProductRatings, updateProductRating } from '../api/products/api';

// interface RatingData {
//   _id: string;
//   rating: number;
//   customer: { name: string; email: string };
//   createdAt: string;
//   productId?: string;
//   productName?: string;
// }

// const pageSize = 8;

// const ManageReviews = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [ratings, setRatings] = useState<RatingData[]>([]);
//   const [total, setTotal] = useState(0);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedRating, setSelectedRating] = useState<RatingData | null>(null);
//   const [newRating, setNewRating] = useState<number | null>(null);
//   const [form] = Form.useForm();
//   const token = useSelector((state: RootState) => state.Login.token);
//   const role = useSelector((state: RootState) => state.Login.role);

//   const page = parseInt(new URLSearchParams(location.search).get('page_no') || '4');

//   const fetchRatings = async () => {
//     if (role !== 'super_admin') {
//       message.error('Access denied. Super Admin only.');
//       navigate('/dashboard');
//       return;
//     }

//     try {
//       // Fetch all products to get their IDs and names
//       const productsResult = await dispatch(getAllProducts({ page_no: page })).unwrap();
//       const products = productsResult.products;
//       const totalProducts = productsResult.total;

//       // Fetch ratings for each product
//       const ratingsData: RatingData[] = [];
//       for (const product of products) {
//         const ratingsResult = await dispatch(getProductRatings(product._id)).unwrap();
//         const productRatings = ratingsResult.map((rating: any) => ({
//           ...rating,
//           productId: product._id,
//           productName: product.name,
//         }));
//         ratingsData.push(...productRatings);
//       }

//       setRatings(ratingsData);
//       setTotal(totalProducts); // Use product count for pagination
//     } catch (error: any) {
//       message.error(error || 'Failed to fetch reviews');
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchRatings();
//     }
//   }, [page, token, role, dispatch]);

//   const handlePageChange = (page: number) => {
//     navigate(`?page_no=${page}`);
//   };

//   const handleUpdateClick = (rating: RatingData) => {
//     setSelectedRating(rating);
//     setNewRating(rating.rating);
//     setIsModalVisible(true);
//     form.setFieldsValue({ rating: rating.rating });
//   };

//   const handleModalOk = async () => {
//     if (!selectedRating || newRating === null) return;

//     try {
//       await dispatch(
//         updateProductRating({ ratingId: selectedRating._id, rating: newRating })
//       ).unwrap();
//       message.success('Rating updated successfully');
//       setIsModalVisible(false);
//       setSelectedRating(null);
//       setNewRating(null);
//       form.resetFields();
//       fetchRatings(); // Refresh ratings
//     } catch (error: any) {
//       message.error(error || 'Failed to update rating');
//     }
//   };

//   const handleModalCancel = () => {
//     setIsModalVisible(false);
//     setSelectedRating(null);
//     setNewRating(null);
//     form.resetFields();
//   };

//   const columns = useMemo(
//     () => [
//       {
//         title: 'Product Name',
//         dataIndex: 'productName',
//         key: 'productName',
//         render: (text: string, record: RatingData) => (
//           <button
//             onClick={() => navigate(`/Product_List?product=${record.productId}`)}
//             className="text-orange-500 hover:underline"
//           >
//             {text || 'Unknown Product'}
//           </button>
//         ),
//       },
//       {
//         title: 'Customer Name',
//         dataIndex: ['customer', 'name'],
//         key: 'customerName',
//       },
//       {
//         title: 'Rating',
//         dataIndex: 'rating',
//         key: 'rating',
//       },
//       {
//         title: 'Date',
//         dataIndex: 'createdAt',
//         key: 'createdAt',
//         render: (text: string) => new Date(text).toLocaleDateString(),
//       },
//       {
//         title: 'Actions',
//         key: 'actions',
//         render: (_: any, record: RatingData) => (
//           <Button
//             type="link"
//             onClick={() => handleUpdateClick(record)}
//             className="text-blue-500 hover:underline"
//           >
//             Update
//           </Button>
//         ),
//       },
//     ],
//     []
//   );

//   return (
//     <div className="p-6 bg-white min-h-screen">
//       <h1 className="text-2xl font-bold mb-4">Manage Reviews</h1>
//       <div className="overflow-x-auto shadow-lg">
//         <Table
//           columns={columns}
//           dataSource={ratings}
//           rowKey={(record) => record._id}
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
//         title="Update Rating"
//         visible={isModalVisible}
//         onOk={handleModalOk}
//         onCancel={handleModalCancel}
//         okText="Update"
//         cancelText="Cancel"
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             label="Rating (1-5)"
//             name="rating"
//             rules={[
//               { required: true, message: 'Please enter a rating' },
//               { type: 'number', min: 1, max: 5, message: 'Rating must be between 1 and 5' },
//             ]}
//           >
//             <InputNumber
//               min={1}
//               max={5}
//               value={newRating}
//               onChange={(value) => setNewRating(value)}
//               style={{ width: '100%' }}
//             />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default ManageReviews;

import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Table, message, Modal, InputNumber, Form } from 'antd';
import { AppDispatch, RootState } from '../store/store';
import { getAllProducts, getProductRatings, updateProductRating } from '../api/products/api';

interface RatingData {
  _id: string;
  rating: number;
  customer: { name: string; email: string };
  createdAt: string;
  productId?: string;
  productName?: string;
}

const pageSize = 8;

const ManageReviews = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [ratings, setRatings] = useState<RatingData[]>([]);
  const [totalRated, setTotalRated] = useState(0); // Total number of ratings for pagination
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState<RatingData | null>(null);
  const [newRating, setNewRating] = useState<number | null>(null);
  const [form] = Form.useForm();
  const token = useSelector((state: RootState) => state.Login.token);
  const role = useSelector((state: RootState) => state.Login.role);

  const page = parseInt(new URLSearchParams(location.search).get('page_no') || '1');

  const fetchRatings = async () => {
    if (role !== 'super_admin') {
      message.error('Access denied. Super Admin only.');
      navigate('/dashboard');
      return;
    }

    try {
      // Step 1: Fetch page 1 to get total products
      const initialResult = await dispatch(getAllProducts({ page_no: 1 })).unwrap();
      const totalProducts = initialResult.total;
      const productsPage1 = initialResult.products;

      // Step 2: Calculate total pages and fetch all pages
      const totalPages = Math.ceil(totalProducts / pageSize);
      const allProducts: any[] = [...productsPage1]; // Start with page 1 products

      // Fetch remaining pages (2 to totalPages) in a loop
      for (let pageNum = 2; pageNum <= totalPages; pageNum++) {
        const pageResult = await dispatch(getAllProducts({ page_no: pageNum })).unwrap();
        allProducts.push(...pageResult.products);
      }

      // Step 3: Deduplicate products by _id
      const uniqueProducts = Array.from(
        new Map(allProducts.map((product: any) => [product._id, product])).values()
      );

      // Step 4: Fetch ratings for each product concurrently
      const ratingsPromises = uniqueProducts.map(async (product: any) => {
        try {
          const ratingsResult = await dispatch(getProductRatings(product._id)).unwrap();
          return ratingsResult.map((rating: any) => ({
            ...rating,
            productId: product._id,
            productName: product.name,
          }));
        } catch (error) {
          console.error(`Error fetching ratings for product ${product._id}:`, error);
          return [];
        }
      });

      const ratingsArrays = await Promise.all(ratingsPromises);
      let allRatings: RatingData[] = ratingsArrays.flat();

      // Step 5: Filter out records without ratings
      const ratedRatings = allRatings.filter((rating) => rating.rating !== undefined);

      // Step 6: Sort by createdAt (most recent first)
      ratedRatings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Step 7: Paginate only the rated products
      const startIndex = (page - 1) * pageSize;
      const paginatedRatings = ratedRatings.slice(startIndex, startIndex + pageSize);

      setRatings(paginatedRatings);
      setTotalRated(ratedRatings.length); // Paginate based on number of rated products
    } catch (error: any) {
      console.error('Error in fetchRatings:', error);
      message.error(error.message || 'Failed to fetch reviews');
    }
  };

  useEffect(() => {
    if (token) {
      fetchRatings();
    }
  }, [page, token, role, dispatch]);

  const handlePageChange = (page: number) => {
    navigate(`?page_no=${page}`);
  };

  const handleUpdateClick = (rating: RatingData) => {
    setSelectedRating(rating);
    setNewRating(rating.rating);
    setIsModalVisible(true);
    form.setFieldsValue({ rating: rating.rating });
  };

  const handleModalOk = async () => {
    if (!selectedRating || newRating === null) return;

    try {
      await dispatch(
        updateProductRating({ ratingId: selectedRating._id, rating: newRating })
      ).unwrap();
      message.success('Rating updated successfully');
      setIsModalVisible(false);
      setSelectedRating(null);
      setNewRating(null);
      form.resetFields();
      fetchRatings(); // Refresh ratings
    } catch (error: any) {
      message.error(error.message || 'Failed to update rating');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedRating(null);
    setNewRating(null);
    form.resetFields();
  };

  const columns = useMemo(
    () => [
      {
        title: 'Product Name',
        dataIndex: 'productName',
        key: 'productName',
        render: (text: string, record: RatingData) => (
          <button
            onClick={() => navigate(`/Product_List?product=${record.productId}`)}
            className="text-orange-500 hover:underline"
          >
            {text || 'Unknown Product'}
          </button>
        ),
      },
      {
        title: 'Customer Name',
        dataIndex: ['customer', 'name'],
        key: 'customerName',
      },
      {
        title: 'Rating',
        dataIndex: 'rating',
        key: 'rating',
      },
      {
        title: 'Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => new Date(text).toLocaleDateString(),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: RatingData) => (
          <Button
            type="link"
            onClick={() => handleUpdateClick(record)}
            className="text-blue-500 hover:underline"
          >
            Update
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Manage Reviews</h1>
      <div className="overflow-x-auto shadow-lg">
        <Table
          columns={columns}
          dataSource={ratings}
          rowKey={(record) => record._id}
          pagination={{
            current: page,
            pageSize,
            total: totalRated, // Paginate based on rated products only
            onChange: handlePageChange,
          }}
          className="border-t"
          scroll={{ x: 1000 }}
        />
      </div>

      <Modal
        title="Update Rating"
        open={isModalVisible} // Changed from visible to open to fix deprecation warning
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Update"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Rating (1-5)"
            name="rating"
            rules={[
              { required: true, message: 'Please enter a rating' },
              { type: 'number', min: 1, max: 5, message: 'Rating must be between 1 and 5' },
            ]}
          >
            <InputNumber
              min={1}
              max={5}
              value={newRating}
              onChange={(value) => setNewRating(value)}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageReviews;