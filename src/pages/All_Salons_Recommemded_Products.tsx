import { Table, message } from 'antd';
import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getAllSalons } from '../api/service/api';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import SalonSearchBar from '../components/SalonSearchBar';

const pageSize = 8;

const All_Salons_Recommemded_Products = () => {const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const page = parseInt(new URLSearchParams(location.search).get('page_no') || '1');
  const salon_name = new URLSearchParams(location.search).get('salon_name') || undefined;

  const fetchData = async () => {
    try {
      const result = await dispatch(getAllSalons({ page_no: page, salon_name })).unwrap();
      setData(result.salons);
      setTotal(result.total);
    } catch (error) {
      message.error('Failed to fetch salons');
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, salon_name]);

  const handlePageChange = (page: number) => {
    navigate(`?page_no=${page}`);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '-';
  
    const [hourStr, minute = "00"] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const isPM = hour >= 12;
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const suffix = isPM ? 'pm' : 'am';
    return `${formattedHour}:${minute} ${suffix}`;
  };

  const handleSearch = (filters: { salon_name?: string }) => {
    const updatedParams: Record<string, string> = {};

    if (filters.salon_name) {
      updatedParams.salon_name = filters.salon_name;
    }

    updatedParams.page = "1"; 

    setSearchParams(updatedParams);
  };

  
  const columns = useMemo(() => [
    {
      title: 'Salon Name',
      dataIndex: 'salon_name',
      key: 'salon_name',
      render: (_: any, record: any) => (
        <button
          onClick={() => navigate(`/Recommemded_Products?salonId=${record._id}`)}
          className="text-orange-500 hover:underline"
        >
          {record.salon_name}
        </button>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Opening Hours',
      dataIndex: 'openingHour',
      key: 'openingHour',
      render: (time) => formatTime(time),
    },
    {
      title: 'Closing Hours',
      dataIndex: 'closingHour',
      key: 'closingHour',
      render: (time) => formatTime(time),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ], []);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">All Salons Recommended Products</h1>
      <SalonSearchBar onSearch={handleSearch} />

      <div className="overflow-x-auto shadow-lg">
        <Table
          columns={columns}
          dataSource={data}
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
}

export  default All_Salons_Recommemded_Products;