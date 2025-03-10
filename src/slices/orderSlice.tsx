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
import {
  getAllOrders,
  getDashBoardOrders,
  getOrderListOrders,
  updateProductStatus,
} from "../api/order/api";

interface Items {
  product: any;
  quantity: number;
}
interface Product {
  _id: string;
  name: string;
  base_price: number;
  discounted_price: number;
  description: string;
  image1: string;
  image2?: string;
  image3?: string;
  status: string;
  type: { value: string }[];
  size: { value: string; unit: string }[];
}

interface OrderProduct {
  product: Product;
  storeId: string;
  quantity: number;
  total_price: number;
  orderProductStatus: string;
}

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  state: string;
  zip: string;
  address: string;
  shippingMethod: string;
}
// interface Order {
//   _id: string;
//   created_at: string;
//   customerId: string;
//   customerEmail: string;
//   items: Items[];
//   status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
//   actions?: string;
// }

interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  items: Items[];
  total: number;
  discountedTotal: number;
  paymentMethod: string;
  ShippingInfo: ShippingInfo;
  productList: OrderProduct[];
}
interface AllOrder {
  dashboardOrders: Order[];
  dashboardTotalPages: number;
  orderList: Order[];
  orderTotalPages: number;
  allOrders: Order[];
}

const initialState: AllOrder = {
  dashboardOrders: [],
  dashboardTotalPages: 0,
  orderList: [], // Add initial value for orderList
  orderTotalPages: 0, // Add initial value for orderPage
  allOrders: [],
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
        productList: order.productList.filter(
          (product) => product.product._id !== productId
        ),
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
      // builder.addCase(updateProductStatus.fulfilled, (state, action) => {
      //   const { orderId, productId } = action.payload;
      //   state.dashboardOrders = removeProductFromOrder(
      //     state.dashboardOrders,
      //     orderId,
      //     productId,
      //     // storeId,
      //     // status,
      //   );
      // });
      builder.addCase(updateProductStatus.fulfilled, (state, action) => {
        // The updated order after the API call
        const updatedOrder = action.payload.updatedOrder;
        const productId = updatedOrder.productList[0]?.product._id;

        // Update the order in state.allOrders with the new status
        state.allOrders = state.allOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );

        // Now, remove the product from the order's items array
        if (productId) {
          state.allOrders = removeProductFromOrder(
            state.allOrders,
            updatedOrder._id,
            productId
          );
        }
      });
    builder.addCase(getAllOrders.fulfilled, (state, action) => {
      state.allOrders = action.payload;
    });
  },
});

export default allOrderSlice;
