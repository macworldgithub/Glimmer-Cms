import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
} from "antd";
import {
  getAllCategories,
  getAllSubcategories,
  getAllProductItem,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../api/category/api"; // Import your API functions
import axios from "axios";

const { Option } = Select;

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [productItems, setProductItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

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
  const [selectedProduct, setSelectedProduct] = useState({ _id: "", name: "" });

  const [newSubcategory, setNewSubCategory] = useState();

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      console.log("category", data);
      setCategories(data);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch categories");
      setLoading(false);
    }
  };

  // Fetch Subcategories
  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const data = await getAllSubcategories();
      console.log("sub category", data);
      setSubcategories(data);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch subcategories");
      setLoading(false);
    }
  };

  // Fetch Product Items
  const fetchProductItems = async () => {
    try {
      setLoading(true);
      const data = await getAllProductItem();
      console.log("product item", data);
      setProductItems(data);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch product items");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchProductItems();
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

  const handleSelectProduct = (event: any) => {
    const id = event.target.value;
    const name =
      event.target.options[event.target.selectedIndex].getAttribute(
        "data-name"
      );
    setSelectedProduct((prevCategory) => ({
      ...prevCategory,
      name: name,
      _id: id,
    }));
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

    console.log("8888", filteredProducts, selectedSubcategory);
  }, [selectedSubcategory._id]);

  const openSubCategoryModal = (type) => {
    setModalType(type);
    setIsSubCategoryModalOpen(true);
  };

  const openProductModal = (type) => {
    setModalType(type);
    setIsProductModalOpen(true);
  };

  const closeSubCategoryModal = async () => {
    if (modalType === "Add") {
      try {
        const res = await createSubcategory(
          newSubcategory,
          "aaaa",
          selectedCategory._id
        );

        if (res) {
          alert("New Sub Category Added");
        }
      } catch (error) {
        console.error("error", error);
      }
    }
    if (modalType === "Update") {
      try {
        setNewSubCategory(selectedCategory.name);
        const res = updateSubcategory(
          newSubcategory,
          "desc",
          selectedSubcategory._id,
          selectedCategory._id
        );

        if (res) {
          alert(`Updated ${newSubcategory}`);
        }
      } catch (error) {
        console.error("error", error);
        throw error;
      }
    }
    if (modalType === "Delete") {
      try {
        const res = await deleteSubcategory(selectedSubcategory._id);
        if (res) {
          alert(`deleted ${selectedSubcategory.name}`);
        }
      } catch (error) {
        console.error("error", error);
        throw error;
      }
    }
    setIsSubCategoryModalOpen(false);
    setModalType("");
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setModalType("");
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label>Select Category:</label>
        <select onChange={handleSelectCategory}>
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
        <label>Select Subcategory:</label>
        <select onChange={handleSelectSubcategory}>
          <option value="" disabled selected>
            Select a Category
          </option>
          {filterSubcategory?.map((category) =>
            category?.sub_categories?.map((item) => (
              <option key={item._id} value={item._id} data-name={item.name}>
                {item.name}
              </option>
            ))
          )}
        </select>
        <label>Select Product Item:</label>
        <select onChange={handleSelectProduct}>
          <option value="" disabled selected>
            Select a Category
          </option>
          {filterProducts?.map((item) => (
            <option key={item._id} value={item._id} data-name={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        {selectedCategory?._id && (
          <div>
            {selectedSubcategory._id && (
              <Button onClick={() => openSubCategoryModal("Update")}>
                Update Sub Category
              </Button>
            )}
            <Button onClick={() => openSubCategoryModal("Add")}>
              Add Sub Category
            </Button>
            {selectedSubcategory._id && (
              <Button onClick={() => openSubCategoryModal("Delete")}>
                Delete Sub Category
              </Button>
            )}
          </div>
        )}
      </div>

      <div>
        {selectedProduct?._id && (
          <div>
            <Button onClick={() => openProductModal("Update")}>
              Update Product
            </Button>
            <Button onClick={() => openProductModal("Add")}>Add Product</Button>
            <Button onClick={() => openProductModal("Delete")}>
              Delete Product
            </Button>
          </div>
        )}
      </div>

      {/* Subcategory Modal */}
      <Modal
        title={`${modalType} Sub Category`}
        open={isSubCategoryModalOpen}
        onOk={closeSubCategoryModal}
        onCancel={() => setIsSubCategoryModalOpen(false)}
      >
        <p>
          {modalType === "Update" ? (
            <div className="flex flex-col">
              <span>
                {" "}
                Sub Category Name{" "}
                <Input
                  value={newSubcategory}
                  defaultValue={newSubcategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                />{" "}
              </span>
            </div>
          ) : modalType === "Add" ? (
            <div className="flex flex-col">
              <span>
                {" "}
                Sub Category Name{" "}
                <Input
                  value={newSubcategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                />{" "}
              </span>
            </div>
          ) : (
            `Delete the subcategory: ${selectedSubcategory.name}`
          )}
        </p>
      </Modal>

      {/* Product Modal */}
      {/* <Modal
        title={`${modalType} Product`}
        open={isProductModalOpen}
        onOk={closeProductModal}
        onCancel={closeProductModal}
      >
        <p>
          {modalType === "Update"
            ? `Update the product: ${selectedProduct.name}`
            : modalType === "Add"
            ? "Add a new product"
            : `Delete the product: ${selectedProduct.name}`}
        </p>
      </Modal> */}
    </div>
  );
};

export default CategoryTable;
