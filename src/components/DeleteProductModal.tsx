import React from "react";
import { Modal } from "antd";
import { deleteProductApi, getAllProducts } from "../api/products/api";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";

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

interface DeleteProductModalProps {
  product: Product;
  visible: boolean;
  page: number;
  role: string;
  name?: string;
  category?: string;
  createdAt?: string;
  storeId?: string;
  onClose: () => void;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  product,
  visible,
  page,
  role,
  name,
  category,
  createdAt,
  storeId,
  onClose,
}) => {
  const token = useSelector((state: RootState) => state.Login.token);
  const dispatch = useDispatch<AppDispatch>();

  const handleOk = async () => {
    try {
      // Delete API call
      await deleteProductApi(product._id, token);

      // Re-fetch with the same filters
      //@ts-ignore
      dispatch(
        getAllProducts({
          page_no: page,
          name,
          category,
          created_at: createdAt,
          storeId: role === "super_admin" ? storeId : undefined,
        })
      );

      onClose();
      alert("Product deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting product:", error.message || error);
    }
  };

  return (
    <Modal
      title="Confirm Delete"
      open={visible}
      onCancel={onClose}
      onOk={handleOk}
      okText="Yes, Delete"
      cancelText="Cancel"
      okButtonProps={{ className: "ant-btn-dangerous-delete-modal" }}
    >
      <p>
        Are you sure you want to delete <strong>{product.name}</strong>?
      </p>
    </Modal>
  );
};

export default DeleteProductModal;
