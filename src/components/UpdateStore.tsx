import React, { Dispatch, SetStateAction, useState } from "react";
import { Modal, Button, Input, Upload } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

import { UploadOutlined } from "@ant-design/icons";

interface PropsUpdateStoreModal {
  profile: boolean;
  setProfile: Dispatch<SetStateAction<boolean>>;
}

const UpdateStoreModal: React.FC<PropsUpdateStoreModal> = ({
  profile,
  setProfile,
}) => {
  const [newImageUrl, setNewImageUrl] = useState<string>();
  const store = useSelector((state: RootState) => state.Login);
  const [formData, setFormData] = useState({
    store_name: store.store_name,
    vendor_name: store.vendor_name,
    description: store.description,
    store_conteact_email: store.store_contact_email,
    email: store.email,
    country: store.country,
    address: store.address,
    store_image: store.store_image,
  });
  // Handle image upload
  const handleImageChange = (info: any) => {
    if (info.file.status === "done" || info.file.originFileObj) {
      const newImageUrl = URL.createObjectURL(info.file.originFileObj);
      setFormData({ ...formData, store_image: info.file.originFileObj });

      setNewImageUrl(newImageUrl);
    }
  };

  // Handle input change
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Called when the user clicks "Cancel"
  const handleCancel = () => {
    setProfile(false);
  };

  // Called when the user clicks "Update"
  const handleUpdate = () => {
    console.log("Updated data:", formData);
    setProfile(false);
  };

  return (
    <Modal
      title="Update Store Details"
      visible={profile}
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
          onChange={(e) => handleChange("storeName", e.target.value)}
        />
      </p>
      <p>
        <strong>Vendor Name:</strong>
        <Input
          value={formData.vendor_name}
          onChange={(e) => handleChange("vendorName", e.target.value)}
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
          value={formData.store_conteact_email}
          onChange={(e) => handleChange("contactEmail", e.target.value)}
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
        <img
          src={newImageUrl ? newImageUrl : formData.store_image}
          alt="Store"
          style={{
            width: "150px",
            height: "150px",
            marginBottom: "8px",
            cursor: "pointer",
          }}
          //   onClick={handlePreview} // Open preview on click
        />
      </div>
      <Upload
        name="storeImage"
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
