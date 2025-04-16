import { Button, Input, Modal, Table, message } from 'antd';
import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllProducts, getAllSalons } from '../api/service/api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { getAllCategories, getAllProductItem, getAllSubcategories } from '../api/category/api';


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

const All_Salons_Services = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDropdownModalVisible, setIsDropdownModalVisible] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<string[]>(['']);
  const [activeProductIndex, setActiveProductIndex] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [productItems, setProductItems] = useState([]);

  const [filterSubcategory, setFilterSubcategory] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState({
    _id: "",
    name: "",
  });
  const [selectedSubcategory, setSelectedSubcategory] = useState({
    _id: "",
    name: "",
  });
  const [selectedProducts, setSelectedProducts] = useState({ _id: "", name: "" });

  const [relatedProducts, setRelatedProducts] = useState<string[]>([]);
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<string[]>([]);
  console.log(selectedRelatedProducts)

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cat = await getAllCategories();
        const sub = await getAllSubcategories();
        const items = await getAllProductItem();

        setCategories(cat);
        setSubcategories(sub);
        setProductItems(items);
      } catch (error) {
        message.error("Failed to fetch category data");
      }
    };

    fetchData();
  }, []);

  const handleSelectCategory = (event: any) => {
    const id = event.target.value;
    const name =
      event.target.options[event.target.selectedIndex].getAttribute(
        "data-name"
      );

    setSelectedCategory((prevCategory) => ({
      ...prevCategory,
      name: name,
      _id: id,
    }));
  };

  const handleSelectSubcategory = (event: any) => {
    const id = event.target.value;
    const name =
      event.target.options[event.target.selectedIndex].getAttribute(
        "data-name"
      );

    setSelectedSubcategory((prevCategory) => ({
      ...prevCategory,
      name: name,
      _id: id,
    }));
  };

  const handleSelectProductItem = async (event: any) => {
    const id = event.target.value;
    const name =
      event.target.options[event.target.selectedIndex].getAttribute(
        "data-name"
      );
    setSelectedProducts((prevCategory) => ({
      ...prevCategory,
      name: name,
      _id: id,
    }));

    try {
      const response = await getAllProducts(
        selectedCategory._id,
        selectedSubcategory._id,
        id
      );

      const products = response?.products?.map((p) => p.name) || [];
      setRelatedProducts(products);
      setSelectedRelatedProducts([]);
    } catch (err) {
      message.error("Failed to load related products");
    }
  };

  useEffect(() => {
    const filteredSubCategories = subcategories.filter(
      (item) => item._id === selectedCategory._id
    );
    setFilterSubcategory(filteredSubCategories);

    console.log("checkk", selectedCategory);
  }, [selectedCategory._id]);

  useEffect(() => {
    // const filteredProducts = productItems.filter((sub) => {
    //   sub?.sub_categories?.filter((item) => item._id === selectedSubcategory);
    // });

    function getSubcategoryItems(data, subCategoryId) {
      for (const category of data) {
        for (const subcategory of category.sub_categories) {
          if (subcategory._id === subCategoryId) {
            return subcategory.items;
          }
        }
      }
      return [];
    }

    const filteredProducts = getSubcategoryItems(
      productItems,
      selectedSubcategory._id
    );

    setFilterProducts(filteredProducts);

  }, [selectedSubcategory._id]);

  const handleConfirmProductSelection = () => {
    if (selectedRelatedProducts.length === 0) return;

    // Calculate how many we can add
    const availableSlots = 10 - recommendedProducts.length;
    const productsToAdd = selectedRelatedProducts.slice(0, availableSlots);

    const updated = [...recommendedProducts, ...productsToAdd];

    setRecommendedProducts(updated);
    setIsDropdownModalVisible(false);
    setActiveProductIndex(null);

    // Clear state
    setSelectedCategory({ _id: "", name: "" });
    setSelectedSubcategory({ _id: "", name: "" });
    setSelectedProducts({ _id: "", name: "" });
    setRelatedProducts([]);
    setSelectedRelatedProducts([]);
  };


  const handlePageChange = (page: number) => {
    navigate(`?page_no=${page}`);
  };

  const handleUpdate = (record: TableData) => {
    console.log(record);
    setRecommendedProducts(['']); // Reset
    setIsModalVisible(true);
  };

  const handleAddProduct = () => {
    if (recommendedProducts.length < 10) {
      setRecommendedProducts([...recommendedProducts, '']);
    }
  };

  const handleRemoveProduct = (index: number) => {
    const updated = recommendedProducts.filter((_, i) => i !== index);
    setRecommendedProducts(updated.length ? updated : ['']);
  };

  const openDropdownModal = (index: number) => {
    setActiveProductIndex(index);
    setSelectedProduct(recommendedProducts[index] || undefined);
    setIsDropdownModalVisible(true);
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
          onClick={() => navigate(`/SuperAdmin_Services_List?salonId=${record._id}`)}
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
      <h1 className="text-2xl font-bold mb-4">All Salons Services</h1>

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
      <Modal
        title="Manage Recommended Products"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="space-y-3">
          {recommendedProducts.map((product, index) => (
            <div key={index} className="flex items-center gap-4">
              <Button
                onClick={() => openDropdownModal(index)}
                className="flex-1 text-left border border-gray-300"
              >
                {product ? product : 'Select Product'}
              </Button>
              <Button danger onClick={() => handleRemoveProduct(index)}>
                Remove
              </Button>
            </div>
          ))}

          <Button
            onClick={handleAddProduct}
            disabled={recommendedProducts.length >= 10}
            className="mt-2"
          >
            Add Recommended Product
          </Button>
        </div>
      </Modal>

      <Modal
        title="Select Product"
        visible={isDropdownModalVisible}
        onCancel={() => setIsDropdownModalVisible(false)}
        onOk={handleConfirmProductSelection}
        okButtonProps={{ disabled: relatedProducts.length === 0 }}
      >
        <div className="space-y-4">
          <label className="text-gray-700 font-medium">
            Select Category:
            <select
              onChange={handleSelectCategory}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="" disabled selected>
                Select a Category
              </option>
              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                  data-name={category.name}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-gray-700 font-medium">
            Select Subcategory:
            <select
              onChange={handleSelectSubcategory}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="" disabled selected>
                Select a Subcategory
              </option>
              {filterSubcategory?.map((category) =>
                category?.sub_categories?.map((item) => (
                  <option key={item._id} value={item._id} data-name={item.name}>
                    {item.name}
                  </option>
                ))
              )}
            </select>
          </label>

          <label className="text-gray-700 font-medium">
            Select Product Item:
            <select
              onChange={handleSelectProductItem}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="" disabled selected>
                Select a Product
              </option>
              {filterProducts?.map((item) => (
                <option key={item._id} value={item._id} data-name={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          {relatedProducts.length > 0 && (
            <div>
              <h4 className="font-semibold">Select Related Products:</h4>
              <div className="flex flex-col gap-2">
                {relatedProducts.map((prod, i) => (
                  <label key={i} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedRelatedProducts.includes(prod)}
                      onChange={() => {
                        const isSelected = selectedRelatedProducts.includes(prod);
                        if (isSelected) {
                          setSelectedRelatedProducts(prev => prev.filter(p => p !== prod));
                        } else {
                          setSelectedRelatedProducts(prev => [...prev, prod]);
                        }
                      }}
                    />
                    {prod}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>

    </div>
  );
};

export default All_Salons_Services;
