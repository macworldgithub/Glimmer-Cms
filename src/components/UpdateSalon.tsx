import React, { Dispatch, SetStateAction, useState } from "react";
import { Modal, Button, Input, Upload } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useDispatch } from "react-redux";

import { UploadOutlined } from "@ant-design/icons";
import { updateSalon } from "../slices/loginSlice";
import { updateSalonApi } from "../api/service/api";

interface PropsUpdateSalonModal {
  profile: boolean;
  setProfile: Dispatch<SetStateAction<boolean>>;
}

const UpdateSalonModal: React.FC<PropsUpdateSalonModal> = ({
  profile,
  setProfile,
}) => {
  const [newImageUrl, setNewImageUrl] = useState<string>();
  const dispatch = useDispatch();

  const salon = useSelector((state: RootState) => state.Login);

  const [formData, setFormData] = useState({
    salon_name: salon.salon_name,
    owner_name: salon.owner_name,
    about: salon.about,
    owner_contact_email: salon.owner_contact_email,
    contact_number: salon.contact_number,
    email: salon.email,
    password: salon.password,
    address: salon.address,
    openingHour: salon.openingHour,
    closingHour: salon.closingHour,
    salon_image: salon.salon_image,
  });
  // Handle image upload
  const handleImageChange = (info: any) => {
    if (info.file.status === "done" || info.file.originFileObj) {
      const newImageUrl = URL.createObjectURL(info.file.originFileObj);
      setFormData({ ...formData, salon_image: info.file.originFileObj });

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
  const handleUpdate = async () => {
    try {
      const res = await updateSalonApi(salon.token, formData);

      if (res) {
        dispatch(updateSalon({ type: "updateSalon", payload: { res } }));
      }
      setProfile(false);
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <Modal
      title="Update Salon Details"
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
        <strong>Salon Name:</strong>
        <Input
          value={formData.salon_name}
          onChange={(e) => handleChange("salon_name", e.target.value)}
        />
      </p>
      <p>
        <strong>Owner Name:</strong>
        <Input
          value={formData.owner_name}
          onChange={(e) => handleChange("owner_name", e.target.value)}
        />
      </p>
      <p>
        <strong>About:</strong>
        <Input
          value={formData.about}
          onChange={(e) => handleChange("about", e.target.value)}
        />
      </p>
      <p>
        <strong>Contact Email:</strong>
        <Input
          value={formData.owner_contact_email}
          onChange={(e) => handleChange("owner_contact_email", e.target.value)}
        />
      </p>
      <p>
        <strong>Contact Number:</strong>
        <Input
          value={formData.contact_number}
          onChange={(e) => handleChange("contact_number", e.target.value)}
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
        <strong>Password:</strong>
        <Input
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />
      </p>
      <p>
        <strong>Opening Hour:</strong>
        <Input
          value={formData.openingHour}
          onChange={(e) => handleChange("openingHour", e.target.value)}
        />
      </p>
      <p>
        <strong>Closing Hour:</strong>
        <Input
          value={formData.closingHour}
          onChange={(e) => handleChange("closingHour", e.target.value)}
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
        <strong>Salon Image:</strong>
      </p>
      <div style={{ marginBottom: "16px" }}>
        <img
          src={newImageUrl ? newImageUrl : formData.salon_image}
          alt="Salon"
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
        name="salonImage"
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

export default UpdateSalonModal;
