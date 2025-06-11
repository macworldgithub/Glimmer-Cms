// import React, { Dispatch, SetStateAction, useState } from "react";
// import { Modal, Button, Input, Upload } from "antd";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../store/store";
// import { UploadOutlined } from "@ant-design/icons";
// import { updateStoreApi } from "../api/products/api";
// import { updateStore } from "../slices/loginSlice";

// interface PropsUpdateStoreModal {
//   profile: boolean;
//   setProfile: Dispatch<SetStateAction<boolean>>;
// }

// const UpdateStoreModal: React.FC<PropsUpdateStoreModal> = ({
//   profile,
//   setProfile,
// }) => {
//   const [newImageUrl, setNewImageUrl] = useState<string>();
//   const dispatch = useDispatch();
//   const store = useSelector((state: RootState) => state.Login);

//   const [formData, setFormData] = useState<{
//     store_name: string;
//     vendor_name: string;
//     description: string;
//     store_contact_email: string;
//     email: string;
//     country: string;
//     address: string;
//     store_image: string | File;
//   }>({
//     store_name: store.store_name,
//     vendor_name: store.vendor_name,
//     description: store.description,
//     store_contact_email: store.store_contact_email,
//     email: store.email,
//     country: store.country,
//     address: store.address,
//     store_image: store.store_image,
//   });

//   const handleImageChange = (info: any) => {
//     if (info.file.status === "done" || info.file.originFileObj) {
//       const file = info.file.originFileObj;
//       const imageUrl = URL.createObjectURL(file);
//       setNewImageUrl(imageUrl);
//       setFormData({ ...formData, store_image: file });
//     }
//   };

//   const handleChange = (field: string, value: string) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   const handleCancel = () => {
//     setProfile(false);
//   };

//   const handleUpdate = async () => {
//     try {
//       const data = new FormData();
//       data.append("store_name", formData.store_name);
//       data.append("vendor_name", formData.vendor_name);
//       data.append("description", formData.description);
//       data.append("store_contact_email", formData.store_contact_email);
//       data.append("email", formData.email);
//       data.append("country", formData.country);
//       data.append("address", formData.address);

//       if (formData.store_image instanceof File) {
//         data.append("store_image", formData.store_image);
//       }

//       const res = await updateStore(store.token, data);

//       if (res) {
//         dispatch(updateStore({ type: "updateStore", payload: { res } }));
//       }

//       setProfile(false);
//     } catch (error) {
//       console.error("Update error:", error);
//     }
//   };

//   return (
//     <Modal
//       title="Update Store Details"
//       open={profile}
//       onCancel={handleCancel}
//       footer={[
//         <Button key="cancel" onClick={handleCancel}>
//           Cancel
//         </Button>,
//         <Button
//           key="update"
//           type="primary"
//           className="btn-profile-update-modal"
//           onClick={handleUpdate}
//         >
//           Update
//         </Button>,
//       ]}
//     >
//       <p>
//         <strong>Store Name:</strong>
//         <Input
//           value={formData.store_name}
//           onChange={(e) => handleChange("store_name", e.target.value)}
//         />
//       </p>
//       <p>
//         <strong>Vendor Name:</strong>
//         <Input
//           value={formData.vendor_name}
//           onChange={(e) => handleChange("vendor_name", e.target.value)}
//         />
//       </p>
//       <p>
//         <strong>Description:</strong>
//         <Input
//           value={formData.description}
//           onChange={(e) => handleChange("description", e.target.value)}
//         />
//       </p>
//       <p>
//         <strong>Contact Email:</strong>
//         <Input
//           value={formData.store_contact_email}
//           onChange={(e) => handleChange("store_contact_email", e.target.value)}
//         />
//       </p>
//       <p>
//         <strong>Email:</strong>
//         <Input
//           value={formData.email}
//           onChange={(e) => handleChange("email", e.target.value)}
//         />
//       </p>
//       <p>
//         <strong>Country:</strong>
//         <Input
//           value={formData.country}
//           onChange={(e) => handleChange("country", e.target.value)}
//         />
//       </p>
//       <p>
//         <strong>Address:</strong>
//         <Input
//           value={formData.address}
//           onChange={(e) => handleChange("address", e.target.value)}
//         />
//       </p>
//       <p>
//         <strong>Store Image:</strong>
//       </p>
//       <div style={{ marginBottom: "16px" }}>
//         <img
//           src={
//             newImageUrl ||
//             (typeof formData.store_image === "string"
//               ? formData.store_image
//               : "")
//           }
//           alt="Store"
//           style={{
//             width: "150px",
//             height: "150px",
//             marginBottom: "8px",
//             cursor: "pointer",
//             objectFit: "cover",
//             borderRadius: "4px",
//           }}
//         />
//       </div>
//       <Upload
//         name="storeImage"
//         showUploadList={false}
//         beforeUpload={(file) => {
//           const isImage = file.type.startsWith("image/");
//           if (!isImage) {
//             console.error("You can only upload image files!");
//             return false;
//           }
//           return true;
//         }}
//         onChange={handleImageChange}
//       >
//         <Button icon={<UploadOutlined />}>Upload New Image</Button>
//       </Upload>
//     </Modal>
//   );
// };

// export default UpdateStoreModal;

import React, { Dispatch, SetStateAction, useState } from "react";
import { Modal, Button, Input, Upload, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { UploadOutlined } from "@ant-design/icons";
import { updateStoreApi } from "../api/products/api"; // Assuming this is the correct API function
import { updateStore } from "../slices/loginSlice";
import axios from "axios";

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
  const token = store.token; // Extract token for API call

  const [formData, setFormData] = useState({
    store_name: store.store_name || "",
    vendor_name: store.vendor_name || "",
    description: store.description || "",
    store_contact_email: store.store_contact_email || "",
    email: store.email || "",
    country: store.country || "",
    address: store.address || "",
    store_image: store.store_image || null,
  });

  const handleImageChange = (info: any) => {
    if (info.file.status === "done" || info.file.originFileObj) {
      const file = info.file.originFileObj;
      const imageUrl = URL.createObjectURL(file);
      setNewImageUrl(imageUrl);
      setFormData((prev) => ({ ...prev, store_image: file }));
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setProfile(false);
  };

  const handleUpdate = async () => {
    try {
      const data = new FormData();
      data.append("store_name", formData.store_name);
      data.append("vendor_name", formData.vendor_name);
      data.append("description", formData.description);
      data.append("store_contact_email", formData.store_contact_email);
      data.append("email", formData.email);
      data.append("country", formData.country);
      data.append("address", formData.address);

      if (formData.store_image instanceof File) {
        data.append("store_image", formData.store_image);
      }

      // Use axios with the token in headers
      const res = await axios.put(
        `/api/store/update`, // Replace with your actual endpoint
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data) {
        dispatch(updateStore({ type: "updateStore", payload: res.data })); // Dispatch with response data
        message.success("Store updated successfully!");
      }

      setProfile(false);
    } catch (error) {
      console.error("Update error:", error);
      message.error("Failed to update store. Please try again.");
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
        <img
          src={
            newImageUrl ||
            (typeof formData.store_image === "string" ? formData.store_image : "")
          }
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