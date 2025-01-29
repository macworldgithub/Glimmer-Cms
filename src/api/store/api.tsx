import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../../config/server";
import { RootState } from "../../store/store";

export const getAllStores = createAsyncThunk(
  "getAllStores",
  async (payload: { page_no: number }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;
      const response = await axios.get(
        `${BACKEND_URL}/store/get_all_stores?page_no=${payload.page_no}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);


export const deleteStore = async (token: string, storeId: string) => {
    try {
      const response = await axios.delete(`${BACKEND_URL}/store/delete_store`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { _id: storeId }, // Ensure the request body contains the store ID
      });
      return response.data; // Return the response data
    } catch (error: any) {
      console.error("Error deleting store:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to delete store");
    }
  };
     