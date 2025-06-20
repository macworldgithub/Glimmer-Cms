// import React, { useState } from "react";
// import { createStore } from "../api/auth/api";

// const SignupStore = () => {
//   const [storeImageFile, setStoreImageFile] = useState<File | null>(null);
//   const [previewImage, setPreviewImage] = useState<string | null>(null);

//   const [formData, setFormData] = useState({
//     storeImage: "",
//     storeName: "",
//     vendorName: "",
//     description: "",
//     storeContactEmail: "",
//     email: "",
//     password: "",
//     country: "",
//     address: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setStoreImageFile(file);

//       // Generate image preview
//       const reader = new FileReader();
//       reader.onload = () => setPreviewImage(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate required fields
//     if (!storeImageFile) {
//       alert("Please upload a store image.");
//       return;
//     }
//     if (!formData.storeName.trim()) {
//       alert("Store Name is required.");
//       return;
//     }
//     if (!formData.vendorName.trim()) {
//       alert("Vendor Name is required.");
//       return;
//     }
//     if (!formData.storeContactEmail.trim()) {
//       alert("Store Contact Email is required.");
//       return;
//     }
//     if (!formData.email.trim()) {
//       alert("Email is required.");
//       return;
//     }
//     if (!formData.password.trim()) {
//       alert("Password is required.");
//       return;
//     }

//     // Prepare FormData object
//     const formDataToSubmit = new FormData();
//     formDataToSubmit.append("store_image", storeImageFile);
//     formDataToSubmit.append("store_name", formData.storeName);
//     formDataToSubmit.append("vendor_name", formData.vendorName);
//     formDataToSubmit.append("description", formData.description);
//     formDataToSubmit.append("store_contact_email", formData.storeContactEmail);
//     formDataToSubmit.append("email", formData.email);
//     formDataToSubmit.append("password", formData.password);
//     formDataToSubmit.append("country", formData.country);
//     formDataToSubmit.append("address", formData.address);

//     try {
//       const response = await createStore(formDataToSubmit); // Call createStore
//       alert("Store created successfully");

//       // Reset form fields
//       //@ts-ignore
//       setFormData({
//         storeName: "",
//         vendorName: "",
//         description: "",
//         storeContactEmail: "",
//         email: "",
//         password: "",
//         country: "",
//         address: "",
//       });
//       setStoreImageFile(null);
//       setPreviewImage(null); // Reset preview image
//     } catch (error) {
//       console.error("Error creating store:", error);
//       alert("An error occurred while creating the store. Please try again.");
//     }
//   };

//   return (
    
//     <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
//       <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Signup</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="flex flex-col">
//           <label className="font-medium text-gray-700">Store Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             className="border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//           />
//           {previewImage && (
//             <img src={previewImage} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded-lg shadow-md" />
//           )}
//         </div>
//         {[
//           { label: "Store Name", name: "storeName", type: "text" },
//           { label: "Vendor Name", name: "vendorName", type: "text" },
//           { label: "Store Contact Email", name: "storeContactEmail", type: "email" },
//           { label: "Email", name: "email", type: "email" },
//           { label: "Password", name: "password", type: "password" },
//           { label: "Country", name: "country", type: "text" },
//           { label: "Address", name: "address", type: "text" },
//         ].map(({ label, name, type }) => (
//           <div key={name} className="flex flex-col">
//             <label className="font-medium text-gray-700">{label}</label>
//             <input
//               type={type}
//               name={name}
//               value={formData[name as keyof typeof formData]}
//               onChange={handleChange}
//               className="border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//               required={name !== "country" && name !== "address"}
//             />
//           </div>
//         ))}
//         <div className="flex flex-col">
//           <label className="font-medium text-gray-700">Description</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-[#5F61E6] text-white p-2 rounded-md font-semibold hover:[#5F61E6] transition"
//         >
//           Signup
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignupStore;
import React, { useState, useEffect } from "react";
import { createStore } from "../api/auth/api";
import axios from "axios";
import { BACKEND_URL } from "../config/server";

const SignupStore = () => {
  const [storeImageFile, setStoreImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    storeImage: "",
    storeName: "",
    vendorName: "",
    description: "",
    storeContactEmail: "",
    email: "",
    password: "",
    country: "",
    address: "", // Added as required
    cityName: "",
  });

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/postex/operational-cities`, {
          params: { operationalCityType: "pickup" },
        });
        if (response.data.statusCode === "200") {
          const cityNames = response.data.dist.map((city: any) => city.operationalCityName);
          setCities(cityNames);
        }
      } catch (error) {
        console.error("Error fetching cities:", error.response?.data || error.message);
        setError("Failed to load cities. Please check the API configuration.");
      }
    };
    fetchCities();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setStoreImageFile(file);

      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    if (!formData.cityName.trim()) {
      alert("City Name is required.");
      return;
    }
    if (!formData.address.trim()) {
      alert("Address is required.");
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("store_image", storeImageFile);
    formDataToSubmit.append("store_name", formData.storeName);
    formDataToSubmit.append("vendor_name", formData.vendorName);
    formDataToSubmit.append("description", formData.description);
    formDataToSubmit.append("store_contact_email", formData.storeContactEmail);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("password", formData.password);
    formDataToSubmit.append("country", formData.country);
    formDataToSubmit.append("address", formData.address); // Added to form data
    formDataToSubmit.append("cityName", formData.cityName);

    try {
      const response = await createStore(formDataToSubmit);
      alert("Store created successfully");

      setFormData({
        storeImage: "",
        storeName: "",
        vendorName: "",
        description: "",
        storeContactEmail: "",
        email: "",
        password: "",
        country: "",
        address: "",
        cityName: "",
      });
      setStoreImageFile(null);
      setPreviewImage(null);
      setError(null);
    } catch (error: any) {
      console.error("Error creating store:", error.response?.data || error.message);
      setError(error.response?.data?.message || "An error occurred while creating the store.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Signup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Store Image</label>
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
          { label: "Store Name", name: "storeName", type: "text" },
          { label: "Vendor Name", name: "vendorName", type: "text" },
          { label: "Store Contact Email", name: "storeContactEmail", type: "email" },
          { label: "Email", name: "email", type: "email" },
          { label: "Password", name: "password", type: "password" },
          { label: "Country", name: "country", type: "text" },
          { label: "Address", name: "address", type: "text" }, // Added as required
          {
            label: "City Name",
            name: "cityName",
            type: "select",
            options: cities,
          },
        ].map(({ label, name, type, options }) => (
          <div key={name} className="flex flex-col">
            <label className="font-medium text-gray-700">{label}</label>
            {type === "select" ? (
              <select
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              >
                <option value="">Select a city</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required={name !== "country" && name !== "description"}
              />
            )}
          </div>
        ))}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-[#5F61E6] text-white p-2 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default SignupStore;