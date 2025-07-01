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
  async (
    payload: {
      page_no: number;
      store_id: string;
      order_id?: string;
      status?: string;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;
      const queryParams = new URLSearchParams({
        page_no: payload.page_no.toString(),
        store_id: state.Login._id.toString(),
      });

      if (payload.order_id) queryParams.append("order_id", payload.order_id);
      if (payload.status) queryParams.append("status", payload.status);

      const response = await axios.get(
        `${BACKEND_URL}/order/get_all_store_orders?${queryParams.toString()}`,
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
export const getAllUpdatedOrders = createAsyncThunk(
  "getAllUpdatedOrders",
  async (
    payload: { page_no: number; store_id: number | string },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;
      const response = await axios.get(
        `${BACKEND_URL}/order/get_all_admin_orders?page_no=${payload.page_no}&store_id=${state.Login._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response", "laoal", response.data);
      // Validate that the response is an array or expected data structure.
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid data format: orders must be an array.");
      }

      return response.data; // Assuming `orders` is the array of order objects.
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const getStoreRevenueSales = createAsyncThunk(
  "getStoreRevenueSales",
  async (
    payload: {
      page_no: number;
      store_id: string;
      order_id?: string;
      status?: string;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;
      const queryParams = new URLSearchParams({
        page_no: payload.page_no.toString(),
        store_id: state.Login._id.toString(),
      });

      if (payload.order_id) queryParams.append("order_id", payload.order_id);
      if (payload.status) queryParams.append("status", payload.status);

      const response = await axios.get(
        `${BACKEND_URL}/order/get_store_revenue_sales?${queryParams.toString()}`,
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

export const getDashBoardOrders = createAsyncThunk(
  "getAllDashboardOrders",
  async (page: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const response = await axios.get(
        `${BACKEND_URL}/order/getOrdersByStore`,
        {
          params: {
            page: page, // Use the dynamic page number
            limit: 8, // Default limit
            status: "Pending",
          },
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

export const getOrderListOrders = createAsyncThunk(
  "getAllOrderListOrders",
  async (page: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      const response = await axios.get(
        `${BACKEND_URL}/order/getOrdersByStore`,
        {
          params: {
            page: page, // Use the dynamic page number
            status: "Confirmed",
          },
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

export const updateProductStatus = createAsyncThunk(
  "updateProductOfOrder",
  async (
    payload: {
      order_id: string;
      product_id: string;
      store_id: string;
      order_product_status: string;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;
      const res = await axios.put(
        `${BACKEND_URL}/order/updateProductStatus`,
        {
          order_id: payload.order_id,
          product_id: payload.product_id,
          store_id: payload.store_id,
          order_product_status: payload.order_product_status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { updatedOrder: res.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateConfirmedOrderStatus = createAsyncThunk(
  "updateConfirmedOrderStatus",
  async (
    { orderId, orderStatus }: { orderId: string; orderStatus: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.Login.token;

      // Make the API call to update order status
      const response = await axios.put(
        `${BACKEND_URL}/order/updateConfirmedOrderStatus`,
        {
          orderId,
          orderStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data; // Return success data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to update order status"
      );
    }
  }
);