import axios from "axios";
import { useEffect, useState } from "react";
import { IoCubeOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addProductApi } from "../../api/products/api";
import {
  addImages,
  removeImage,
  resetImage,
  updateProduct,
} from "../../slices/addProductSlice";
import { RootState } from "../../store/store";
import { BACKEND_URL } from "../../config/server";
import SizeAndType from "../../components/SizeAndType";
interface Sizes {
  id: number;
  value: string;
  unit: string;
}

interface Types {
  id: number;
  value: string;
}
const ProductPage = () => {
  const token = useSelector((state: RootState) => state.Login.token);
  const [categoryData, setCategoryData] = useState([]);

  const [showSubcategories, setShowSubcategories] = useState(false);
  const [showSubSubcategories, setShowSubSubcategories] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [sizes, setSizes] = useState<Sizes[]>([
    { id: 1, value: "", unit: "mg" },
  ]);
  const [types, setTypes] = useState<Types[]>([{ id: 1, value: "" }]);

  const category = useSelector((state: RootState) => state.AddProduct.category);
  const subcategory = useSelector(
    (state: RootState) => state.AddProduct.subcategory
  );
  const item = useSelector((state: RootState) => state.AddProduct.item);

  //@ts-ignore
  const sub_category_options = categoryData?.filter(
    (cat) => cat?._id === category
  )[0]?.sub_categories;
  const item_options = sub_category_options?.filter(
    (sub: any) => sub?._id === subcategory
  )[0]?.items;

  console.log(category, subcategory, item, sub_category_options, " heeelo");

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        BACKEND_URL + "/product_item/get_all_product_item",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use token from Redux
          },
        }
      );

      setCategoryData(response.data || []); // Safeguard for empty response
      console.log(response.data, "catssssss");
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    console.log("selected category", category);
  }, [category]);

  const dispatch = useDispatch();
  const addProduct = useSelector((state: RootState) => state.AddProduct);

  const [isInStock, setIsInStock] = useState(true);

  const HandleChange = (name: string, value: string | number | any) => {
    dispatch(updateProduct({ [name]: value }));
  };

 

  const images = useSelector((state: RootState) => state.AddProduct.images);


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

  useEffect(() => {
    if (sub_category_options?.length > 0) {
      HandleChange("subcategory", sub_category_options[0]._id); // Set the first option as default

      for (let item of sub_category_options) {
        if (item?._id === sub_category_options[0]?._id) {
          HandleChange("item", item?.items[0]?._id);
        }
      }
    }
  }, [sub_category_options]); // Runs whenever sub_category_options changes

  useEffect(() => {}, [subcategory]);
  const handleDiscountChange = (value) => {
    let discountPercentage = parseFloat(value);

    // Ensure discount percentage does not exceed 100
    if (discountPercentage > 100) discountPercentage = 100;
    if (discountPercentage < 0 || isNaN(discountPercentage))
      discountPercentage = 0;

    // Store the percentage in discounted_price for UI
    HandleChange("discounted_price", discountPercentage);

    // Calculate and update final price for display
    const basePrice = parseFloat((addProduct.base_price || 0).toString()); // Convert to string
    const finalPrice = basePrice - (basePrice * discountPercentage) / 100;
    HandleChange("final_price_display", finalPrice.toFixed(2));
  };
  return (
    <div className="mx-auto overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between ">
        <div>
          <h1 className="text-2xl text-gray-600">Add a new Product</h1>
          <p className="text-gray-400">Orders placed across your store</p>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <button
            onClick={() => {
              HandleConfirm();
            }}
            className="bg-[#5f61e6] text-white px-4 py-2 rounded-md"
          >
            Publish Product
          </button>
        </div>
      </div>
      <div className="mb-4">
        <label className="bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer">
          Upload Bulk Products 
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const formData = new FormData();
              formData.append("file", file);

              try {
                const res = await fetch(`${BACKEND_URL}/product/upload-csv`, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  body: formData,
                });

                const data = await res.json();
                if (res.ok) {
                  alert(`${data.count} products uploaded successfully!`);
                  console.log("Bulk Upload Result:", data);
                } else {
                  alert(`Upload failed: ${data.message || "Unknown error"}`);
                }
              } catch (err) {
                console.error("Bulk upload error:", err);
                alert("Something went wrong during upload.");
              }
            }}
          />
        </label>
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

         

          <div className="border-gray-200  rounded-md max-md:w-full bg-white px-4 py-2 my-4 shadow-md">
            <h2 className="text-lg  mt-6 mb-4">Inventory (Quantity)</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                
                <input
                  type="number"
                  placeholder="Quantity"
                  value={addProduct.quantity}
                  onChange={(e) =>
                    HandleChange(
                      "quantity",
                      e.target.value === "" ? "" : parseInt(e.target.value)
                    )
                  }

                  className="w-full border-gray-400 rounded-md shadow-sm p-3  border-solid border"
                />
              </div>
             
            </div>
           
          </div>
        </div>

        {/* Right Section (Pricing) */}

        {/* <div className="w-1/3 max-lg:w-full">
          <div className="p-6 bg-white rounded-md my-4 shadow-md">
            <h2 className="text-lg font-medium mb-4">Pricing</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actual Price
              </label>
              <input
                type="number"
                placeholder="Price"
                className="w-full rounded-md shadow-sm p-3 border-solid border border-gray-400"
                value={addProduct.base_price || ""}
                onChange={(e) =>
                  HandleChange("base_price", parseFloat(e.target.value))
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discounted Percentage (%)
              </label>
              <input
                type="number"
                placeholder="Discounted Price"
                className="w-full rounded-md shadow-sm p-3 border-solid border border-gray-400"
                value={addProduct.discounted_price || ""}
                onChange={(e) => handleDiscountChange(e.target.value)}
                max={100}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Final Price
              </label>
              <input
                type="number"
                placeholder="Final Price"
                className="w-full rounded-md shadow-sm p-3 border-solid border border-gray-400 bg-gray-100"
                value={
                  addProduct.base_price && addProduct.discounted_price
                    ? (addProduct.base_price -
                      (addProduct.base_price * addProduct.discounted_price) /
                        100).toFixed(2)
                    : addProduct.base_price || ""
                }
                readOnly
              />
            </div>
        
          </div> */}
        <div className="w-1/3 max-lg:w-full">
          <div className="p-6 bg-white rounded-md my-4 shadow-md">
            <h2 className="text-lg font-medium mb-4">Pricing</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actual Price
              </label>
              <input
                type="number"
                placeholder="Price"
                className="w-full rounded-md shadow-sm p-3 border-solid border border-gray-400"
                value={addProduct.base_price || ""}
                onChange={(e) =>
                  HandleChange("base_price", parseFloat(e.target.value))
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Percentage (%)
              </label>
              <input
                type="number"
                placeholder="Discount Percentage"
                className="w-full rounded-md shadow-sm p-3 border-solid border border-gray-400"
                value={addProduct.discounted_price || ""}
                onChange={(e) => handleDiscountChange(e.target.value)}
                max="100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Final Price
              </label>
              <input
                type="number"
                placeholder="Final Price"
                className="w-full rounded-md shadow-sm p-3 border-solid border border-gray-400 bg-gray-100"
          value={addProduct.final_price_display || addProduct.base_price || ""}
                readOnly
              />
            </div>
          </div>

          <div className="shadow-md  p-6 bg-white rounded-md max-md:w-full">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Organize</h2>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Category
              </label>
              <select
                className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500"
                value={category}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  HandleChange("category", selectedValue);
                }}
              >
                <option value="">Select Category</option>
                {categoryData.map((cat: any) => {
                  return (
                    <option value={cat?.product_category?._id}>
                      {cat?.product_category?.name}
                    </option>
                  );
                })}
              </select>

              {/* Subcategories */}
              {category && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Subcategory
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500"
                    value={subcategory}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      //@ts-ignore
                      HandleChange("subcategory", selectedValue);
                    }}
                  >
                    <option value="">Select Sub Category</option>
                    {sub_category_options?.map((sub: any) => (
                      <option key={sub._id} value={sub._id}>
                        {sub?.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sub-Subcategories */}
              {item_options?.length && subcategory && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Items
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500"
                    value={item}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      //@ts-ignore
                      HandleChange("item", selectedValue);
                    }}
                  >
                    <option value="">Select Item</option>
                    {item_options?.map((item: any) => {
                      return <option value={item._id}>{item?.name}</option>;
                    })}
                  </select>
                </div>
              )}
            </div>

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
          <SizeAndType
            sizes={sizes}
            types={types}
            setSizes={setSizes}
            setTypes={setTypes}
            HandleChange={HandleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
