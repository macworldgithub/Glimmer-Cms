import { Modal } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { update_product_of_order } from "../api/order/api";

const OrderModal = ({ isVisible, onClose, actionType, record, setRecord }) => {
  const dispatch = useDispatch();

  const handleOk = () => {
    if (record) {
      dispatch(
        //@ts-ignore
        update_product_of_order({
          orderId: record.orderId,
          productId: record.productId,
          status: actionType,
        })
      );
    }
    onClose();
  };

  return (
    <Modal
      title="Confirm Action"
      open={isVisible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Yes"
      cancelText="No"
    >
      <p>Are you sure you want to {actionType.toLowerCase()} this order?</p>
    </Modal>
  );
};

export default OrderModal;
