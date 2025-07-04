import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { signInAdmin, signInSalon, signInStore } from "../api/auth/api";

interface Authentication {
  _id: string;
  name: string;
  isAuthenticated: boolean;
  store_name?: string;
  vendor_name?: string;
  description?: string;
  store_contact_email?: string;
  salon_name?: string;
  about?: string;
  contact_number?: string;
  openingHour?: string;
  closingHour?: string;
  email: string;
  password: string;
  country?: string;
  address: string;
  store_image?: string;
  images?: string[];
  token: string;
  role: string;
}

const initialStoreState: Authentication = {
  _id: "",
  isAuthenticated: false,
  store_name: "",
  vendor_name: "",
  description: "",
  store_contact_email: "",
  email: "",
  password: "",
  country: "",
  address: "",
  store_image: "",
  token: "",
  role: "",
  name: "",
};

const initialSalonState: Authentication = {
  _id: "",
  isAuthenticated: false,
  salon_name: "",
  about: "",
  contact_number: "",
  openingHour: "",
  closingHour: "",
  email: "",
  password: "",
  address: "",
  images: [],
  token: "",
  role: "",
  name: "",
};

const loginSlice = createSlice({
  name: "login",
  initialState: initialStoreState || initialSalonState,
  reducers: {
    changeAuthentication: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },

    logout: (state) => {
      // Reset all fields to their initial values
      Object.assign(state, initialStoreState, initialSalonState);
    },

    updateStore: (state, action) => {
      const {
        store_name,
        vendor_name,
        description,
        store_contact_email,
        email,
        country,
        address,
        store_image,
      } = action.payload;

      state.store_name = store_name ?? state.store_name;
      state.vendor_name = vendor_name ?? state.vendor_name;
      state.description = description ?? state.description;
      state.store_contact_email = store_contact_email ?? state.store_contact_email;
      state.email = email ?? state.email;
      state.country = country ?? state.country; // Fixed: Assign to country
      state.address = address ?? state.address;
      state.store_image = store_image ?? state.store_image;
    },
    addImages: (state, action) => {
      if (!state.images) {
        state.images = []; 
      }
      
      if (Array.isArray(action.payload) && (state.images.length + action.payload.length <= 4)) {
        state.images = [...state.images, ...action.payload];
      } else {
        alert("You can only upload up to 4 images.");
      }
    },
    removeImage: (state, action: PayloadAction<number>) => {
      state.images = state.images.filter((_, index) => index !== action.payload);
    },
    resetImage: (state) => {
      state.images = [];
    },
    updateSalon: (state, action) => {
      const {
         salon_name,
        about,
        contact_number,
        email,
        address,
        openingHour,
        closingHour,
        images,
      } = action.payload;

      state.salon_name = salon_name ?? state.salon_name;
      state.about = about ?? state.about;
      state.contact_number = contact_number ?? state.contact_number;
      state.email = email ?? state.email;
      state.address = address ?? state.address;
      state.openingHour = openingHour ?? state.openingHour;
      state.closingHour = closingHour ?? state.closingHour;
      state.images = Array.isArray(images) ? images.slice(0, 4).filter(Boolean) : state.images;
    },
  },
  extraReducers(builder) {
    builder.addCase(signInStore.fulfilled, (state, action) => {
      const { store, token, role } = action.payload;
      state._id = store._id;
      state.store_name = store.store_name;
      state.vendor_name = store.vendor_name;
      state.description = store.description;
      state.store_contact_email = store.store_contact_email;
      state.email = store.email;
      state.country = store.country;
      state.address = store.address;
      state.store_image = `${store.store_image}`;
      state.token = token;
      state.isAuthenticated = true; // Mark as authenticated
      state.role = role;
    });

    builder.addCase(signInAdmin.fulfilled, (state, action) => {
      const { admin, token, role, store_image } = action.payload;

      state.email = admin.email;
      state.name = admin.name;

      state.token = token;
      state.isAuthenticated = true; // Mark as authenticated
      state.role = role;
      state.store_image = store_image;
    });

    builder.addCase(signInSalon.fulfilled, (state, action) => {
      const { salon, token, role } = action.payload;
      state._id = salon._id;
      state.salon_name = salon.salon_name;
      state.about = salon.about;
      state.contact_number = salon.contact_number;
      state.openingHour = salon.openingHour;
      state.closingHour = salon.closingHour;
      state.email = salon.email;
      state.address = salon.address;
      state.images = [
        salon.image1 ? `${salon.image1}` : null,
        salon.image2 ? `${salon.image2}` : null,
        salon.image3 ? `${salon.image3}` : null,
        salon.image4 ? `${salon.image4}` : null,
      ].filter(Boolean);
      state.token = token;
      state.isAuthenticated = true; // Mark as authenticated
      state.role = role;
    });

    builder.addCase(signInStore.rejected, (state, action) => {
      alert("Sign Store Failed");
    });

    builder.addCase(signInAdmin.rejected, (state, action) => {
      alert("Sign Admin Failed");
    });

    builder.addCase(signInSalon.rejected, (state, action) => {
      alert("Sign Salon Failed");
    });
  },
});

export const { changeAuthentication, logout, updateStore, updateSalon, addImages, removeImage, resetImage } = loginSlice.actions;
export default loginSlice;
