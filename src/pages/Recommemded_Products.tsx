import { Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { getAllRecommendedProducts } from '../api/service/api';

const pageSize = 10;

const Recommemded_Products = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();

  const page = parseInt(new URLSearchParams(location.search).get('page_no') || '1');
  const salonId = new URLSearchParams(location.search).get('salonId') || '';

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const res: any = await dispatch(getAllRecommendedProducts(salonId));
      console.log("API Response:", res);
  
      if (res.payload && Array.isArray(res.payload)) {
        const mapped = res.payload.map((product: any) => ({
          productId: product._id,
          name: product.name,
          quantity: product.quantity,
          basePrice: product.base_price,
          discountedPrice: product.discounted_price,
          image: product.image1,
          rate: product.rate_of_salon || 0,
          refOfSalon: product.ref_of_salon || "",
        }));
  
        setData(mapped);
        setTotal(mapped.length);
      }
    };
  
    if (salonId) {
      fetchData();
    }
  }, [dispatch, salonId]);
  

  const handlePageChange = (newPage: number) => {
    navigate(`?page_no=${newPage}`);
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
  ], []);

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
    </div>
  );
};

export default Recommemded_Products;
