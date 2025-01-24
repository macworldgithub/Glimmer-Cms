import React, { useState } from "react";
import { createStore } from "../api/auth/api";

const SignupStore = () => {
  const [storeImageFile, setStoreImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    storeImage: "",
    storeName: "",
    vendorName: "",
    description: "",
    storeContactEmail: "",
    email: "",
    password: "",
    country: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setStoreImageFile(file);

      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!storeImageFile) {
      alert("Please upload a store image.");
      return;
    }
    if (!formData.storeName.trim()) {
      alert("Store Name is required.");
      return;
    }
    if (!formData.vendorName.trim()) {
      alert("Vendor Name is required.");
      return;
    }
    if (!formData.storeContactEmail.trim()) {
      alert("Store Contact Email is required.");
      return;
    }
    if (!formData.email.trim()) {
      alert("Email is required.");
      return;
    }
    if (!formData.password.trim()) {
      alert("Password is required.");
      return;
    }

    // Prepare FormData object
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("store_image", storeImageFile);
    formDataToSubmit.append("store_name", formData.storeName);
    formDataToSubmit.append("vendor_name", formData.vendorName);
    formDataToSubmit.append("description", formData.description);
    formDataToSubmit.append("store_contact_email", formData.storeContactEmail);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("password", formData.password);
    formDataToSubmit.append("country", formData.country);
    formDataToSubmit.append("address", formData.address);

    try {
      const response = await createStore(formDataToSubmit); // Call createStore
      alert("Store created successfully");

      // Reset form fields
      //@ts-ignore
      setFormData({
        storeName: "",
        vendorName: "",
        description: "",
        storeContactEmail: "",
        email: "",
        password: "",
        country: "",
        address: "",
      });
      setStoreImageFile(null);
      setPreviewImage(null); // Reset preview image
    } catch (error) {
      console.error("Error creating store:", error);
      alert("An error occurred while creating the store. Please try again.");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "max-content",
        margin: "0 auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1>Signup</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div>
          <label>Store Image</label>
          <input
            type="file"
            name="storeImage"
            accept="image/*"
            onChange={handleFileChange}
          />

          {previewImage && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={previewImage}
                alt="Uploaded Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>
          )}
        </div>
        <div>
          <label>Store Name *</label>
          <input
            type="text"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Vendor Name *</label>
          <input
            type="text"
            name="vendorName"
            value={formData.vendorName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Store Contact Email *</label>
          <input
            type="email"
            name="storeContactEmail"
            value={formData.storeContactEmail}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <button type="submit" style={{ marginTop: "20px" }}>
          Signup
        </button>
      </form>
    </div>
  );
};

export default SignupStore;
