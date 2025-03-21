import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  addImages,
  removeImage,
  resetImage,
  updateSalon,
} from "../slices/addSalonSlice";
import {
  addSalonApi,
  getAllServices,
  getAllServicesById,
} from "../api/service/api";
import { message } from "antd";

const ServicePage = () => {
  const dispatch = useDispatch();
  const addSalon = useSelector((state: RootState) => state.AddSalon);
  const selectedService = useSelector(
    (state: RootState) => state.AddSalon.categoryId
  );
  const selectedSubservice = useSelector(
    (state: RootState) => state.AddSalon.subCategoryName
  );
  const selectedProduct = useSelector(
    (state: RootState) => state.AddSalon.subSubCategoryName
  );
  const [services, setServices] = useState<{ _id: string; category: string }[]>(
    []
  );
  const [subservices, setSubservices] = useState<{ [key: string]: string[] }>(
    {}
  );
  const [productItems, setProductItems] = useState<string[]>([]);

  // Fetch Categories
  const fetchServices = async () => {
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      message.error("Failed to fetch services");
    }
  };

  // Fetch Subservices and Products
  const fetchSubservicesAndProducts = async (categoryId: string) => {
    try {
      const data = await getAllServicesById(categoryId);
      if (Array.isArray(data.services)) {
        setSubservices({});
        setProductItems(data.services);
      } else if (data.services && typeof data.services === "object") {
        setSubservices(data.services);
        setProductItems([]);
      } else {
        setSubservices({});
        setProductItems([]);
      }
    } catch (error) {
      message.error("Failed to fetch subservices and products");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService) {
      fetchSubservicesAndProducts(selectedService);
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedSubservice) {
      // Extract products (values) for the selected subservice category
      const selectedProducts = subservices[selectedSubservice] || [];
      setProductItems(selectedProducts);
    }
  }, [selectedSubservice, subservices]);

  const handleSelectService = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value;
    if (!id) {
      alert("Invalid selection");
      return;
    }
    dispatch(
      updateSalon({
        categoryId: id,
        subCategoryName: "", // Reset subcategory when a new service is selected
        subSubCategoryName: "", // Reset subSubCategory
      })
    );
  };

  const handleSelectSubservice = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const name =
      event.target.options[event.target.selectedIndex]?.getAttribute(
        "data-name"
      );
    dispatch(updateSalon({ subCategoryName: name || "" }));
  };

  const handleSelectProduct = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const name =
      event.target.options[event.target.selectedIndex]?.getAttribute(
        "data-name"
      );
    dispatch(updateSalon({ subSubCategoryName: name || "" }));
  };

  const HandleChange = (name: string, value: string | number | any) => {
    dispatch(updateSalon({ [name]: value }));
  };

  const images = useSelector((state: RootState) => state.AddSalon.images);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];

    if (files.length + images.length > 3) {
      alert("You can only upload up to 3 images.");
      return;
    }

    const fileData = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    dispatch(addImages(fileData));
  };

  const handleRemoveImage = (index: number) => {
    if (images.length === 1) {
      dispatch(resetImage());
      setPreviewUrls([]);
    }
    dispatch(removeImage(index));
  };

  const HandleConfirm = () => {
    const categoryId = selectedService;
    if (!categoryId) {
      alert("Please select a category before submitting.");
      return;
    }
    //@ts-ignore
    dispatch(addSalonApi({}));
  };

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    console.log(images, previewUrls, "problemo");
    const urls = images.map((image) => image.url);
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleDiscountChange = (value) => {
    let discount = parseFloat(value);

    // Ensure discount does not exceed 100
    if (discount > 100) discount = 100;
    if (discount < 0 || isNaN(discount)) discount = 0;

    HandleChange("discounted_price", discount);
  };

  return (
    <div className=" mx-auto overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between ">
        <div>
          <h1 className="text-2xl text-gray-600">Add a new Salon Service</h1>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0 max-sm:gap-1 max-sm:flex-col">
          <div>
            <button
              onClick={() => {
                HandleConfirm();
              }}
              className="bg-[#5f61e6] text-white px-4 py-2 rounded-md "
            >
              Publish Service
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex gap-x-4 flex-col lg:flex-row ">
        <div className="w-2/3 max-lg:w-full">
          <div className="border-gray-200  rounded-md  bg-white p-6 my-2 shadow-md">
            <h2 className="text-lg  mb-4 text-gray-700 ">
              Service information
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Salon title"
                className="w-full border-solid border border-gray-400 rounded-md shadow-sm p-3"
                value={addSalon.name}
                onChange={(e) => HandleChange("name", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                About (Optional)
              </label>
              <textarea
                placeholder=""
                className="w-full rounded-md shadow-sm p-3 border-solid border   border-gray-400"
                value={addSalon.description}
                onChange={(e) => HandleChange("description", e.target.value)}
              >
                {" "}
              </textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Duration
              </label>
              <input
                type="number"
                placeholder="Duration in minutes and hours"
                className="w-full border-solid border border-gray-400 rounded-md shadow-sm p-3"
                value={addSalon.duration || ""}
                onChange={(e) => HandleChange("duration", e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Requested Price
              </label>
              <input
                type="number"
                placeholder="Request Price to super admin"
                className="w-full border-solid border border-gray-400 rounded-md shadow-sm p-3"
                value={addSalon.requestedPrice || ""}
                onChange={(e) => HandleChange("requestedPrice", e.target.value)}
              />
            </div>
          </div>

          <div className="border-gray-200 rounded-md max-md:w-full bg-white px-4 py-2 my-4 shadow-md">
            <div className="mt-4 flex flex-row justify-between max-sm:flex-col max-sm:mt-1">
              <div>
                <h2 className="text-lg text-gray-700 mb-4">Service Image</h2>
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
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.url} // Use stored URL
                    alt={image.name}
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
        </div>

        {/* Right Section (Pricing) */}
        <div className="w-1/3 max-lg:w-full">
          <div className="p-6 bg-white rounded-md my-4 shadow-md border-l-4 border-red-500 relative">
            <h2 className="text-lg font-medium text-red-600 mb-2">
              Pricing - Restricted Section
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Only the Super Admin can modify this section.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actual Price
              </label>
              <input
                type="number"
                placeholder="Price"
                className="w-full rounded-md shadow-sm p-3 border border-gray-400 bg-gray-100 opacity-60 cursor-not-allowed"
                value={addSalon.base_price || ""}
                readOnly
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discounted Percentage (%)
              </label>
              <input
                type="number"
                placeholder="Discounted Price"
                className="w-full rounded-md shadow-sm p-3 border border-gray-400 bg-gray-100 opacity-60 cursor-not-allowed"
                value={addSalon.discounted_price || ""}
                max={100}
                readOnly
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Final Price
              </label>
              <input
                type="number"
                placeholder="Final Price"
                className="w-full rounded-md shadow-sm p-3 border border-gray-400 bg-gray-100 opacity-60 cursor-not-allowed"
                value={
                  addSalon.base_price && addSalon.discounted_price
                    ? (
                        addSalon.base_price -
                        (addSalon.base_price * addSalon.discounted_price) / 100
                      ).toFixed(2)
                    : addSalon.base_price || ""
                }
                readOnly
              />
            </div>

            {/* Tooltip on hover */}
            <div className="absolute top-2 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Managed by Super Admin
            </div>
          </div>
          <label className="text-gray-700 font-medium">
            Select Services:
            <select
              onChange={handleSelectService}
              value={selectedService || ""}
              className="w-full mt-2 mb-4 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="" disabled selected>
                Select a Service
              </option>
              {services.map((service) => (
                <option
                  key={service._id}
                  value={service._id}
                  data-name={service.category}
                >
                  {service.category}
                </option>
              ))}
            </select>
          </label>

          <label className="text-gray-700 font-medium">
            Select Subservice:
            <select
              onChange={handleSelectSubservice}
              className="w-full mt-2 mb-4 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={selectedSubservice}
            >
              <option value="" disabled selected>
                Select a Subservice
              </option>
              {Object.keys(subservices).map((category) => (
                <option
                  key={category}
                  value={category} // Use the category name as the value
                  data-name={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="text-gray-700 font-medium">
            Select Product:
            <select
              onChange={handleSelectProduct}
              className="w-full mt-2 mb-4 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={selectedProduct}
            >
              <option value="" disabled selected>
                Select a Product
              </option>
              {productItems.map((product, index) => (
                <option key={`${selectedService}-${index}`} value={product} data-name={product}>
                  {product}
                </option>
              ))}
            </select>
          </label>
          <div className="shadow-md  p-6 bg-white rounded-md max-md:w-full">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Organize</h2>
            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Status
              </label>
              <select
                value={addSalon.status}
                onChange={(e) => HandleChange("status", e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="Active">Active</option>{" "}
                <option value="Inactive">Inactive</option>{" "}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
