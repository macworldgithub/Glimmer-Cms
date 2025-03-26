import React, { useState } from "react";
import { Modal, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { deleteBookingApi, getAdminBookings } from "../api/service/api";

interface Booking {
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

interface DeleteBookingModalProps {
  booking: Booking;
  visible: boolean;
  page: number;
  onClose: () => void;
}

const DeleteBookingModal: React.FC<DeleteBookingModalProps> = ({
  booking,
  onClose,
  visible,
  page,
}) => {
  const token = useSelector((state: RootState) => state.Login.token);
  const dispatch = useDispatch();
  const handleOk = async () => {
    try {
      await deleteBookingApi(booking._id, token);
      alert("Booking deleted successfully.");
      onClose();
      window.location.reload();
      //@ts-ignore
      dispatch(getAdminBookings({ page_no: page }));
    } catch (error: any) {
      message.error("Failed to delete booking.");
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
          Are you sure you want to delete <strong>{booking.name}</strong>?
        </p>
      </Modal>
    </>
  );
};

export default DeleteBookingModal;
