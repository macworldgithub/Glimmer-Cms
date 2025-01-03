import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  name: "ssssssss",
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
    updateProduct(state, action: PayloadAction<Partial<Product>>) {
      return { ...state, ...action.payload };
    },
  },
  extraReducers(builder) {},
});

export const { updateProduct } = addProductSlice.actions;
export default addProductSlice;
