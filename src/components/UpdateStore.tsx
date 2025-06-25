
import React, { Dispatch, SetStateAction, useState } from "react";
import { Modal, Button, Input, Upload } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { UploadOutlined } from "@ant-design/icons";
import { updateStoreApi } from "../api/products/api";
import { updateStore } from "../slices/loginSlice";

interface PropsUpdateStoreModal {
  profile: boolean;
  setProfile: Dispatch<SetStateAction<boolean>>;
}

const UpdateStoreModal: React.FC<PropsUpdateStoreModal> = ({
  profile,
  setProfile,
}) => {
  const [newImageUrl, setNewImageUrl] = useState<string>();
  const dispatch = useDispatch();
  const store = useSelector((state: RootState) => state.Login);

  const [formData, setFormData] = useState<{
    store_name: string;
    vendor_name: string;
    description: string;
    store_contact_email: string;
    email: string;
    country: string;
    address: string;
    store_image: File | null;
  }>({
    store_name: store.store_name || "",
    vendor_name: store.vendor_name || "",
    description: store.description || "",
    store_contact_email: store.store_contact_email || "",
    email: store.email || "",
    country: store.country || "",
    address: store.address || "",
    store_image: null,
  });

  const handleImageChange = (info: any) => {
    if (info.file.status === "done" || info.file.originFileObj) {
      const file = info.file.originFileObj as File;
      const imageUrl = URL.createObjectURL(file);
      setNewImageUrl(imageUrl);
      setFormData({ ...formData, store_image: file });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCancel = () => {
    setProfile(false);
  };

  const handleUpdate = async () => {
    try {
      const res = await updateStoreApi(store.token, formData);
      if (res) {
        dispatch(
          updateStore({
            store_name: res.store_name,
            vendor_name: res.vendor_name,
            description: res.description,
            store_contact_email: res.store_contact_email,
            email: res.email,
            country: res.country,
            address: res.address,
            store_image: res.store_image,
          })
        );
      }
      setProfile(false);
    } catch (error: any) {
      console.error("Update error:", error.response?.data || error.message);
      alert("Failed to update store: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <Modal
      title="Update Store Details"
      open={profile}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="update"
          type="primary"
          className="btn-profile-update-modal"
          onClick={handleUpdate}
        >
          Update
        </Button>,
      ]}
    >
      <p>
        <strong>Store Name:</strong>
        <Input
          value={formData.store_name}
          onChange={(e) => handleChange("store_name", e.target.value)}
        />
      </p>
      <p>
        <strong>Vendor Name:</strong>
        <Input
          value={formData.vendor_name}
          onChange={(e) => handleChange("vendor_name", e.target.value)}
        />
      </p>
      <p>
        <strong>Description:</strong>
        <Input
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </p>
      <p>
        <strong>Contact Email:</strong>
        <Input
          value={formData.store_contact_email}
          onChange={(e) => handleChange("store_contact_email", e.target.value)}
        />
      </p>
      <p>
        <strong>Email:</strong>
        <Input
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </p>
      <p>
        <strong>Country:</strong>
        <Input
          value={formData.country}
          onChange={(e) => handleChange("country", e.target.value)}
        />
      </p>
      <p>
        <strong>Address:</strong>
        <Input
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />
      </p>
      <p>
        <strong>Store Image:</strong>
      </p>
      <div style={{ marginBottom: "16px" }}>
        {newImageUrl || store.store_image ? (
          <img
            src={newImageUrl || store.store_image}
            alt="Store"
            style={{
              width: "150px",
              height: "150px",
              marginBottom: "8px",
              cursor: "pointer",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        ) : (
          <p>No image selected</p>
        )}
      </div>
      <Upload
        name="store_image" // Match backend field
        showUploadList={false}
        beforeUpload={(file) => {
          const isImage = file.type.startsWith("image/");
          if (!isImage) {
            console.error("You can only upload image files!");
            return false;
          }
          return true;
        }}
        onChange={handleImageChange}
      >
        <Button icon={<UploadOutlined />}>Upload New Image</Button>
      </Upload>
    </Modal>
  );
};

export default UpdateStoreModal;