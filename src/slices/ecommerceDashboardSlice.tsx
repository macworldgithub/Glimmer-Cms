import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialState {
  OrderList: any[];
  totalOrders: number;
  totalSales: number;
}

const initialState = {
  OrderList: [],
  totalOrder: 0,
  totalSales: 0,
};

const EcommerceDasboardSlice = createSlice({
  name: "EcommerceDashboard",
  initialState,
  reducers: {},
  extraReducers(builder) {},
});

export default EcommerceDasboardSlice;
