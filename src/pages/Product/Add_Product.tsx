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


const categories = {
  "SkinCare": [
    "Cleansers",
    "Moisturisers",
    "Sunscreens (SPF)",
    "Eye Care",
    "Lip Care",
    "Bath & Body",
    "Men’s Care",
  ],
  "Hair Care": [
    "Shampoo & Conditioner",
    "Hair treatments",
    "Styling",
    "Tools",
    "Professional Hair",
  ],
  "Makeup": [
    "Face",
    "Lips",
    "Eyes",
    "Nails",
    "Accessories",
  ],
  "Fragrance": [
    "Men",
    "Women", "Unisex",
    "Deodorant",
    "Body spray & Mists",
  ],
};

const subcategories = {
  "Cleansers": [
    "Face Wash",
    "Cleansing Balms and Oils",
    "Face Masks",
    "Makeup Remover",
    "Toners and Mists",
    "Exfoliators and Scrub",
  ],
  "Moisturisers": [
    "Creams & Lotions",
    "Gels",
    "Day & Night Creams",
  ],
  "Bath & Body": [
    "Body Lotions & Creams",
    "Body Wash",
    "Body Scrubs",
    "Soap and Handwash",
    "Body Wax",
  ],
  "Men’s Care": [
    "After Shave", "Shaving Gel/Foam"
  ],
  "Shampoo & Conditioner": [
    "Shampoo",
    "Conditioner",
  ],
  "Hair treatments": [
    "Hair Oil",
    "Hair Supplement",
    "Hair Serums",
    "Hair Fiber",
    "Beard Oil",
    "Hair Cream",
    "Hair-Serum",
    "Hair Mask",
  ],
  "Styling": [
    "Styling Cream",
    "Hair Spray",
    "Hair Color",
    "Hair Gel",
    "Dry Shampoo",
    "Hair Mist",
    "Hair Fiber",
  ],
  "Tools": [
    "Hair Brushes & Comb",
    "Hair Straightener",
    "Hair Dryer",
    "Hair Curling Irons",
    "Hair Trimmer",
    "Hair Bands",
    "Hair Waver",
    "Hair Epilator",
  ],
  "Professional Hair": [
    "Revlon Professional",
    "L'Oréal Professionnel",
    "Cosmo",
    "Behave",
    "Secret Fragrance",
  ],
  "Face": [
    "Concealers",
    "Blushes",
    "Primer",
    "Foundations",
    "Setting Spray",
    "Bronzer & Contouring",
    "Highlighters",
    "Setting Powder",
    "BB-Creams & CC-Creams",
    "Setting Powder",
    "Sets",
    "Illuminators",
    "Face Palette",
  ],
  "Lips": [
    "Lipsticks",
    "Lip Plumper",
    "Lip Balm",
    "Lip Pencils",
    "Lip Stain",
    "Lip Gloss",
    "Lip Sets",
    "Lip Treatment",
  ],
  "Eyes": [
    "Eyelashes",
    "Eyeliner",
    "Mascara",
    "Eyeshadow",
    "Eyebrows",
    "Eye Pencil",
    "Eye Set",
  ],
  "Nails": [
    "Nail Polish Remover",
    "Fake Nails",
    "Nail Polish",
    "Nail Glue",
    "Nail Tools",
  ],
  "Accessories": [
    "Makeup Brushes",
    "Makeup & Travler Case",
    "Beauty Tools",
    "Candle Accessories",
    "Face Brush",
    "Brush Sets",
    "Sponges",    
  ],


};


const ProductPage = () => {

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [showSubcategories, setShowSubcategories] = useState(false);


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
              <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
              
                <select
                  className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubCategory("");
                    setShowSubcategories(true);
                  }}
                >
                  <option value="">Select Category</option>
                  {Object.keys(categories).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

              {/* Subcategories */}
              {showSubcategories && selectedCategory && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Subcategory</label>
                  <select
                    className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500"
                    value={selectedSubCategory}
                    onChange={(e) => {
                      setSelectedSubCategory(e.target.value);
                    }}
                  >
                    <option value="">Select Subcategory</option>
                    {categories[selectedCategory].map((subcat) => (
                      <option key={subcat} value={subcat}>
                        {subcat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sub-Subcategories */}
              {selectedSubCategory && subcategories[selectedSubCategory]?.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Sub-Subcategory</label>
                  <select
                    className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select Sub-Subcategory</option>
                    {subcategories[selectedSubCategory].map((subsubcat) => (
                      <option key={subsubcat} value={subsubcat}>
                        {subsubcat}
                      </option>
                    ))}
                  </select>
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
