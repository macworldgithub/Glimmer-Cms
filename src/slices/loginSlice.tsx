import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { signInAdmin, signInStore } from "../api/auth/api";

interface Authentication {
  _id: string;
  name: string;
  isAuthenticated: boolean;
  store_name: string;
  vendor_name: string;
  description: string;
  store_contact_email: string;
  email: string;
  password: string;
  country: string;
  address: string;
  store_image: string;
  token: string;
  role: string;
}

const initialState: Authentication = {
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

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    changeAuthentication: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },

    logout: (state) => {
      // Reset all fields to their initial values
      Object.assign(state, initialState);
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

      state.address = address;
      state.address = country;
      state.description = description;
      state.email = email;
      state.store_contact_email = store_contact_email;
      state.store_image = store_image;
      state.store_name = store_name;
      state.vendor_name = vendor_name;
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
      state.store_image = store.store_image;
      state.token = token;
      state.isAuthenticated = true; // Mark as authenticated
      state.role = role;
    });

    builder.addCase(signInAdmin.fulfilled, (state, action) => {
      const { admin, token, role } = action.payload;

      state.email = admin.email;
      state.name = admin.name;

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
  },
});

export const { changeAuthentication, logout, updateStore } = loginSlice.actions;
export default loginSlice;
