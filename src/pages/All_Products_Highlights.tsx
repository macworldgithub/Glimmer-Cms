import { Table, message, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { getAllProductHighlights } from '../api/products/api';

const { Option } = Select;

const All_Products_Highlights = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [searchParams, setSearchParams] = useSearchParams();

    const [data, setData] = useState<any[]>([]);
    const [allHighlights, setAllHighlights] = useState({
        best_seller: [],
        trending_product: [],
        you_must_have_this: [],
    });

    const currentFilter = searchParams.get('filter') || 'best_seller';

    const fetchData = async () => {
        try {
            const result = await dispatch(getAllProductHighlights({})).unwrap();
            setAllHighlights(result);
            applyFilter(currentFilter, result);
        } catch (error) {
            message.error('Failed to fetch product highlights');
        }
    };

    const applyFilter = (filter: string, highlights = allHighlights) => {
        switch (filter) {
            case 'best_seller':
                setData(highlights.best_seller || []);
                break;
            case 'trending_product':
                setData(highlights.trending_product || []);
                break;
            case 'you_must_have_this':
                setData(highlights.you_must_have_this || []);
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

    const columns = [
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
        },
        { title: "Description", dataIndex: "description", key: "description" },
        {
          title: "Price",
          dataIndex: "base_price",
          key: "base_price",
          render: (text: number) => {
            return text.toFixed(2);
          },
        },
        {
          title: "Discounted Price",
          dataIndex: "discounted_price",
          key: "discounted_price",
        },
        { title: "Status", dataIndex: "status", key: "status" },
        { title: "Stock", dataIndex: "quantity", key: "quantity" },
        { title: "Created at", dataIndex: "created_at", key: "created_At" },
      ];
    

    return (
    <div className="p-6 bg-white min-h-screen" style={{ minWidth: '1000px' }}>
            <h1 className="text-2xl font-bold mb-4">Product Highlights</h1>

            <div className="mb-4 flex items-center gap-4">
                <span className="font-semibold">Filter by:</span>
                <Select
                    value={currentFilter}
                    style={{ width: 220 }}
                    onChange={handleFilterChange}
                >
                    <Option value="best_seller">Best Seller</Option>
                    <Option value="trending_product">Trending Product</Option>
                    <Option value="you_must_have_this">You Must Have This</Option>
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

export default All_Products_Highlights;
