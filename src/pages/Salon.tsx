import React, { useState } from "react";
import { createSalon } from "../api/auth/api";

const Salon = () => {
  const [storeImageFile, setStoreImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    salonImage: "",
    salonName: "",
    ownerName: "",
    about: "",
    ownerContactEmail: "",
    contactNumber: "",
    email: "",
    password: "",
    address: "",
    openingHour: "",
    closingHour: ""
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
      alert("Please upload a profile image.");
      return;
    }
    if (!formData.salonName.trim()) {
      alert("Salon Name is required.");
      return;
    }
    if (!formData.ownerName.trim()) {
      alert("Owner Name is required.");
      return;
    }
    if (!formData.ownerContactEmail.trim()) {
      alert("Owner Contact Email is required.");
      return;
    }
    if (!formData.contactNumber.trim()) {
      alert("Owner Contact Number is required.");
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
    formDataToSubmit.append("salon_image", storeImageFile);
    formDataToSubmit.append("salon_name", formData.salonName);
    formDataToSubmit.append("owner_name", formData.ownerName);
    formDataToSubmit.append("about", formData.about);
    formDataToSubmit.append("owner_contact_email", formData.ownerContactEmail);
    formDataToSubmit.append("contact_number", formData.contactNumber);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("password", formData.password);
    formDataToSubmit.append("address", formData.address);
    formDataToSubmit.append("openingHour", formData.openingHour);
    formDataToSubmit.append("closingHour", formData.closingHour);

    try {
      const response = await createSalon(formDataToSubmit); // Call createStore
      alert("Salon created successfully");

      // Reset form fields
      //@ts-ignore
      setFormData({
        salonName: "",
        ownerName: "",
        about: "",
        ownerContactEmail: "",
        contactNumber: "",
        email: "",
        password: "",
        address: "",
        openingHour: "",
        closingHour: "",
      });
      setStoreImageFile(null);
      setPreviewImage(null); // Reset preview image
    } catch (error) {
      console.error("Error creating salon:", error);
      alert("An error occurred while creating the salon. Please try again.");
    }
  };

  return (
    
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Salon</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Profile</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {previewImage && (
            <img src={previewImage} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded-lg shadow-md" />
          )}
        </div>
        {[
          { label: "Salon Name", name: "salonName", type: "text" },
          { label: "Owner Name", name: "ownerName", type: "text" },
          { label: "Owner Contact Email", name: "ownerContactEmail", type: "email" },
          { label: "Email", name: "email", type: "email" },
          { label: "Password", name: "password", type: "password" },
          { label: "Contact Number", name: "contactNumber", type: "number" },
          { label: "Address", name: "address", type: "text" },
          { label: "Opeing Hour", name: "openingHour", type: "number" },
          { label: "Closing Hour", name: "closingHour", type: "number" },
        ].map(({ label, name, type }) => (
          <div key={name} className="flex flex-col">
            <label className="font-medium text-gray-700">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name as keyof typeof formData]}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required={name !== "country" && name !== "address"}
            />
          </div>
        ))}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">About</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#5F61E6] text-white p-2 rounded-md font-semibold hover:[#5F61E6] transition"
        >
          Create Salon
        </button>
      </form>
    </div>
  );
};

export default Salon;
