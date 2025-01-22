import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { developmentServer } from "../../config/server";
import { RootState } from "../../store/store";

export const getAllOrders = createAsyncThunk(
  "getAllOrders",
  async (payload: { page_no: number }, { rejectWithValue, getState }) => {
    try {
      
      const state = getState() as RootState;
      const token = state.Login.token;

      
      const response = await axios.get(
      
        `${developmentServer}/order/get_all_store_orders?page_no=${payload.page_no}`,
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
