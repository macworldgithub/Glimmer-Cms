import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllProducts } from "../api/products/api";

interface Product {
  name: string;
  quantity: number;
  description: string;
  images: string[];
  base_price: number;
  discounted_price: number;
  status: "Active" | "Inactive";
}

interface AllProducts {
  products: Product[];
}

const initialState: AllProducts = {
  products: [],
};

const allProductsSlice = createSlice({
  name: "allProducts",
  initialState,
  reducers: {
    addToProductList: (state, action) => {
      state.products.push(action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      //   state.products = action.payload;
      console.log(action.payload, "hehe");
    });
  },
});

export const { addToProductList } = allProductsSlice.actions;
export default allProductsSlice;
