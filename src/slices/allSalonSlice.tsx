import { createSlice } from "@reduxjs/toolkit";
import { getAllProducts, updateProductApi } from "../api/products/api";
import { getAllServicesForAdmin, getAllServicesForSalon, updateSalonServiceApi } from "../api/service/api";

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
}

interface AllSalon {
  salons: Salon[];
  page: number;
}

const initialState: AllSalon = {
  salons: [],
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
      //   state.products = action.payload;
      state.salons = action.payload;
    });
    builder.addCase(getAllServicesForAdmin.fulfilled, (state, action) => {
      //   state.products = action.payload;
      state.salons = action.payload;
    });

    builder.addCase(updateSalonServiceApi.fulfilled, (state, action) => {
      const updatedSalon = action.payload; // Assuming API returns the updated product
      state.salons = state.salons.map((salon) =>
        salon._id === updatedSalon.id ? updatedSalon : salon
      );
      alert("Record Updated");
    });
  },
});

export const { addToServiceList } = allSalonSlice.actions;
export default allSalonSlice;
