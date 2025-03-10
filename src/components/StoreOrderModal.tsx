import { Modal } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProductStatus } from "../api/order/api";

const OrderModal = ({ isVisible, onClose, actionType, record, setRecord }) => {
  const dispatch = useDispatch();

  const handleOk = async () => {
    if (record) {
      try {
        const updatedRecord = {
          ...record,
          status: "Accepted",
        };
        await dispatch(
          //@ts-ignore
          updateProductStatus({
            order_id: record.orderId,
            product_id: record.productId,
            store_id: record.storeId,
            order_product_status: updatedRecord.status,
          })
        );
        console.log("Update successful");
      } catch (error) {
        console.error("Update failed:", error);
      }
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
