import React, { useEffect, useState } from "react";
import { createSalon } from "../api/auth/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addImages, removeImage, resetImage } from "../slices/loginSlice";

const Salon = () => {
  const dispatch = useDispatch();
  const images = useSelector((state: RootState) => state.Login.images);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    salonName: "",
    about: "",
    contactNumber: "",
    email: "",
    password: "",
    address: "",
    openingHour: "",
    closingHour: "",
  });

  console.log(formData);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files || []).slice(0, 4 - (images?.length || 0)); // Allow max 4 images

      if (files.length + (images?.length || 0) > 4) {
        alert("You can only upload up to 4 images.");
        return;
      }

      const imageUrls = files.map((file) => URL.createObjectURL(file));

      setPreviewUrls([...previewUrls, ...imageUrls]); // Update preview URLs
      setImageFiles([...imageFiles, ...files]); // Store actual files
      dispatch(addImages(imageUrls)); // Dispatch action to store in Redux
    }
  };
  const handleRemoveImage = (index: number) => {
    if (images.length === 1) {
      dispatch(resetImage());
      setPreviewUrls([]);
      setImageFiles([]);
    } else {
      dispatch(removeImage(index));
      setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
      setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    if (images?.length > 0) {
      setPreviewUrls(images.map((img) => img));
    }
  }, [images]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if(imageFiles.length < 2) {
      alert("Please upload at least two profile image.");
      return;
    }
    if (!formData.salonName.trim()) {
      alert("Salon Name is required.");
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
    imageFiles.forEach((file, index) => {
      formDataToSubmit.append(`image${index + 1}`, file);
    });
    // Object.entries(formData).forEach(([key, value]) => {
    //   formDataToSubmit.append(key, value);
    // });
    formDataToSubmit.append("salon_name", formData.salonName);
    formDataToSubmit.append("about", formData.about);
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
        about: "",
        contactNumber: "",
        email: "",
        password: "",
        address: "",
        openingHour: "",
        closingHour: "",
      });
      setImageFiles([]);
      setPreviewUrls([]);
      dispatch(resetImage());
    } catch (error) {
      console.error("Error creating salon:", error);
      alert("An error occurred while creating the salon. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Salon
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Profile</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <div className="flex space-x-2 mt-2">
            {previewUrls.map((src, index) => (
              <div key={index} className="relative">
                <img
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
        {[
          { label: "Salon Name", name: "salonName", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Password", name: "password", type: "password" },
          { label: "Contact Number", name: "contactNumber", type: "number" },
          { label: "Address", name: "address", type: "text" },
          { label: "Opening Hour", name: "openingHour", type: "time" },
          { label: "Closing Hour", name: "closingHour", type: "time" },
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
