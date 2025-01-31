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
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { updateProductApi } from "../api/products/api";
import { getAllProducts } from "../api/products/api";
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
  // State for images
  const [images, setImages] = useState({
    image1: product.image1,
    image2: product.image2,
    image3: product.image3,
  });

  // Handle image deletion
  const handleDeleteImage = (key: keyof typeof images) => {
    setImages((prev) => ({ ...prev, [key]: "" }));
  };

  // Handle image upload
  const handleUpload = (file: File, key: keyof typeof images) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImages((prev) => ({ ...prev, [key]: file }));
    };
    reader.readAsDataURL(file);
    return false; // Prevent default upload
  };

  const handleSave = async () => {
    try {
      const formValues = await form.validateFields();

      // Construct the payload
      const payload = {
        ...formValues,
        _id: product._id,
        ...images, // Includes updated image states ("" for deleted, File for new upload)
      };

      // Dispatch API call
      //@ts-ignore
      dispatch(updateProductApi(payload));

      //@ts-ignore
      dispatch(getAllProducts({ page_no: 1 }));

      onSave(payload);
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
    }
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
          {(["image1", "image2", "image3"] as const).map((key) => (
            <div key={key} className="relative border p-2">
              {images[key] ? (
                <>
                  <Image
                    width={100}
                    height={100}
                    src={
                      typeof images[key] === "string"
                        ? images[key]
                        : URL.createObjectURL(images[key] as File)
                    }
                    alt={`Product ${key}`}
                  />
                  <Button
                    type="text"
                    danger
                    className="absolute top-0 right-0"
                    onClick={() => handleDeleteImage(key)}
                    icon={<DeleteOutlined />}
                  />
                </>
              ) : (
                <Upload
                  showUploadList={false}
                  beforeUpload={(file) => handleUpload(file, key)}
                >
                  <Button icon={<PlusOutlined />}>Upload</Button>
                </Upload>
              )}
            </div>
          ))}
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateModal;
