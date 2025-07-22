import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  InputNumber,
  Select,
  Form,
  Button,
  Upload,
  message,
} from "antd";
import { UploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import { BACKEND_URL } from "../config/server";

import axios from "axios";
import { RootState } from "../store/store";
import {
  getAllServices,
  getAllServicesById,
  getAllServicesForSalon,
} from "../api/service/api";
const { TextArea } = Input;
const { Option } = Select;

interface Salon {
  id: string;
  categoryId: string;
  subCategoryName: string;
  subSubCategoryName: string;
  name: string;
  description: string;
  duration: number;
  image1: string;
  image2: string;
  image3: string;
  requestedPrice: number;
  base_price: number;
  discounted_price: number;
  status: "Active" | "Inactive";
  actions: string;
}
interface UpdateModalProps {
  visible: boolean;
  salon: Salon;
  onClose: () => void;
  onSave: (updatedSalon: Salon) => void;
  page: number;
}

const UpdateServiceModal: React.FC<UpdateModalProps> = ({
  visible,
  salon,
  onClose,
  page,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [finalPrice, setFinalPrice] = useState(0);
  const token = useSelector((state: RootState) => state.Login.token);

  const [services, setServices] = useState<{ _id: string; category: string }[]>(
    []
  );
  const [subservices, setSubservices] = useState<{ [key: string]: string[] }>(
    {}
  );
  const [productItems, setProductItems] = useState<string[]>([]);

  const [selectedService, setSelectedService] = useState({
    _id: "",
    category: "",
  });
  const [selectedSubservice, setSelectedSubservice] = useState({
    _id: "",
    name: "",
  });
  const [selectedProduct, setSelectedProduct] = useState({ _id: "", name: "" });

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

  useEffect(() => {
    if (visible && salon && services.length > 0) {
      const matchedService = services.find((s) => s._id === salon.categoryId);
      setSelectedService({
        _id: salon.categoryId,
        category: matchedService ? matchedService.category : "",
      });

      setSelectedSubservice({
        _id: "",
        name: salon.subCategoryName,
      });

      setSelectedProduct({
        _id: "",
        name: salon.subSubCategoryName,
      });

      form.setFieldsValue({
        categoryId: salon.categoryId,
        categoryName: matchedService ? matchedService.category : "",
        subCategoryName: salon.subCategoryName,
        subSubCategoryName: salon.subSubCategoryName,
      });
    }
  }, [visible, salon, services]); // make sure services is included here

  const fetchServices = async () => {
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      message.error("Failed to fetch services");
    }
  };

  const fetchSubservicesAndProducts = async (categoryId: string) => {
    try {
      const data = await getAllServicesById(categoryId);
      if (Array.isArray(data.services)) {
        setSubservices({});
        setProductItems(data.services);
      } else if (typeof data.services === "object") {
        setSubservices(data.services);
        setProductItems([]);
      }
    } catch (error) {
      message.error("Failed to fetch subservices and products");
    }
  };

  const handleSelectService = (event: any) => {
    const id = event.target.value;
    const category = event.target.options[event.target.selectedIndex].text;
    setSelectedService({ _id: id, category });
    setSelectedSubservice({ _id: "", name: "" });
    setSelectedProduct({ _id: "", name: "" });
  };

  const handleSelectSubservice = (event: any) => {
    const id = event.target.value;
    const name =
      event.target.options[event.target.selectedIndex].getAttribute(
        "data-name"
      );
    setSelectedSubservice({ _id: id, name: name || "" });
  };

  const handleSelectProduct = (event: any) => {
    const id = event.target.value;
    const name =
      event.target.options[event.target.selectedIndex].getAttribute(
        "data-name"
      );
    setSelectedProduct({ _id: id, name: name || "" });
  };

  const [pictures, setPictures] = useState<any>({
    image1: "",
    image2: "",
    image3: "",
  });

  useEffect(() => {
    setPictures((image) => ({
      ...image,
      image1: form.getFieldValue("image1"),
      image2: form.getFieldValue("image2"),
      image3: form.getFieldValue("image3"),
    }));
  }, []);

  const handleUpload = (file, key) => {
    setPictures((prev) => ({
      ...prev,
      [key]: file,
    }));
    return false;
  };

  const handleDelete = (key) => {
    setPictures((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const handleSave = async () => {
    const formData = new FormData();

    formData.append("id", salon.id);
    formData.append("name", form.getFieldValue("name"));
    formData.append("description", form.getFieldValue("description"));
    formData.append("duration", form.getFieldValue("duration"));
    formData.append("base_price", form.getFieldValue("base_price"));
    formData.append("discounted_price", form.getFieldValue("discounted_price"));
    formData.append("requestedPrice", form.getFieldValue("requestedPrice"));
    formData.append("status", form.getFieldValue("status"));

    formData.append("categoryId", form.getFieldValue("categoryId"));
    formData.append("subCategoryName", form.getFieldValue("subCategoryName"));
    formData.append(
      "subSubCategoryName",
      form.getFieldValue("subSubCategoryName")
    );

    Object.entries(pictures).forEach(([key, value]) => {
      //@ts-ignore
      formData.append(key, value);
    });

    try {
      await axios.put(
        `${BACKEND_URL}/salon-services/updateServiceById`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      //@ts-ignore
      dispatch(getAllServicesForSalon({ page_no: page }));
      alert("Service Updated successfully!");
      onClose();
      window.location.reload();
    } catch (error) {
      message.error("Failed to submit product.");
      console.error(error);
    }
  };

  const getImageSrc = (image) => {
    return image instanceof File ? URL.createObjectURL(image) : image;
  };

  useEffect(() => {
    form.setFieldValue("categoryName", selectedService.category);
    form.setFieldValue("categoryId", selectedService._id);
    form.setFieldValue("subCategoryName", selectedSubservice.name);
    form.setFieldValue("subSubCategoryName", selectedProduct.name);
  }, [selectedService, selectedSubservice, selectedProduct]);

  const calculateDiscountedPrice = () => {
    const basePrice = form.getFieldValue("base_price") || 0;
    const discountPrice = form.getFieldValue("discounted_price") || 0;

    const discountedPrice = (basePrice * (100 - discountPrice)) / 100;
    setFinalPrice(parseFloat(discountedPrice.toFixed(2)));
  };

  return (
    <Modal
      title="Update Service"
      visible={visible}
      onCancel={onClose}
      onOk={handleSave}
      okText="Save"
      cancelText="Cancel"
      bodyStyle={{ width: "480px" }}
    >
      <Form
        form={form}
        className="w-[100%] "
        initialValues={{
          id: salon.id,
          name: salon.name,
          description: salon.description,
          duration: salon.duration,
          image1: salon.image1,
          image2: salon.image2,
          image3: salon.image3,
          requestedPrice: salon.requestedPrice,
          base_price: salon.base_price,
          discounted_price: salon.discounted_price,
          status: salon.status,
          categoryId: selectedService._id,
          categoryName: selectedService.category,
          subCategoryName: selectedSubservice.name,
          subSubCategoryName: selectedProduct.name,
        }}
      >
        <Form.Item label="Service" name="categoryId">
          <select value={selectedService._id} onChange={handleSelectService}>
            <option value="" disabled>
              Select Service
            </option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.category}
              </option>
            ))}
          </select>
        </Form.Item>

        <Form.Item label="Sub Service" name="subCategoryName">
          <select
            value={selectedSubservice.name}
            onChange={handleSelectSubservice}
            disabled={!selectedService._id}
          >
            <option value="" disabled>
              Select Gender
            </option>
            {Object.keys(subservices).map((category) => (
              <option key={category} value={category} data-name={category}>
                {category}
              </option>
            ))}
          </select>
        </Form.Item>

        <Form.Item label="Product" name="subSubCategoryName">
          <select
            value={selectedProduct.name}
            onChange={handleSelectProduct}
            disabled={!selectedSubservice.name}
          >
            <option value="" disabled>
              Select Sub Service
            </option>
            {productItems.map((product, index) => (
              <option
                key={`${selectedService._id}-${index}`}
                value={product}
                data-name={product}
              >
                {product}
              </option>
            ))}
          </select>
        </Form.Item>

        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>

        <Form.Item label="Duration" name="duration">
          <InputNumber />
        </Form.Item>

        <Form.Item label="Requested Price" name="requestedPrice">
          <InputNumber />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea rows={3} />
        </Form.Item>

        <div className="p-6 bg-white rounded-md my-4 shadow-md border-l-4 border-red-500 relative">
          <h2 className="text-lg font-medium text-red-600 mb-2">
            Pricing - Restricted Section
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Only the Super Admin can modify this section.
          </p>

          <Form.Item
            label="Base Price"
            name="base_price"
            rules={[{ required: true, message: "Please enter the base price" }]}
          >
            <InputNumber
              min={0}
              className="w-full rounded-md shadow-sm p-3 border border-gray-400 bg-gray-100"
              onChange={calculateDiscountedPrice}
              readOnly
            />
          </Form.Item>

          <Form.Item label="Discounted Price (%)" name="discounted_price">
            <InputNumber
              min={0}
              max={100}
              className="w-full rounded-md shadow-sm p-3 border border-gray-400 bg-gray-100"
              onChange={(value) => {
                if (value > 100) value = 100;
                form.setFieldsValue({ discounted_price: value });
                calculateDiscountedPrice();
              }}
              readOnly
            />
          </Form.Item>

          <p className="text-sm text-gray-600 mt-1">
            Final Price:{" "}
            <span className="font-semibold text-black">PKR {finalPrice}</span>
          </p>

          <div className="absolute top-2 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow-md">
            Managed by Super Admin
          </div>
        </div>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Select>
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
        </Form.Item>

        <div className="flex flex-wrap gap-4">
          <div className="flex flex-wrap gap-4">
            {Object.entries(pictures).map(([key, image]) => (
              <div key={key} className="relative flex flex-col items-center">
                {image ? (
                  <>
                    <img
                      src={getImageSrc(image)}
                      alt="Product"
                      width={100}
                      height={100}
                      className="rounded-md object-cover border"
                    />
                    <Button
                      type="text"
                      danger
                      icon={<CloseCircleOutlined />}
                      onClick={() => handleDelete(key)}
                      className="mt-1"
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <Upload
                    beforeUpload={(file) => handleUpload(file, key)}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                )}
              </div>
            ))}
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateServiceModal;
