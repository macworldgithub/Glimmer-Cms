// import React, { useState } from "react";
// import { Modal, Button, message } from "antd";
// import { deleteProductApi, getAllProducts } from "../api/products/api";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../store/store";

// interface Product {
//   name: string;
//   quantity: number;
//   description: string;
//   images: string[];
//   base_price: number;
//   discounted_price: number;
//   status: "Active" | "Inactive";
//   store: string;
//   _id: string;
//   actions: string;
// }

// interface DeleteProductModalProps {
//   product: Product;
//   visible: boolean;
//   page: number;
//   onClose: () => void;
// }

// const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
//   product,
//   onClose,
//   visible,
//   page,
// }) => {
//   const token = useSelector((state: RootState) => state.Login.token);
//   const dispatch = useDispatch();
//   const handleOk = async () => {
//     try {
//       // Attempt to delete the product
//       const result = await deleteProductApi(product._id, token);

//       // If successful, fetch the updated list of products
//       //@ts-ignore
//       dispatch(getAllProducts({ page_no: page })); // Avoiding ts-ignore if possible

//       // Close the modal or UI after a successful operation
//       //@ts-ignore
//       onClose();

//       // Notify the user
//       alert("Product deleted successfully.");
//     } catch (error: any) {
//       // Handle and log errors properly
//       console.error("Error deleting product:", error.message || error);

//       // Optionally, show a user-friendly error message
//       alert("Failed to delete the product. Please try again.");
//     }
//   };

//   return (
//     <>
//       <Modal
//         title="Confirm Delete"
//         visible={visible}
//         onCancel={onClose}
//         onOk={handleOk}
//         okText="Yes, Delete"
//         cancelText="Cancel"
//         okButtonProps={{ className: "ant-btn-dangerous-delete-modal" }} // Add danger class
//       >
//         <p>
//           Are you sure you want to delete <strong>{product.name}</strong>?
//         </p>
//       </Modal>
//     </>
//   );
// };

// export default DeleteProductModal;
import React from "react";
import { Modal, Button, message } from "antd";
import { deleteProductApi, getAllProducts } from "../api/products/api";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";

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
  onClose: () => void;
  nameFilter: string;
  categoryFilter: string;
  createdAtFilter: string;
  storeId: string;
  role: string;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  product,
  onClose,
  visible,
  page,
  nameFilter,
  categoryFilter,
  createdAtFilter,
  storeId,
  role,
}) => {
  const token = useSelector((state: RootState) => state.Login.token);
  const dispatch = useDispatch();
  const handleOk = async () => {
    try {
      // Attempt to delete the product
      const result = await deleteProductApi(product._id, token);

      // Dispatch the getAllProducts action with proper filters
      dispatch(
        getAllProducts({
          page_no: page,
          name: nameFilter,
          category: categoryFilter,
          created_at: createdAtFilter,
          storeId: role === "super_admin" ? storeId : undefined,
        })
      );

      // Close the modal or UI after a successful operation
      onClose();

      // Notify the user
      message.success("Product deleted successfully.");
    } catch (error: any) {
      // Handle and log errors properly
      console.error("Error deleting product:", error.message || error);

      // Optionally, show a user-friendly error message
      message.error("Failed to delete the product. Please try again.");
    }
  };

  return (
    <Modal
      title="Confirm Delete"
      visible={visible}
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