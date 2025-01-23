// import { createSlice } from "@reduxjs/toolkit";
// import { getAllOrders } from "../api/order/api";
// interface Order {
//     order: string;
//     date: number;
//     customer: string;
//     payment: number;
//     status: "Active" | "Inactive";
//     method: string;
//     store: string;
//     _id: string;
//     actions: string;
//   }

// interface AllOrder {
//   orders: Order[];
//   page: number;
// }

// const initialState: AllOrder = {
//   orders: [],
//   page: 1,
// };

// const orderSlice = createSlice({
//   name: "allOrders",
//   initialState,
//   reducers: {
//     addToOrderList: (state, action) => {
//       state.orders.push(action.payload);
//     },
//   },
//   extraReducers(builder) {
      
//     builder.addCase(getAllOrders.fulfilled, (state, action) => {
//         console.log("aa", state)
//       //   state.orders = action.payload;
//       state.orders = action.payload;
//     });
//     builder.addCase(getAllOrders.rejected, (state, action) => {
//           console.log("aa", action.payload);
//         });
//   },
// });

// // export const { addToProductList } = orderSlice.actions;
// export default orderSlice;


import { createSlice } from "@reduxjs/toolkit";
import { getAllOrders } from "../api/order/api";

interface Order {
  _id: string;
  created_at: string;
  customer: string;
  payment: number;
  status: "Completed" | "Pending" | "Failed";
  method: string;
  actions?: string;
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllOrders.fulfilled, (state, action) => {
      state.orders = action.payload; // Assuming the payload is the array of orders.
    });
    builder.addCase(getAllOrders.rejected, (state, action) => {
      console.error("Failed to fetch orders:", action.payload);
    });
  },
});

export default orderSlice;
