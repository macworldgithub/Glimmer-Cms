import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { developmentServer } from "../../config/server";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
// Async thunk for signup
export const getAllProducts = createAsyncThunk(
  "getAllProducts",
  async (payload: { page_no: number }, { rejectWithValue, getState }) => {
    try {
      // Access token from the Redux state
      const state = getState() as RootState;
      const token = state.Login.token;

      // Make API request with page number as a query parameter
      const response = await axios.get(
        `${developmentServer}/product/get_all_store_products?page_no=${payload.page_no}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token
          },
        }
      );

      return response.data; // Return the response data if successful
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const addProduct = createAsyncThunk(
  "addProduct",
  async (payload: {}, { rejectWithValue, getState }) => {
    try {
      // Access token from the Redux state
      const state = getState() as RootState;
      const token = state.Login.token;

      const product = state.AddProduct;

      // Make API request with page number as a query parameter
      const response = await axios.post(
        `${developmentServer}/product/create`,
        product,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token
            "Content-Type": "application/json",
          },
        }
      );

      return response.data; // Return the response data if successful
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);
