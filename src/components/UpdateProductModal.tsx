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

import {
  getAllSubcategories,
  getAllProductItem,
  getAllCategories,
} from "../api/category/api";

import { BACKEND_URL } from "../config/server";

import axios from "axios";
import { RootState } from "../store/store";
const { TextArea } = Input;
const { Option } = Select;

interface Selection {
  category_id: string;
  category_name: string;
  sub_categories: {
    sub_category_id: string;
    name: string;
    items: {
      item_id: string;
      name: string;
    }[];
  }[];
}

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
  category: string;
  sub_category: string;
  item: string;
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
  const [selections, setSelection] = useState<Selection[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productItemsRes] = await Promise.all([getAllProductItem()]);
        const Selections = transformData(productItemsRes);
        setSelection(Selections);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState({
    id: "",
    name: "",
  });
  const [selectedSubCategory, setSelectedSubCategory] = useState({
    id: "",
    name: "",
  });
  const [selectedItem, setSelectedItem] = useState({ id: "", name: "" });

  const token = useSelector((state: RootState) => state.Login.token);

  const [pictures, setPictures] = useState<any>({
    image1: "",
    image2: "",
    image3: "",
  });

  function transformData(data: any[]): Selection[] {
    return data.map((category) => ({
      category_id: category.product_category._id,
      category_name: category.product_category.name,
      sub_categories: category.sub_categories.map((subCategory) => ({
        sub_category_id: subCategory._id,
        name: subCategory.name,
        items: subCategory.items.map((item) => ({
          item_id: item._id,
          name: item.name,
        })),
      })),
    }));
  }

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

    formData.append("category", form.getFieldValue("categoryId"));
    formData.append("sub_category", form.getFieldValue("sub_categoryId"));
    formData.append("item", form.getFieldValue("itemId"));

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

  function getCategoryById(data: Selection[], categoryId: string) {
    const category = data.find((cat) => cat.category_id === categoryId);

    return category
      ? { id: category.category_id, name: category.category_name }
      : null;
  }

  function getSubCategoryById(data: Selection[], subCategoryId: string) {
    for (const category of data) {
      for (const subCategory of category.sub_categories) {
        if (subCategory.sub_category_id === subCategoryId) {
          console.log("chala sub category", {
            id: subCategory.sub_category_id,
            name: subCategory.name,
          });
          return { id: subCategory.sub_category_id, name: subCategory.name };
        }
      }
    }
    console.log("chala nhi sub category", data, subCategoryId);
    return null; // Return null if subCategoryId is not found
  }

  function getItemById(data: Selection[], itemId: string) {
    for (const category of data) {
      for (const subCategory of category.sub_categories) {
        const item = subCategory.items.find((it) => it.item_id === itemId);
        if (item) {
          return { id: item.item_id, name: item.name };
        }
      }
    }
    return null;
  }

  const HandleChangeCategory = (value: string) => {
    const { id, name } = getCategoryById(selections, value);

    if (id !== selectedCategory.id) {
      setSelectedCategory((item: any) => ({ ...item, id: id, name: name }));

      setSelectedSubCategory({ id: "", name: "" });
      setSelectedItem({ id: "", name: "" });
    }
  };
  const HandleChangeSubCategory = (value: string) => {
    const { id, name } = getSubCategoryById(selections, value);

    if (id !== selectedSubCategory.id) {
      setSelectedSubCategory((item: any) => ({ ...item, id: id, name: name }));

      setSelectedItem({ id: "", name: "" });
    }
  };
  const HandleChangeItem = (value: string) => {
    const { id, name } = getItemById(selections, value);

    setSelectedItem((item: any) => ({ ...item, id: id, name: name }));
  };

  useEffect(() => {
    //@ts-ignore
    setSelectedCategory((item) => ({
      ...item,
      id: product.category,
      name: getCategoryById(selections, product.category)?.name,
    }));
    //@ts-ignore
    setSelectedSubCategory((item) => ({
      ...item,
      id: product.sub_category,
      name: getSubCategoryById(selections, product.sub_category)?.name,
    }));
    setSelectedItem((item) => ({
      ...item,
      id: product.item,
      name: getItemById(selections, product.item)?.name,
    }));
  }, [selections]);

  useEffect(() => {
    form.setFieldValue("categoryName", selectedCategory.name);
    form.setFieldValue("categoryId", selectedCategory.id);
    form.setFieldValue("sub_categoryName", selectedSubCategory.name);
    form.setFieldValue("sub_categoryId", selectedSubCategory.id);
    form.setFieldValue("itemName", selectedItem.name);
    form.setFieldValue("itemId", selectedItem.id);
    // console.log(() => getCategoryById(selections, product.category), "le bhai");
  }, [selectedCategory, selectedSubCategory, selectedItem]);

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
          categoryId: selectedCategory.id,
          categoryName: selectedCategory.name,
          sub_categoryId: selectedSubCategory.id,
          sub_categoryName: selectedSubCategory.name,
          itemId: selectedItem.id,
          itemName: selectedItem.name,
        }}
      >
        <Form.Item label="Category" name="categoryName">
          <Select
            placeholder="Select a category"
            //@ts-ignore
            onChange={HandleChangeCategory}
          >
            {selections?.map((item: any) => (
              <Select.Option key={item.category_id} value={item.category_id}>
                {" "}
                {item.category_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Subcategory" name="sub_categoryName">
          <Select
            placeholder="Select a subcategory"
            //@ts-ignore
            onChange={HandleChangeSubCategory}
            disabled={!selectedCategory.id}
          >
            {selections
              //@ts-ignore
              .find((item) => item.category_id === selectedCategory.id)
              ?.sub_categories.map((sub) => (
                <Select.Option
                  key={sub.sub_category_id}
                  value={sub.sub_category_id}
                >
                  {sub.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item label="Item" name="itemName">
          <Select
            placeholder="Select a Item"
            //@ts-ignore
            onChange={HandleChangeItem}
            disabled={!selectedSubCategory.id}
          >
            {selections
              .find((item) => item.category_id === selectedCategory?.id)
              ?.sub_categories.find(
                (sub) => sub.sub_category_id === selectedSubCategory?.id
              )
              ?.items.map((product) => (
                <Select.Option key={product.item_id} value={product.item_id}>
                  {product.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

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
