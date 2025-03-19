import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Input,
  message,
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
import { getAllServices, getAllServicesById } from "../api/service/api";

const { Option } = Select;

const CreateServices = () => {
  const [services, setServices] = useState<{ _id: string; category: string }[]>([]);
  const [subservices, setSubservices] = useState([]);
  const [productItems, setProductItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isSubServiceModalOpen, setIsSubServiceModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const [filterSubservice, setfilterSubservice] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);

  const [selectedService, setselectedService] = useState({
    _id: "",
    category: "",
  });
  const [selectedSubservice, setselectedSubservice] = useState({
    _id: "",
    name: "",
  });
  const [selectedProduct, setSelectedProduct] = useState({ _id: "", name: "" });

  const [newSubservice, setNewSubService] = useState();
  const [newProduct, setNewProduct] = useState();

  // Fetch Categories
  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getAllServices();
      console.log("service", data);
      setServices(data);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch services");
      setLoading(false);
    }
  };

  // Fetch Subcategories
  const fetchSubservices = async (categoryId: string) => {
    if (!categoryId) {
      console.warn("No category ID provided for fetching subservices.");
      return;
    }
    try {
      setLoading(true);
      const data = await getAllServicesById(categoryId);
      console.log("sub service", data);
      setSubservices(data.services);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch subservices");
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
    fetchServices();
    fetchProductItems();
  }, []);

  useEffect(() => {
    if (selectedService._id) {
      fetchSubservices(selectedService._id);
    }
  }, [selectedService._id]);

  useEffect(() => {
    if (selectedService._id && subservices) {
      const serviceKeys = Object.keys(subservices);
      setfilterSubservice(serviceKeys);
    }
  }, [selectedService._id, subservices]);

  const handleSelectService = (event: any) => {
    const id = event.target.value;
    const category =
      event.target.options[event.target.selectedIndex].getAttribute("data-category");

    setselectedService({
      _id: id,
      category: category || "",
    });
  };

  const handleSelectSubservice = (event: any) => {
    const id = event.target.value;
    const name =
      event.target.options[event.target.selectedIndex].getAttribute(
        "data-name"
      );

    setselectedSubservice((prevService) => ({
      ...prevService,
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
    setSelectedProduct((prevService) => ({
      ...prevService,
      name: name,
      _id: id,
    }));
  };

  useEffect(() => {
    const filteredSubServices = subservices.filter(
      (item) => item._id === selectedService._id
    );
    setfilterSubservice(filteredSubServices);

    console.log("checkk", selectedService);
  }, [selectedService._id]);

  useEffect(() => {
    function getSubserviceItems(data, subServiceId) {
      for (const service of data) {
        for (const subservice of service.sub_services) {
          if (subservice._id === subServiceId) {
            return subservice.items;
          }
        }
      }
      return [];
    }

    const filteredProducts = getSubserviceItems(
      productItems,
      selectedSubservice._id
    );

    setFilterProducts(filteredProducts);

    console.log("8888", filteredProducts, selectedSubservice);
  }, [selectedSubservice._id]);

  const openSubServiceModal = (type) => {
    setModalType(type);
    setIsSubServiceModalOpen(true);
  };

  const openProductModal = (type) => {
    setModalType(type);
    setIsProductModalOpen(true);
  };

  const closeSubServiceModal = async () => {
    if (modalType === "Add") {
      try {
        const res = await createSubcategory(
          newSubservice,
          "aaaa",
          selectedService._id
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
        setNewSubService(selectedService.name);
        const res = updateSubcategory(
          newSubservice,
          "desc",
          selectedSubservice._id,
          selectedService._id
        );

        if (res) {
          alert(`Updated ${newSubservice}`);
        }
      } catch (error) {
        console.error("error", error);
        throw error;
      }
    }
    if (modalType === "Delete") {
      try {
        const res = await deleteSubcategory(selectedSubservice._id);
        if (res) {
          alert(`deleted ${selectedSubservice.name}`);
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
    if (modalType === "Add") {
      try {
        const res = await createProductItem(
          newProduct,
          "aaaa",
          selectedSubservice._id
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
          selectedSubservice._id,
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
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="" disabled selected>
              Select a Subservice
            </option>
            {filterSubservice?.map((key) =>
              <option key={key} value={key} data-name={key}>
                {key}
              </option>
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

      {/* Subcategory Actions */}
      {selectedService?._id && (
        <div className="mt-4 flex gap-3">
          {selectedSubservice._id && (
            <Button
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
              onClick={() => openSubServiceModal("Update")}
            >
              Update Subcategory
            </Button>
          )}
          <Button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            onClick={() => openSubServiceModal("Add")}
          >
            Add Subcategory
          </Button>
          {selectedSubservice._id && (
            <Button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              onClick={() => openSubServiceModal("Delete")}
            >
              Delete Subcategory
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

export default CreateServices;
