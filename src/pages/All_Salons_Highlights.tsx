import { Table, message, Select } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllSalonsHighlights } from '../api/service/api';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';

const { Option } = Select;

const All_Salons_Highlights = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<any[]>([]);
  const [allHighlights, setAllHighlights] = useState({
    newToGlimmer: [],
    trendingSalon: [],
    recommendedSalon: [],
  });

  const currentFilter = searchParams.get('filter') || 'new-to-glimmer';

  const fetchData = async () => {
    try {
      const result = await dispatch(getAllSalonsHighlights({})).unwrap();
      setAllHighlights(result);
      applyFilter(currentFilter, result);
    } catch (error) {
      message.error('Failed to fetch salon highlights');
    }
  };

  const applyFilter = (filter: string, highlights = allHighlights) => {
    switch (filter) {
      case 'new-to-glimmer':
        setData(highlights.newToGlimmer || []);
        break;
      case 'trending-salon':
        setData(highlights.trendingSalon || []);
        break;
      case 'recommended-salon':
        setData(highlights.recommendedSalon || []);
        break;
      default:
        setData([]);
    }
  };

  const handleFilterChange = (value: string) => {
    setSearchParams({ filter: value });
    applyFilter(value);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilter(currentFilter);
  }, [currentFilter]);

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '-';
    const [hourStr, minute = '00'] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const isPM = hour >= 12;
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minute} ${isPM ? 'pm' : 'am'}`;
  };

  const columns = useMemo(() => [
    {
      title: 'Salon Name',
      dataIndex: 'salon_name',
      key: 'salon_name',
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
      render: formatTime,
    },
    {
      title: 'Closing Hours',
      dataIndex: 'closingHour',
      key: 'closingHour',
      render: formatTime,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ], [navigate]);

  return (
  <div className="p-6 bg-white min-h-screen" style={{ minWidth: '1000px' }}>
      <h1 className="text-2xl font-bold mb-4">Salon Highlights</h1>

      <div className="mb-4 flex items-center gap-4">
        <span className="font-semibold">Filter by:</span>
        <Select
          value={currentFilter}
          style={{ width: 220 }}
          onChange={handleFilterChange}
        >
          <Option value="new-to-glimmer">New To Glimmer</Option>
          <Option value="trending-salon">Trending Salon</Option>
          <Option value="recommended-salon">Recommended Salon</Option>
        </Select>
      </div>

  <div className="overflow-x-auto md:overflow-x-hidden lg:overflow-x-auto" style={{ width: '100%' }}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record) => record._id}
          pagination={false}
          className="border-t"
        />
      </div>
    </div>
  );
};

export default All_Salons_Highlights;
