
import React, { Dispatch, SetStateAction, useState } from "react";
import { Modal, Button, Input, Upload } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
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
    salon_name: salon.salon_name || "",
    about: salon.about || "",
    contact_number: salon.contact_number || "",
    email: salon.email || "",
    address: salon.address || "",
    openingHour: salon.openingHour || "",
    closingHour: salon.closingHour || "",
    salon_image: salon.images?.[0] || null, // Nullable image
  });

  const handleImageChange = (info: any) => {
    if (info.file.status === "done" || info.file.originFileObj) {
      const newImageUrl = URL.createObjectURL(info.file.originFileObj);
      setFormData({ ...formData, salon_image: info.file.originFileObj });
      setNewImageUrl(newImageUrl);
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
      const res = await updateSalonApi(salon.token, formData);
      if (res) {
        dispatch(
          updateSalon({
            salon_name: res.salon_name,
            about: res.about,
            contact_number: res.contact_number,
            email: res.email,
            address: res.address,
            openingHour: res.openingHour,
            closingHour: res.closingHour,
            images: [
              res.image1 || null,
              res.image2 || null,
              res.image3 || null,
              res.image4 || null,
            ].filter(Boolean),
          })
        );
      }
      setProfile(false);
    } catch (error: any) {
      console.error("Error updating salon:", error.response?.data || error.message);
      alert("Failed to update salon: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <Modal
      title="Update Salon Details"
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
        <strong>Salon Name:</strong>
        <Input
          value={formData.salon_name}
          onChange={(e) => handleChange("salon_name", e.target.value)}
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
        {newImageUrl || formData.salon_image ? (
          <img
            src={newImageUrl || formData.salon_image}
            alt="Salon"
            style={{
              width: "150px",
              height: "150px",
              marginBottom: "8px",
              cursor: "pointer",
            }}
          />
        ) : (
          <p>No image selected</p>
        )}
      </div>
      <Upload
        name="image1" // Match backend field
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