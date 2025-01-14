import { createSlice } from "@reduxjs/toolkit";
import { getAllOrders } from "../api/order/api";
interface Order {
    order: string;
    date: number;
    customer: string;
    payment: number;
    status: "Active" | "Inactive";
    method: string;
    store: string;
    _id: string;
    actions: string;
  }

interface AllOrder {
  orders: Order[];
  page: number;
}

const initialState: AllOrder = {
  orders: [],
  page: 1,
};

const orderSlice = createSlice({
  name: "allOrders",
  initialState,
  reducers: {
    addToOrderList: (state, action) => {
      state.orders.push(action.payload);
    },
  },
  extraReducers(builder) {
      
    builder.addCase(getAllOrders.fulfilled, (state, action) => {
        console.log("aa", state)
      //   state.products = action.payload;
      state.orders = action.payload;
    });
    builder.addCase(getAllOrders.rejected, (state, action) => {
          console.log("aa", action.payload);
        });
  },
});

// export const { addToProductList } = orderSlice.actions;
export default orderSlice;
