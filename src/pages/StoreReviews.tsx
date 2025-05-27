import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, message } from 'antd';
import { AppDispatch, RootState } from '../store/store';
import { getAllProducts, getProductRatings } from '../api/products/api';

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
  const [total, setTotal] = useState(0);
  const token = useSelector((state: RootState) => state.Login.token);
  const role = useSelector((state: RootState) => state.Login.role);
  const storeId = useSelector((state: RootState) => state.Login.user?._id);

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

    try {
      // Fetch store's products
      const productsResult = await dispatch(
        getAllProducts({ page_no: page, storeId })
      ).unwrap();
      const products = productsResult.products;
      const totalProducts = productsResult.total;

      // Fetch ratings for each product
      const ratingsData: RatingData[] = [];
      for (const product of products) {
        const ratingsResult = await dispatch(getProductRatings(product._id)).unwrap();
        const productRatings = ratingsResult.map((rating: any) => ({
          ...rating,
          productId: product._id,
          productName: product.name,
        }));
        ratingsData.push(...productRatings);
      }

      setRatings(ratingsData);
      setTotal(totalProducts);
    } catch (error: any) {
      message.error(error || 'Failed to fetch reviews');
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
        <Table
          columns={columns}
          dataSource={ratings}
          rowKey={(record) => record._id}
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
    </div>
  );
};

export default StoreReviews;