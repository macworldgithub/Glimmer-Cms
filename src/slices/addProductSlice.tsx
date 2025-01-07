import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addProduct } from "../api/products/api";

export interface Product {
  name: string;
  quantity: number;
  description: string;
  images: string[];
  base_price: number;
  discounted_price: number;
  status: "Active" | "Inactive"; // Enum-like string literals
}

const initialState: Product = {
  name: "",
  quantity: 0,
  description: "",
  images: [],
  base_price: 0,
  discounted_price: 0,
  status: "Active",
};

const addProductSlice = createSlice({
  name: "addProduct",
  initialState,
  reducers: {
    addImages: (state, action) => {
      if (state.images.length + action.payload.length <= 5) {
        state.images.push(...action.payload); // Add new images
      } else {
        alert("You can only upload up to 5 images.");
      }
    },
    removeImage: (state, action) => {
      state.images = state.images.filter(
        (_, index) => index !== action.payload
      ); // Remove image by index
    },
    updateProduct(state, action: PayloadAction<Partial<Product>>) {
      return { ...state, ...action.payload };
    },
  },
  extraReducers(builder) {
    builder.addCase(addProduct.fulfilled, () => {
      alert("Success : Product Added");
    });
  },
});

export const { updateProduct, addImages, removeImage } =
  addProductSlice.actions;
export default addProductSlice;
