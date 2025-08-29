import { createSlice } from "@reduxjs/toolkit";
import { 
  getAllSalons,
  getAllServicesForAdmin, 
  getAllServicesForSalon, 
  updateNewToGlimmer, 
  updateRecommendedSalon, 
  updateSalonServiceApi, 
  updateTrendingSalon
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
  salon_name: string;
  email: string;
  address: string;
  about: string;
  openingHour: string;
  closingHour: string;
  status: "active" | "inactive";
  newToGlimmer: boolean;
  trendingSalon: boolean;
  recommendedSalon: boolean;
}

interface AllSalonState {
  salons: Salon[];
  services: Service[];
  total: number;
  page: number;
}
const initialState: AllSalonState = {
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
      state.services.push(action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(getAllSalons.fulfilled, (state, action) => {
      state.salons = action.payload.salons;
      state.total = action.payload.total;
    });

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
      const updatedService = action.payload;
      state.services = state.services.map((s) =>
        s._id === updatedService._id ? updatedService : s
      );
      alert("Service Updated");
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
