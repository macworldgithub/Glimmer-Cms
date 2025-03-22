import React, { useState } from "react";
import { Modal, Button, message } from "antd";
import { deleteProductApi, getAllProducts } from "../api/products/api";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { deleteServiceApi, getAllServices } from "../api/service/api";

interface Service {
  _id: string;
  name: string;
  categoryId: string;
  subCategoryName: string;
  subSubCategoryName: string;
  requestedPrice: number;
  adminPrice: number;
  description: string;
  duration: string;
  status: "Active" | "Inactive";
  created_at: string;
}
interface DeleteServiceModalProps {
  service: Service;
  visible: boolean;
  page: number;
  onClose: () => void;
}

const DeleteServiceModal: React.FC<DeleteServiceModalProps> = ({
  service,
  onClose,
  visible,
  page,
}) => {
  const token = useSelector((state: RootState) => state.Login.token);
  const dispatch = useDispatch();
  const handleOk = async () => {
    try {
      await deleteServiceApi(service._id, token);
      alert("Service deleted successfully.");
      onClose();
      window.location.reload();
      //@ts-ignore
      dispatch(getAllServices({ page_no: page }));
    } catch (error: any) {
      message.error("Failed to delete service.");
      console.error(error);
    }
  };

  return (
    <>
      <Modal
        title="Confirm Delete"
        visible={visible}
        onCancel={onClose}
        onOk={handleOk}
        okText="Yes, Delete"
        cancelText="Cancel"
        okButtonProps={{ className: "ant-btn-dangerous-delete-modal" }} // Add danger class
      >
        <p>
          Are you sure you want to delete <strong>{service.name}</strong>?
        </p>
      </Modal>
    </>
  );
};

export default DeleteServiceModal;
