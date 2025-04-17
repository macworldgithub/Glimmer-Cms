import { Button, Input, Modal, Table, message } from 'antd';
import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addRecommendedProduct, getAllProducts, getAllRecommendedProductsForSalon, getAllSalons } from '../api/service/api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { getAllCategories, getAllProductItem, getAllSubcategories } from '../api/category/api';


interface TableData {
  _id: string;
  salon_name: string;
  email: string;
  address: string;
  about: string;
  contact_number: number;
  openingHour: string;
  closingHour: string;
}

interface ProductOption {
  _id: string;
  name: string;
  image1: string;
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
  const [recommendedProducts, setRecommendedProducts] = useState<ProductOption[]>([]);
  const [activeProductIndex, setActiveProductIndex] = useState<number | null>(null);

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
  const [selectedSalonId, setSelectedSalonId] = useState<string | null>(null);

  const [relatedProducts, setRelatedProducts] = useState<ProductOption[]>([]);
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<ProductOption[]>([]);

  const [fetchedRecommendedProducts, setFetchedRecommendedProducts] = useState<ProductOption[]>([]);

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
      console.log(response);
      const products = response?.products?.map((p) => ({
        _id: p._id,
        name: p.name,
        image1: p.image1,
      })) || [];

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

    // Remove placeholder entries (like Select Product)
    const cleanedExisting = recommendedProducts.filter(
      (prod) => prod._id && prod.name
    );

    // Determine how many new products can be added
    const availableSlots = 10 - cleanedExisting.length;

    const productsToAdd = selectedRelatedProducts.slice(0, availableSlots);

    const updated = [...cleanedExisting, ...productsToAdd];

    setRecommendedProducts(updated);
    setIsDropdownModalVisible(false);
    setActiveProductIndex(null);

    // Clear modal state
    setSelectedCategory({ _id: "", name: "" });
    setSelectedSubcategory({ _id: "", name: "" });
    setSelectedProducts({ _id: "", name: "" });
    setRelatedProducts([]);
    setSelectedRelatedProducts([]);
  };



  const handlePageChange = (page: number) => {
    navigate(`?page_no=${page}`);
  };

  const handleUpdate = async (record: TableData) => {
    try {
      setSelectedSalonId(null);
      setFetchedRecommendedProducts([]);
      setRecommendedProducts([]);
      setIsModalVisible(true); // Open modal early if you want loading UX
  
      // Now load new salon's data
      setSelectedSalonId(record._id);
  
      const res: any = await dispatch(getAllRecommendedProductsForSalon(record._id));
      if (res.payload && Array.isArray(res.payload)) {
        const mapped = res.payload.map((product: any) => ({
          _id: product._id,
          name: product.name,
          image1: product.image1,
        }));
  
        setFetchedRecommendedProducts(mapped);
        setRecommendedProducts(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch saved products", error);
      message.error("Could not load saved recommended products.");
    }
  };  

  const handleDropdownClick = (index: number) => {
    if (!recommendedProducts[index]?.name) {
      openDropdownModal(index);
    }
  };

  const openDropdownModal = (index: number) => {
    setActiveProductIndex(index);
    setSelectedProducts(recommendedProducts[index] || undefined);
    setIsDropdownModalVisible(true);
  };

  const handleAddProduct = () => {
    if (recommendedProducts.length < 10) {
      setRecommendedProducts([...recommendedProducts, { _id: '', name: '', image1: '' }]);
    }
  };

  const handleRemoveProduct = (index: number) => {
    const updated = recommendedProducts.filter((_, i) => i !== index);
    setRecommendedProducts(updated.length ? updated : [{ _id: '', name: '', image1: '' }]);
  };

  const handleAddProductForSalon = async () => {
    const validProducts = recommendedProducts.filter((p) => p._id && p.name);

    if (!selectedSalonId) {
      return message.error("Salon ID not found.");
    }

    const newProducts = validProducts.filter(
      (product) => !fetchedRecommendedProducts.some((fetched) => fetched._id === product._id)
    );

    if (newProducts.length === 0) {
      return message.info("No new products to add.");
    }

    try {
      for (const product of newProducts) {
        await addRecommendedProduct(selectedSalonId, product._id, product.name);
      }

      message.success("Products successfully added to the salon!");
      setIsModalVisible(false);
      setRecommendedProducts([]);
      setFetchedRecommendedProducts([]);
      setSelectedSalonId(null);
    } catch (error) {
      message.error("Failed to add recommended products.");
    }
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
          <Button
            onClick={handleAddProduct}
            disabled={recommendedProducts.length >= 10}
            className="mt-2"
          >
            Add Recommended Product
          </Button>
          {recommendedProducts.map((product, index) => {
            console.log('Rendering product:', product);
            return (
              <><div key={index} className="flex items-center gap-4">
                <Button
                  onClick={() => handleDropdownClick(index)}
                  className="flex-1 text-left border border-gray-300 cursor-default"
                >

                  <div className="flex items-center gap-2">
                    {product.image1 && (
                      <img
                        src={product.image1}
                        alt={product.name}
                        className="w-6 h-6 object-cover rounded" />
                    )}
                    {product?.name || 'Select Product'}
                  </div>
                </Button>
                {product.name && (
                  <Button danger onClick={() => handleRemoveProduct(index)}>
                    Remove
                  </Button>
                )}
              </div>
                <div className='flex justify-center'>
                  <Button onClick={handleAddProductForSalon}>Add to Salon</Button>
                </div>
              </>
            );
          })}
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

          {relatedProducts.map((prod, i) => {
            const isSelected = selectedRelatedProducts.some(p => p._id === prod._id);
            return (
              <label key={prod._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {
                    const isSelected = selectedRelatedProducts.some(p => p._id === prod._id);
                    if (isSelected) {
                      setSelectedRelatedProducts(prev => prev.filter(p => p._id !== prod._id));
                    } else {
                      setSelectedRelatedProducts(prev => [...prev, prod]);
                    }
                  }}
                />
                {prod.name}
              </label>
            );
          })}

        </div>
      </Modal>

    </div>
  );
};

export default All_Salons_Services;
