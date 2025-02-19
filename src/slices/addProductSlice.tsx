import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addProductApi } from "../api/products/api";

export interface Product {
  name: string;
  quantity: number;
  description: string;
  images: string[];
  base_price: number;
  discounted_price: number;
  status: "Active" | "Inactive"; // Enum-like string literals
  category: string;
  subcategory: string;
  item: string;

  size: any[];
  type: any[];
}

const initialState: Product = {
  name: "",
  quantity: 0,
  description: "",
  images: [],
  base_price: 0,
  discounted_price: 0,
  status: "Active",
  category: "",
  subcategory: "",
  item: "",
  size: [],
  type: [],
};

const addProductSlice = createSlice({
  name: "addProduct",
  initialState,
  reducers: {
    addImages: (state, action) => {
      if (state.images.length + action.payload.length <= 3) {
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
    resetImage: (state) => {
      state.images = [];
    },
  },
  extraReducers(builder) {
    builder.addCase(addProductApi.fulfilled, () => {
      alert("Success : Product Added");
      return initialState; // Correct way to reset the state
    });
    builder.addCase(addProductApi.rejected, (e, d) => {
      console.log(e, "e idhr hai", d);
      //@ts-ignore
      alert("Error: " + (d?.payload?.message ? d?.payload?.message[0] : "!"));
      return;
    });
  },
});

export const { updateProduct, addImages, removeImage, resetImage } =
  addProductSlice.actions;
export default addProductSlice;
