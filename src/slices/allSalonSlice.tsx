import { createSlice } from "@reduxjs/toolkit";
import { getAllProducts, updateProductApi } from "../api/products/api";
import {
  getAllSalons,
  getAllServicesForAdmin,
  getAllServicesForSalon,
  updateNewToGlimmer,
  updateRecommendedSalon,
  updateSalonServiceApi,
  updateTrendingSalon,
} from "../api/service/api";

interface Service {
  _id: string;
  name: string;
  description: string;
  duration: number;
  images: { name: string; url: string }[];
  requestedPrice: number;
  base_price: number;
  discounted_price: number;
  status: "Active" | "Inactive";
  categoryId: string;
  subCategoryName: string;
  subSubCategoryName: string;
}

interface Salon {
  _id: string;
  name: string;
  description: string;
  duration: number;
  images: { name: string; url: string }[];
  requestedPrice: number;
  base_price: number;
  discounted_price: number;
  status: "Active" | "Inactive"; // Enum-like string literals
  categoryId: string;
  subCategoryName: string;
  subSubCategoryName: string;

  newToGlimmer?: boolean;
  trendingSalon?: boolean;
  recommendedSalon?: boolean;
}


interface AllSalon {
  salons: Salon[];
  services: Service[];
  total: number;
  page: number;
}
const initialState: AllSalon = {
  salons: [],
  services: [],
  total: 0,
  page: 1,
};
const allSalonSlice = createSlice({
  name: "allSalons",
  initialState,
  reducers: {
    addToServiceList: (state, action) => {
      state.salons.push(action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(getAllServicesForSalon.fulfilled, (state, action) => {
      state.services = action.payload.services;
      state.total = action.payload.total;
      state.page = action.payload.page;
    });
    
    builder.addCase(getAllServicesForAdmin.fulfilled, (state, action) => {
      state.services = action.payload.services;
      state.total = action.payload.total;
      state.page = action.payload.page;
    });

    builder.addCase(updateSalonServiceApi.fulfilled, (state, action) => {
      const updatedSalon = action.payload; 
      state.salons = state.salons.map((salon) =>
        salon._id === updatedSalon.id ? updatedSalon : salon
      );
      alert("Record Updated");
    });
    builder.addCase(getAllSalons.fulfilled, (state, action) => {
      state.salons = action.payload.salons;
      state.total = action.payload.total;
    });
    builder.addCase(updateNewToGlimmer.fulfilled, (state, action) => {
      const updatedSalon = action.payload;
      state.salons = state.salons.map((s) =>
        s._id === updatedSalon._id ? updatedSalon : s
      );
    });

    builder.addCase(updateTrendingSalon.fulfilled, (state, action) => {
      const updatedSalon = action.payload;
      state.salons = state.salons.map((s) =>
        s._id === updatedSalon._id ? updatedSalon : s
      );
    });

    builder.addCase(updateRecommendedSalon.fulfilled, (state, action) => {
      const updatedSalon = action.payload;
      state.salons = state.salons.map((s) =>
        s._id === updatedSalon._id ? updatedSalon : s
      );
    });
  },
});

export const { addToServiceList } = allSalonSlice.actions;
export default allSalonSlice;
