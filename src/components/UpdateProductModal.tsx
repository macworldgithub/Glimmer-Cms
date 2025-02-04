import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  InputNumber,
  Select,
  Form,
  Button,
  Upload,
  Space,
  Image,
  message,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateProductApi } from "../api/products/api";
import { getAllProducts } from "../api/products/api";

import { BACKEND_URL } from "../config/server";

import axios from "axios";
import { RootState } from "../store/store";
const { TextArea } = Input;
const { Option } = Select;

interface Product {
  name: string;
  quantity: number;
  description: string;
  image1: string;
  image2: string;
  image3: string;
  base_price: number;
  discounted_price: number;
  status: "Active" | "Inactive";
  store: string;
  _id: string;
  actions: string;
}
interface UpdateModalProps {
  visible: boolean;
  product: Product;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
  page: number;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  visible,
  product,
  onClose,
  onSave,
  page,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.Login.token);

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
    console.log("lelee", key);
    setPictures((prev) => ({
      ...prev,
      [key]: file,
    }));
    return false; // Prevent default upload behavior
  };

  const handleDelete = (key) => {
    setPictures((prev) => ({
      ...prev,
      [key]: "", // Set to null or remove the key
    }));
  };

  const handleSave = async () => {
    const formData = new FormData();

    formData.append("name", form.getFieldValue("name"));
    formData.append("quantity", form.getFieldValue("quantity"));
    formData.append("description", form.getFieldValue("description"));
    formData.append("base_price", form.getFieldValue("base_price"));
    formData.append("discounted_price", form.getFieldValue("discounted_price"));
    formData.append("status", form.getFieldValue("status"));

    // Append images (check if file or URL)
    Object.entries(pictures).forEach(([key, value]) => {
      // if (value instanceof File) {
      //   formData.append(key, value);
      // } else if (typeof value === "string") {
      //   formData.append(key, value); // Send image URL directly
      // }
      //@ts-ignore
      formData.append(key, value);
    });

    try {
      const response = await axios.put(
        `${BACKEND_URL}/product/update_store_product_by_id?id=${product._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Product Updated successfully!");
      //@ts-ignore
      dispatch(getAllProducts({ page_no: page }));
      console.log(response.data);
    } catch (error) {
      message.error("Failed to submit product.");
      console.error(error);
    }
  };

  const getImageSrc = (image) => {
    return image instanceof File ? URL.createObjectURL(image) : image;
  };

  return (
    <Modal
      title="Update Product"
      visible={visible}
      onCancel={onClose}
      onOk={handleSave}
      okText="Save"
      cancelText="Cancel"
      //   style={{ width: "1000px", maxWidth: "100%", height: "80vh", top: "10px" }} // Customize modal size and positioning
      bodyStyle={{ width: "480px" }} //
    >
      <Form
        form={form}
        className="w-[100%] "
        initialValues={{
          name: product.name,
          quantity: product.quantity,
          description: product.description,
          image1: product.image1,
          image2: product.image2,
          image3: product.image3, // Display images as comma-separated string
          base_price: product.base_price,
          discounted_price: product.discounted_price,
          status: product.status,
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the product name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true, message: "Please enter the quantity" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Base Price"
          name="base_price"
          rules={[{ required: true, message: "Please enter the base price" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Discounted Price" name="discounted_price">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

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

export default UpdateModal;
