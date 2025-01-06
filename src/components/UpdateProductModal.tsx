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
  images: string[];
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
  const [images, setImages] = useState<string[]>(product.images);
  const dispatch = useDispatch();

  useEffect(() => {
    // Reset form and images when modal opens
    if (visible) {
      form.resetFields();
      setImages([...product.images]); // Clone the original images
    }
  }, [visible, product, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form Values:", values);

      // Dispatch the updateProductApi action
      dispatch(
        //@ts-ignore
        updateProductApi({
          name: values.name,
          quantity: values.quantity,
          description: values.description,
          images: images,
          base_price: values.base_price,
          discounted_price: values.discounted_price,
          status: values.status,
          store: product.store,
          _id: product._id,
        })
      );
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  const handleImageUpload = (file: any) => {
    if (images.length >= 5) {
      message.error("You can only upload up to 5 images.");
      return false;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImages([...images, base64]);
    };
    reader.readAsDataURL(file);

    return false; // Prevent default upload behavior
  };

  const handleImageDelete = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
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
          images: product.images.join(", "), // Display images as comma-separated string
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

        <Form.Item label="Images">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={handleImageUpload}
              accept="image/*"
            >
              {images.length < 5 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {images.map((img, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <Image
                    src={img}
                    alt={`Product Image ${index + 1}`}
                    width={100}
                    height={100}
                    style={{ borderRadius: "4px", objectFit: "cover" }}
                  />
                  <Button
                    shape="circle"
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    style={{ position: "absolute", top: -8, right: -8 }}
                    onClick={() => handleImageDelete(index)}
                  />
                </div>
              ))}
            </div>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateModal;
