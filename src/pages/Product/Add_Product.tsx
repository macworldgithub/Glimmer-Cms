import axios from "axios";
import { useEffect, useState } from "react";
import { IoCubeOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  addImages,
  removeImage,
  resetImage,
  updateProduct,
} from "../../slices/addProductSlice";
import { RootState } from "../../store/store";

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


  const dispatch = useDispatch();
  const addProduct = useSelector((state: RootState) => state.AddProduct);

  const [isInStock, setIsInStock] = useState(true);

  const HandleChange = (name: string, value: string | number) => {
    dispatch(updateProduct({ [name]: value }));
  };

  // const [images, setImages] = useState([]); // Array to hold Base64 images

  const images = useSelector((state: RootState) => state.AddProduct.images);

  // const handleFileChange = (e: any) => {
  //   const files = Array.from(e.target.files); // Get selected files
  //   if (files.length + images.length > 5) {
  //     alert("You can only upload up to 5 images.");
  //     return;
  //   }

  //   // Convert files to Base64
  //   Promise.all(
  //     files.map((file) => {
  //       return new Promise((resolve, reject) => {
  //         const reader = new FileReader();
  //         reader.onload = () => resolve(reader.result);
  //         reader.onerror = reject;
  //         //@ts-ignore
  //         reader.readAsDataURL(file); // Convert to Base64
  //       });
  //     })
  //   ).then((base64Images) => {
  //     // setImages((prevImages: unknown) => [...prevImages, ...base64Images]);
  //     dispatch(addImages(base64Images));
  //   });
  // };

  const handleFileChange = (e: any) => {
    const files = Array.from(e.target.files) as File[]; // Get selected files

    // Check if the total number of files exceeds 5
    if (files.length + images.length > 3) {
      alert("You can only upload up to 3 images.");
      return;
    }

    // Dispatch action to store files in Redux
    dispatch(addImages(files));
  };

  const handleRemoveImage = (index: number) => {
    // setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    if (images.length === 1) {
      dispatch(resetImage());
      setPreviewUrls([]);
    }
    dispatch(removeImage(index));
  };

  const HandleConfirm = () => {
    //@ts-ignore
    dispatch(addProductApi({}));
  };

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    console.log(images, previewUrls, "problemo");
    // Generate preview URLs for each file
    if (images.length > 0) {
      //@ts-ignore
      const urls = images.map((file) => URL?.createObjectURL(file));
      setPreviewUrls(urls);

      // Cleanup: Revoke URLs to prevent memory leaks
      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [images]);

  return (
    <div className=" mx-auto overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between ">
        <div>
          <h1 className="text-2xl text-gray-600">Add a new Product</h1>
          <p className="text-gray-400">Orders placed across your store</p>
        </div>
        {/* <div className="flex gap-2 mt-4 md:mt-0 max-sm:gap-1 max-sm:flex-col">
          <div className="flex flex-row">
            <button className=" text-gray-700 px-4 py-2 rounded-md">
              Discard
            </button>
            <button className=" text-gray-700 px-4 py-2 rounded-md">
              Save Draft
            </button>
          </div>
          <div>
            <button className="bg-[#5f61e6] text-white px-4 py-2 rounded-md ">
              Publish Product
            </button>
          </div>
        </div> */}
      </div>
      {/* Main Content */}
      <div className="flex gap-x-4 flex-col lg:flex-row ">
        <div className="w-2/3 max-lg:w-full">
          <div className="border-gray-200  rounded-md  bg-white p-6 my-2 shadow-md">
            <h2 className="text-lg  mb-4 text-gray-700 ">
              Product information
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Product title"
                className="w-full border-solid border border-gray-400 rounded-md shadow-sm p-3"
                value={addProduct.name}
                onChange={(e) => HandleChange("name", e.target.value)}
              />
            </div>
            {/* <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  SKU
                </label>
                <input
                  type="number"
                  placeholder="SKU"
                  className="w-full rounded-md shadow-sm p-3 border-solid border border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Barcode
                </label>
                <input
                  type="text"
                  placeholder="0123-4567"
                  className="w-full  rounded-md shadow-sm p-3 border-solid border border-gray-400"
                />
              </div>
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Description (Optional)
              </label>
              <textarea
                placeholder=""
                className="w-full rounded-md shadow-sm p-3 border-solid border   border-gray-400"
                value={addProduct.description}
                onChange={(e) => HandleChange("description", e.target.value)}
              >
                {" "}
              </textarea>
            </div>
          </div>

          <div className="border-gray-200 rounded-md max-md:w-full bg-white px-4 py-2 my-4 shadow-md">
            <div className="mt-4 flex flex-row justify-between max-sm:flex-col max-sm:mt-1">
              <div>
                <h2 className="text-lg text-gray-700 mb-4">Product Image</h2>
              </div>
              <div>
                <button className="text-sm text-[#5F61E6] hover:underline">
                  Add media from URL
                </button>
              </div>
            </div>
            <div className="mb-6 border-gray-300 rounded-md">
              <p className="text-gray-500 text-xsm">Browse image</p>

              <div className="mt-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="max-sm:text-[10px] text-sm text-gray-700"
                />
              </div>
            </div>

            {/* Display Uploaded Images */}
            <div className="flex flex-wrap gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Uploaded ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* <div className="border-gray-200  rounded-md max-md:w-full bg-white px-4 py-2 my-4 shadow-md">
            <div className="mt-4 flex flex-row justify-between max-sm:flex-col max-sm:mt-1">
              <div>
                <h2 className="text-lg text-gray-700 mb-4">Product Image</h2>
              </div>
              <div>
                <button className="text-sm text-[#5F61E6] hover:underline">
                  Add media from URL
                </button>
              </div>
            </div>
            <div className="mb-6 border-gray-300 rounded-md">
              <p className="text-gray-800 font-medium text-xl max-sm:text-md">
                Drag and drop your image here
              </p>
              <p className="text-gray-500 mt-2 text-xsm">or</p>
              <p className="text-gray-500 text-xsm">Browse image</p>

              <div className="mt-4">
                <input
                  type="file"
                  className="max-sm:text-[10px] text-sm text-gray-700"
                />
              </div>
            </div>
          </div> */}

          {/* <div className="border-gray-200 shadow-md  rounded-md max-md:w-full bg-white p-4  my-4">
            <h2 className="text-lg  mb-4 text-gray-700">Variants</h2>
            <label className="block text-xsm font-medium text-gray-600 mb-1">
              Options
            </label>
            <div className="mb-4 flex flex-row gap-6 w-full">
              <div className="w-[40%]">
                <select className="w-full  rounded-md shadow-sm border-solid border border-gray-400 p-3">
                  <option>Size</option>
                  <option>Color</option>
                  <option>Weight</option>
                  <option>Smell</option>
                </select>
              </div>
              <div className="w-[60%]">
                <input
                  type="number"
                  placeholder="Enter size"
                  className="w-full border-gray-400 rounded-md shadow-sm border-solid border p-3"
                />
              </div>
            </div>
            <button className="bg-[#5F61E6] text-white px-4 py-2 rounded-md">
              + Add another option
            </button>
          </div> */}

          <div className="border-gray-200  rounded-md max-md:w-full bg-white px-4 py-2 my-4 shadow-md">
            <h2 className="text-lg  mt-6 mb-4">Inventory</h2>
            <div className="flex mb-4 gap-1 items-center bg-[#5F61E6] text-white w-40 p-2 rounded-md">
              <IoCubeOutline size={18} />
              <div className=" text-xl font-medium">Restock</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="block text-md font-medium text-gray-700 mb-2">
                  Options
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add to Stock
                </label>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={addProduct.quantity}
                  onChange={(e) =>
                    HandleChange("quantity", parseInt(e.target.value))
                  }
                  className="w-full border-gray-400 rounded-md shadow-sm p-3  border-solid border"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={HandleConfirm}
                  className="px-4 py-2 bg-[#5F61E6] text-white rounded-md "
                >
                  Confirm
                </button>
              </div>
            </div>
            {/* <div className="mt-4 text-sm text-gray-600">
              <p>Product in stock now: 54</p>
              <p>Product in transit: 390</p>
              <p>Last time restocked: 24th June, 2023</p>
              <p>Total stock over lifetime: 2430</p>
            </div> */}
          </div>
        </div>

        {/* Right Section (Pricing) */}

        <div className="w-1/3 max-lg:w-full">
          <div className="p-6 bg-white rounded-md my-4 shadow-md">
            <h2 className="text-lg font-medium mb-4">Pricing</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Price
              </label>
              <input
                type="number"
                placeholder="Price"
                className="w-full rounded-md shadow-sm p-3 border-solid border border-gray-400"
                value={addProduct.base_price}
                onChange={(e) =>
                  HandleChange("base_price", parseFloat(e.target.value))
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discounted Price
              </label>
              <input
                type="number"
                placeholder="Discounted Price"
                className="w-full rounded-md shadow-sm p-3 border-solid border border-gray-400"
                value={addProduct.discounted_price}
                onChange={(e) =>
                  HandleChange("discounted_price", parseFloat(e.target.value))
                }
              />
            </div>

            <div className="flex items-center justify-between border-t border-gray-300 pt-4">
              <span className="text-sm font-medium text-gray-700">
                In stock
              </span>
              <div
                className={`relative inline-block w-12 h-6 rounded-full cursor-pointer ${isInStock ? "bg-[#5F61E6]" : "bg-gray-300"
                  }`}
                onClick={() => setIsInStock(!isInStock)}
              >
                <span
                  className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow transition-transform ${isInStock ? "translate-x-6" : "translate-x-1"
                    }`}
                ></span>
              </div>
            </div>
          </div>

          <div className="shadow-md  p-6 bg-white rounded-md max-md:w-full">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Organize</h2>

            {/* Vendor */}
            {/* <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Vendor</label>
                            <select
                                className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option>Select Vendor</option>
                                <option>Men's Clothing</option>
                                <option>Women's-clothing</option>
                                <option>Kid's-clothing</option>
                            </select>
                        </div> */}

            {/* Category */}


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




            {/* <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
                            <div className="flex items-center gap-2">
                                <select
                                    className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option>Skin Care</option>                                    
                                    <option>Hair Care</option>                                      
                                    <option>Makeup</option>
                                    <option>Fragrance</option>                                    
                                </select>
                                <button 
                                    className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-md text-xl"
                                    title="Add new category"
                                >
                                    +
                                </button>
                            </div>
                        </div> */}

            {/* Collection */}
            {/* <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Collection</label>
                            <select
                                className="w-full border border-gray-300 rounded-md shadow-sm p-2 "
                            >
                                <option>Collection</option>
                                <option>Men's Clothing</option>
                                <option>Women's-clothing</option>
                                <option>Kid's-clothing</option>
                            </select>
                        </div> */}

            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Status
              </label>
              <select
                value={addProduct.status} // Ensure this value is either "Active" or "Inactive"
                onChange={(e) => HandleChange("status", e.target.value)} // Update the status on change
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="Active">Active</option>{" "}
                {/* Specify the value explicitly */}
                <option value="Inactive">Inactive</option>{" "}
                {/* Specify the value explicitly */}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;


