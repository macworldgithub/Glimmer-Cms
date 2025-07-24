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
  const dispatch = useDispatch();

  const [services, setServices] = useState<{ _id: string; category: string }[]>(
    []
  );
  const [subservices, setSubservices] = useState<{ [key: string]: string[] }>(
    {}
  );
  const [productItems, setProductItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isDeleteServiceModalOpen, setIsDeleteServiceModalOpen] =
    useState(false);

  const [isSubServiceModalOpen, setIsSubServiceModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const [selectedService, setSelectedService] = useState({
    _id: "",
    category: "",
  });
  const [selectedSubservice, setSelectedSubservice] = useState({
    _id: "",
    name: "",
  });
  const [selectedProduct, setSelectedProduct] = useState({ _id: "", name: "" });

  const [newService, setNewService] = useState("");
  const [isUpdateServiceModalOpen, setIsUpdateServiceModalOpen] =
    useState(false);

  const [newSubservice, setNewSubService] = useState("");
  const [newProduct, setNewProduct] = useState("");

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
      setProductItems(subservices[selectedSubservice.name] || []);
    }
  }, [selectedSubservice.name, subservices]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getAllServices();
      setServices(data);
    } catch {
      message.error("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubservicesAndProducts = async (categoryId: string) => {
    if (!categoryId) return;
    try {
      setLoading(true);
      const data = await getAllServicesById(categoryId);

      if (Array.isArray(data.services)) {
        setSubservices({});
        setProductItems(data.services);
      } else if (typeof data.services === "object") {
        setSubservices(data.services);
        setProductItems([]);
      } else {
        setSubservices({});
        setProductItems([]);
      }
    } catch {
      message.error("Failed to fetch subservices and products");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectService = (e: any) => {
    const id = e.target.value;
    const category = e.target.options[e.target.selectedIndex].text;

    setSelectedService({ _id: id, category });
    setSelectedSubservice({ _id: "", name: "" });
    setSelectedProduct({ _id: "", name: "" });
  };

  const handleSelectSubservice = (e: any) => {
    const name = e.target.value;
    setSelectedSubservice({ _id: name, name });
    setSelectedProduct({ _id: "", name: "" });
  };

  const handleSelectProduct = (e: any) => {
    const name = e.target.value;
    setSelectedProduct({ _id: name, name });
  };

  const openServiceModal = () => setIsServiceModalOpen(true);
  const openSubServiceModal = (type: string) => {
    setModalType(type);
    setIsSubServiceModalOpen(true);
  };
  const openProductModal = (type: string) => {
    setModalType(type);
    setIsProductModalOpen(true);
  };

  const closeServiceModal = async () => {
    const trimmed = newService.trim();
    if (!trimmed) return;

    try {
      const res = await dispatch(
        createService({ category: trimmed, services: {} }) as any
      ).unwrap();
      if (res) {
        message.success("Service added successfully");
        fetchServices();
        setNewService("");
      }
    } catch {
      message.error("Failed to add service");
    }

    setIsServiceModalOpen(false);
  };

  const closeSubServiceModal = async () => {
    const name = newSubservice.trim();
    const updated = { ...subservices };

    try {
      if (modalType === "Add") {
        if (!updated[name]) updated[name] = [];
      }

      if (modalType === "Update" && selectedSubservice._id) {
        const old = selectedSubservice.name;
        updated[name] = updated[old];
        delete updated[old];
      }

      if (modalType === "Delete" && selectedSubservice.name) {
        delete updated[selectedSubservice.name]; // 🛠️ Delete just the gender
      }

      // Only proceed if it's Add, Update, or Delete of gender
      if (
        modalType === "Add" ||
        modalType === "Update" ||
        modalType === "Delete"
      ) {
        const payload = {
          category: selectedService.category,
          services: updated,
        };

        const res = await dispatch(
          updateService({
            category_id: selectedService._id,
            data: payload,
          }) as any
        ).unwrap();

        if (res) {
          const successMsg =
            modalType === "Delete"
              ? "Subservice (Gender) deleted"
              : "Subcategory updated";
          message.success(successMsg);

          setSubservices(updated);
          setNewSubService("");
          setSelectedSubservice({ _id: "", name: "" });
        }
      }
    } catch (err) {
      console.error(err);
      message.error(
        modalType === "Delete"
          ? "Error deleting subservice"
          : "Error updating subservice"
      );
    }

    setIsSubServiceModalOpen(false);
    setModalType("");
  };

  const closeProductModal = async () => {
    const updated = { ...subservices };
    const name = newProduct.trim();

    try {
      if (modalType === "Add") {
        if (!updated[selectedSubservice.name])
          updated[selectedSubservice.name] = [];
        if (!updated[selectedSubservice.name].includes(name)) {
          updated[selectedSubservice.name].push(name);
        }
      }

      if (modalType === "Update") {
        const index = updated[selectedSubservice.name].indexOf(
          selectedProduct._id
        );
        if (index !== -1) updated[selectedSubservice.name][index] = name;
      }

      if (modalType === "Delete") {
        // ✅ Remove the product from the gender array
        updated[selectedSubservice.name] = updated[
          selectedSubservice.name
        ].filter((item) => item !== selectedProduct._id);
      }

      const payload = {
        category: selectedService.category,
        services: updated,
      };

      const res = await dispatch(
        updateService({
          category_id: selectedService._id,
          data: payload,
        }) as any
      ).unwrap();

      if (res) {
        let msg = "Product updated";
        if (modalType === "Add") msg = "Product added";
        else if (modalType === "Delete") msg = "Product deleted";

        message.success(msg);
        setSubservices(updated);
        setNewProduct("");
        setSelectedProduct({
          _id: "",
          name: "",
        });
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to update product");
    }

    setIsProductModalOpen(false);
    setModalType("");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Manage Services
      </h2>

      <div className="flex flex-col gap-4">
        <label className="text-gray-700 font-medium">
          Select Service:
          <select
            value={selectedService._id}
            onChange={handleSelectService}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
          >
            <option value="">-- Select a service --</option>
            {services.map((s) => (
              <option key={s._id} value={s._id}>
                {s.category}
              </option>
            ))}
          </select>
        </label>

        {Object.keys(subservices).length > 0 && (
          <label className="text-gray-700 font-medium">
            Select Gender:
            <select
              value={selectedSubservice.name}
              onChange={handleSelectSubservice}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            >
              <option value="">-- Select a gender --</option>
              {Object.keys(subservices).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="text-gray-700 font-medium">
          Select Sub Service:
          <select
            value={selectedProduct.name}
            onChange={handleSelectProduct}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
          >
            <option value="">-- Select a sub service --</option>
            {productItems.map((product, idx) => (
              <option key={`${selectedService._id}-${idx}`} value={product}>
                {product}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button className="bg-blue-500 text-white" onClick={openServiceModal}>
          Add Service
        </Button>

        {selectedService._id && (
          <>
            <Button
              className="bg-yellow-500 text-white"
              onClick={() => {
                setNewService(selectedService.category);
                setIsUpdateServiceModalOpen(true);
              }}
            >
              Update Service
            </Button>

            <Button
              className="bg-red-500 text-white"
              onClick={() => setIsDeleteServiceModalOpen(true)}
            >
              Delete Service
            </Button>
          </>
        )}
      </div>

      {selectedService._id && (
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            className="bg-green-500 text-white"
            onClick={() => openSubServiceModal("Add")}
          >
            Add Gender
          </Button>

          {selectedSubservice._id && (
            <>
              <Button
                className="bg-yellow-500 text-white"
                onClick={() => openSubServiceModal("Update")}
              >
                Update Gender
              </Button>

              <Button
                className="bg-red-500 text-white"
                onClick={() => openSubServiceModal("Delete")}
              >
                Delete Gender
              </Button>
            </>
          )}
        </div>
      )}

      {selectedService._id && (
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            className="bg-green-500 text-white"
            onClick={() => {
              if (selectedSubservice.name) {
                openProductModal("Add");
              } else {
                message.warning(
                  "Please select a gender before adding a product."
                );
              }
            }}
          >
            Add Product
          </Button>

          {selectedSubservice.name && selectedProduct._id && (
            <>
              <Button
                className="bg-yellow-500 text-white"
                onClick={() => openProductModal("Update")}
              >
                Update Product
              </Button>

              <Button
                className="bg-red-500 text-white"
                onClick={() => openProductModal("Delete")}
              >
                Delete Product
              </Button>
            </>
          )}
        </div>
      )}

      {/* Modals */}
      <Modal
        title="Add New Service"
        open={isServiceModalOpen}
        onOk={closeServiceModal}
        onCancel={() => setIsServiceModalOpen(false)}
      >
        <Input
          placeholder="Service name"
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
        />
      </Modal>

      <Modal
        title="Update Service"
        open={isUpdateServiceModalOpen}
        onOk={async () => {
          const trimmed = newService.trim();
          if (!trimmed) return;

          try {
            const payload = {
              category: trimmed,
              services: subservices,
            };

            const res = await dispatch(
              updateService({
                category_id: selectedService._id,
                data: payload,
              }) as any
            ).unwrap();

            if (res) {
              message.success("Service name updated");
              fetchServices();
              setSelectedService({ ...selectedService, category: trimmed });
            }
          } catch {
            message.error("Failed to update service name");
          }

          setIsUpdateServiceModalOpen(false);
        }}
        onCancel={() => setIsUpdateServiceModalOpen(false)}
      >
        <Input
          placeholder="Updated service name"
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
        />
      </Modal>

      <Modal
        title="Delete Service"
        open={isDeleteServiceModalOpen}
        onOk={async () => {
          try {
            const res = await dispatch(
              deleteService({ category_id: selectedService._id }) as any
            ).unwrap();

            if (res) {
              message.success("Service deleted successfully");
              fetchServices(); // refresh
              setSelectedService({ _id: "", category: "" });
              setSubservices({});
              setProductItems([]);
            }
          } catch (err) {
            console.error(err);
            message.error("Failed to delete service");
          }
          setIsDeleteServiceModalOpen(false);
        }}
        onCancel={() => setIsDeleteServiceModalOpen(false)}
      >
        <p>
          Are you sure you want to delete the entire service:{" "}
          <strong>{selectedService.category}</strong>?
        </p>
      </Modal>

      <Modal
        title={`${modalType} Service`}
        open={isSubServiceModalOpen}
        onOk={closeSubServiceModal}
        onCancel={() => setIsSubServiceModalOpen(false)}
      >
        {modalType === "Delete" ? (
          <p>
            Are you sure you want to delete the service:{" "}
            <strong>{selectedService.category}</strong>?
          </p>
        ) : (
          <Input
            placeholder="Subcategory name"
            value={newSubservice}
            onChange={(e) => setNewSubService(e.target.value)}
          />
        )}
      </Modal>

      <Modal
        title={`${modalType} Product`}
        open={isProductModalOpen}
        onOk={closeProductModal}
        onCancel={() => setIsProductModalOpen(false)}
      >
        {modalType === "Delete" ? (
          <p>
            Are you sure you want to delete product:{" "}
            <strong>{selectedProduct._id}</strong>?
          </p>
        ) : (
          <Input
            placeholder="Product name"
            value={newProduct}
            onChange={(e) => setNewProduct(e.target.value)}
          />
        )}
      </Modal>
    </div>
  );
};

export default CreateServices;
