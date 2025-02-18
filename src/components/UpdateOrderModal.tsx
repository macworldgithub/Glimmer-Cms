import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Tag } from "antd";

interface UpdateOrderModalProps {
  visible: boolean;
  order: any;
  onClose: () => void;
  onUpdate: (updatedOrder: any) => void;
}

const UpdateOrderModal: React.FC<UpdateOrderModalProps> = ({ visible, order, onClose, onUpdate }) => {
  const [form] = Form.useForm();
  
  useEffect(() => {
    if (order) {
      form.setFieldsValue(order);
    }
  }, [order, form]);

  const handleSubmit = (values: any) => {
    onUpdate(values);
    onClose();
  };

  return (
    <Modal
      title={`Update Order - ${order?._id}`}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {order && (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="customerEmail" label="Customer Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Input />
          </Form.Item>
          <Form.Item name="total" label="Total" rules={[{ required: true, type: "number" }]}>
            <Input type="number" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Update Order
          </Button>
        </Form>
      )}
    </Modal>
  );
};

export default UpdateOrderModal;
