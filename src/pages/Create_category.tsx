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
  createProductItem,
  updateProductItem,
  deleteProductItem,
} from "../api/category/api"; // Import your API functions
import axios from "axios";

const { Option } = Select;

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [productItems, setProductItems] = useState([]);
  const [loading, setLoading] = useState(false);


  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
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

  const [newCategory, setNewCategory]=useState();
  const [newSubcategory, setNewSubCategory] = useState();
  const [newProduct, setNewProduct] = useState();

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

 const openCategoryModal = (type) => {
    setModalType(type);
    setIsCategoryModalOpen(true);
  };



  const openSubCategoryModal = (type) => {
    setModalType(type);
    setIsSubCategoryModalOpen(true);
  };


 
  const openProductModal = (type) => {
    setModalType(type);
    setIsProductModalOpen(true);
  };


//  const closeCategoryModal = async () => {
//     if (modalType === "Add") {
//       try {
//         const res = await createCategory(
//           newCategory,
//           "aaaa",
//           selectedCategory._id
//         );

//         if (res) {
//           alert("New Category Added");
//         }
//       } catch (error) {
//         console.error("error", error);
//       }
//     }
//     if (modalType === "Update") {
//       try {
//         //@ts-ignore
//         setNewCategory(selectedCategory.name);
//         const res = updateCategory(
//           newCategory,
//           "desc",
//           selectedCategory._id,
//           selectedCategory._id
//         );

