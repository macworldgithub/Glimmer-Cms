import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Table, message } from 'antd';
import { getAllStores } from '../api/service/api';
import { AppDispatch } from '../store/store';
import StoreSearchBar from '../components/StoreSearchBar';


interface StoreData {
    _id: string;
    store_name: string;
    vendor_name: string;
    description: string;
    store_contact_email: string;
    country: string;
    address: string;
    store_image: string | null;
    created_at: string;
}

const pageSize = 8;

const All_Stores_Product = () => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [stores, setStores] = useState<StoreData[]>([]);
    const [total, setTotal] = useState(0);

    const page = parseInt(new URLSearchParams(location.search).get('page_no') || '1');
    const store_name = new URLSearchParams(location.search).get('store_name') || undefined;

    const fetchData = async () => {
        try {
            const result = await dispatch(getAllStores({ page_no: page, store_name })).unwrap();
            setStores(result.stores);
            setTotal(result.total);
        } catch (error) {
            message.error('Failed to fetch stores');
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, store_name]);

    const handlePageChange = (page: number) => {
        navigate(`?page_no=${page}`);
    };

    const handleSearch = (filters: { store_name?: string }) => {
        const updatedParams: Record<string, string> = {};

        if (filters.store_name) {
            updatedParams.store_name = filters.store_name;
        }

        updatedParams.page = "1";

        setSearchParams(updatedParams);
    };

    const columns = useMemo(() => [
        {
            title: 'Store Name',
            dataIndex: 'store_name',
            key: 'store_name',
            render: (_: any, record: StoreData) => (
                <button
                    onClick={() => navigate(`/Product_List?store=${record._id}`)}
                    className="text-orange-500 hover:underline"
                >
                    {record.store_name}
                </button>
            ),
        },
        {
            title: 'Vendor Name',
            dataIndex: 'vendor_name',
            key: 'vendor_name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Contact Email',
            dataIndex: 'store_contact_email',
            key: 'store_contact_email',
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: StoreData) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => console.log(record)}  // Update button can be used to modify store details
                        className="text-blue-500 hover:underline"
                    >
                        Update
                    </button>
                    {/* Optionally, add a Delete button */}
                </div>
            ),
        },
    ], []);

    return (
        <div className="p-6 bg-white min-h-screen">
            <h1 className="text-2xl font-bold mb-4">All Stores</h1>
            <StoreSearchBar onSearch={handleSearch} />

            <div className="overflow-x-auto shadow-lg">
                <Table
                    columns={columns}
                    dataSource={stores}
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

export default All_Stores_Product;
