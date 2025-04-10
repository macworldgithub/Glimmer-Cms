import { Table, message } from 'antd';
import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllSalons } from '../api/service/api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';


interface TableData {
  salon_name: string;
  email: string;
  address: string;
  about: string;
  contact_number: number;
  openingHour: string;
  closingHour: string;
}

const pageSize = 8;

const All_Salons_Bookings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  // const role = useSelector((state: RootState) => state.Login.role);
  // console.log(role);

  const page = parseInt(new URLSearchParams(location.search).get('page_no') || '1');

  const fetchData = async () => {
    try {
      const result = await dispatch(getAllSalons(page)).unwrap();
      setData(result.salons);
      setTotal(result.total);
    } catch (error) {
      message.error('Failed to fetch salons');
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handlePageChange = (page: number) => {
    navigate(`?page_no=${page}`);
  };

  const handleUpdate = (record: TableData) => {
   console.log(record);
  };

  // const handleDelete = (record: TableData) => {
  //   setSelectedSalon(record);
  //   setIsDeleteModalVisible(true);
  // };

  const formatTime = (timeStr) => {
    if (!timeStr) return '-';
  
    const [hourStr, minute = "00"] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const isPM = hour >= 12;
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const suffix = isPM ? 'pm' : 'am';
    return `${formattedHour}:${minute} ${suffix}`;
  };
  
  const columns = useMemo(() => [
    {
      title: 'Salon Name',
      dataIndex: 'salon_name',
      key: 'salon_name',
      render: (_: any, record: any) => (
        <button
          onClick={() => navigate(`/SuperAdmin_Booking_List?salonId=${record._id}`)}
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
          {/* {role === "super_admin" && (
            <button
              onClick={() => handleDelete(record)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          )} */}
        </div>
      ),
    },
  ], []);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">All Salons Bookings</h1>

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
};

export default All_Salons_Bookings;
