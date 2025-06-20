// import { useState, useEffect, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Table, message } from 'antd';
// import { AppDispatch, RootState } from '../store/store';
// import { getAllProducts, getProductRatings } from '../api/products/api';

// interface RatingData {
//   _id: string;
//   rating: number;
//   customer: { name: string; email: string };
//   createdAt: string;
//   productId?: string;
//   productName?: string;
// }

// const pageSize = 8;

// const StoreReviews = () => {
//   console.log('working')
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [ratings, setRatings] = useState<RatingData[]>([]);
//   const [total, setTotal] = useState(0);
//   const token = useSelector((state: RootState) => state.Login.token);
//   const role = useSelector((state: RootState) => state.Login.role);
//   const storeId = useSelector((state: RootState) => state.Login._id);

//   const page = parseInt(new URLSearchParams(location.search).get('page_no') || '1');

//   const fetchRatings = async () => {
//     console.log("fetch rating")
//     console.log(storeId)
//     if (role !== 'store') {
//       message.error('Access denied. Store role only.');
//       navigate('/E_Dashboard');
//       return;
//     }

//     if (!storeId) {
//       message.error('Store ID not found.');
//       return;
//     }

//     try {
//       // Fetch store's products
//       const productsResult = await dispatch(
//         getAllProducts({ page_no: page, storeId })
//       ).unwrap();
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
//       setTotal(totalProducts);
//     } catch (error: any) {
//       message.error(error || 'Failed to fetch reviews');
//     }
//   };

//   useEffect(() => {
//     if (token && storeId) {
//       fetchRatings();
//     }
//   }, [page, token, role, storeId, dispatch]);

//   const handlePageChange = (page: number) => {
//     navigate(`?page_no=${page}`);
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
//     ],
//     []
//   );

//   return (
//     <div className="p-6 bg-white min-h-screen">
//       <h1 className="text-2xl font-bold mb-4">Store Reviews</h1>
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
//     </div>
//   );
// };

// export default StoreReviews;
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, message, Spin } from 'antd';
import { AppDispatch, RootState } from '../store/store';
import { getStoreRatedProducts } from '../api/products/api';

interface RatingData {
  _id: string;
  rating: number;
  customer: { name: string; email: string };
  createdAt: string;
  productId?: string;
  productName?: string;
}

const pageSize = 8;

const StoreReviews = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [ratings, setRatings] = useState<RatingData[]>([]);
  const [totalRated, setTotalRated] = useState(0);
  const [loading, setLoading] = useState(false); // Add loading state
  const token = useSelector((state: RootState) => state.Login.token);
  const role = useSelector((state: RootState) => state.Login.role);
  const storeId = useSelector((state: RootState) => state.Login._id);

  const page = parseInt(new URLSearchParams(location.search).get('page_no') || '1');

  const fetchRatings = async () => {
    if (role !== 'store') {
      message.error('Access denied. Store role only.');
      navigate('/E_Dashboard');
      return;
    }

    if (!storeId) {
      message.error('Store ID not found.');
      return;
    }

    setLoading(true); // Set loading to true before fetching
    try {
      const result = await dispatch(getStoreRatedProducts({ page_no: page, page_size: pageSize })).unwrap();
      console.log('Raw API response (order check):', result.products.flatMap(p => p.ratings.map(r => ({ _id: r._id, createdAt: r.createdAt }))));

      const allRatings: RatingData[] = result.products
        .flatMap((product: any) =>
          (product.ratings || []).map((rating: any) => {
            let ratingId = '';
            if (typeof rating._id === 'string' && /^[0-9a-fA-F]{24}$/.test(rating._id)) {
              ratingId = rating._id;
            } else if (rating._id && typeof rating._id === 'object' && rating._id.$oid && /^[0-9a-fA-F]{24}$/.test(rating._id.$oid)) {
              ratingId = rating._id.$oid;
            } else if (rating._id && typeof rating._id.toString === 'function') {
              const idStr = rating._id.toString();
              if (/^[0-9a-fA-F]{24}$/.test(idStr)) {
                ratingId = idStr;
              }
            }
            
            if (!ratingId) {
              console.warn('Invalid ratingId format:', rating._id);
              return null;
            }

            let productId = '';
            if (typeof product.productId === 'string' && /^[0-9a-fA-F]{24}$/.test(product.productId)) {
              productId = product.productId;
            } else if (product.productId && typeof product.productId === 'object' && product.productId.$oid && /^[0-9a-fA-F]{24}$/.test(product.productId.$oid)) {
              productId = product.productId.$oid;
            } else if (product.productId && typeof product.productId.toString === 'function') {
              const idStr = product.productId.toString();
              if (/^[0-9a-fA-F]{24}$/.test(idStr)) {
                productId = idStr;
              }
            }

            if (!productId) {
              console.warn('Invalid productId format:', product.productId);
              return null;
            }

            return {
              _id: ratingId,
              rating: rating.rating,
              customer: rating.customer || { name: 'Unknown', email: 'unknown@email.com' },
              createdAt: rating.createdAt,
              productId: productId,
              productName: product.productName || 'Unnamed Product',
            };
          })
        )
        .filter((rating) => rating !== null);

      // Sort ratings locally by createdAt in descending order
      const sortedRatings = [...allRatings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      console.log('Processed ratings (order check):', sortedRatings.map(r => ({ _id: r._id, createdAt: r.createdAt })));
      setRatings(sortedRatings);
      setTotalRated(result.total);
    } catch (error: any) {
      console.error('Error in fetchRatings:', error);
      message.error(error.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    if (token && storeId) {
      fetchRatings();
    }
  }, [page, token, role, storeId, dispatch]);

  const handlePageChange = (page: number) => {
    navigate(`?page_no=${page}`);
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
    ],
    []
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Store Reviews</h1>
      <div className="overflow-x-auto shadow-lg">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={ratings}
            rowKey={(record) => record._id}
            pagination={{
              current: page,
              pageSize,
              total: totalRated,
              onChange: handlePageChange,
              showSizeChanger: false, // Optional: Disable page size changer for simplicity
            }}
            className="border-t"
            scroll={{ x: 1000 }}
          />
        )}
      </div>
    </div>
  );
};

export default StoreReviews;