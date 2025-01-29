import React from "react";
import { Modal, message } from "antd";
import { deleteStore, getAllStores } from "../api/store/api";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";

interface Store {
  store_name: string;
  description: string;
  email: string;
  _id: string;
}

interface DeleteStoreModalProps {
  store: Store;
  visible: boolean;
  page: number;
  onClose: () => void;
}

const DeleteStoreModal: React.FC<DeleteStoreModalProps> = ({
  store,
  visible,
  page,
  onClose,
}) => {
  const token = useSelector((state: RootState) => state.Login.token);
  const dispatch = useDispatch();

  const handleOk = async () => {
    if (!store._id) {
      message.error("Invalid store ID.");
      return;
    }

    try {
      await deleteStore(token, store._id); // Send store ID
      message.success("Store deleted successfully.");
      
      // Refresh store list
      //@ts-ignore
      dispatch(getAllStores({ page_no: page }));

      onClose();
    } catch (error: any) {
      console.error("Error deleting store:", error.message);
      message.error(error.message || "Failed to delete the store. Please try again.");
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
      okButtonProps={{ danger: true }}
    >
      <p>
        Are you sure you want to delete <strong>{store.store_name}</strong>?
      </p>
    </Modal>
  );
};

export default DeleteStoreModal;
