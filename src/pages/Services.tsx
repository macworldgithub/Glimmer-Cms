import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Input,
  message,
  Select,
} from "antd";
import {
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
  const [subservices, setSubservices] = useState<{ [key: string]: string[] }>({});
  console.log(subservices);
  const [productItems, setProductItems] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const [newSubservice, setNewSubService] = useState<string>("");

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
      return;
    }
    try {
      setLoading(true);
      const data = await getAllServicesById(categoryId);
      console.log("sub service", data.services);
      if (data.services && typeof data.services === "object") {
        setSubservices(data.services);
      } else {
        setSubservices({}); // Fallback to empty object if invalid
      }
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch subservices");
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService._id) {
      fetchSubservices(selectedService._id);
    }
  }, [selectedService._id]);

  const handleSelectService = (event: any) => {
    const id = event.target.value;
    const category =
      event.target.options[event.target.selectedIndex].getAttribute("data-category");

    setselectedService({
      _id: id,
      category: category || "",
    });
    setselectedSubservice({ _id: "", name: "" });
  };

  const handleSelectSubservice = (event: any) => {
    const id = event.target.value;
    const name =
      event.target.options[event.target.selectedIndex].getAttribute("data-name");

    setselectedSubservice({
      _id: id,
      name: name || "",
    });
  };

  const openSubServiceModal = (type) => {
    setModalType(type);
    setIsSubServiceModalOpen(true);
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
    </div>
  );
};

export default CreateServices;
