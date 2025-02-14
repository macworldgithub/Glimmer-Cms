// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { BACKEND_URL } from "../../config/server";
// import { RootState } from "../../store/store";

// export const getAllOrders = createAsyncThunk(
//   "getAllOrders",
//   async (payload: { page_no: number }, { rejectWithValue, getState }) => {
//     try {

//       const state = getState() as RootState;
//       const token = state.Login.token;

//       const response = await axios.get(

//         `${developmentServer}/order/get_all_store_orders?page_no=${payload.page_no}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || "An error occurred");
//     }
//   }
// );

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { developmentServer, BACKEND_URL } from "../../config/server";
import { RootState } from "../../store/store";

export const getAllOrders = createAsyncThunk(
  "getAllOrders",
  async (payload: { page_no: number }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const response = await axios.get(
        `${BACKEND_URL}/order/get_all_store_orders?page_no=${payload.page_no}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Validate that the response is an array or expected data structure.
      if (!Array.isArray(response.data.orders)) {
        throw new Error("Invalid data format: orders must be an array.");
      }

      return response.data.orders; // Assuming `orders` is the array of order objects.
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const Ecommerce_Dashboard = createAsyncThunk(
  "ecommerce_dashboard",
  async (payload: { page_no: number }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;
      const res = await axios.get(`${BACKEND_URL}/order/get_all_store_orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {}
  }
);


export const getAllStoreOrders = createAsyncThunk(
  "getAllOrders",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const response = await axios.get(
        `${BACKEND_URL}/order/getOrdersByStore`,
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