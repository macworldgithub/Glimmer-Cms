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
  const [images, setImages] = useState<string[]>([]);

  const [binaryImages, setBinaryImages] = useState({
    image1: "",
    image2: "",
    Image3: "",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    // Reset form and images when modal opens
    if (visible) {
      form.resetFields();

      const newImages: string[] = []; // Temporary array for new images

      if (product.image1) newImages.push(product.image1);
      if (product.image2) newImages.push(product.image2);
      if (product.image3) newImages.push(product.image3);

      setImages(newImages); // Set all images at once
    }
  }, [visible, product]);

  const handleSave = async () => {
    try {
      // Validate and get form values
      const formValues = await form.validateFields();
  
      // Construct the payload
      const payload = {
        ...formValues, // Includes name, quantity, description, base_price, discounted_price, and status
        image1: binaryImages.image1 || product.image1, // Use binaryImages for file data
        image2: binaryImages.image2 ||product.image2,
        //@ts-ignore
        image3: binaryImages.image3 || product.image3,
        _id: product._id, // Include the product ID for updates
      };
  
      // Dispatch the thunk with the payload
      //@ts-ignore
      dispatch(updateProductApi(payload));
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);

    // Update images
    setImages((prevImages) => {
      const updatedImages = prevImages ? [...prevImages] : [];
      if (updatedImages.length < 3) {
        updatedImages.push(url);
      }
      return updatedImages;
    });

    // Update binaryImages
    setBinaryImages((prevBinaryImages) => {
      const updatedBinaryImages = { ...prevBinaryImages };
      if (!prevBinaryImages.image1) {
        //@ts-ignore
        updatedBinaryImages.image1 = file;
      } else if (!prevBinaryImages.image2) {
        //@ts-ignore
        updatedBinaryImages.image2 = file;
        //@ts-ignore
      } else if (!prevBinaryImages.image3) {
        //@ts-ignore
        updatedBinaryImages.image3 = file;
      }
      return updatedBinaryImages;
    });

    // Return false to prevent automatic upload by Ant Design
    return false;
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

        <Form.Item label="Images">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={handleImageUpload}
              accept="image/*"
            >
              {images?.length < 3 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {images?.map((img, index) => (
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
