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

export const addProductApi = createAsyncThunk(
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

export const updateProductApi = createAsyncThunk(
  "updateProduct",
  async (
    payload: {
      name: string;
      quantity: number;
      description: string;
      images: string[];
      base_price: number;
      discounted_price: number;
      status: "Active" | "Inactive";
      store: string;
      _id: string;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      // Access token from the Redux state
      const state = getState() as RootState;
      const token = state.Login.token;

      const body = { ...payload } as any;
      // Remove the store property

      // Make API request with the payload
      const response = await axios.put(
        `${developmentServer}/product/update_store_product_by_id?id=${body._id}`,
        body, // Use the payload directly
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token
            "Content-Type": "application/json",
          },
        }
      );

      return response.data; // Return the response data if successful
    } catch (error: any) {
      // Handle error response properly
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An error occurred");
    }
  }
);

export const deleteProductApi = async (_id: string, token: string) => {
  try {
    const response = await axios.delete(
      `${developmentServer}/product/delete_store_product_by_id?id=${_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Return the response data if successful
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data); // Throw error with response data
    }
    throw new Error("An error occurred"); // Generic error
  }
};
