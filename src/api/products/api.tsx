import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const development_url = "http://localhost:3000";
const production_url = "";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
// Async thunk for signup
export const getAllProducts = createAsyncThunk(
  "getAllProducts",
  async (payload: { page_no: number }, { rejectWithValue }) => {
    try {
      const token = useSelector((state: RootState) => state.Login.token);
      // Retrieve the token from localStorage or another source
      const response = await axios.post(
        `${development_url}/product/get_all_store_products`,
        payload,
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