//         if (res) {
//           alert(`Updated ${newCategory}`);
//         }
//       } catch (error) {
//         console.error("error", error);
//         throw error;
//       }
//     }
//     if (modalType === "Delete") {
//       try {
//         const res = await deleteCategory(selectedCategory._id);
//         if (res) {
//           alert(`deleted ${selectedCategory.name}`);
//         }
//       } catch (error) {
//         console.error("error", error);
//         throw error;
//       }
//     }
//     setIsCategoryModalOpen(false);
//     setModalType("");
//   };










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
        //@ts-ignore
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

  const closeProductModal = async () => {
    if (modalType === "Add") {
      try {
        const res = await createProductItem(
          newProduct,
          "aaaa",
          selectedSubcategory._id
        );

        if (res) {
          alert("New Product Added");
        }
      } catch (error) {
        console.error("error", error);
      }
    }
    if (modalType === "Update") {
      try {
        //@ts-ignore
        setNewProduct(selectedProduct.name);
        const res = updateProductItem(
          newProduct,
          "desc",
          selectedSubcategory._id,
          selectedProduct._id
        );

        if (res) {
          alert(`Updated ${newProduct}`);
        }
      } catch (error) {
        console.error("error", error);
        throw error;
      }
    }
    if (modalType === "Delete") {
      try {
        const res = await deleteProductItem(selectedProduct._id);
        if (res) {
          alert(`deleted ${selectedProduct.name}`);
        }
      } catch (error) {
        console.error("error", error);
        throw error;
      }
    }
    setIsProductModalOpen(false);
    setModalType("");
  };

  return (
    // <div className="flex flex-col gap-5">
    //   <div>
    //     <label>Select Category:</label>
    //     <select onChange={handleSelectCategory}>
    //       <option value="" disabled selected>
    //         Select a Category
    //       </option>
    //       {categories.map((category) => (
    //         <option
    //           key={category._id}
    //           value={category._id}
    //           data-name={category.name}
    //         >
    //           {category.name}
    //         </option>
    //       ))}
    //     </select>
    //     <label>Select Subcategory:</label>
    //     <select onChange={handleSelectSubcategory}>
    //       <option value="" disabled selected>
    //         Select a Category
    //       </option>
    //       {filterSubcategory?.map((category) =>
    //         category?.sub_categories?.map((item) => (
    //           <option key={item._id} value={item._id} data-name={item.name}>
    //             {item.name}
    //           </option>
    //         ))
    //       )}
    //     </select>
    //     <label>Select Product Item:</label>
    //     <select onChange={handleSelectProduct}>
    //       <option value="" disabled selected>
    //         Select a Category
    //       </option>
    //       {filterProducts?.map((item) => (
    //         <option key={item._id} value={item._id} data-name={item.name}>
    //           {item.name}
    //         </option>
    //       ))}
    //     </select>
    //   </div>

    //   <div>
    //     {selectedCategory?._id && (
    //       <div>
    //         {selectedSubcategory._id && (
    //           <Button onClick={() => openSubCategoryModal("Update")}>
    //             Update Sub Category
    //           </Button>
    //         )}
    //         <Button onClick={() => openSubCategoryModal("Add")}>
    //           Add Sub Category
    //         </Button>
    //         {selectedSubcategory._id && (
    //           <Button onClick={() => openSubCategoryModal("Delete")}>
    //             Delete Sub Category
    //           </Button>
    //         )}
    //       </div>
    //     )}
    //   </div>

    //   <div>
    //     {selectedSubcategory._id && (
    //       <div>
    //         {selectedProduct?._id && (
    //           <Button onClick={() => openProductModal("Update")}>
    //             Update Product
    //           </Button>
    //         )}
    //         <Button onClick={() => openProductModal("Add")}>Add Product</Button>
    //         {selectedProduct?._id && (
    //           <Button onClick={() => openProductModal("Delete")}>
    //             Delete Product
    //           </Button>
    //         )}
    //       </div>
    //     )}
    //   </div>

    //   {/* Subcategory Modal */}
    //   <Modal
    //     title={`${modalType} Sub Category`}
    //     open={isSubCategoryModalOpen}
    //     onOk={closeSubCategoryModal}
    //     onCancel={() => setIsSubCategoryModalOpen(false)}
    //   >
    //     <p>
    //       {modalType === "Update" ? (
    //         <div className="flex flex-col">
    //           <span>
    //             {" "}
    //             Sub Category Name{" "}
    //             <Input
    //               value={newSubcategory}
    //               defaultValue={newSubcategory}
    //               //@ts-ignore
    //               onChange={(e) => setNewSubCategory(e.target.value)}
    //             />{" "}
    //           </span>
    //         </div>
    //       ) : modalType === "Add" ? (
    //         <div className="flex flex-col">
    //           <span>
    //             {" "}
    //             Sub Category Name{" "}
    //             <Input
    //               value={newSubcategory}
    //               //@ts-ignore
    //               onChange={(e) => setNewSubCategory(e.target.value)}
    //             />{" "}
    //           </span>
    //         </div>
    //       ) : (
    //         `Delete the subcategory: ${selectedSubcategory.name}`
    //       )}
    //     </p>
    //   </Modal>

    //   {/* Product Modal */}
    //   <Modal
    //     title={`${modalType} Product`}
    //     open={isProductModalOpen}
    //     onOk={closeProductModal}
    //     onCancel={() => setIsProductModalOpen(false)}
    //   >
    //     <p>
    //       {modalType === "Update" ? (
    //         <div className="flex flex-col">
    //           <span>
    //             {" "}
    //             Update Product {selectedProduct.name}
    //             <Input
    //               value={newProduct}
    //               //@ts-ignore
    //               onChange={(e) => setNewProduct(e.target.value)}
    //             />{" "}
    //           </span>
    //         </div>
    //       ) : modalType === "Add" ? (
    //         <div className="flex flex-col">
    //           <span>
    //             {" "}
    //             Add Product{" "}
    //             <Input
    //               value={newProduct}
    //               //@ts-ignore
    //               onChange={(e) => setNewProduct(e.target.value)}
    //             />{" "}
    //           </span>
    //         </div>
    //       ) : (
    //         `Delete the product: ${selectedProduct.name}`
    //       )}
    //     </p>
    //   </Modal>
    // </div>
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Manage Categories & Products
      </h2>

      {/* Category, Subcategory & Product Selection */}
      <div className="flex flex-col gap-4">
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
            onChange={handleSelectProduct}
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
      </div>

  {/* Add Category Actions */}
      {selectedCategory?._id && (
        <div className="mt-4 flex gap-3">
          {selectedCategory._id && (
            <Button
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
              onClick={() => openSubCategoryModal("Update")}
            >
              Update Category
            </Button>
          )}
          <Button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            onClick={() => openSubCategoryModal("Add")}
          >
            Add Category
          </Button>
          {selectedCategory._id && (
            <Button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              onClick={() => openSubCategoryModal("Delete")}
            >
              Delete Category
            </Button>
          )}
        </div>
      )}


      {/* Subcategory Actions */}
      {selectedCategory?._id && (
        <div className="mt-4 flex gap-3">
          {selectedSubcategory._id && (
            <Button
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
              onClick={() => openSubCategoryModal("Update")}
            >
              Update Subcategory
            </Button>
          )}
          <Button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            onClick={() => openSubCategoryModal("Add")}
          >
            Add Subcategory
          </Button>
          {selectedSubcategory._id && (
            <Button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              onClick={() => openSubCategoryModal("Delete")}
            >
              Delete Subcategory
            </Button>
          )}
        </div>
      )}

      {/* Product Actions */}
      {selectedSubcategory._id && (
        <div className="mt-4 flex gap-3">
          {selectedProduct?._id && (
            <Button
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
              onClick={() => openProductModal("Update")}
            >
              Update Product
            </Button>
          )}
          <Button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            onClick={() => openProductModal("Add")}
          >
            Add Product
          </Button>
          {selectedProduct?._id && (
            <Button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              onClick={() => openProductModal("Delete")}
            >
              Delete Product
            </Button>
          )}
        </div>
      )}

      {/* Subcategory Modal */}
      <Modal
        title={`${modalType} Subcategory`}
        open={isSubCategoryModalOpen}
        onOk={closeSubCategoryModal}
        onCancel={() => setIsSubCategoryModalOpen(false)}
      >
        <p>
          {modalType === "Update" ? (
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">
                Subcategory Name:
              </label>
              <Input
                value={newSubcategory}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                //@ts-ignore
                onChange={(e) => setNewSubCategory(e.target.value)}
              />
            </div>
          ) : modalType === "Add" ? (
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">
                Subcategory Name:
              </label>
              <Input
                value={newSubcategory}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                //@ts-ignore
                onChange={(e) => setNewSubCategory(e.target.value)}
              />
            </div>
          ) : (
            `Are you sure you want to delete the subcategory: ${selectedSubcategory.name}?`
          )}
        </p>
      </Modal>

      {/* Product Modal */}
      <Modal
        title={`${modalType} Product`}
        open={isProductModalOpen}
        onOk={closeProductModal}
        onCancel={() => setIsProductModalOpen(false)}
      >
        <p>
          {modalType === "Update" ? (
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">
                Update Product:
              </label>
              <Input
                value={newProduct}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                //@ts-ignore
                onChange={(e) => setNewProduct(e.target.value)}
              />
            </div>
          ) : modalType === "Add" ? (
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">Add Product:</label>
              <Input
                value={newProduct}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                //@ts-ignore
                onChange={(e) => setNewProduct(e.target.value)}
              />
            </div>
          ) : (
            `Are you sure you want to delete the product: ${selectedProduct.name}?`
          )}
        </p>
      </Modal>
    </div>
  );
};

export default CategoryTable;
