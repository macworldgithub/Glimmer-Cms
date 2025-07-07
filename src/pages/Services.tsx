import { useEffect, useState } from "react";
import { Button, Modal, Input, message, Select } from "antd";
import {
  getAllProductItem,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  createProductItem,
  updateProductItem,
  deleteProductItem,
} from "../api/category/api"; // Import your API functions
import {
  createService,
  deleteService,
  getAllServices,
  getAllServicesById,
  updateService,
} from "../api/service/api";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";

const { Option } = Select;

const CreateServices = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [services, setServices] = useState<{ _id: string; category: string }[]>(
    []
  );
  const [subservices, setSubservices] = useState<{ [key: string]: string[] }>(
    {}
  );
  const [productItems, setProductItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const [isSubServiceModalOpen, setIsSubServiceModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const [selectedService, setselectedService] = useState({
    _id: "",
    category: "",
  });
  const [selectedSubservice, setselectedSubservice] = useState({
    _id: "",
    name: "",
  });
  const [selectedProduct, setSelectedProduct] = useState({ _id: "", name: "" });
  const [newService, setNewService] = useState("");
  const [newSubservice, setNewSubService] = useState<string>("");
  const [newProduct, setNewProduct] = useState<string>("");

  // Fetch Categories
  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getAllServices();
      setServices(data);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch services");
      setLoading(false);
    }
  };

  // Fetch Subservices and Products
  const fetchSubservicesAndProducts = async (categoryId: string) => {
    if (!categoryId) {
      console.warn("No category ID provided for fetching subservices.");
      return;
    }
    try {
      setLoading(true);
      const data = await getAllServicesById(categoryId);

      if (Array.isArray(data.services)) {
        // Case 1: Services is an array (direct products)
        setSubservices({}); // No subservices, so set to empty object
        setProductItems(data.services); // Set products directly
      } else if (data.services && typeof data.services === "object") {
        // Case 2: Services is an object (subservices with nested products)
        setSubservices(data.services); // Set subservices
        setProductItems([]); // Reset products
      } else {
        // Fallback for invalid data
        setSubservices({});
        setProductItems([]);
      }

      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch subservices and products");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService._id) {
      fetchSubservicesAndProducts(selectedService._id);
    }
  }, [selectedService._id]);

  useEffect(() => {
    if (selectedSubservice.name) {
      // Extract products (values) for the selected subservice category
      const selectedProducts = subservices[selectedSubservice.name] || [];
      setProductItems(selectedProducts);
    }
  }, [selectedSubservice.name, subservices]);

  const handleSelectService = (event: any) => {
    const id = event.target.value;
    const category = event.target.options[event.target.selectedIndex].text;

    setselectedService({
      _id: id,
      category: category || "",
    });
    setselectedSubservice({ _id: "", name: "" });
    setSelectedProduct({ _id: "", name: "" });
  };

  const handleSelectSubservice = (event: any) => {
    const id = event.target.value;
    const name =
      event.target.options[event.target.selectedIndex].getAttribute(
        "data-name"
      );

    setselectedSubservice({
      _id: id,
      name: name || "",
    });
  };
  const handleSelectProduct = (event: any) => {
    const id = event.target.value;
    const name =
      event.target.options[event.target.selectedIndex].getAttribute(
        "data-name"
      );

    setSelectedProduct({
      _id: id,
      name: name || "",
    });
  };

  const openServiceModal = () => {
    setIsServiceModalOpen(true);
  };

  const closeServiceModal = async () => {
  const trimmedService = newService.trim();
  if (!trimmedService) return;

  try {
    const newServiceData = {
      category: trimmedService,
      services: {}, 
    };

    const res = await dispatch(createService(newServiceData)).unwrap();

    if (res) {
      message.success("Service added successfully!");
      setNewService("");
      fetchServices(); 
    }
  } catch (error) {
    console.error("Failed to add service", error);
    message.error("Failed to add service");
  }

  setIsServiceModalOpen(false);
};

  const openSubServiceModal = (type) => {
    setModalType(type);
    setIsSubServiceModalOpen(true);
  };
  const openProductModal = (type) => {
    setModalType(type);
    setIsProductModalOpen(true);
  };

  const closeSubServiceModal = async () => {
    if (
      modalType === "Add" ||
      (modalType === "Update" && selectedSubservice?._id)
    ) {
      try {
        const newSubserviceName = newSubservice.trim();
        const updatedSubservices = { ...subservices };
        if (modalType === "Add") {
          if (!updatedSubservices[newSubserviceName]) {
            // If it's a new category, add it with an empty array
            updatedSubservices[newSubserviceName] = [];
          }
          // Prevent duplicate entries
          if (
            !updatedSubservices[selectedService.category]?.includes(
              newSubserviceName
            )
          ) {
            updatedSubservices[selectedService.category]?.push(
              newSubserviceName
            );
          }
        }
        if (modalType === "Update") {
          const oldSubserviceName = selectedSubservice.name;

          if (oldSubserviceName && updatedSubservices[oldSubserviceName]) {
            updatedSubservices[newSubserviceName] =
              updatedSubservices[oldSubserviceName];

            delete updatedSubservices[oldSubserviceName];
          }
        }

        const requestBody = {
          category: selectedService.category,
          services: updatedSubservices,
        };
        const res = await dispatch(
          updateService({ category_id: selectedService._id, data: requestBody })
        ).unwrap();
        if (res) {
          alert("New Sub Category Updated");
          setSubservices(updatedSubservices);
          setNewSubService("");
        }
      } catch (error) {
        console.error("error", error);
      }
    }
    if (modalType === "Delete") {
      try {
        const res = await dispatch(
          deleteService({ category_id: selectedService._id })
        ).unwrap();
        if (res) {
          alert(`deleted ${selectedService.category}`);
        }
      } catch (error) {
        console.error("error", error);
        throw error;
      }
    }
    setIsSubServiceModalOpen(false);
    setModalType("");
  };

  const closeProductModal = async () => {
    if (
      modalType === "Add" ||
      (modalType === "Update" && selectedProduct?._id)
    ) {
      try {
        const newProductName = newProduct.trim();
        const updatedProduct = { ...subservices };

        if (modalType === "Add") {
          if (!updatedProduct[selectedSubservice.name]) {
            updatedProduct[selectedSubservice.name] = [];
          }

          // Prevent duplicates and add the new product
          if (
            !updatedProduct[selectedSubservice.name].includes(newProductName)
          ) {
            updatedProduct[selectedSubservice.name].push(newProductName);
          }
        }
        if (modalType === "Update" && selectedProduct?._id) {
          const oldProductName = selectedProduct._id;

          if (
            selectedSubservice._id &&
            updatedProduct[selectedSubservice._id]
          ) {
            // Find index of the existing product and replace it
            const productIndex =
              updatedProduct[selectedSubservice.name].indexOf(oldProductName);
            if (productIndex !== -1) {
              updatedProduct[selectedSubservice.name][productIndex] =
                newProductName;
            }
          }
        }

        const requestBody = {
          category: selectedService.category,
          services: updatedProduct,
        };
        console.log(requestBody);
        const res = await dispatch(
          updateService({ category_id: selectedService._id, data: requestBody })
        ).unwrap();
        if (res) {
          alert("New Product Updated");
          setSubservices(updatedProduct);
          setNewProduct("");
        }
      } catch (error) {
        console.error("error", error);
      }
    }
    // if (modalType === "Delete") {
    //   try {
    //     const res = await dispatch(
    //       deleteService({ category_id: selectedService._id })
    //     ).unwrap();
    //     if (res) {
    //       alert(`deleted ${selectedService.category}`);
    //     }
    //   } catch (error) {
    //     console.error("error", error);
    //     throw error;
    //   }
    // }
    setIsProductModalOpen(false);
    setModalType("");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Manage Services
      </h2>

      {/* Services, Subservices & Product Selection */}
      <div className="flex flex-col gap-4">
        <label className="text-gray-700 font-medium">
          Select Services:
          <select
            onChange={handleSelectService}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="" disabled selected>
              Select a service
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
          Select Gender:
          <select
            onChange={handleSelectSubservice}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="" disabled selected>
              Select a gender
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
          Select Sub Service:
          <select
            onChange={handleSelectProduct}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="" disabled selected>
              Select a sub service
            </option>
            {productItems.map((product, index) => (
              <option key={`${selectedService._id}-${index}`} value={product}>
                {product}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Button
        className="bg-blue-500 text-white mb-4 mt-4 px-4 py-2 rounded-md hover:bg-blue-600 transition"
        onClick={openServiceModal}
      >
        Add Service
      </Button>

      {/* Subcategory Actions */}
      {selectedService?._id && (
        <div className="mt-4 flex gap-3">
          {selectedSubservice?._id && (
            <Button
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
              onClick={() => openSubServiceModal("Update")}
            >
              Update Gender
            </Button>
          )}
          <Button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            onClick={() => openSubServiceModal("Add")}
          >
            Add Gender
          </Button>
          {selectedSubservice._id && (
            <Button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              onClick={() => openSubServiceModal("Delete")}
            >
              Delete Service
            </Button>
          )}
        </div>
      )}
      {/* Product Actions */}
      {selectedSubservice._id && (
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
          {/* {selectedProduct?._id && (
            <Button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              onClick={() => openProductModal("Delete")}
            >
              Delete Product
            </Button>
          )} */}
        </div>
      )}
      <Modal
        title="Add New Service"
        open={isServiceModalOpen}
        onOk={closeServiceModal}
        onCancel={() => setIsServiceModalOpen(false)}
      >
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Service Name:</label>
          <Input
            value={newService}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            onChange={(e) => setNewService(e.target.value)}
          />
        </div>
      </Modal>

      {/* Subcategory Modal */}
      <Modal
        title={`${modalType} Subcategory`}
        open={isSubServiceModalOpen}
        onOk={closeSubServiceModal}
        onCancel={() => setIsSubServiceModalOpen(false)}
      >
        <p>
          {modalType === "Update" ? (
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">
                Subcategory Name:
              </label>
              <Input
                value={newSubservice}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                //@ts-ignore
                onChange={(e) => setNewSubService(e.target.value)}
              />
            </div>
          ) : modalType === "Add" ? (
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">
                Subcategory Name:
              </label>
              <Input
                value={newSubservice}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                //@ts-ignore
                onChange={(e) => setNewSubService(e.target.value)}
              />
            </div>
          ) : (
            `Are you sure you want to delete the subcategory: ${selectedSubservice.name}?`
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
              <label className="text-gray-700 font-medium">Add Product:</label>
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

export default CreateServices;
