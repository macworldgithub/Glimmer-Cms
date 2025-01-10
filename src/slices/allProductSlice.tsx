import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllProducts, updateProductApi } from "../api/products/api";
import { useDispatch } from "react-redux";

interface Product {
  name: string;
  quantity: number;
  description: string;
  images: string[];
  base_price: number;
  discounted_price: number;
  status: "Active" | "Inactive";
  store: string;
  _id: string;
}

interface AllProducts {
  products: Product[];
  page: number;
}

const initialState: AllProducts = {
  products: [],
  page: 1,
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
      state.products = action.payload;
    });

    builder.addCase(updateProductApi.fulfilled, (state, action) => {
      const updatedProduct = action.payload; // Assuming API returns the updated product
      state.products = state.products.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      );
      alert("Record Updated");
    });
  },
});

export const { addToProductList } = allProductsSlice.actions;
export default allProductsSlice;
