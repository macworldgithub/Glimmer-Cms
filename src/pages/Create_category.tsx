import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
const Create_category = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [productCategory, setProductCategory] = useState(""); // Holds category ID to associate subcategory
  const [itemName, setItemName] = useState(""); // Item name for the subcategory
  const [selectedSubcategory, setSelectedSubcategory] = useState(""); // For dropdown selection
  const [categories, setCategories] = useState<{
    id: string;
    category: string;
    description: string;
    subcategories: { name: string; items: string[] }[];
  }[]>([]);

  // Get token from Redux store
  const token = useSelector((state: RootState) => state.Login.token);

  // Create a new category
  const createCategory = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/product-category/create_product_category",
        {
          name: categoryName,
          description: categoryDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Category created successfully!");
        setCategories((prev) => [
          ...prev,
          {
            id: response.data._id,
            category: categoryName,
            description: categoryDescription,
            subcategories: [],
          },
        ]);
        setCategoryName("");
        setCategoryDescription("");
      } else {
        alert("Failed to create category.");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      alert("An error occurred while creating the category.");
    }
  };

  // Create a new subcategory
  const createSubcategory = async () => {
    if (!productCategory) {
      alert("Please select a valid category.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/product-sub-category/create_product_sub_category",
        {
          name: subcategoryName,
          description: categoryDescription,
          product_category: productCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Subcategory created successfully!");
        setCategories((prev) =>
          prev.map((category) =>
            category.id === productCategory
              ? {
                  ...category,
                  subcategories: [
                    ...category.subcategories,
                    { name: subcategoryName, items: [] },
                  ],
                }
              : category
          )
        );
        setSubcategoryName("");
        setProductCategory("");
        setSelectedSubcategory(""); // Automatically enable the dropdown
      } else {
        alert("Failed to create subcategory.");
      }
    } catch (error) {
      console.error("Error creating subcategory:", error);
      alert("An error occurred while creating the subcategory.");
    }
  };

  // Create a new item for the subcategory
  const createItemForSubcategory = () => {
    if (!selectedSubcategory || !itemName) {
      alert("Please enter an item name and select a subcategory.");
      return;
    }

    setCategories((prev) =>
      prev.map((category) => {
        const updatedSubcategories = category.subcategories.map((sub) => {
          if (sub.name === selectedSubcategory) {
            return { ...sub, items: [...sub.items, itemName] };
          }
          return sub;
        });

        return { ...category, subcategories: updatedSubcategories };
      })
    );
    setItemName("");
    setSelectedSubcategory("");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">
        Create Category and Subcategory
      </h2>
      {/* Category Form */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Enter category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />
        <input
          type="text"
          placeholder="Enter category description"
          value={categoryDescription}
          onChange={(e) => setCategoryDescription(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />
        <button
          onClick={createCategory}
          className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Category
        </button>
      </div>

      {/* Subcategory Form */}
      <div className="mb-8">
        <select
          value={productCategory}
          onChange={(e) => {
            setProductCategory(e.target.value);
            setSubcategoryName("");
            setSelectedSubcategory("");
          }}
          className="w-full p-3 border rounded mb-4"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.category}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Enter subcategory name"
          value={subcategoryName}
          onChange={(e) => setSubcategoryName(e.target.value)}
          className="w-full p-3 border rounded mb-4"
          disabled={!productCategory}
        />
        <button
          onClick={createSubcategory}
          className="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={!productCategory || !subcategoryName}
        >
          Create Subcategory
        </button>
      </div>

      {/* Item Form */}
      <div className="mb-8">
        <select
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
          className="w-full p-3 border rounded mb-4"
          disabled={!productCategory}
        >
          <option value="">Select Subcategory</option>
          {categories
            .find((category) => category.id === productCategory)
            ?.subcategories.map((sub) => (
              <option key={sub.name} value={sub.name}>
                {sub.items.length === 0 ? `All (${sub.name})` : sub.name}
              </option>
            ))}
        </select>

        <input
          type="text"
          placeholder="Enter item name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="w-full p-3 border rounded mb-4"
          disabled={!selectedSubcategory}
        />
        <button
          onClick={createItemForSubcategory}
          className="w-full p-3 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          disabled={!selectedSubcategory || !itemName}
        >
          Create Item
        </button>
      </div>

      {/* Display Categories, Subcategories, and Items */}
      <h3 className="text-2xl font-bold mb-4">Categories, Subcategories, and Items</h3>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Category</th>
            <th className="border p-2">Subcategories</th>
            <th className="border p-2">Items</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={index}>
              <td className="border p-2">
                <div>
                  <strong>{category.category}</strong>
                </div>
                <div className="text-sm text-gray-500">{category.description || "N/A"}</div>
              </td>
              <td className="border p-2">
                {category.subcategories.length > 0
                  ? category.subcategories.map((sub, idx) => (
                      <div key={idx}>
                        <strong>{sub.name}</strong>
                        <div className="text-sm text-gray-500">
                          {sub.items.length > 0 ? sub.items.join(", ") : "No items yet"}
                        </div>
                      </div>
                    ))
                  : "No subcategories yet"}
              </td>
              <td className="border p-2">
                {category.subcategories.length > 0
                  ? category.subcategories.map((sub, idx) => (
                      <div key={idx}>
                        {sub.items.length > 0 ? sub.items.join(", ") : "No items yet"}
                      </div>
                    ))
                  : "No items yet"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Create_category;