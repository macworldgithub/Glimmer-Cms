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
import { getDashBoardOrders, getOrderListOrders } from "../api/order/api";
import { update_product_of_order } from "../api/order/api";

interface Items {
  product: any;
  quantity: number;
}

interface Order {
  _id: string;
  created_at: string;
  customerId: string;
  customerEmail: string;
  items: Items[];
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  actions?: string;
}

interface AllOrder {
  dashboardOrders: Order[];
  dashboardTotalPages: number;
  orderList: Order[];
  orderTotalPages: number;
}

const initialState: AllOrder = {
  dashboardOrders: [],
  dashboardTotalPages: 0,
  orderList: [], // Add initial value for orderList
  orderTotalPages: 0, // Add initial value for orderPage
};

const removeProductFromOrder = (
  orders: Order[],
  orderId: string,
  productId: string
): Order[] => {
  return orders.map((order) => {
    if (order._id === orderId) {
      return {
        ...order,
        items: order.items.filter((item) => item.product._id !== productId), // Removing product and quantity
      };
    }
    return order;
  });
};

const allOrderSlice = createSlice({
  name: "allOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDashBoardOrders.fulfilled, (state, action) => {
      const { orders, totalPages } = action.payload;

      state.dashboardOrders = orders;
      state.dashboardTotalPages = totalPages;
    }),
      builder.addCase(getOrderListOrders.fulfilled, (state, action) => {
        const { orders, toalPages } = action.payload;
        state.orderList = orders;
        state.orderTotalPages = toalPages;
      }),
      builder.addCase(update_product_of_order.fulfilled, (state, action) => {
        const { message, status, orderId, productId } = action.payload;
        state.dashboardOrders = removeProductFromOrder(
          state.dashboardOrders,
          orderId,
          productId
        );
      });
  },
});

export default allOrderSlice;
