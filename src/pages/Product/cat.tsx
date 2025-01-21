
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Import useSelector for Redux
import { RootState } from "../store"; // Adjust this path to your store's RootState location

const ProductPage = () => {
  const token = useSelector((state: RootState) => state.Login.token); 
  const [categories, setCategories] = useState([]); 
  const [subcategories, setSubcategories] = useState([]); 
  const [subSubcategories, setSubSubcategories] = useState([]); 
  const [items, setItems] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [selectedSubCategory, setSelectedSubCategory] = useState(""); 
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState(""); 
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [showSubSubcategories, setShowSubSubcategories] = useState(false); 
  const [loadingCategories, setLoadingCategories] = useState(true); 
  const [loadingSubcategories, setLoadingSubcategories] = useState(false); 
  const [loadingSubSubcategories, setLoadingSubSubcategories] = useState(false); 
  const [loadingItems, setLoadingItems] = useState(false); 

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/product-category/get_all_categories",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Use token from Redux
            },
          }
        );

        setCategories(response.data || []); // Safeguard for empty response
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (token) {
      fetchCategories();
    }
  }, [token]);

  // Fetch subcategories when a category is selected
  const fetchSubcategories = async (categoryId) => {
    setLoadingSubcategories(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/product-sub-category/get_all_sub_categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const filteredSubcategories = response.data.find(
        (category) => category.product_category._id === categoryId
      )?.sub_categories;

      setSubcategories(filteredSubcategories || []); // Safeguard for empty response
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  // Fetch sub-subcategories when a subcategory is selected
  const fetchSubSubcategories = async (subCategoryId) => {
    setLoadingSubSubcategories(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/product-sub-sub-category/get_all_sub_sub_categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const filteredSubSubcategories = response.data.find(
        (subcategory) => subcategory.parent_subcategory._id === subCategoryId
      )?.sub_subcategories;

      setSubSubcategories(filteredSubSubcategories || []); // Safeguard for empty response
    } catch (error) {
      console.error("Error fetching sub-subcategories:", error);
    } finally {
      setLoadingSubSubcategories(false);
    }
  };

  // Fetch items when a sub-subcategory is selected
  const fetchItems = async (subSubCategoryId) => {
    setLoadingItems(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/items/get_items_by_sub_sub_category/${subSubCategoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItems(response.data || []); // Safeguard for empty response
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoadingItems(false);
    }
  };

  return (
    <div>
      {/* Main Category */}
      <label className="block text-sm font-medium text-gray-500 mb-1">
        Category
      </label>
      <select
        className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500"
        value={selectedCategory}
        onChange={(e) => {
          const selectedValue = e.target.value;
          setSelectedCategory(selectedValue);
          setSelectedSubCategory("");
          setSelectedSubSubCategory("");
          setShowSubcategories(true);
          setShowSubSubcategories(false);

          if (selectedValue) {
            fetchSubcategories(selectedValue); // Fetch subcategories for the selected category
          }
        }}
      >
        <option value="">Select Category</option>
        {loadingCategories ? (
          <option value="" disabled>
            Loading categories...
          </option>
        ) : (
          categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))
        )}
      </select>

      {/* Subcategories */}
      {showSubcategories && selectedCategory && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Subcategory
          </label>
          <select
            className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500"
            value={selectedSubCategory}
            onChange={(e) => {
              const selectedValue = e.target.value;
              setSelectedSubCategory(selectedValue);
              setSelectedSubSubCategory("");
              setShowSubSubcategories(true);

              if (selectedValue) {
                fetchSubSubcategories(selectedValue); // Fetch sub-subcategories for the selected subcategory
              }
            }}
          >
            <option value="">Select Subcategory</option>
            {loadingSubcategories ? (
              <option value="" disabled>
                Loading subcategories...
              </option>
            ) : subcategories.length > 0 ? (
              subcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No subcategories available
              </option>
            )}
          </select>
        </div>
      )}

      {/* Sub-Subcategories */}
      {showSubSubcategories && selectedSubCategory && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Sub-Subcategory
          </label>
          <select
            className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500"
            value={selectedSubSubCategory}
            onChange={(e) => {
              const selectedValue = e.target.value;
              setSelectedSubSubCategory(selectedValue);

              if (selectedValue) {
                fetchItems(selectedValue); // Fetch items for the selected sub-subcategory
              }
            }}
          >
            <option value="">Select Sub-Subcategory</option>
            {loadingSubSubcategories ? (
              <option value="" disabled>
                Loading sub-subcategories...
              </option>
            ) : subSubcategories.length > 0 ? (
              subSubcategories.map((subSubcategory) => (
                <option key={subSubcategory._id} value={subSubcategory._id}>
                  {subSubcategory.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No sub-subcategories available
              </option>
            )}
          </select>
        </div>
      )}

      {/* Items Table */}
      {selectedSubSubCategory && (
        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-700">Items</h2>
          {loadingItems ? (
            <p>Loading items...</p>
          ) : items.length > 0 ? (
            <table className="min-w-full border border-gray-300 mt-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Item Name</th>
                  <th className="border px-4 py-2 text-left">Price</th>
                  <th className="border px-4 py-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td className="border px-4 py-2">{item.name}</td>
                    <td className="border px-4 py-2">{item.price}</td>
                    <td className="border px-4 py-2">{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No items available for this sub-subcategory.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
